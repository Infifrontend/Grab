import { useState } from "react";
import {
  Button,
  Drawer,
  Radio,
  RadioChangeEvent,
  Typography,
  Tooltip,
} from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import "./ThemeChanger.scss";
import { useTheming } from "@/hooks/Theme.hook";
import { ThemeIcon, ThemePreviewIcon, ThemeChecked } from "../Icons/HeaderIcon";
import { useTranslation } from "react-i18next";
import { localStorageAccessor } from "@/utils/browserStorage";
const { Text } = Typography;

const ThemeChanger = () => {
  const [themeCollapse, setThemeCollapse] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <Tooltip title={t(t("theme_selector"))}>
        <Button
          data-testid="ThemeButton"
          type="link"
          className="cls-theme-selector"
          onClick={() => {
            setThemeCollapse(true);
            setShowDrawer(true);
          }}
        >
          <ThemeIcon />
        </Button>
      </Tooltip>
      {showDrawer && (
        <Drawer
          closable={false}
          placement="right"
          onClose={() => {
            setThemeCollapse(false);
            setTimeout(() => {
              setShowDrawer(false);
            }, 1000);
          }}
          open={themeCollapse}
        >
          <div className="ThemeChanger">
            <div className="d-flex mb-20 theme-header space-between">
              <h3 className="f-sbold mb-0 d-flex align-center g-10">
                <ThemeIcon />
                {t("theme_settings")}
              </h3>
              <CloseCircleOutlined
                onClick={() => {
                  setThemeCollapse(false);
                  setTimeout(() => {
                    setShowDrawer(false);
                  }, 1000);
                }}
                style={{ color: "#FF4646", fontSize: "20px" }}
              />
            </div>
            <div className="cls-theme-change">
              <Text className="d-block">{t("theme")}</Text>
              <TempThemeChanger />
            </div>
          </div>
        </Drawer>
      )}
    </>
  );
};

const TempThemeChanger = () => {
  const { changeTheme } = useTheming();
  const [LgetTheme] = localStorageAccessor("theme");

  const handleTheme = (e: RadioChangeEvent) => {
      changeTheme(e.target.value);
  };

  return (
    <>
      <Radio.Group onChange={handleTheme} defaultValue={LgetTheme()}>
        <Radio.Button value="default">
          <ThemePreviewIcon color="#CDDDF5" />
          <Text className="checked-icon">
            <ThemeChecked />
          </Text>
        </Radio.Button>
        <Radio.Button className="dark" value="dark">
          <ThemePreviewIcon color="#4B5284" />
          <Text className="checked-icon">
            <ThemeChecked />
          </Text>
        </Radio.Button>
      </Radio.Group>
    </>
  );
};

export { ThemeChanger };
