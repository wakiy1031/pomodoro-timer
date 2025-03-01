"use client";

import dynamic from "next/dynamic";
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

// クライアントサイドでのみレンダリングされるTimerコンポーネント
const TimerClient = dynamic(() => import("@/components/timer/Timer"), {
  ssr: false,
  loading: () => (
    <div className="w-64 h-64 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  ),
});

export default function Home() {
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
        className={`relative flex justify-center items-center h-full transition-all duration-500 ${
          mounted ? "opacity-100 transform-none" : "opacity-0 translate-y-4"
        }`}
        style={{ willChange: "opacity, transform" }}
      >
        <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)] md:h-[calc(100vh-12rem)]">
          <TimerClient />
        </div>
      </div>
    </Layout>
  );
}
