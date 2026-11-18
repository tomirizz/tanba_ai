"use client";

import type { TextKey } from "@/lib/i18n";
import { useI18n } from "./I18n";

const STEPS: TextKey[] = ["stepUpload", "stepReview", "stepDownload"];

// current: 0 = upload, 1 = check and edit, 2 = download
export default function Stepper({ current }: { current: number }) {
  const { t } = useI18n();

  return (
    <nav aria-label={t("stepsLabel")}>
      <ol className="stepper">
        {STEPS.map((key, index) => (
          <li
            key={key}
            className="step"
            data-state={index < current ? "done" : index === current ? "current" : "next"}
            aria-current={index === current ? "step" : undefined}
          >
            <span className="step-number" aria-hidden="true">
              {index + 1}
            </span>
            <span className="step-name">{t(key)}</span>
          </li>
        ))}
      </ol>
    </nav>
  );
}
