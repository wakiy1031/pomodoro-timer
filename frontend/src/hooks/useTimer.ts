import { useAtom } from "jotai";
import {
  timerSessionAtom,
  timerIntervalIdAtom,
  timerSettingsAtom,
} from "../store/timerAtoms";
import { TimerSession, TimerSettings } from "../types/timer";
import { useEffect } from "react";

export const useTimer = () => {
  const [session, setSession] = useAtom(timerSessionAtom);
  const [intervalId, setIntervalId] = useAtom(timerIntervalIdAtom);
  const [settings] = useAtom(timerSettingsAtom);

  // 設定変更を監視して、タイマーセッションを更新
  useEffect(() => {
    // 設定が変更されたら、現在のセッションの時間設定を更新
    setSession((prev) => {
      // 現在のステータスを保持
      const currentStatus = prev.status;
      const isBreak = prev.isBreak;

      // 残り時間の割合を計算（例: 25分中の15分 = 60%）
      const currentTotalTime = isBreak
        ? prev.breakDuration
        : prev.focusDuration;
      const remainingRatio = prev.remainingTime / currentTotalTime;

      // 新しい時間設定
      const newFocusDuration = settings.defaultFocusDuration;
      const newBreakDuration = settings.defaultBreakDuration;

      // 新しい残り時間を計算（割合を維持）
      const newRemainingTime = Math.round(
        isBreak
          ? newBreakDuration * remainingRatio
          : newFocusDuration * remainingRatio
      );

      return {
        ...prev,
        focusDuration: newFocusDuration,
        breakDuration: newBreakDuration,
        remainingTime: newRemainingTime,
      };
    });
  }, [settings, setSession]);

  // タイマーの状態が変わったときに自動的に休憩タイマーを開始
  useEffect(() => {
    // 作業時間が終了して休憩モードになった場合、自動的に休憩タイマーを開始
    if (session.status === "completed" && session.isBreak) {
      startBreakTimer();
    }
  }, [session.status, session.isBreak]);

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

  // 休憩タイマーを自動的に開始する関数
  const startBreakTimer = () => {
    setSession((prev) => ({
      ...prev,
      status: "in_progress",
    }));

    const id = window.setInterval(() => {
      setSession((prev) => {
        if (prev.remainingTime <= 0) {
          // 休憩タイマー終了時の処理
          clearInterval(id);
          return {
            ...prev,
            status: "initial",
            isBreak: false,
            remainingTime: prev.focusDuration,
          };
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

    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }

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
