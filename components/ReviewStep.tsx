"use client";

import type { CheckResult } from "@/lib/compliance";
import { FIELDS, type AnalyzeResult, type FieldId, type OutputLang } from "@/lib/fields";
import CheckList from "./CheckList";
import { useI18n } from "./I18n";

export default function ReviewStep({
  headingRef,
  result,
  check,
  photoUrl,
  onEdit,
  onEacChange,
  onBack,
  onContinue,
}: {
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  result: AnalyzeResult;
  check: CheckResult | null;
  photoUrl: string | null;
  onEdit: (id: FieldId, lang: OutputLang, text: string) => void;
  onEacChange: (value: boolean) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const { lang, t } = useI18n();
  const cosmetic = result.sampleCategory === "cosmetics";
  const visibleFields = cosmetic ? FIELDS.filter(({ id }) => result.fields[id].original) : FIELDS;

  return (
    <section className="review">
      <div className="review-head">
        <h1 ref={headingRef} tabIndex={-1} className="page-title">
          {t("reviewTitle")}
        </h1>
        <p className="page-text">{t("reviewText")}</p>
        {result.mode === "demo" && <p className="demo-note">{t(cosmetic ? "cosmeticDemo" : "demoNote")}</p>}
      </div>

      <div className="review-layout">
        <div className="review-side">
          {photoUrl && (
            <figure className="photo">
              {/* A plain <img> is used because the photo is a local preview, not a file on the server. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photoUrl} alt={t("photoAlt")} />
              {result.sourceLanguage && (
                <figcaption>
                  {t("sourceLanguage")}: {result.sourceLanguage}
                </figcaption>
              )}
            </figure>
          )}
          {check && <CheckList check={check} eacMark={result.eacMark} onEacChange={onEacChange} />}
        </div>

        <div className="review-fields">
          {visibleFields.map((def) => {
            const field = result.fields[def.id];
            const status = check?.items.find((item) => item.id === def.id)?.status ?? "ok";
            const fieldName = def.label[lang];
            // About 36 characters fit on one line of a text box.
            const longest = Math.max(field.kk.length, field.ru.length);
            const rows = Math.min(10, Math.max(2, Math.ceil(longest / 36) + 1));

            return (
              <fieldset key={def.id} className="field" data-status={status}>
                <legend className="field-name">{fieldName}</legend>

                <p className="field-original">
                  <span className="field-caption">{t("colOriginal")}</span>
                  {field.original ? (
                    <span>{field.original}</span>
                  ) : (
                    <span className="field-empty">{t("notFound")}</span>
                  )}
                </p>

                <div className="field-translations">
                  {(["kk", "ru"] as const).map((outLang) => (
                    <label key={outLang} className="field-edit">
                      <span className="field-caption">
                        {t(outLang === "kk" ? "colKk" : "colRu")}
                      </span>
                      <textarea
                        lang={outLang}
                        rows={rows}
                        value={field[outLang]}
                        aria-label={t("fieldFor", {
                          field: fieldName,
                          lang: t(outLang === "kk" ? "colKk" : "colRu"),
                        })}
                        onChange={(event) => onEdit(def.id, outLang, event.target.value)}
                      />
                    </label>
                  ))}
                </div>
              </fieldset>
            );
          })}
        </div>
      </div>

      <div className="actions-bar">
        {check && check.missing > 0 && (
          <p className="warning" role="status">
            {t("missingWarning", { n: check.missing })}
          </p>
        )}
        <div className="actions">
          <button type="button" className="button button-quiet" onClick={onBack}>
            {t("btnBack")}
          </button>
          <button type="button" className="button button-primary" onClick={onContinue}>
            {t("btnContinue")}
          </button>
        </div>
      </div>
    </section>
  );
}
