"use client";

import type { CheckResult, CheckStatus } from "@/lib/compliance";
import { FIELDS } from "@/lib/fields";
import type { TextKey } from "@/lib/i18n";
import { useI18n } from "./I18n";

const STATUS_TEXT: Record<CheckStatus, TextKey> = {
  ok: "statusOk",
  missing: "statusMissing",
  optional: "statusOptional",
};

// Each status has its own symbol, so it never depends on colour alone.
const STATUS_SYMBOL: Record<CheckStatus, string> = {
  ok: "✓",
  missing: "!",
  optional: "–",
};

export default function CheckList({
  check,
  eacMark,
  onEacChange,
}: {
  check: CheckResult;
  eacMark: boolean;
  onEacChange: (value: boolean) => void;
}) {
  const { lang, t } = useI18n();

  function nameOf(id: string): string {
    if (id === "eac") return t("eacName");
    const def = FIELDS.find((field) => field.id === id);
    return def ? def.label[lang] : id;
  }

  return (
    <section className="check" aria-labelledby="check-title">
      <h2 id="check-title" className="panel-title">
        {t("checkTitle")}
      </h2>
      {/* aria-live: the count is read out again whenever it changes. */}
      <p className="check-summary" aria-live="polite" data-complete={check.missing === 0}>
        {t("checkSummary", { found: check.found, total: check.total })}
      </p>

      <ul className="check-list">
        {check.items.map((item) => (
          <li key={item.id} className="check-item" data-status={item.status}>
            <span className="check-symbol" aria-hidden="true">
              {STATUS_SYMBOL[item.status]}
            </span>
            <span className="check-name">{nameOf(item.id)}</span>
            <span className="check-status">{t(STATUS_TEXT[item.status])}</span>
          </li>
        ))}
      </ul>

      <label className="eac-toggle">
        <input
          type="checkbox"
          checked={eacMark}
          onChange={(event) => onEacChange(event.target.checked)}
        />
        <span>{t("eacLabel")}</span>
      </label>

      <p className="fine-print">{t("checkNote")}</p>
    </section>
  );
}
