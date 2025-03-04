"use client";

import dynamic from "next/dynamic";

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
  return (
    <Layout>
      <div className="relative flex justify-center items-center h-full">
        <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)] md:h-[calc(100vh-12rem)]">
          <TimerClient />
        </div>
      </div>
    </Layout>
  );
}
