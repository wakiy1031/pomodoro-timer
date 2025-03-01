"use client";

import dynamic from "next/dynamic";

// クライアントサイドでのみレンダリングされるコンポーネント
const Layout = dynamic(() => import("@/components/layout"), {
  ssr: false,
});

// クライアントサイドでのみレンダリングされるTimerコンポーネント
const TimerClient = dynamic(() => import("@/components/timer/Timer"), {
  ssr: false,
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
