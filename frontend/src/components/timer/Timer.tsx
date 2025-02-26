"use client";

import { Box, Button, Text, CircleProgress } from "@yamada-ui/react";
import { useState, useEffect } from "react";
import { PlayIcon, PauseIcon } from "lucide-react";
const Timer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <Box className="flex flex-col items-center">
      <Box className="w-64 h-64 rounded-full border-4 border-primary flex items-center justify-center mb-8">
        <Text className="text-6xl font-bold">{formatTime(timeLeft)}</Text>
      </Box>
      <Box className="flex space-x-4">
        <Button onClick={toggleTimer} borderRadius="10px" size="lg">
          {isActive ? (
            <>
              <PauseIcon size={16} />
              Pause
            </>
          ) : (
            <>
              <PlayIcon size={16} />
              Start
            </>
          )}
        </Button>
        <Button onClick={resetTimer} borderRadius="10px" size="lg">
          Reset
        </Button>
      </Box>
    </Box>
  );
};

export default Timer;
