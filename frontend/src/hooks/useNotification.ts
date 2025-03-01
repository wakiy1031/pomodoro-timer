"use client";

import { useState, useEffect, useCallback } from "react";

interface NotificationOptions {
  title: string;
  body: string;
  data?: string;
}

export const useNotification = () => {
  const [permission, setPermission] = useState<
    NotificationPermission | "unsupported"
  >("default");
  const [swRegistration, setSwRegistration] =
    useState<ServiceWorkerRegistration | null>(null);
  const [isEnabled, setIsEnabled] = useState<boolean>(true);

  // Service Workerの登録とNotification APIのサポートチェック
  useEffect(() => {
    // サーバーサイドレンダリング時は何もしない
    if (typeof window === "undefined") return;

    // Notification APIとService Workerのサポートチェック
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      setPermission("unsupported");
      return;
    }

    // 現在の通知許可状態を設定
    setPermission(Notification.permission);

    // ローカルストレージから通知の有効/無効状態を取得
    try {
      const storedIsEnabled = localStorage.getItem("notificationsEnabled");
      if (storedIsEnabled !== null) {
        setIsEnabled(storedIsEnabled === "true");
      }
    } catch (error) {
      console.error("Failed to access localStorage:", error);
    }

    // Service Workerの登録
    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js");
        setSwRegistration(registration);
      } catch (error) {
        console.error("Service Worker registration failed:", error);
      }
    };

    registerSW();
  }, []);

  // 通知の許可を要求する関数
  const requestPermission = async (): Promise<NotificationPermission> => {
    // サーバーサイドレンダリング時やサポートされていない場合は何もしない
    if (typeof window === "undefined" || permission === "unsupported") {
      return "denied";
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    } catch (e) {
      console.error("Failed to request permission:", e);
      return "denied";
    }
  };

  // 通知の有効/無効を切り替える関数
  const toggleNotifications = useCallback(() => {
    // 新しい状態を計算
    const newState = !isEnabled;

    // ローカルストレージに保存
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("notificationsEnabled", newState.toString());
      } catch (error) {
        console.error("Failed to save to localStorage:", error);
      }
    }

    // 状態を更新（非同期処理の後に確実に実行されるようにする）
    setIsEnabled(newState);

    return newState;
  }, [isEnabled]);

  // 通知を表示する関数
  const showNotification = async (
    options: NotificationOptions
  ): Promise<boolean> => {
    // サーバーサイドレンダリング時やサポートされていない場合は何もしない
    if (typeof window === "undefined" || permission === "unsupported") {
      return false;
    }

    // 通知が無効化されている場合は何もしない
    if (!isEnabled) {
      return false;
    }

    // 許可がない場合は許可を要求
    if (permission !== "granted") {
      const newPermission = await requestPermission();
      if (newPermission !== "granted") {
        return false;
      }
    }

    try {
      // Service Workerを使用して通知を表示
      if (swRegistration) {
        await swRegistration.showNotification(options.title, {
          body: options.body,
          data: options.data,
        });
        return true;
      } else {
        // フォールバック: 通常の通知API
        new Notification(options.title, {
          body: options.body,
        });
        return true;
      }
    } catch (e) {
      console.error("Failed to show notification:", e);
      return false;
    }
  };

  return {
    permission,
    isEnabled,
    requestPermission,
    showNotification,
    toggleNotifications,
  };
};
