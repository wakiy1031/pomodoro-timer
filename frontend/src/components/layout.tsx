"use client";

import { useState, useEffect } from "react";
import type React from "react";
import {
  Button,
  List,
  ListItem,
  Switch,
  useDisclosure,
  Box,
  IconButton,
  useBreakpointValue,
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
const MobileDrawer = () => {
  const { open, onOpen, onClose } = useDisclosure();

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
  const isMobile = useBreakpointValue({ base: false, lg: true });

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <div className="flex h-dvh">
        {!isMobile && <Sidebar />}
        {isMobile && <MobileDrawer />}
        <main
          className={`flex-1 p-8 h-dvh bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
            isMobile ? "w-full" : ""
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
