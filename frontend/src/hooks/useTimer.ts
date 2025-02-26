import { useAtom } from "jotai";
import { timerSessionAtom, timerIntervalIdAtom } from "../store/timerAtoms";
import { TimerSession } from "../types/timer";

export const useTimer = () => {
  const [session, setSession] = useAtom(timerSessionAtom);
  const [intervalId, setIntervalId] = useAtom(timerIntervalIdAtom);

  const startTimer = () => {
    if (session.status !== "initial" && session.status !== "paused") return;

    setSession((prev) => ({
      ...prev,
      status: "in_progress",
      startedAt: prev.startedAt || new Date(),
    }));

    const id = window.setInterval(() => {
      setSession((prev) => {
        if (prev.remainingTime <= 0) {
          // タイマー終了時の処理
          clearInterval(id);
          if (prev.isBreak) {
            // 休憩終了時
            return {
              ...prev,
              status: "initial",
              isBreak: false,
              remainingTime: prev.focusDuration,
            };
          } else {
            // フォーカス時間終了時
            return {
              ...prev,
              status: "completed",
              isBreak: true,
              remainingTime: prev.breakDuration,
            };
          }
        }
        return {
          ...prev,
          remainingTime: prev.remainingTime - 1,
        };
      });
    }, 1000);

    setIntervalId(id);
  };

  const pauseTimer = () => {
    if (session.status !== "in_progress") return;

    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }

    setSession((prev) => ({
      ...prev,
      status: "paused",
    }));
  };

  const resetTimer = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }

    setSession((prev) => ({
      ...prev,
      status: "initial",
      remainingTime: prev.focusDuration,
      isBreak: false,
      startedAt: undefined,
      endedAt: undefined,
    }));
  };

  const skipBreak = () => {
    if (!session.isBreak) return;

    setSession((prev) => ({
      ...prev,
      status: "initial",
      isBreak: false,
      remainingTime: prev.focusDuration,
    }));
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return {
    session,
    startTimer,
    pauseTimer,
    resetTimer,
    skipBreak,
    formatTime,
  };
};
