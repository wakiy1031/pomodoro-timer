import Layout from "@/components/layout";
import Timer from "@/components/timer/Timer";
import { UIProvider } from "@yamada-ui/react";
export default function Home() {
  return (
    <UIProvider>
      <Layout>
        <div className="relative h-full">
          <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)]">
            <Timer />
          </div>
        </div>
      </Layout>
    </UIProvider>
  );
}
