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

// セッション状態の永続化
// ページリロード時にも状態を保持するが、初期化時に残り時間を正しく設定
export const timerSessionAtom = atomWithStorage<TimerSession>(
  "currentTimerSession",
  initialSession,
  {
    // カスタムストレージイベントハンドラ
    getItem: (key, initialValue) => {
      // ローカルストレージから値を取得
      const storedValue = localStorage.getItem(key);
      if (!storedValue) return initialValue;

      try {
        const session = JSON.parse(storedValue) as TimerSession;

        // 休憩モードの場合は、残り時間が正しく設定されているか確認
        if (session.isBreak && session.status === "completed") {
          session.remainingTime = session.breakDuration;
        }

        return session;
      } catch (e) {
        return initialValue;
      }
    },
    setItem: (key, value) => {
      localStorage.setItem(key, JSON.stringify(value));
    },
    removeItem: (key) => {
      localStorage.removeItem(key);
    },
  }
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
