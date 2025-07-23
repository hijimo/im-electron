import { ThemeMode } from "@/theme";
import type { ColorName } from "@/theme/tokens";
import { createContext, useContext, useState } from "react";

// 主题上下文类型
interface ThemeContextType {
  themeMode: ThemeMode;
  colorName: ColorName;
  setThemeMode: (mode: ThemeMode) => void;
  setColorName: (name: ColorName) => void;
}

const defaultColorName = import.meta.env.VITE_THEME_COLOR;

// 创建主题上下文
export const ThemeContext = createContext<ThemeContextType>({
  themeMode: "light",
  colorName: defaultColorName,
  setThemeMode: () => {},
  setColorName: () => {},
});

// 主题提供者组件
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // 从本地存储获取上次保存的主题设置，如果没有则使用默认值
  const savedThemeMode = (localStorage.getItem("themeMode") || "light") as ThemeMode;
  const savedColorName = (localStorage.getItem("colorName") ||
    defaultColorName) as ColorName;

  const [themeMode, setThemeModeState] = useState<ThemeMode>(savedThemeMode);
  const [colorName, setColorNameState] = useState<ColorName>(savedColorName);

  // 更新主题模式并保存到本地存储
  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem("themeMode", mode);
  };

  // 更新主题颜色并保存到本地存储
  const setColorName = (name: ColorName) => {
    setColorNameState(name);
    localStorage.setItem("colorName", name);
  };

  // 为应用程序提供主题上下文
  return (
    <ThemeContext.Provider value={{ themeMode, colorName, setThemeMode, setColorName }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 自定义钩子，用于在组件中访问主题上下文
const useTheme = () => useContext(ThemeContext);

export default useTheme;
