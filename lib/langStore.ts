// Remembers the chosen interface language in the browser (localStorage),
// so the choice survives a page reload.
// It is written as a tiny "store" for React's useSyncExternalStore hook:
// the server always renders English, and the browser switches to the saved
// language right after loading, without a mismatch error.

import type { UiLang } from "./i18n";

const STORAGE_KEY = "tanba-lang";
const listeners = new Set<() => void>();

// Used when the browser blocks localStorage (for example, private mode).
let fallback: UiLang = "en";

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getLang(): UiLang {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "kk") return saved;
  } catch {
    // localStorage is not available; use the in-memory value.
  }
  return fallback;
}

export function getServerLang(): UiLang {
  return "en";
}

export function setLang(lang: UiLang): void {
  fallback = lang;
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // Ignore: the choice still works until the page is closed.
  }
  for (const listener of listeners) listener();
}
