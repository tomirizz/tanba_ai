"use client";

// Gives every component access to the current language and the t() function.

import { createContext, useContext, useEffect, useSyncExternalStore } from "react";
import { translate, type TextKey, type UiLang } from "@/lib/i18n";
import { getLang, getServerLang, setLang, subscribe } from "@/lib/langStore";

type I18n = {
  lang: UiLang;
  setLang: (lang: UiLang) => void;
  t: (key: TextKey, values?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18n | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const lang = useSyncExternalStore(subscribe, getLang, getServerLang);

  // Tell browsers and screen readers which language the page is in.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value: I18n = {
    lang,
    setLang,
    t: (key, values) => translate(lang, key, values),
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18n {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside I18nProvider");
  return value;
}
