"use client";

import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { timerSettingsAtom, timerSessionAtom } from "@/store/timerAtoms";
import {
  Box,
  FormControl,
  Input,
  Button,
  VStack,
  Heading,
  Text,
  useNotice,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Divider,
} from "@yamada-ui/react";
import { NotificationPermission } from "@/components/notification/NotificationPermission";

const SettingsForm = () => {
  const [settings, setSettings] = useAtom(timerSettingsAtom);
  const [session] = useAtom(timerSessionAtom);
  const [focusMinutes, setFocusMinutes] = useState("");
  const [breakMinutes, setBreakMinutes] = useState("");
  const [mounted, setMounted] = useState(false);
  const notice = useNotice();

  // 初期値をセット
  useEffect(() => {
    setFocusMinutes(String(Math.floor(settings.defaultFocusDuration / 60)));
    setBreakMinutes(String(Math.floor(settings.defaultBreakDuration / 60)));
  }, [settings]);

  // マウント時のアニメーション用
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 入力値のバリデーション
    const focusMin = parseInt(focusMinutes, 10);
    const breakMin = parseInt(breakMinutes, 10);

    if (isNaN(focusMin) || focusMin <= 0 || focusMin > 120) {
      notice({
        title: "エラー",
        description: "作業時間は1〜120分の間で設定してください",
        status: "error",
      });
      return;
    }

    if (isNaN(breakMin) || breakMin <= 0 || breakMin > 60) {
      notice({
        title: "エラー",
        description: "休憩時間は1〜60分の間で設定してください",
        status: "error",
      });
      return;
    }

    // 設定を更新
    setSettings({
      defaultFocusDuration: focusMin * 60,
      defaultBreakDuration: breakMin * 60,
    });

    // 通知メッセージ
    const isTimerActive =
      session.status === "in_progress" || session.status === "paused";
    const noticeMessage = isTimerActive
      ? "アクティブなタイマーにも反映されました。"
      : "";

    notice({
      title: "設定を保存しました",
      description: noticeMessage,
      status: "success",
    });
  };

  // タイマーがアクティブかどうかを確認
  const isTimerActive =
    session.status === "in_progress" || session.status === "paused";

  return (
    <Box
      p={6}
      w="full"
      borderRadius="md"
      className={`transition-all duration-500 ${
        mounted ? "opacity-100 transform-none" : "opacity-0 translate-y-4"
      }`}
      style={{ willChange: "opacity, transform" }}
    >
      <VStack gap={6}>
        <Heading size="md">タイマー設定</Heading>
        <Text>作業時間と休憩時間をカスタマイズできます</Text>

        {isTimerActive && (
          <Alert status="info" variant="subtle" borderRadius="md">
            <AlertIcon />
            <Box>
              <AlertTitle>タイマー実行中</AlertTitle>
              <AlertDescription>
                設定の変更はアクティブなタイマーにも即時反映されます。
              </AlertDescription>
            </Box>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <VStack gap={4} alignItems="stretch">
            <FormControl>
              <Text fontWeight="bold" mb={2}>
                作業時間（分）
              </Text>
              <Input
                type="number"
                value={focusMinutes}
                onChange={(e) => setFocusMinutes(e.target.value)}
                min="1"
                max="120"
              />
            </FormControl>

            <FormControl>
              <Text fontWeight="bold" mb={2}>
                休憩時間（分）
              </Text>
              <Input
                type="number"
                value={breakMinutes}
                onChange={(e) => setBreakMinutes(e.target.value)}
                min="1"
                max="60"
              />
            </FormControl>

            <Button type="submit" colorScheme="primary" mt={4}>
              保存
            </Button>
          </VStack>
        </form>

        <Divider my={6} />

        <Box w="full">
          <Heading size="md" mb={4}>
            通知設定
          </Heading>
          <Text mb={4}>
            タイマー終了時に通知を受け取るには、ブラウザの通知を許可してください。
          </Text>
          <NotificationPermission />
        </Box>
      </VStack>
    </Box>
  );
};

export default SettingsForm;
