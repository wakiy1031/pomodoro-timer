"use client";

import dynamic from "next/dynamic";
import { Heading } from "@yamada-ui/react";

// クライアントサイドでのみレンダリングされるコンポーネント
const Layout = dynamic(() => import("@/components/layout"), {
  ssr: false,
});

// クライアントサイドでのみレンダリングされるSettingsFormコンポーネント
const SettingsFormClient = dynamic(
  () => import("@/components/settings/SettingsForm"),
  {
    ssr: false,
  }
);

export default function Settings() {
  return (
    <Layout>
      <div className="relative h-full">
        <Heading size="lg">設定</Heading>
        <div className="flex flex-col h-[calc(100vh-12rem)]">
          <SettingsFormClient />
        </div>
      </div>
    </Layout>
  );
}
