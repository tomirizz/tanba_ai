// Short codes the server sends when something goes wrong.
// The browser shows a message for each code in the chosen language.

export const ERROR_CODES = [
  "noFile",
  "fileType",
  "fileSize",
  "noLabel",
  "aiNotConfigured",
  "aiFailed",
  "rateLimited",
  "network", // set by the browser when the server cannot be reached
] as const;

export type ErrorCode = (typeof ERROR_CODES)[number];

export function isErrorCode(value: unknown): value is ErrorCode {
  return typeof value === "string" && (ERROR_CODES as readonly string[]).includes(value);
}
