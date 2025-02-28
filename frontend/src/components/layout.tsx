"use client";

import type React from "react";
import { Button, is, List, ListItem, Switch } from "@yamada-ui/react";
import { useTheme } from "@/hooks/useTheme";
import { Sun, Moon, Timer, Settings } from "lucide-react";
import Link from "next/link";

const Sidebar = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <aside className="w-64 bg-gray-900 text-white p-4 flex flex-col h-screen">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-gray-700"></div>
            <div>
              <h2 className="font-bold">Wakiy</h2>
            </div>
          </div>
        </div>
      </div>
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
      <div className="flex items-center justify-between relative w-fit">
        <Switch
          checked={!isDarkMode}
          onChange={toggleTheme}
          size="lg"
          border="2px solid"
          borderColor="white"
          borderRadius="full"
          colorScheme="white"
        />
        <div className="absolute flex items-center justify-center pointer-events-none z-1 w-full h-full -translate-y-1/2 top-1/2 mb-1">
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
    </aside>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`flex min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <Sidebar />
      <main className="flex-1 p-8 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
        {children}
      </main>
    </div>
  );
};

export default Layout;
