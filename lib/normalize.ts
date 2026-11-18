// Turns the AI's raw answer into the exact shape the app expects.
// The AI returns valid JSON, but its values are not guaranteed to be right,
// so nothing from it is trusted without a check.

import { FIELD_IDS, emptyFields, type ProductCategory, type FieldId, type LabelFields } from "./fields";

const MAX_TEXT = 2000; // longest text kept for one label part

export type NormalizedAnswer = {
  isLabel: boolean;
  category: ProductCategory;
  sourceLanguage: string;
  eacMark: boolean;
  fields: LabelFields;
};

function cleanText(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, MAX_TEXT);
}

function isFieldId(value: unknown): value is FieldId {
  return typeof value === "string" && (FIELD_IDS as readonly string[]).includes(value);
}

export function normalizeAnswer(raw: unknown): NormalizedAnswer {
  const fields = emptyFields();
  const data = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;

  if (Array.isArray(data.fields)) {
    for (const item of data.fields) {
      if (!item || typeof item !== "object") continue;
      const row = item as Record<string, unknown>;
      if (!isFieldId(row.id)) continue;
      fields[row.id] = {
        original: cleanText(row.original),
        kk: cleanText(row.kk),
        ru: cleanText(row.ru),
      };
    }
  }

  // If the AI found no text for any part, treat the photo as "not a label",
  // whatever it claimed in isLabel.
  const anyText = FIELD_IDS.some((id) => fields[id].original !== "");

  return {
    isLabel: data.isLabel === true && anyText,
    category: data.category === "food" || data.category === "cosmetics" ? data.category : "other",
    sourceLanguage: cleanText(data.sourceLanguage).slice(0, 40),
    eacMark: data.eacMark === true,
    fields,
  };
}
