import { afterEach, expect, it, vi } from "vitest";
import { readLabelWithGemini } from "../lib/gemini";

afterEach(() => vi.unstubAllGlobals());

it("retries a busy model using the Interactions version that accepts inline image and text parts", async () => {
  const answer = {
    isLabel: true, sourceLanguage: "English", eacMark: false,
    fields: [{ id: "name", original: "Oats", kk: "Сұлы", ru: "Овёс" }],
  };
  const paths: string[] = [];
  vi.stubGlobal("fetch", async (input: RequestInfo | URL, init?: RequestInit) => {
    const request = new Request(input, init);
    const path = new URL(request.url).pathname;
    paths.push(path);
    if (path.endsWith(":generateContent")) {
      return Response.json({ error: { code: 503, status: "UNAVAILABLE", message: "Busy" } }, { status: 503 });
    }
    expect(path).toBe("/v1beta/interactions");
    const body = await request.json();
    expect(body.store).toBe(false);
    expect(body.input).toEqual([
      { type: "image", mime_type: "image/jpeg", data: "/9j/" },
      { type: "text", text: expect.any(String) },
    ]);
    return Response.json({
      id: "test-interaction", model: body.model, status: "completed",
      steps: [{ type: "model_output", content: [{ type: "text", text: JSON.stringify(answer) }] }],
    });
  });
  const result = await readLabelWithGemini("test-only", Uint8Array.of(255, 216, 255), "image/jpeg");
  expect(paths).toHaveLength(2);
  expect(result.fields.name).toEqual({ original: "Oats", kk: "Сұлы", ru: "Овёс" });
});
