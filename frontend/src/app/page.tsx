"use client";

import Layout from "@/components/layout";
import Timer from "@/components/timer/Timer";
import { UIProvider, extendTheme } from "@yamada-ui/react";
export default function Home() {
  const breakpoints = {
    sm: "376px",
    md: "768px",
    lg: "1024px",
    xl: "1200px",
    "2xl": "1440px",
  };

  const customTheme = extendTheme({ breakpoints })({ omit: ["breakpoints"] });

  return (
    <UIProvider theme={customTheme}>
      <Layout>
        <div className="relative flex justify-center items-center h-full">
          <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)] md:h-[calc(100vh-12rem)]">
            <Timer />
          </div>
        </div>
      </Layout>
    </UIProvider>
  );
}
