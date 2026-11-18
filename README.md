# Tańba AI

[Open the live application](https://tanba-ai.vercel.app/) · [Production test results](docs/real-run-results.md)

Tańba AI turns a photo of a foreign food label into a label in Kazakh and Russian, and shows which required details are missing.

It is the MVP for the Tańba AI startup project (Technological Entrepreneurship, AITU, group BDA-2403).

## What the user does

1. **Upload** a photo of the label, or pick a built-in sample.
2. **Check and edit**: the AI reads the label and translates each part. The user corrects the text and sees which required details are missing.
3. **Download**: print the finished label as a sticker, save it as PDF, download it as a text file, or copy it.

The interface works in English and Kazakh. The finished label is in Kazakh and Russian.

## Run it on your computer

You need [Node.js](https://nodejs.org) version 22.12 or newer.

```bash
npm install
cp .env.example .env.local   # on Windows: copy .env.example .env.local
npm run dev
```

Open http://localhost:3000.

Without an API key the app runs in **demo mode**: the two sample labels work from start to finish, and an uploaded photo gets a clear "AI is not connected" message.

## Connect the AI

1. Create a Gemini API key in Google AI Studio.
2. Put it in `.env.local`:

   ```
   GEMINI_API_KEY=your-key
   GEMINI_MODEL=name-of-the-current-fast-model
   ```

3. Restart `npm run dev`.

Model names change. Copy the name of a current fast model with image input from Google AI Studio. If the name is wrong, the app shows "The AI service did not respond" and the terminal shows the reason.

Never put the key in the code or upload `.env.local` to GitHub. The file is listed in `.gitignore`.

## Put it online

The app runs on any host that supports Next.js. With Vercel:

1. Upload this project to GitHub.
2. In Vercel, create a project from the GitHub repository.
3. Add the environment variables `GEMINI_API_KEY` and `GEMINI_MODEL` in the project settings.
4. Deploy, then open the link on a second device and run the whole journey in both languages.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the app for development |
| `npm run build` | Builds the production version |
| `npm run start` | Runs the production version |
| `npm test` | Runs 18 automatic checks of the app's rules |
| `npm run lint` | Checks the code style |

A browser test of the whole journey is in `tests/e2e/journey.py`; the file explains how to run it.

## Project map

```
app/
  page.tsx              the page (loads the app)
  layout.tsx            page frame, fonts, title
  globals.css           all styles
  api/analyze/route.ts  server: receives the photo, calls the AI, answers
components/
  TanbaApp.tsx          the journey and its state (upload -> check -> download)
  UploadStep.tsx        step 1
  ReviewStep.tsx        step 2: edit translations
  CheckList.tsx         step 2: required details
  DownloadStep.tsx      step 3: sticker, print, text file
  Header.tsx, Stepper.tsx, ErrorBanner.tsx, I18n.tsx
lib/
  fields.ts             the list of label details
  compliance.ts         the required-details check
  gemini.ts             the only file that talks to Gemini
  normalize.ts          cleans the AI's answer
  validation.ts         file type and size checks
  rateLimit.ts          limit on requests per visitor
  i18n.ts               all interface text, English and Kazakh
  demo.ts               sample labels and demo results
docs/                   project documents (see below)
tests/                  automatic checks
```

## Documents

| File | What it is |
| --- | --- |
| `docs/core-journey.md` | The core user journey, step by step |
| `docs/moscow.md` | Feature prioritisation (MoSCoW) |
| `docs/technical-overview.md` | Platform, architecture, data, dependencies, limits |
| `docs/privacy-security-accessibility.md` | What was checked and what is not covered |
| `docs/testing.md` | Automatic tests and the plan for user testing |
| `docs/ai-use.md` | How AI was used to build this MVP |
| `docs/guide-ru.md` | Объяснение проекта на русском: как всё устроено и что говорить на защите |

## Limits

- The translation is made by AI and can be wrong. A person must check the final label.
- The required-details check covers the list in TR CU 022/2011, article 4, part 4.1. It does not check font size, product-specific rules or the accuracy of the content. It is not legal advice.
- The Kazakh interface text and the sample translations need a review by a fluent speaker.
