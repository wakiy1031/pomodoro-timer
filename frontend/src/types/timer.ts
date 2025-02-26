export type TimerStatus =
  | "initial"
  | "in_progress"
  | "paused"
  | "completed"
  | "interrupted";

export interface TimerSession {
  id?: string;
  focusDuration: number; // 秒単位
  breakDuration: number; // 秒単位
  status: TimerStatus;
  startedAt?: Date;
  endedAt?: Date;
  remainingTime: number; // 秒単位
  isBreak: boolean;
}

export interface TimerSettings {
  defaultFocusDuration: number; // 秒単位
  defaultBreakDuration: number; // 秒単位
}
