"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
  Switch,
  HStack,
  Text,
  useNotice,
} from "@yamada-ui/react";
import { BellIcon } from "lucide-react";
import { useNotification } from "@/hooks/useNotification";

export const NotificationPermission = () => {
  const { permission, requestPermission, isEnabled, toggleNotifications } =
    useNotification();
  const [showAlert, setShowAlert] = useState(false);
  const [localEnabled, setLocalEnabled] = useState(isEnabled);
  const notice = useNotice();

  // isEnabledの変更を追跡して、ローカルの状態を更新
  useEffect(() => {
    setLocalEnabled(isEnabled);
  }, [isEnabled]);

  // 初回レンダリング時に通知許可状態を確認
  useEffect(() => {
    // サーバーサイドレンダリング時は何もしない
    if (typeof window === "undefined") return;

    // 通知がサポートされていない場合は何もしない
    if (permission === "unsupported") return;

    // 通知許可がまだ要求されていない場合、アラートを表示
    if (permission === "default") {
      setShowAlert(true);
    }
  }, [permission]);

  // 通知許可を要求する
  const handleRequestPermission = async () => {
    const result = await requestPermission();
    if (result === "granted") {
      setShowAlert(false);
      notice({
        title: "通知が許可されました",
        description: "タイマー終了時に通知が表示されます。",
        status: "success",
      });
    } else {
      notice({
        title: "通知が許可されませんでした",
        description: "ブラウザの設定から通知を許可してください。",
        status: "warning",
      });
    }
  };

  // 通知の有効/無効を切り替える
  const handleToggleNotifications = () => {
    const newState = toggleNotifications();
    setLocalEnabled(newState);

    notice({
      title: newState ? "通知を有効にしました" : "通知を無効にしました",
      description: newState
        ? "タイマー終了時に通知が表示されます。"
        : "タイマー終了時の通知は表示されません。",
      status: newState ? "success" : "info",
    });
  };

  // 通知がサポートされていない場合は警告を表示
  if (permission === "unsupported") {
    return (
      <Box mb={4}>
        <Alert status="warning" variant="subtle">
          <AlertIcon />
          <Box>
            <AlertTitle>通知機能がサポートされていません</AlertTitle>
            <AlertDescription>
              お使いのブラウザは通知機能をサポートしていないか、Service
              Workerが利用できません。
            </AlertDescription>
          </Box>
        </Alert>
      </Box>
    );
  }

  // 通知許可が必要な場合のみアラートを表示
  if (!showAlert && permission !== "granted") {
    return (
      <Box mb={4}>
        <Button
          leftIcon={<BellIcon size={16} />}
          colorScheme="blue"
          size="sm"
          onClick={handleRequestPermission}
        >
          通知を許可する
        </Button>
      </Box>
    );
  }

  // 通知許可がすでに付与されている場合も状態を表示する
  if (permission === "granted") {
    return (
      <Box mb={4}>
        {localEnabled && (
          <Alert status="success" variant="subtle" mb={4}>
            <AlertIcon />
            <Box>
              <AlertTitle>通知は許可されています</AlertTitle>
              <AlertDescription>
                タイマー終了時に通知が表示されます。
              </AlertDescription>
            </Box>
          </Alert>
        )}

        <HStack gap={4} alignItems="center">
          <Text fontWeight="bold">通知</Text>
          <Switch
            size="md"
            colorScheme="primary"
            isChecked={localEnabled}
            onChange={handleToggleNotifications}
          />
          <Text>{localEnabled ? "有効" : "無効"}</Text>
        </HStack>
      </Box>
    );
  }

  return (
    <Box mb={4}>
      <Alert status="info" variant="subtle">
        <AlertIcon />
        <Box>
          <AlertTitle>通知の許可</AlertTitle>
          <AlertDescription>
            タイマー終了時に通知を受け取るには、通知を許可してください。
          </AlertDescription>
          <Box mt={2}>
            <Button
              leftIcon={<BellIcon size={16} />}
              colorScheme="blue"
              size="sm"
              onClick={handleRequestPermission}
            >
              通知を許可する
            </Button>
          </Box>
        </Box>
      </Alert>
    </Box>
  );
};
