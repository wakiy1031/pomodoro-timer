"use client";

import { useAtom } from "jotai";
import {
  timerSessionAtom,
  timerIntervalIdAtom,
  timerSettingsAtom,
} from "../store/timerAtoms";
import { useEffect, useCallback } from "react";
import { useNotification } from "./useNotification";

export const useTimer = () => {
  const [session, setSession] = useAtom(timerSessionAtom);
  const [intervalId, setIntervalId] = useAtom(timerIntervalIdAtom);
  const [settings] = useAtom(timerSettingsAtom);
  const { showNotification } = useNotification();

  // 設定変更を監視して、タイマーセッションを更新
  useEffect(() => {
    // 設定が変更されたら、現在のセッションの時間設定を更新
    setSession((prev) => {
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

  // 休憩タイマーを自動的に開始する関数
  const startBreakTimer = useCallback(() => {
    // サーバーサイドレンダリング時は何もしない
    if (typeof window === "undefined") return;

    // 休憩タイマーの開始時に、残り時間を休憩時間の設定値に確実に設定
    setSession((prev) => ({
      ...prev,
      status: "in_progress",
      remainingTime: prev.breakDuration, // 確実に休憩時間の設定値を使用
    }));

    // setIntervalの戻り値をnumberとして扱う
    const id = setInterval(() => {
      setSession((prev) => {
        if (prev.remainingTime <= 0) {
          // 休憩タイマー終了時の処理
          clearInterval(id);

          // 休憩終了時に通知を表示
          if (typeof window !== "undefined") {
            showNotification({
              title: "休憩終了",
              body: "休憩時間が終了しました。新しい作業セッションを開始しましょう！",
            });
          }

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
    }, 1000) as unknown as number;

    setIntervalId(id);
  }, [setSession, setIntervalId, showNotification]);

  // タイマーの状態が変わったときに自動的に休憩タイマーを開始
  useEffect(() => {
    // サーバーサイドレンダリング時は何もしない
    if (typeof window === "undefined") return;

    // 作業時間が終了して休憩モードになった場合、自動的に休憩タイマーを開始
    if (session.status === "completed" && session.isBreak) {
      startBreakTimer();
    }
  }, [session.status, session.isBreak, startBreakTimer]);

  const startTimer = () => {
    // サーバーサイドレンダリング時は何もしない
    if (typeof window === "undefined") return;

    if (session.status !== "initial" && session.status !== "paused") return;

    setSession((prev) => ({
      ...prev,
      status: "in_progress",
      startedAt: prev.startedAt || new Date(),
    }));

    // setIntervalの戻り値をnumberとして扱う
    const id = setInterval(() => {
      setSession((prev) => {
        if (prev.remainingTime <= 0) {
          // タイマー終了時の処理
          clearInterval(id);
          if (prev.isBreak) {
            // 休憩終了時

            // 休憩終了時に通知を表示
            if (typeof window !== "undefined") {
              showNotification({
                title: "休憩終了",
                body: "休憩時間が終了しました。新しい作業セッションを開始しましょう！",
              });
            }

            return {
              ...prev,
              status: "initial",
              isBreak: false,
              remainingTime: prev.focusDuration,
            };
          } else {
            // フォーカス時間終了時

            // 作業終了時に通知を表示
            if (typeof window !== "undefined") {
              showNotification({
                title: "作業終了",
                body: "お疲れ様でした！休憩時間です。",
              });
            }

            // 休憩モードに切り替える際に、残り時間を確実に休憩時間の設定値に設定
            return {
              ...prev,
              status: "completed",
              isBreak: true,
              remainingTime: prev.breakDuration, // 確実に休憩時間の設定値を使用
            };
          }
        }
        return {
          ...prev,
          remainingTime: prev.remainingTime - 1,
        };
      });
    }, 1000) as unknown as number;

    setIntervalId(id);
  };

  const pauseTimer = () => {
    // サーバーサイドレンダリング時は何もしない
    if (typeof window === "undefined") return;

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
    // サーバーサイドレンダリング時は何もしない
    if (typeof window === "undefined") return;

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
    // サーバーサイドレンダリング時は何もしない
    if (typeof window === "undefined") return;

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
