// The only file that talks to the Google Gemini API.
// It runs on the server, so the API key never reaches the browser.

import { GoogleGenAI } from "@google/genai";
import { FIELD_IDS } from "./fields";
import { normalizeAnswer, type NormalizedAnswer } from "./normalize";

// The model name changes over time. Set GEMINI_MODEL in .env.local to the
// current fast multimodal model shown in Google AI Studio.
const DEFAULT_MODEL = "gemini-3.8-flash";

const TIMEOUT_MS = 45_000;

const INSTRUCTIONS = `You read photos of packaged food labels and prepare them for sale in Kazakhstan.

Rules:
1. Copy only text that is really printed on the label. Never invent or guess missing details.
2. If a detail is not on the label, return empty strings for it.
3. For each detail return: "original" (text exactly as printed), "kk" (Kazakh translation, Cyrillic script), "ru" (Russian translation).
   In "kk" and "ru" give only the value, without the detail's title, because the app prints the title itself.
   Example for shelfLife: original "Best before: 12.06.2027", kk "12.06.2027 дейін", ru "до 12.06.2027".
   Exception: quantity keeps its words, for example "Масса нетто 200 г".
4. Keep numbers, dates, units, percentages, E-numbers, company names and addresses exactly as printed. Translate country and city names.
5. Use standard food-labelling terms in Kazakh and Russian. Keep allergen statements.
6. Set "isLabel" to false if the photo is not a food label or the text cannot be read.
7. Set "eacMark" to true only if the EAC conformity mark is visible.
8. "sourceLanguage" is the main language of the label, as an English word, for example "English" or "Turkish".

Details:
- name: product name
- composition: ingredients list, including allergens
- quantity: net weight or volume
- manufactureDate: date of manufacture
- shelfLife: shelf life or best-before date
- storage: storage conditions
- manufacturer: manufacturer name and address
- importer: importer name and address
- nutrition: nutrition facts (energy, fat, carbohydrate, protein)
- usage: preparation or usage instructions and restrictions
- gmo: information about genetically modified ingredients`;

// JSON Schema that forces the AI to answer in a fixed structure.
const ANSWER_SCHEMA = {
  type: "object",
  properties: {
    isLabel: { type: "boolean" },
    sourceLanguage: { type: "string" },
    eacMark: { type: "boolean" },
    fields: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string", enum: [...FIELD_IDS] },
          original: { type: "string" },
          kk: { type: "string" },
          ru: { type: "string" },
        },
        required: ["id", "original", "kk", "ru"],
      },
    },
  },
  required: ["isLabel", "sourceLanguage", "eacMark", "fields"],
};

export async function readLabelWithGemini(
  apiKey: string,
  imageBytes: Uint8Array,
  mimeType: string,
): Promise<NormalizedAnswer> {
  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || DEFAULT_MODEL,
    contents: [
      {
        inlineData: {
          mimeType,
          data: Buffer.from(imageBytes).toString("base64"),
        },
      },
      { text: "Read this label and return every detail." },
    ],
    config: {
      systemInstruction: INSTRUCTIONS,
      responseMimeType: "application/json",
      responseJsonSchema: ANSWER_SCHEMA,
      temperature: 0.1,
      abortSignal: AbortSignal.timeout(TIMEOUT_MS),
    },
  });

  const text = response.text ?? "";
  return normalizeAnswer(JSON.parse(text));
}
