import { Radio, RadioChangeEvent, Tooltip, Typography } from "antd";
import "./Theme.scss";
import { useTheming } from "@/hooks/Theme.hook";
import { useState } from "react";
import { useEffect } from "react";
import { localStorageAccessor } from "@/utils/browserStorage";
import { BulbOutlined, MoonOutlined } from "@ant-design/icons";

// import { useTranslation } from "react-i18next";


const Theme = () => {
  // const { t } = useTranslation();
  const { Text } = Typography;
  const { changeTheme } = useTheming();
  const [newTheme,setNewTheme] = useState(true);
  const [themeValue, setThemeValue] = useState("default");
  /* Localstorage theme value & handlers */
  const [LgetTheme] = localStorageAccessor('theme');

  useEffect(() => {
    setNewTheme(LgetTheme() === 'default' ? true : false) // eslint-disable-next-line
  }, [])

  console.log(themeValue);
  
  return (
      <Radio.Group
        style={{height: 32}}
        onChange={(e: RadioChangeEvent) => { 
          if(e.target.value === 'default'){
            setNewTheme(true);
          }else{
            setNewTheme(false);
          }
          changeTheme(e.target.value); setThemeValue(e.target.value);
        }}
        className="radioSwitch" 
        value={themeValue}
      >
        <Radio.Button className={`${newTheme ?'cls-default-theme cls-radio-switch':"cls-radio-switch"}`} value="default">
          <Text className="cls-light-icon Infi-Sp_14_Light"></Text> <BulbOutlined className="cls-light-icon"></BulbOutlined>
        </Radio.Button>
        <Radio.Button className={`${newTheme ?'cls-radio-switch':"cls-default-theme  cls-radio-switch"}`} value="dark">
          <Text className="cls-dark-icon Infi-Sp_15_Dark"></Text> <MoonOutlined className="cls-dark-icon"></MoonOutlined>
        </Radio.Button>
      </Radio.Group>
  );
};

export { Theme };