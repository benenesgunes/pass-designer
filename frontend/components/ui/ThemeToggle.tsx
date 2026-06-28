"use client";

import { Moon, Sun } from "lucide-react";

const themeStorageKey = "wallet-pass-theme";

type Theme = "light" | "dark";

function getCurrentTheme(): Theme {
  const currentTheme = document.documentElement.dataset.theme;

  if (currentTheme === "dark" || currentTheme === "light") {
    return currentTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;

  try {
    localStorage.setItem(themeStorageKey, theme);
  } catch {
    return;
  }
}

export function ThemeToggle() {
  function toggleTheme() {
    setTheme(getCurrentTheme() === "dark" ? "light" : "dark");
  }

  return (
    <button
      aria-label="Toggle theme"
      className="theme-toggle"
      onClick={toggleTheme}
      title="Toggle theme"
      type="button"
    >
      <Moon aria-hidden className="theme-icon theme-icon-moon" />
      <Sun aria-hidden className="theme-icon theme-icon-sun" />
    </button>
  );
}
