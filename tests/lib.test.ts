// Automatic checks for the app's rules. Run them with: npm test

import { describe, expect, it } from "vitest";
import { checkLabel } from "../lib/compliance";
import { demoResult, isSampleId } from "../lib/demo";
import { buildLabelText } from "../lib/exportText";
import { emptyFields, reviewFields } from "../lib/fields";
import { normalizeAnswer } from "../lib/normalize";
import { allowRequest } from "../lib/rateLimit";
import { MAX_FILE_BYTES, checkFile, sniffImageType } from "../lib/validation";

describe("required details check", () => {
  it("reports everything as missing for an empty label", () => {
    const check = checkLabel(emptyFields(), false);
    expect(check.total).toBe(10);
    expect(check.found).toBe(0);
    expect(check.missing).toBe(10);
  });

  it("counts a detail only when both Kazakh and Russian are filled in", () => {
    const fields = emptyFields();
    fields.name = { original: "Tea", kk: "Шай", ru: "" };
    expect(checkLabel(fields, false).found).toBe(0);
    fields.name.ru = "Чай";
    expect(checkLabel(fields, false).found).toBe(1);
  });

  it("treats text made of spaces as empty", () => {
    const fields = emptyFields();
    fields.name = { original: "", kk: "   ", ru: "  " };
    expect(checkLabel(fields, false).found).toBe(0);
  });

  it("never marks conditional details as missing", () => {
    const check = checkLabel(emptyFields(), false);
    const usage = check.items.find((item) => item.id === "usage");
    const gmo = check.items.find((item) => item.id === "gmo");
    expect(usage?.status).toBe("optional");
    expect(gmo?.status).toBe("optional");
  });

  it("counts the EAC mark", () => {
    expect(checkLabel(emptyFields(), true).found).toBe(1);
  });

  it("finds the gaps in the sample labels", () => {
    const cookies = demoResult("oat-cookies");
    expect(checkLabel(cookies.fields, cookies.eacMark).found).toBe(8);
    const chocolate = demoResult("hazelnut-chocolate");
    expect(checkLabel(chocolate.fields, chocolate.eacMark).found).toBe(6);
  });
});

describe("file checks", () => {
  it("accepts photos and rejects other files", () => {
    expect(checkFile("image/jpeg", 1000)).toBeNull();
    expect(checkFile("image/png", 1000)).toBeNull();
    expect(checkFile("image/webp", 1000)).toBeNull();
    expect(checkFile("application/pdf", 1000)).toBe("fileType");
    expect(checkFile("image/gif", 1000)).toBe("fileType");
    expect(checkFile("", 1000)).toBe("fileType");
  });

  it("rejects files over the size limit", () => {
    expect(checkFile("image/png", MAX_FILE_BYTES)).toBeNull();
    expect(checkFile("image/png", MAX_FILE_BYTES + 1)).toBe("fileSize");
  });

  it("recognises real image files by their first bytes", () => {
    expect(sniffImageType(new Uint8Array([0xff, 0xd8, 0xff, 0xe0]))).toBe("image/jpeg");
    expect(sniffImageType(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))).toBe(
      "image/png",
    );
    const webp = new TextEncoder().encode("RIFF0000WEBPVP8 ");
    expect(sniffImageType(webp)).toBe("image/webp");
  });

  it("rejects a text file that only pretends to be an image", () => {
    expect(sniffImageType(new TextEncoder().encode("this is not an image"))).toBeNull();
    expect(sniffImageType(new Uint8Array([]))).toBeNull();
  });
});

