# Testing

## What has been tested automatically (18 Nov 2026)

| Test | How to run | Result |
| --- | --- | --- |
| 18 checks of the rules: required-details count, file checks, cleaning of the AI answer, label text, request limit | `npm test` | 18 of 18 passed |
| 22 browser checks of the whole journey in English and Kazakh, on desktop and a 390 px phone screen, including three error cases, editing, download and language memory | `tests/e2e/journey.py` | 22 of 22 passed |
| Server answers for bad uploads: no file, fake image, wrong type, over 8 MB | `curl` requests | Correct error code each time |
| AI path against a local stand-in for the Gemini service: good answer, "not a label", broken answer, service error, quota error | Local mock server | Correct result or error message each time |
| Type check and code style | `npx tsc --noEmit`, `npm run lint` | No problems |

## Production checks on 18 Nov 2026

| Request | Observed response |
| --- | --- |
| `GET /` | HTTP 200. The upload screen opened. |
| `POST /api/analyze` with a plain-text file | HTTP 415 and `fileType`. |
| Two project labels uploaded as files | HTTP 200 and AI mode. Gemini returned original text and both translations for 8 of 11 English-label fields and 6 of 11 Turkish-label fields. |
| An independent image containing an ingredients list | The first request timed out. The next upload returned HTTP 200, the English ingredients and both translations. The other ten fields were empty. |
| An image without text and a severely blurred label | Both returned HTTP 422 and `noLabel`. |
| Sample buttons and editing | Both buttons opened a prepared label. An edited Russian product name appeared in the export preview. |

The same English file uploaded with the normal site button opened the review screen. Four earlier requests returned HTTP 502 after Google reported high demand. The report includes timings, field-level results and the failed requests. [Live-run results](real-run-results.md)

## What has NOT been tested yet

- **Extraction on real photographs.** The team’s test-photo folder was unavailable. The live checks used project examples, an external label excerpt and two controlled inputs. Human translation review is pending.
- **Real users.** See the plan below.
- **Screen readers, old browsers, slow connections.**
- **Printing on a real sticker printer.**

## Follow-up checks with real photos

1. Open the [production application](https://tanba-ai.vercel.app/).
2. Upload a sharp photo of a real label. Expect the check screen within about 30 seconds.
3. Compare every detail with the label. Note every wrong or missing value.
4. Upload a photo without a label (for example, a landscape). Expect "No label text was found".
5. Upload a blurry label photo. Note what happens.
6. Repeat with 5–10 labels in different languages. Record the share of details read correctly:
   this number belongs in the business plan.

## User testing plan (Template E)

At least five people from the target group (importers, shop owners, people who prepare labels).
Use participant codes, not names. Do not help during the task.

| Task | What to watch |
| --- | --- |
| "Here is a product. Get a label for it in Kazakh and Russian." | Do they find the upload button? Do they understand the three steps? |
| "Is anything missing on this label?" | Do they notice and understand the required-details list? |
| "The importer is ‹name, address›. Add it." | Do they find the right field? Does the count change make sense to them? |
| "Get the label onto paper or into a file." | Which option do they choose? Does the result meet their need? |
| "Switch the site to Kazakh / English." | Do they find the switch? Is the Kazakh text natural? |
| Give them a PDF instead of a photo | Do they understand the error message and recover? |

After each session write down: task, what happened, result (done / done with help / failed),
problem and severity, and the change made. At least three changes must come from these notes.
