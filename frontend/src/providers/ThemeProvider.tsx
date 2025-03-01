"use client";

import { UIProvider, extendTheme } from "@yamada-ui/react";
import { ReactNode } from "react";

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const breakpoints = {
    sm: "376px",
    md: "768px",
    lg: "1024px",
    xl: "1200px",
    "2xl": "1440px",
  };

  const customTheme = extendTheme({ breakpoints })({ omit: ["breakpoints"] });

  return <UIProvider theme={customTheme}>{children}</UIProvider>;
}
