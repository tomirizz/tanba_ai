// Checks which required label details are filled in.
// A detail counts as filled in only when BOTH translations (Kazakh and
// Russian) have text, because the finished label needs both languages.

import { FIELDS, type FieldId, type LabelFields } from "./fields";

export type CheckStatus = "ok" | "missing" | "optional";

export type CheckItem = {
  id: FieldId | "eac";
  status: CheckStatus;
};

export type CheckResult = {
  items: CheckItem[];
  found: number; // required details that are filled in
  total: number; // all required details
  missing: number; // total - found
};

function hasText(value: string): boolean {
  return value.trim().length > 0;
}

export function checkLabel(fields: LabelFields, eacMark: boolean): CheckResult {
  const items: CheckItem[] = [];
  let found = 0;
  let total = 0;

  for (const def of FIELDS) {
    const field = fields[def.id];
    const filled = hasText(field.kk) && hasText(field.ru);

    if (def.level === "required") {
      total += 1;
      if (filled) found += 1;
      items.push({ id: def.id, status: filled ? "ok" : "missing" });
    } else {
      // Conditional details never count as missing: the product may not need them.
      items.push({ id: def.id, status: filled ? "ok" : "optional" });
    }
  }

  // The EAC mark is a picture on the package, not text, so the user confirms it.
  total += 1;
  if (eacMark) found += 1;
  items.push({ id: "eac", status: eacMark ? "ok" : "missing" });

  return { items, found, total, missing: total - found };
}
