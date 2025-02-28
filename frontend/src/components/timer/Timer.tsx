"use client";

import { Box, Button, Text, Badge, CircleProgress } from "@yamada-ui/react";
import {
  PlayIcon,
  PauseIcon,
  InfoIcon,
  CoffeeIcon,
  TimerIcon,
} from "lucide-react";
import { useTimer } from "@/hooks/useTimer";
import { useAtom } from "jotai";
import { timerSettingsAtom, timerProgressAtom } from "@/store/timerAtoms";

const Timer = () => {
  const { session, startTimer, pauseTimer, resetTimer, skipBreak, formatTime } =
    useTimer();
  const [settings] = useAtom(timerSettingsAtom);
  const [progress] = useAtom(timerProgressAtom);

  // 現在のタイマー時間と設定時間が異なるかどうかを確認
  const isCustomized =
    (session.isBreak &&
      session.breakDuration !== settings.defaultBreakDuration) ||
    (!session.isBreak &&
      session.focusDuration !== settings.defaultFocusDuration);

  // 休憩中かどうかに基づいてスタイルを変更
  const timerColor = session.isBreak ? "teal" : "primary";
  const progressColor = session.isBreak ? "teal.400" : "primary";
  const textColor = session.isBreak ? "teal.700" : "inherit";

  return (
    <Box className="flex flex-col items-center">
      <Box className="relative w-64 h-64 flex items-center justify-center mb-8">
        <CircleProgress
          value={progress}
          thickness="4px"
          color={progressColor}
          trackColor="gray.100"
          className="absolute inset-0"
          boxSize={72}
        />
        <Box
          className="flex flex-col items-center justify-center z-10"
          position="absolute"
        >
          <Text className="text-5xl font-bold" color={textColor}>
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
          className="mb-4 p-3 rounded-lg border flex items-center"
          width="fit-content"
          maxW="md"
          bg="teal.100"
          borderColor="teal.300"
        >
          <CoffeeIcon size={24} className="mr-2 text-teal-600" />
          <Text fontSize="lg" fontWeight="bold" color="teal.700">
            休憩中
          </Text>
        </Box>
      )}

      <Box className="flex space-x-4 flex-wrap justify-center gap-y-3">
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
