// Builds the finished label as plain text, for the .txt download and "Copy".

import { FIELDS, type FieldId, type LabelFields, type OutputLang } from "./fields";

export type LabelLine = {
  id: FieldId;
  title: string | null; // null: print the text without a title
  text: string;
};

// The filled-in details of one language, in label order. Empty details are skipped.
export function labelLines(fields: LabelFields, lang: OutputLang): LabelLine[] {
  const lines: LabelLine[] = [];
  for (const def of FIELDS) {
    const text = fields[def.id]?.[lang]?.trim() ?? "";
    if (text === "") continue;
    lines.push({ id: def.id, title: def.printTitle ? def.label[lang] : null, text });
  }
  return lines;
}

function block(fields: LabelFields, lang: OutputLang): string {
  return labelLines(fields, lang)
    .map((line) => (line.title ? `${line.title}: ${line.text}` : line.text))
    .join("\n");
}

export function buildLabelText(fields: LabelFields): string {
  return `${block(fields, "kk")}\n\n${block(fields, "ru")}\n`;
}
