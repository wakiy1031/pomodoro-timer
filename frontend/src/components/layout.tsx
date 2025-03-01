"use client";

import { useEffect, useState, useRef } from "react";
import type React from "react";
import {
  Button,
  List,
  ListItem,
  Switch,
  useDisclosure,
  Box,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerCloseButton,
} from "@yamada-ui/react";
import { useTheme } from "@/hooks/useTheme";
import { Sun, Moon, Timer, Settings, Menu } from "lucide-react";
import Link from "next/link";

// サイドバーの内容をコンポーネント化
const SidebarContent = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <>
      <div className="mb-8"></div>
      <nav className="flex-1">
        <List className="space-y-2" gap={4}>
          <ListItem>
            <Link href="/" className="w-full">
              <Button
                w="full"
                justifyContent="start"
                color="white"
                bg="none"
                _hover={{ color: "gray.900", bg: "white" }}
              >
                <Timer className="mr-2" />
                タイマー
              </Button>
            </Link>
          </ListItem>
          {/* <ListItem>
            <Button className="w-full justify-start">統計</Button>
          </ListItem> */}
          <ListItem>
            <Link href="/settings" className="w-full">
              <Button
                w="full"
                justifyContent="start"
                color="white"
                bg="none"
                _hover={{ color: "gray.900", bg: "white" }}
              >
                <Settings className="mr-2" />
                設定
              </Button>
            </Link>
          </ListItem>
        </List>
      </nav>
      <div className="flex items-center justify-between relative w-fit mb-4">
        <Switch
          checked={!isDarkMode}
          onChange={toggleTheme}
          size="lg"
          border="2px solid"
          borderColor="white"
          borderRadius="full"
          colorScheme="white"
        />
        <div className="absolute flex items-center justify-center pointer-events-none z-1 w-full h-full -translate-y-1/2 top-1/2">
          {isDarkMode ? (
            <Moon
              size={15}
              className="text-white absolute right-2 -translate-y-1/2 top-1/2"
            />
          ) : (
            <Sun
              size={15}
              className="text-white absolute left-2 -translate-y-1/2 top-1/2"
            />
          )}
        </div>
      </div>
    </>
  );
};

// サイドバーコンポーネント
const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-900 text-white p-4 flex flex-col h-screen">
      <SidebarContent />
    </aside>
  );
};

// モバイル用ドロワーコンポーネント
const MobileDrawer = ({ isVisible }: { isVisible: boolean }) => {
  const { open, onOpen, onClose } = useDisclosure();

  // isVisibleがfalseの場合は何もレンダリングしない
  if (!isVisible) return null;

  return (
    <>
      <Box position="fixed" top={4} right={4} zIndex={10} m="0">
        <IconButton
          aria-label="メニューを開く"
          icon={<Menu />}
          onClick={onOpen}
          colorScheme="gray"
          variant="solid"
        />
      </Box>

      <Drawer
        open={open}
        placement="right"
        onClose={onClose}
        size="xs"
        className="m-0"
      >
        <DrawerOverlay />
        <DrawerBody bg="gray.900" color="white" m="0">
          <DrawerCloseButton color="white" />
          <SidebarContent />
        </DrawerBody>
      </Drawer>
    </>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { isDarkMode } = useTheme();

  // hydrationの不一致を防ぐためのステート
  const [isClient, setIsClient] = useState(false);
  // メディアクエリの結果を保持するステート
  const [isDesktop, setIsDesktop] = useState(true); // デフォルトでデスクトップとして初期化
  // コンテンツの読み込み状態を管理
  const [contentReady, setContentReady] = useState(false);
  // レイアウトが安定したかどうかを追跡
  const [layoutStable, setLayoutStable] = useState(false);
  // 初期レンダリングを追跡
  const initialRenderRef = useRef(true);

  // クライアントサイドでのみレンダリングされるようにする
  useEffect(() => {
    setIsClient(true);

    // コンテンツの読み込み完了を少し遅延させてトランジションを滑らかにする
    const contentTimer = setTimeout(() => {
      setContentReady(true);
    }, 150);

    // レイアウトの安定化をさらに遅延させる
    const layoutTimer = setTimeout(() => {
      setLayoutStable(true);
      initialRenderRef.current = false;
    }, 300);

    return () => {
      clearTimeout(contentTimer);
      clearTimeout(layoutTimer);
    };
  }, []);

  // クライアントサイドでのみメディアクエリを実行
  useEffect(() => {
    if (!isClient) return;

    try {
      const mediaQuery = window.matchMedia("(min-width: 1024px)");

      // 初期値を設定
      setIsDesktop(mediaQuery.matches);

      // リスナーを設定
      const handleChange = (e: MediaQueryListEvent) => {
        setIsDesktop(e.matches);
      };

      // リスナーを追加
      mediaQuery.addEventListener("change", handleChange);

      // クリーンアップ
      return () => {
        mediaQuery.removeEventListener("change", handleChange);
      };
    } catch (error) {
      console.error("Error in media query:", error);
    }
  }, [isClient]);

  // 初期レンダリング時のスケルトン表示
  if (!isClient) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-800 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // レイアウトの骨組みを常に表示し、コンテンツだけをフェードイン
  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <div className="flex h-dvh">
        {/* サイドバーは常に同じ位置に表示（表示/非表示の切り替えのみ） */}
        <div
          className={`${
            isDesktop ? "block" : "hidden"
          } w-64 transition-transform duration-300`}
        >
          <Sidebar />
        </div>

        {/* モバイルメニューはクライアントサイドでのみ表示し、レイアウトが安定した後に表示 */}
        <MobileDrawer isVisible={isClient && !isDesktop && layoutStable} />

        {/* メインコンテンツ領域 */}
        <main
          className={`flex-1 p-8 h-dvh bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-500 ${
            contentReady
              ? "opacity-100 transform-none"
              : "opacity-0 translate-y-4"
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
