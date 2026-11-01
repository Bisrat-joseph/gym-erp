import { useSyncExternalStore } from "react";

const THEME_KEY = "gp_admin_theme";

type Theme = "light" | "dark";

let listeners: Array<() => void> = [];

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "dark" || saved === "light") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

let currentTheme: Theme = getStoredTheme();

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

// Initial apply
applyTheme(currentTheme);

export function setTheme(theme: Theme) {
  currentTheme = theme;
  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
  listeners.forEach((l) => l());
}

export function toggleTheme() {
  setTheme(currentTheme === "dark" ? "light" : "dark");
}

function subscribe(callback: () => void) {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter((l) => l !== callback);
  };
}

function getSnapshot(): Theme {
  return currentTheme;
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, () => "light");
  return {
    theme,
    isDark: theme === "dark",
    setTheme,
    toggleTheme,
  };
}

