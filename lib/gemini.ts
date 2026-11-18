// The only file that talks to the Google Gemini API.
// It runs on the server, so the API key never reaches the browser.

import { ApiError, GoogleGenAI } from "@google/genai";
import { setTimeout as delay } from "node:timers/promises";
import { FIELD_IDS, PRODUCT_CATEGORIES } from "./fields";
import { normalizeAnswer, type NormalizedAnswer } from "./normalize";

// The model name changes over time. Set GEMINI_MODEL in .env.local to the
// current fast multimodal model shown in Google AI Studio.
const DEFAULT_MODEL = "gemini-3.8-flash";

const FALLBACK_MODEL = "gemini-3.5-flash-lite";
const TIMEOUT_MS = 45_000;

const INSTRUCTIONS = `You transcribe and translate product labels into Kazakh and Russian for people in Kazakhstan. Korean skincare and makeup are a main use case. Accept readable labels for any product, including cosmetics, household goods, electronics, textiles and food.

Rules:
1. Copy only text that is really printed on the label. Never invent or guess missing details.
2. If a detail is not on the label, return empty strings for it.
3. For each detail return: "original" (text exactly as printed), "kk" (Kazakh translation, Cyrillic script), "ru" (Russian translation).
   In "kk" and "ru" give only the value, without the detail's title, because the app prints the title itself.
   Example for shelfLife: original "Best before: 12.06.2027", kk "12.06.2027 дейін", ru "до 12.06.2027".
   Exception: quantity keeps its words, for example "Масса нетто 200 г".
4. Keep numbers, dates, units, percentages, E-numbers, company names and addresses exactly as printed. Translate country and city names.
5. Use terminology appropriate to the product. Preserve printed INCI names, model numbers, units and safety warnings. Translate Korean directions, precautions and period-after-opening statements faithfully. Never add health advice or product claims.
6. Set "isLabel" to true for a readable product or packaging label, including a fragment such as ingredients, directions, specifications or a care label. Set it to false for unreadable images or images with no product label. Classify the product as "cosmetics", "food", or "other". If the product type is unclear, use "other".
7. Set "eacMark" to true only if the EAC conformity mark is visible.
8. "sourceLanguage" is the main language of the label, as an English word, for example "Korean", "English" or "Turkish". Return only fields supported by visible text.

Details:
- name: product name
- composition: ingredients (including INCI for cosmetics and printed allergens for food)
- quantity: net weight or volume
- manufactureDate: date of manufacture
- shelfLife: expiry, shelf life or period after opening
- storage: storage conditions
- manufacturer: manufacturer name and address
- importer: importer name and address
- nutrition: nutrition facts (energy, fat, carbohydrate, protein)
- usage: preparation or usage instructions and restrictions
- gmo: information about genetically modified ingredients in food
- warnings: printed precautions or hazards
- batch: batch or lot number
- origin: country of origin
- materials: materials and fibre composition for non-food goods
- model: model name, model number or item reference, preserving letters, digits and punctuation
- specifications: dimensions, ratings, technical and other measurements, preserving all numbers and units
- care: printed washing and care instructions
- otherDetails: any remaining printed product details. Combine multiple distinct statements for one field into a single string with line breaks`;

// JSON Schema that forces the AI to answer in a fixed structure.
const ANSWER_SCHEMA = {
  type: "object",
  properties: {
    isLabel: { type: "boolean" },
    category: { type: "string", enum: [...PRODUCT_CATEGORIES] },
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
  required: ["isLabel", "category", "sourceLanguage", "eacMark", "fields"],
};

export async function readLabelWithGemini(
  apiKey: string,
  imageBytes: Uint8Array,
  mimeType: string,
): Promise<NormalizedAnswer> {
  const ai = new GoogleGenAI({ apiKey });
  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;
  const signal = AbortSignal.timeout(TIMEOUT_MS);
  const data = Buffer.from(imageBytes).toString("base64");
  const prompt = "Read this label and return every detail.";

  let text: string | undefined;
  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ inlineData: { mimeType, data } }, { text: prompt }],
      config: {
        systemInstruction: INSTRUCTIONS,
        responseMimeType: "application/json",
        responseJsonSchema: ANSWER_SCHEMA,
        temperature: 0.1,
        abortSignal: signal,
      },
    });
    text = response.text;
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 503) throw error;
    await delay(1000, undefined, { signal });
    const interaction = await ai.interactions.create({
      // Inline image and text parts require the beta Interactions request format.
      api_version: "v1beta",
      model: model === FALLBACK_MODEL ? "gemini-3.1-flash-lite" : FALLBACK_MODEL,
      store: false,
      input: [{ type: "image", mime_type: mimeType, data }, { type: "text", text: prompt }],
      system_instruction: INSTRUCTIONS,
      response_format: { type: "text", mime_type: "application/json", schema: ANSWER_SCHEMA },
    }, { signal, maxRetries: 0 });
    text = interaction.output_text;
    console.info("[analyze] Gemini Interactions retry returned a response.");
  }
  return normalizeAnswer(JSON.parse(text ?? ""));
}
