import { atomWithStorage } from "jotai/utils";

export const isDarkModeAtom = atomWithStorage<boolean>(
  "isDarkMode",
  typeof window !== "undefined"
    ? window?.matchMedia("(prefers-color-scheme: dark)").matches
    : false
);
