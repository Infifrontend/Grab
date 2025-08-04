import { ReactNode } from "react";

export type ThemesType = "default" | "BW" | "BY" | "YB" | "dark";

export type ConfigType = "global" | "component" | "custom" | "algorithm" | "token";

export interface ThemeManagerProps {
  children: ReactNode; // Use ReactNode to accept any type of children
}
/* Interface for ThemeContext, with optional custom config support */
export interface ThemeContextProps {
  selectedTheme: string;
  themeAlgorithm: string;
  setSelectedTheme: (theme: ThemesType) => void;
  setThemeAlgorithm: (algorithm: string) => void;
}

export type CSSVariables = {
  [key: string]: string;
};

export interface ConfigKeyType {
  token?: Record<string, any>;
  global?: Record<string, any>;
  component?: Record<string, any>;
  custom?: CSSVariables;
  algorithm?: string;
}

export interface GeneralThemeType {
  default: ConfigKeyType;
  dark?: ConfigKeyType;
  BW?: ConfigKeyType;
  BY?: ConfigKeyType;
  YB?: ConfigKeyType;
  fonts?: CSSVariables;
}

export type AirlineThemeType = {
  default: ConfigKeyType;
  dark: ConfigKeyType;
  BW: ConfigKeyType;
  BY: ConfigKeyType;
  YB: ConfigKeyType;
  fonts: CSSVariables;
};

// type CSSVariables = Record<string, string>;

export interface ComponentTheme {
  [componentName: string]: CSSVariables;
}

export interface ThemeConfig {
  global?: CSSVariables;
  component?: ComponentTheme;
  custom?: CSSVariables;
  algorithm?: string;
  token?: CSSVariables;
}

export interface ThemeCollection {
  // Theme configurations
  default: ThemeConfig;
  dark: ThemeConfig;
  sync?: ThemeConfig; // Optional sync theme
  
  // Additional theme-related configurations
  fonts?: CSSVariables;
}

export enum ConfigTypes {
  GLOBAL = "global",
  COMPONENT = "component", 
  CUSTOM = "custom",
  ALGORITHM = "algorithm",
  TOKEN = "token",
}