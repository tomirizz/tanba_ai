# AI use in building the MVP

This file records how AI was used for the product part of the project. Copy the relevant
rows into the team's AI-use declaration (Template L) and correct them to match what really happened.

| AI tool | Task and purpose | Output retained or changed | Human verification still required | Data / privacy safeguard | Where used |
| --- | --- | --- | --- | --- | --- |
| Claude (Anthropic), model Claude Fable 5.2, 18 Nov 2026 | Wrote the first version of the MVP from the team's decisions: core journey "photo → translation → check", Gemini API, Next.js, EN/KZ interface | All application code, styles, automatic tests | Read every file with `docs/guide-ru.md`; run the app; be able to explain each part; record every later change | No personal or customer data was given to the tool | `app/`, `components/`, `lib/`, `tests/` |
| Same | Drafted Kazakh interface text and the sample labels' Kazakh and Russian translations | `lib/i18n.ts`, `lib/demo.ts` | Review by a fluent Kazakh speaker for meaning, terms, tone and fit | The sample companies are invented | Interface, samples |
| Same | Drafted project documents | `README.md`, `docs/*.md` | Check every statement against the running product; fill the CustDev evidence in `docs/moscow.md` from real interviews | — | `docs/` |
| Same | Looked up the required label details in TR CU 022/2011, art. 4, part 4.1 (via an official Kazakhstan government page) | The list in `lib/fields.ts` | Read the regulation itself and cite it, not the AI | — | Required-details check |
| Google Gemini API (inside the product) | Reads the label photo and translates it for the user | Shown to the user for editing; never stored | The product tells the user to review every line | The user is told the photo goes to Google; nothing is stored by the app | Product feature |
| OpenAI Codex (GPT-6), 18 Nov 2026 | Installed dependencies, ran the unit tests, lint and production build, published the 45 project files on GitHub, checked the published tree against the local copy, configured the approved Gemini model and attempted to start the local server | Startup failure and pending photo tests recorded in the live-run log. Drafted section 6 from the project documents. | Check extracted details and both translations against real labels, run user sessions and verify the production site. | The API key was entered by the project owner and excluded from Git. | [Live-run log](real-run-results.md), [section 6 draft](business-plan-section-6-draft.md) |

Decisions made by the team, not by AI: the core journey (photo → translation + check),
the AI provider (Gemini), the framework (Next.js).