describe("cleaning the AI answer", () => {
  it("keeps valid details and fills the rest with empty text", () => {
    const answer = normalizeAnswer({
      isLabel: true,
      sourceLanguage: "English",
      eacMark: false,
      fields: [{ id: "name", original: " Tea ", kk: "Шай", ru: "Чай" }],
    });
    expect(answer.isLabel).toBe(true);
    expect(answer.fields.name).toEqual({ original: "Tea", kk: "Шай", ru: "Чай" });
    expect(answer.fields.composition).toEqual({ original: "", kk: "", ru: "" });
  });

  it("ignores unknown details and wrong value types", () => {
    const answer = normalizeAnswer({
      isLabel: true,
      fields: [
        { id: "price", original: "5", kk: "5", ru: "5" },
        { id: "name", original: 42, kk: null, ru: ["x"] },
        "garbage",
      ],
    });
    expect(answer.fields.name).toEqual({ original: "", kk: "", ru: "" });
    expect(answer.isLabel).toBe(false);
  });

  it("says 'not a label' when no text was found, whatever the AI claims", () => {
    expect(normalizeAnswer({ isLabel: true, fields: [] }).isLabel).toBe(false);
    expect(normalizeAnswer(null).isLabel).toBe(false);
    expect(normalizeAnswer("text").isLabel).toBe(false);
  });

  it("cuts very long text", () => {
    const answer = normalizeAnswer({
      isLabel: true,
      fields: [{ id: "composition", original: "a".repeat(5000), kk: "", ru: "" }],
    });
    expect(answer.fields.composition.original.length).toBe(2000);
  });
});

describe("finished label text", () => {
  it("has a Kazakh block, then a Russian block, without empty details", () => {
    const text = buildLabelText(demoResult("oat-cookies").fields);
    expect(text).toContain("Құрамы: Сұлы жармасы");
    expect(text).toContain("Состав: Овсяные хлопья");
    expect(text.indexOf("Құрамы")).toBeLessThan(text.indexOf("Состав"));
    expect(text).not.toContain("Импортёр");
  });

  it("prints the name and the quantity without a title", () => {
    const text = buildLabelText(demoResult("oat-cookies").fields);
    expect(text.startsWith("Шоколад түйіршіктері қосылған сұлы печеньесі\n")).toBe(true);
    expect(text).toContain("\nМасса нетто 200 г\n");
    expect(text).toContain("Срок годности: до 12.06.2027");
  });
});

describe("samples and request limit", () => {
  it("knows only the built-in samples", () => {
    expect(isSampleId("oat-cookies")).toBe(true);
    expect(isSampleId("../../etc/passwd")).toBe(false);
    expect(isSampleId(null)).toBe(false);
  });

  it("blocks a visitor after 12 requests and lets them back after 10 minutes", () => {
    const start = 1_000_000;
    for (let i = 0; i < 12; i++) expect(allowRequest("visitor-a", start + i)).toBe(true);
    expect(allowRequest("visitor-a", start + 20)).toBe(false);
    expect(allowRequest("visitor-b", start + 20)).toBe(true);
    expect(allowRequest("visitor-a", start + 10 * 60 * 1000 + 100)).toBe(true);
  });
});

describe("product label categories", () => {
  it("preserves cosmetic precautions through review and export", () => {
    const answer = normalizeAnswer({
      isLabel: true, category: "cosmetics", sourceLanguage: "Korean",
      fields: [{ id: "warnings", original: "눈에 들어가지 않도록 하세요.", kk: "Көзге тигізбеңіз.", ru: "Избегайте попадания в глаза." }],
    });
    expect(answer.category).toBe("cosmetics");
    expect(reviewFields(answer.category, answer.fields).map(({ id }) => id)).toEqual(["warnings"]);
    expect(buildLabelText(answer.fields)).toContain("Избегайте попадания в глаза.");
  });

  it("retains multiple printed lines when Gemini repeats a field", () => {
    const size = { id: "specifications", original: "36 x 42 cm", ru: "36 x 42 см", kk: "36 x 42 см" };
    const capacity = { id: "specifications", original: "8 L", ru: "8 л", kk: "8 л" };
    const result = normalizeAnswer({ category: "other", isLabel: true, fields: [size, capacity, size] });
    expect(result.fields.specifications.ru).toBe("36 x 42 см\n8 л");
  });

  it("keeps product-specific details and uses a neutral category for an unknown type", () => {
    const answer = normalizeAnswer({
      isLabel: true, category: "textiles",
      fields: [{ id: "otherDetails", original: "Model TX-42", kk: "TX-42 моделі", ru: "Модель TX-42" }],
    });
    expect(answer.category).toBe("other");
    expect(answer.isLabel).toBe(true);
    expect(reviewFields(answer.category, answer.fields).map(({ id }) => id)).toEqual(["otherDetails"]);
    expect(buildLabelText(answer.fields)).toContain("TX-42");
    expect(reviewFields("food", emptyFields()).some(({ id }) => id === "nutrition")).toBe(true);
  });
});
