"use client";

import { useState } from "react";
import type { CheckResult } from "@/lib/compliance";
import { buildLabelText, labelLines } from "@/lib/exportText";
import type { LabelFields, OutputLang } from "@/lib/fields";
import { useI18n } from "./I18n";

function StickerBlock({ fields, lang }: { fields: LabelFields; lang: OutputLang }) {
  return (
    <div className="sticker-block" lang={lang}>
      {labelLines(fields, lang).map((line) => (
        <p key={line.id} className={line.id === "name" ? "sticker-name" : "sticker-line"}>
          {line.title && <strong>{line.title}: </strong>}
          {line.text}
        </p>
      ))}
    </div>
  );
}

export default function DownloadStep({
  headingRef,
  fields,
  check,
  onEdit,
  onRestart,
}: {
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  fields: LabelFields;
  check: CheckResult | null;
  onEdit: () => void;
  onRestart: () => void;
}) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  function downloadText() {
    // "﻿" (a byte order mark) helps Windows Notepad show Kazakh letters correctly.
    const blob = new Blob(["﻿" + buildLabelText(fields)], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "tanba-label.txt";
    link.click();
    URL.revokeObjectURL(url);
  }

  async function copyText() {
    try {
      await navigator.clipboard.writeText(buildLabelText(fields));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard access can be blocked by the browser; the text file still works.
    }
  }

  return (
    <section className="download">
      <div className="download-head">
        <h1 ref={headingRef} tabIndex={-1} className="page-title">
          {t("downloadTitle")}
        </h1>
        <p className="page-text">{t("downloadText")}</p>
        {check && check.missing > 0 && (
          <p className="warning" role="status">
            {t("missingWarning", { n: check.missing })}
          </p>
        )}
      </div>

      <div className="sticker-sheet">
        <article className="sticker" aria-label={t("stickerLabel")}>
          <StickerBlock fields={fields} lang="kk" />
          <StickerBlock fields={fields} lang="ru" />
        </article>
      </div>

      <div className="actions download-actions">
        <button type="button" className="button button-primary" onClick={() => window.print()}>
          {t("btnPrint")}
        </button>
        <button type="button" className="button" onClick={downloadText}>
          {t("btnTxt")}
        </button>
        <button type="button" className="button" onClick={copyText}>
          <span aria-live="polite">{copied ? t("copied") : t("btnCopy")}</span>
        </button>
        <span className="actions-gap" />
        <button type="button" className="button button-quiet" onClick={onEdit}>
          {t("btnEdit")}
        </button>
        <button type="button" className="button button-quiet" onClick={onRestart}>
          {t("btnRestart")}
        </button>
      </div>
    </section>
  );
}
