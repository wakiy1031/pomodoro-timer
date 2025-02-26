import { atomWithStorage } from "jotai/utils";

export const isDarkModeAtom = atomWithStorage<boolean>(
  "isDarkMode",
  window?.matchMedia("(prefers-color-scheme: dark)").matches ?? false
);
