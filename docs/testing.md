# Testing

## What has been tested automatically (18 Nov 2026)

| Test | How to run | Result |
| --- | --- | --- |
| 18 checks of the rules: required-details count, file checks, cleaning of the AI answer, label text, request limit | `npm test` | 18 of 18 passed |
| 22 browser checks of the whole journey in English and Kazakh, on desktop and a 390 px phone screen, including three error cases, editing, download and language memory | `tests/e2e/journey.py` | 22 of 22 passed |
| Server answers for bad uploads: no file, fake image, wrong type, over 8 MB | `curl` requests | Correct error code each time |
| AI path against a local stand-in for the Gemini service: good answer, "not a label", broken answer, service error, quota error | Local mock server | Correct result or error message each time |
| Type check and code style | `npx tsc --noEmit`, `npm run lint` | No problems |

## What has NOT been tested yet

- **The real Gemini service.** No API key was available during development. The first run
  with a real key is the most important test still to do (see below).
- **Real label photos.** Only the two generated sample images were used.
- **Real users.** See the plan below.
- **Screen readers, old browsers, slow connections.**
- **Printing on a real sticker printer.**

## First run with a real key

1. Put the key and a current model name in `.env.local`, restart the app.
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
