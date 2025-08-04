import React, { useState, createContext, useCallback, useLayoutEffect, useMemo } from "react";
import { ConfigProvider, theme } from "antd";
import { localStorageAccessor } from "@/utils/browserStorage";
// import { useLang } from "@/hooks/Language.hook";
import { 
  ThemesType, 
  ThemeContextProps, 
  ThemeManagerProps, 
  GeneralThemeType, 
  AirlineThemeType,
  CSSVariables,
  ConfigKeyType
} from "./ThemeManagerTypes";
import CFG from "../../config/config.json";
import generalThemeFile from '@/assets/theme/theme.json';

const DEFAULT_ALGORITHM = "default";
const DEFAULT_THEME: ThemesType = "default";
const LOCALSTORAGE_VAR = "theme";

export const ThemeContext = createContext<ThemeContextProps>({
  selectedTheme: DEFAULT_THEME,
  themeAlgorithm: DEFAULT_ALGORITHM,
  setSelectedTheme: () => {},
  setThemeAlgorithm: () => {},
});

const ThemeManager: React.FC<ThemeManagerProps> = ({ children }) => {
  // const { antdLangProvider } = useLang();

  // Set document direction
  useLayoutEffect(() => {    
    document.documentElement.dir = CFG?.site?.layout?.page_direction === "right" ? "rtl" : "ltr";
  }, [CFG?.site?.layout?.page_direction]);

  // Load themes
  const [generalThemes] = useState<GeneralThemeType>(() => {
    try {
      return generalThemeFile;
    } catch (error) {
      console.error("Failed to load general themes", error);
      return {
        default: {} as ConfigKeyType,
        dark: {} as ConfigKeyType,
        BW: {} as ConfigKeyType,
        BY: {} as ConfigKeyType,
        YB: {} as ConfigKeyType,
        fonts: {} as CSSVariables
      };
    }
  });

  const [airlineThemes, setAirlineThemes] = useState<AirlineThemeType | null>(null);

  // Load airline-specific assets
  useLayoutEffect(() => {
    const loadAirlineAssets = async () => {
      if (!CFG?.default?.airline_code) return;

      try {
        const airlineCode = CFG?.default?.airline_code;
        
        // Dynamically import airline theme
        const themeModule = await import(
          /* webpackMode: "lazy" */
          `@/plugins/${airlineCode}/config/theme.json`
        );
        
        setAirlineThemes(themeModule.default);
      } catch (error) {
        console.error(`Failed to load airline themes for ${CFG?.default?.airline_code}`, error);
      }
    };

    loadAirlineAssets();
  }, [CFG?.default?.airline_code]);

  // Theme state management
  const [LgetCurrentTheme, LsetCurrentTheme] = localStorageAccessor<ThemesType>(
    LOCALSTORAGE_VAR,
    DEFAULT_THEME
  );

  const [selectedTheme, setSelectedTheme] = useState<ThemesType>(() => {
    return LgetCurrentTheme() || DEFAULT_THEME;
  });

  const [themeAlgorithm, setThemeAlgorithm] = useState<string>(DEFAULT_ALGORITHM);

  // Merge airline themes with general themes
  const mergedThemes = useMemo(() => {
    if (!airlineThemes || !generalThemes) return generalThemes;

    const result: GeneralThemeType = { ...generalThemes };

    (Object.keys(generalThemes) as Array<keyof GeneralThemeType>).forEach((themeKey) => {
      if (themeKey === "fonts") return;

      const themeName = themeKey as Exclude<keyof GeneralThemeType, "fonts">;
      const airlineTheme = airlineThemes[themeName];

      if (!airlineTheme) return;

      result[themeName] = {
        ...result[themeName],
        global: { ...result[themeName]?.global, ...airlineTheme.global },
        component: { ...result[themeName]?.component, ...airlineTheme.component },
        custom: { ...result[themeName]?.custom, ...airlineTheme.custom },
        token: { ...result[themeName]?.token, ...airlineTheme.token },
        algorithm: airlineTheme.algorithm || result[themeName]?.algorithm
      };
    });

    return result;
  }, [generalThemes, airlineThemes]);

  // Update CSS variables
  const updateCSSVariables = useCallback((config: CSSVariables) => {
    if (!config) return;
    
    const root = document.documentElement;
    Object.entries(config).forEach(([property, value]) => {
      if (value) {
        root.style.setProperty(property, value);
      }
    });
  }, []);

  // Apply theme changes
  useLayoutEffect(() => {
    if (!mergedThemes) return;

    const currentTheme = mergedThemes[selectedTheme];
    if (!currentTheme) return;

    // Apply algorithm
    setThemeAlgorithm(currentTheme.algorithm || DEFAULT_ALGORITHM);

    // Apply custom variables
    if (currentTheme.custom) {
      updateCSSVariables(currentTheme.custom);
    }

    // Apply fonts
    if (mergedThemes.fonts) {
      updateCSSVariables(mergedThemes.fonts);
    }

    // Save to localStorage
    LsetCurrentTheme(selectedTheme);
  }, [mergedThemes, selectedTheme, updateCSSVariables, LsetCurrentTheme]);

  const contextValue = useMemo(() => ({
    selectedTheme,
    setSelectedTheme: (theme: ThemesType) => {
      setSelectedTheme(theme);
      LsetCurrentTheme(theme);
    },
    themeAlgorithm,
    setThemeAlgorithm,
  }), [selectedTheme, themeAlgorithm, LsetCurrentTheme]);

  const currentThemeConfig = mergedThemes?.[selectedTheme];

  if (!currentThemeConfig) {
    console.error("No theme configuration found for", selectedTheme);
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      <ConfigProvider
        theme={{
          token: currentThemeConfig.token,
          components: currentThemeConfig.component,
          algorithm: themeAlgorithm === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
          cssVar: true,
          hashed: false,
        }}
        // locale={antdLangProvider}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeManager;