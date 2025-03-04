"use client";

import { UIProvider, extendTheme } from "@yamada-ui/react";
import { ReactNode, useEffect, useState } from "react";
import { useTheme } from "@/hooks/useTheme";

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { isDarkMode, isInitialized } = useTheme();
  const [mounted, setMounted] = useState(false);

  // マウント後にレンダリングを行うことでhydrationエラーを防止
  useEffect(() => {
    setMounted(true);
  }, []);

  const breakpoints = {
    sm: "376px",
    md: "768px",
    lg: "1024px",
    xl: "1200px",
    "2xl": "1440px",
  };

  const customTheme = extendTheme({
    breakpoints,
    colorSchemes: {
      light: {
        colors: {
          bg: {
            base: "white",
            accent: "gray.100",
          },
          text: {
            base: "gray.900",
            muted: "gray.600",
          },
        },
      },
      dark: {
        colors: {
          bg: {
            base: "gray.800",
            accent: "gray.700",
          },
          text: {
            base: "white",
            muted: "gray.300",
          },
        },
      },
    },
    components: {
      Button: {
        baseStyle: {
          _dark: {
            bg: "gray.700",
            color: "white",
            _hover: {
              bg: "gray.600",
            },
          },
        },
      },
      Switch: {
        baseStyle: {
          _dark: {
            borderColor: "gray.600",
          },
        },
      },
    },
    config: {
      initialColorMode: isDarkMode ? "dark" : "light",
    },
  })({
    omit: ["breakpoints"],
  });

  // マウント前またはテーマ初期化前は何も表示しない
  if (!mounted || !isInitialized) {
    return <div style={{ visibility: "hidden" }}>{children}</div>;
  }

  return <UIProvider theme={customTheme}>{children}</UIProvider>;
}
