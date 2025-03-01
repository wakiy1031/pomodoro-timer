import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { TimerSession, TimerSettings } from "../types/timer";

// デフォルト設定
const DEFAULT_SETTINGS: TimerSettings = {
  defaultFocusDuration: 25 * 60, // 25分
  defaultBreakDuration: 5 * 60, // 5分
};

// 設定の永続化
export const timerSettingsAtom = atomWithStorage<TimerSettings>(
  "timerSettings",
  DEFAULT_SETTINGS
);

// 現在のセッション
const initialSession: TimerSession = {
  focusDuration: DEFAULT_SETTINGS.defaultFocusDuration,
  breakDuration: DEFAULT_SETTINGS.defaultBreakDuration,
  status: "initial",
  remainingTime: DEFAULT_SETTINGS.defaultFocusDuration,
  isBreak: false,
};

export const timerSessionAtom = atomWithStorage<TimerSession>(
  "currentTimerSession",
  initialSession
);

// タイマーのティック（1秒ごとの更新）用
export const timerIntervalIdAtom = atom<number | null>(null);

// 派生したatom（計算された値）
export const timerProgressAtom = atom((get) => {
  const session = get(timerSessionAtom);
  const totalDuration = session.isBreak
    ? session.breakDuration
    : session.focusDuration;
  return ((totalDuration - session.remainingTime) / totalDuration) * 100;
});
