"use client";

import { Box, Button, Text, Badge } from "@yamada-ui/react";
import {
  PlayIcon,
  PauseIcon,
  InfoIcon,
  CoffeeIcon,
  TimerIcon,
} from "lucide-react";
import { useTimer } from "@/hooks/useTimer";
import { useAtom } from "jotai";
import { timerSettingsAtom } from "@/store/timerAtoms";

const Timer = () => {
  const { session, startTimer, pauseTimer, resetTimer, skipBreak, formatTime } =
    useTimer();
  const [settings] = useAtom(timerSettingsAtom);

  // 現在のタイマー時間と設定時間が異なるかどうかを確認
  const isCustomized =
    (session.isBreak &&
      session.breakDuration !== settings.defaultBreakDuration) ||
    (!session.isBreak &&
      session.focusDuration !== settings.defaultFocusDuration);

  // 休憩中かどうかに基づいてスタイルを変更
  const timerBorderColor = session.isBreak ? "teal.400" : "primary";
  const timerBgColor = session.isBreak ? "teal.50" : "transparent";
  const timerTextColor = session.isBreak ? "teal.700" : "inherit";

  return (
    <Box className="flex flex-col items-center">
      <Box
        className={`w-64 h-64 rounded-full border-4 flex items-center justify-center mb-8 relative ${
          session.isBreak ? "animate-pulse" : ""
        }`}
        borderColor={timerBorderColor}
        bg={timerBgColor}
      >
        <Box className="flex flex-col items-center">
          <Text className="text-6xl font-bold" color={timerTextColor}>
            {formatTime(session.remainingTime)}
          </Text>
        </Box>
        {isCustomized && (
          <Box position="absolute" top="0" right="0" mr={2} mt={2}>
            <Badge colorScheme="blue" variant="solid" borderRadius="full">
              <InfoIcon size={16} className="mr-1" />
              設定反映済み
            </Badge>
          </Box>
        )}
      </Box>

      {session.isBreak && (
        <Box
          className="mb-4 p-3 rounded-lg bg-teal-100 border border-teal-300 flex items-center"
          width="fit-content"
          maxW="md"
        >
          <CoffeeIcon size={24} className="mr-2 text-teal-600" />
          <Text fontSize="lg" fontWeight="bold" color="teal.700">
            休憩中です
          </Text>
        </Box>
      )}

      <Box className="flex space-x-4">
        <Button
          onClick={session.status === "in_progress" ? pauseTimer : startTimer}
          borderRadius="10px"
          size="lg"
          colorScheme={session.isBreak ? "teal" : "primary"}
        >
          {session.status === "in_progress" ? (
            <>
              <PauseIcon size={16} />
              一時停止
            </>
          ) : (
            <>
              <PlayIcon size={16} />
              開始
            </>
          )}
        </Button>
        <Button onClick={resetTimer} borderRadius="10px" size="lg">
          リセット
        </Button>
        {session.isBreak && (
          <Button
            onClick={skipBreak}
            borderRadius="10px"
            size="lg"
            variant="outline"
            colorScheme="teal"
          >
            スキップ
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default Timer;
