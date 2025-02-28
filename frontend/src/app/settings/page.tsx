import Layout from "@/components/layout";
import SettingsForm from "@/components/settings/SettingsForm";
import { Heading, UIProvider } from "@yamada-ui/react";

export default function Settings() {
  return (
    <UIProvider>
      <Layout>
        <div className="relative h-full">
          <Heading size="lg">設定</Heading>
          <div className="flex flex-col h-[calc(100vh-12rem)]">
            <SettingsForm />
          </div>
        </div>
      </Layout>
    </UIProvider>
  );
}
