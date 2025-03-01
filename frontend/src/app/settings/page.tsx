"use client";

import dynamic from "next/dynamic";
import { Heading } from "@yamada-ui/react";
import { useEffect, useState } from "react";
// クライアントサイドでのみレンダリングされるコンポーネント
const Layout = dynamic(() => import("@/components/layout"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-white dark:bg-gray-800 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  ),
});

// クライアントサイドでのみレンダリングされるSettingsFormコンポーネント
const SettingsFormClient = dynamic(
  () => import("@/components/settings/SettingsForm"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    ),
  }
);

export default function Settings() {
  const [mounted, setMounted] = useState(false);

  // マウント時のアニメーション用
  useEffect(() => {
    // ページ遷移時のちらつきを防ぐため、少し遅延させる
    const timer = setTimeout(() => {
      setMounted(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout>
      <div
        className={`relative h-full transition-all duration-500 ${
          mounted ? "opacity-100 transform-none" : "opacity-0 translate-y-4"
        }`}
        style={{ willChange: "opacity, transform" }}
      >
        <Heading size="lg">設定</Heading>
        <div className="flex flex-col h-[calc(100vh-12rem)]">
          <SettingsFormClient />
        </div>
      </div>
    </Layout>
  );
}
