"use client";

import { UI_LANGS } from "@/lib/i18n";
import { useI18n } from "./I18n";

export default function Header() {
  const { lang, setLang, t } = useI18n();

  return (
    <header className="header">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true">
          T
        </span>
        <span className="brand-text">
          <span className="brand-name">Tańba AI</span>
          <span className="brand-tagline">{t("tagline")}</span>
        </span>
      </div>

      <div className="lang-switch" role="group" aria-label={t("langSwitch")}>
        {UI_LANGS.map((item) => (
          <button
            key={item.id}
            type="button"
            className="lang-button"
            aria-pressed={lang === item.id}
            lang={item.id}
            title={item.name}
            onClick={() => setLang(item.id)}
          >
            {item.short}
          </button>
        ))}
      </div>
    </header>
  );
}
