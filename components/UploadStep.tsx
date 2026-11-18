"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { SAMPLE_IDS, sampleImagePath, type SampleId } from "@/lib/demo";
import type { TextKey } from "@/lib/i18n";
import { useI18n } from "./I18n";

const SAMPLE_NAMES: Record<SampleId, TextKey> = {
  "oat-cookies": "sampleOat",
  "hazelnut-chocolate": "sampleChocolate",
  "rice-cream": "sampleRiceCream",
  "green-tea-cleanser": "sampleGreenTeaCleanser",
};

export default function UploadStep({
  headingRef,
  onFile,
  onSample,
}: {
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  onFile: (file: File) => void;
  onSample: (id: SampleId) => void;
}) {
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleDrop(event: React.DragEvent) {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) onFile(file);
  }

  function handleChoose(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) onFile(file);
    event.target.value = ""; // lets the user pick the same file again
  }

  return (
    <section className="upload">
      <div className="upload-main">
        <h1 ref={headingRef} tabIndex={-1} className="hero-title">
          {t("heroTitle")}
        </h1>
        <p className="hero-text">{t("heroText")}</p>

        <div
          className="dropzone"
          data-dragging={dragging}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            id="label-photo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="visually-hidden"
            tabIndex={-1}
            onChange={handleChoose}
          />
          <button
            type="button"
            className="button button-primary button-large"
            onClick={() => inputRef.current?.click()}
          >
            {t("dropTitle")}
          </button>
          <p className="dropzone-hint">{t("dropHint")}</p>
        </div>

        <p className="privacy-note">{t("privacy")}</p>
      </div>

      <aside className="samples" aria-labelledby="samples-title">
        <h2 id="samples-title" className="samples-title">
          {t("samplesTitle")}
        </h2>
        <ul className="sample-list">
          {SAMPLE_IDS.map((id) => (
            <li key={id}>
              <button type="button" className="sample" onClick={() => onSample(id)}>
                <Image
                  src={sampleImagePath(id)}
                  alt=""
                  width={150}
                  height={200}
                  className="sample-image"
                />
                <span className="sample-name">{t(SAMPLE_NAMES[id])}</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </section>
  );
}
