"use client";

import type { ErrorCode } from "@/lib/errors";
import type { TextKey } from "@/lib/i18n";
import { useI18n } from "./I18n";

// Which message to show for each error code.
const MESSAGES: Record<ErrorCode, TextKey> = {
  noFile: "errNoFile",
  fileType: "errFileType",
  fileSize: "errFileSize",
  noLabel: "errNoLabel",
  aiNotConfigured: "errAiNotConfigured",
  aiFailed: "errAiFailed",
  rateLimited: "errRateLimited",
  network: "errNetwork",
};

export default function ErrorBanner({
  code,
  onDismiss,
}: {
  code: ErrorCode;
  onDismiss: () => void;
}) {
  const { t } = useI18n();

  return (
    // role="alert" makes screen readers announce the message at once.
    <div className="error-banner" role="alert" data-error={code}>
      <div>
        <p className="error-title">{t("errorTitle")}</p>
        <p>{t(MESSAGES[code])}</p>
      </div>
      <button type="button" className="button button-quiet" onClick={onDismiss}>
        {t("btnDismiss")}
      </button>
    </div>
  );
}
