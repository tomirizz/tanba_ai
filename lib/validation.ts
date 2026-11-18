// File checks shared by the browser (fast feedback) and the server (real protection).

export const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8 MB

export const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

export type AllowedType = (typeof ALLOWED_TYPES)[number];

export type FileProblem = "fileType" | "fileSize" | null;

export function checkFile(type: string, size: number): FileProblem {
  if (!(ALLOWED_TYPES as readonly string[]).includes(type)) return "fileType";
  if (size > MAX_FILE_BYTES) return "fileSize";
  return null;
}

// The file type a browser reports can be wrong or faked, so the server also
// looks at the first bytes of the file. Every image format starts with a
// fixed signature ("magic bytes").
export function sniffImageType(bytes: Uint8Array): AllowedType | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return "image/png";
  }
  if (bytes.length >= 12) {
    const riff = String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]);
    const webp = String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11]);
    if (riff === "RIFF" && webp === "WEBP") return "image/webp";
  }
  return null;
}
