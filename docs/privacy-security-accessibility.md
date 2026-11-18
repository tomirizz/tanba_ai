# Privacy, security and accessibility (step A6)

A basic check of the MVP. "Done" items can be verified in the code or in the running app.

## Privacy

| Item | Status | Where |
| --- | --- | --- |
| The app has no accounts and asks for no personal data | Done | — |
| Photos are processed in memory and never saved to disk or a database | Done | `app/api/analyze/route.ts` |
| The user is told that the photo is sent to an outside AI service | Done | Upload screen, both languages |
| Error logs contain the reason of a failure, never the photo or its text | Done | `route.ts` |
| The only thing stored in the browser is the chosen language | Done | `lib/langStore.ts` |
| No analytics or tracking scripts; fonts are bundled with the app | Done | `app/layout.tsx` |

**Limit:** photos are sent to Google's Gemini API. How Google stores and uses them depends on
Google's terms for the key that is used. The team must read those terms and describe them
in the business plan. Do not upload photos that contain personal or confidential data.

## Security

| Item | Status | Where |
| --- | --- | --- |
| The AI key stays on the server and is never sent to the browser | Done | `lib/gemini.ts`, `.env.local` |
| `.env.local` is excluded from GitHub | Done | `.gitignore` |
| Uploads are limited to 8 MB and to JPG, PNG, WEBP | Done | `lib/validation.ts` |
| The server checks the file's real type by its first bytes, not only its name | Done | `sniffImageType` |
| The AI's answer is cleaned and never trusted as is | Done | `lib/normalize.ts` |
| Text is shown through React, which escapes HTML, so a label cannot inject code into the page | Done | all components |
| Request limit: 12 requests per visitor per 10 minutes | Done | `lib/rateLimit.ts` |
| Security headers (no framing, no type sniffing, limited referrer) | Done | `next.config.ts` |
| Production dependencies have no known vulnerabilities (`npm audit --omit=dev`, 18 Nov 2026) | Done | — |

**Limits:**
- The request limit lives in memory. It resets on restart and is not shared between server
  instances, so it slows abuse but does not stop a determined attacker. Set a spending or
  quota limit on the AI key as well.
- `npm audit` reports one issue in a development tool (`picomatch`, used by the linter and the
  test runner). It is not part of the deployed app.
- A photo can contain text written to trick the AI ("ignore your instructions…"). The app
  limits the damage: the answer must fit a fixed structure, is cleaned, and is only shown to
  the same user for review.

## Accessibility

| Item | Status |
| --- | --- |
| Everything works with the keyboard; focus is always visible | Done |
| After each step, focus moves to the new heading | Done |
| Errors and the "filled in" count are announced to screen readers | Done |
| The page language (`lang`) switches with the interface; label text is marked as Kazakh or Russian | Done |
| Status is never shown by colour alone: each has a symbol and a word | Done |
| Text contrast meets WCAG AA for body text | Done |
| Works on a 390 px wide phone without sideways scrolling | Done (tested) |
| Animation is switched off for users who ask for reduced motion | Done |
| Buttons are at least 44 px tall | Done |

**Limits:** not tested with a real screen reader or with real users who have disabilities.
Include at least one keyboard-only run in user testing.

## Safe failure

When something goes wrong, the app returns to the upload screen with a message that says what
happened and what to do. No failure loses the user's edits on the check screen, because the AI is
called only once, before editing starts.
