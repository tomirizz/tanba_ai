// POST /api/analyze
// Takes a label photo, asks the AI to read and translate it, and returns the
// result as JSON. On any problem it returns a short error code; the browser
// turns that code into a message in the user's language.
//
// The photo is kept in memory only for the length of the request.
// Nothing is written to disk or to a database.

import { demoResult, isSampleId } from "@/lib/demo";
import type { ErrorCode } from "@/lib/errors";
import type { AnalyzeResult } from "@/lib/fields";
import { readLabelWithGemini } from "@/lib/gemini";
import { allowRequest } from "@/lib/rateLimit";
import { MAX_FILE_BYTES, checkFile, sniffImageType } from "@/lib/validation";

// The longest time, in seconds, the hosting platform should let one request run.
// Reading a photo usually takes 5-20 seconds; the AI call itself gives up after 45.
export const maxDuration = 60;

function fail(code: ErrorCode, status: number) {
  return Response.json({ error: code }, { status });
}

export async function POST(request: Request) {
  const visitor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!allowRequest(visitor)) return fail("rateLimited", 429);

  // Reject oversized uploads early, before reading the body.
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_FILE_BYTES + 100_000) return fail("fileSize", 413);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail("noFile", 400);
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const sampleId = form.get("sampleId");
  const file = form.get("file");

  // Demo mode: no AI key, but the built-in samples still work.
  if (!apiKey && isSampleId(sampleId)) {
    return Response.json(demoResult(sampleId));
  }

  if (!(file instanceof File) || file.size === 0) return fail("noFile", 400);

  const problem = checkFile(file.type, file.size);
  if (problem === "fileType") return fail("fileType", 415);
  if (problem === "fileSize") return fail("fileSize", 413);

  const bytes = new Uint8Array(await file.arrayBuffer());
  const realType = sniffImageType(bytes);
  if (!realType) return fail("fileType", 415);

  if (!apiKey) return fail("aiNotConfigured", 503);

  try {
    const answer = await readLabelWithGemini(apiKey, bytes, realType);
    if (!answer.isLabel) return fail("noLabel", 422);

    const result: AnalyzeResult = {
      sourceLanguage: answer.sourceLanguage,
      category: answer.category,
      fields: answer.fields,
      eacMark: answer.eacMark,
      mode: "ai",
    };
    return Response.json(result);
  } catch (error) {
    // Log the reason for the developer, never the photo or its text.
    const reason = error instanceof Error ? `${error.name}: ${error.message}` : "unknown";
    console.error("[analyze] AI request failed:", reason.slice(0, 300));

    // Status 429 from the AI service means its request quota is used up for now.
    const status = (error as { status?: unknown } | null)?.status;
    if (status === 429) return fail("rateLimited", 429);

    return fail("aiFailed", 502);
  }
}
