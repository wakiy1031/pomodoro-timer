"use client";

import { useAtom } from "jotai";
import { isDarkModeAtom } from "@/store/themeAtom";
import { useEffect, useState } from "react";

export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useAtom(isDarkModeAtom);
  const [isInitialized, setIsInitialized] = useState(false);

  // 初期化処理
  useEffect(() => {
    // サーバーサイドレンダリング時は何もしない
    if (typeof window === "undefined") return;

    // ローカルストレージから設定を読み込む
    const storedTheme = localStorage.getItem("isDarkMode");

    if (storedTheme !== null) {
      // ユーザーが明示的に設定している場合はその設定を使用
      setIsDarkMode(JSON.parse(storedTheme));
    } else {
      // 設定がない場合はシステム設定を使用
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setIsDarkMode(prefersDark);
    }

    setIsInitialized(true);
  }, [setIsDarkMode]);

  // ダークモード変更時の処理
  useEffect(() => {
    // 初期化前または サーバーサイドレンダリング時は何もしない
    if (!isInitialized || typeof document === "undefined") return;

    // HTML要素のクラスを更新
    document.documentElement.classList.toggle("dark", isDarkMode);

    // ローカルストレージに保存
    localStorage.setItem("isDarkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode, isInitialized]);

  // システムの設定が変更された場合に対応
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      // ユーザーが明示的に設定していない場合のみシステム設定に従う
      if (localStorage.getItem("isDarkMode") === null) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [setIsDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return {
    isDarkMode,
    toggleTheme,
    isInitialized,
  };
};
