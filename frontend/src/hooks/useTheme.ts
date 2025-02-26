import { useAtom } from "jotai";
import { isDarkModeAtom } from "@/store/themeAtom";
import { useEffect } from "react";

export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useAtom(isDarkModeAtom);

  useEffect(() => {
    // HTML要素のクラスを更新
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return {
    isDarkMode,
    toggleTheme,
  };
};
