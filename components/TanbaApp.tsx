"use client";

// The whole user journey lives here:
// upload a photo -> AI reads and translates -> check and edit -> download.
// This component keeps the state; the step components only show it.

import { useEffect, useRef, useState } from "react";
import { checkLabel } from "@/lib/compliance";
import { demoResult, sampleImagePath, type SampleId } from "@/lib/demo";
import { isErrorCode, type ErrorCode } from "@/lib/errors";
import type { AnalyzeResult, FieldId, OutputLang } from "@/lib/fields";
import { checkFile } from "@/lib/validation";
import DownloadStep from "./DownloadStep";
import ErrorBanner from "./ErrorBanner";
import Header from "./Header";
import { useI18n } from "./I18n";
import ReviewStep from "./ReviewStep";
import Stepper from "./Stepper";
import UploadStep from "./UploadStep";

type Stage = "upload" | "analyzing" | "review" | "download";

const STEP_INDEX: Record<Stage, number> = { upload: 0, analyzing: 0, review: 1, download: 2 };

export default function TanbaApp() {
  const { t } = useI18n();
  const [stage, setStage] = useState<Stage>("upload");
  const [error, setError] = useState<ErrorCode | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeResult | null>(null);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const isFirstRender = useRef(true);

  // When the step changes, move keyboard focus to the new heading,
  // so keyboard and screen-reader users land in the right place.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    headingRef.current?.focus();
    window.scrollTo({ top: 0 });
  }, [stage]);

  function showPhoto(url: string | null) {
    setPhotoUrl((old) => {
      if (old?.startsWith("blob:")) URL.revokeObjectURL(old);
      return url;
    });
  }

  async function analyze(file: File) {
    // Check the file in the browser first: the user gets an answer at once.
    const problem = checkFile(file.type, file.size);
    if (problem) {
      setError(problem);
      return;
    }

    setError(null);
    showPhoto(URL.createObjectURL(file));
    setStage("analyzing");

    const body = new FormData();
    body.append("file", file);

    try {
      const response = await fetch("/api/analyze", { method: "POST", body });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(isErrorCode(data?.error) ? data.error : "aiFailed");
        setStage("upload");
        return;
      }

      setResult(data as AnalyzeResult);
      setStage("review");
    } catch {
      setError("network");
      setStage("upload");
    }
  }

  function analyzeSample(id: SampleId) {
    setError(null);
    showPhoto(sampleImagePath(id));
    setResult(demoResult(id));
    setStage("review");
  }

  function editField(id: FieldId, lang: OutputLang, text: string) {
    setResult((old) =>
      old ? { ...old, fields: { ...old.fields, [id]: { ...old.fields[id], [lang]: text } } } : old,
    );
  }

  function restart() {
    setResult(null);
    setError(null);
    showPhoto(null);
    setStage("upload");
  }

  const check = result ? checkLabel(result.fields, result.eacMark) : null;

  return (
    <div className="page">
      <Header />
      <Stepper current={STEP_INDEX[stage]} />

      <main className="main">
        {error && <ErrorBanner code={error} onDismiss={() => setError(null)} />}

        {stage === "upload" && (
          <UploadStep headingRef={headingRef} onFile={analyze} onSample={analyzeSample} />
        )}

        {stage === "analyzing" && (
          <section className="analyzing" aria-busy="true">
            <div className="scanner" aria-hidden="true">
              {photoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoUrl} alt="" />
              )}
              <span className="scanner-line" />
            </div>
            <h1 ref={headingRef} tabIndex={-1} className="page-title" role="status">
              {t("analyzing")}
            </h1>
            <p className="page-text">{t("analyzingHint")}</p>
          </section>
        )}

        {stage === "review" && result && check && (
          <ReviewStep
            headingRef={headingRef}
            result={result}
            check={check}
            photoUrl={photoUrl}
            onEdit={editField}
            onEacChange={(value) => setResult((old) => (old ? { ...old, eacMark: value } : old))}
            onBack={restart}
            onContinue={() => setStage("download")}
          />
        )}

        {stage === "download" && result && check && (
          <DownloadStep
            headingRef={headingRef}
            fields={result.fields}
            check={check}
            onEdit={() => setStage("review")}
            onRestart={restart}
          />
        )}
      </main>

      <footer className="footer">{t("footer")}</footer>
    </div>
  );
}
