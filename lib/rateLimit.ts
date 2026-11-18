// A simple limit on how often one visitor can call the AI.
// It protects the API key's quota from accidental or deliberate overuse.
// The counters live in memory, so they reset when the server restarts and
// are not shared between server instances. That is enough for an MVP.

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 12;

const history = new Map<string, number[]>();

export function allowRequest(visitor: string, now: number = Date.now()): boolean {
  const recent = (history.get(visitor) ?? []).filter((time) => now - time < WINDOW_MS);

  if (recent.length >= MAX_REQUESTS) {
    history.set(visitor, recent);
    return false;
  }

  recent.push(now);
  history.set(visitor, recent);

  // Keep the map from growing without limit.
  if (history.size > 5000) history.clear();

  return true;
}
