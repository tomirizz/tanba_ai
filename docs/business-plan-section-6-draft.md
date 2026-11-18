# 6. Product development and validation

## Core journey

An importer or shop owner in Kazakhstan starts with a photo of a foreign-language food label and needs a sticker in Kazakh and Russian. They choose English or Kazakh for the interface, upload one label photo and review the original text alongside both translations. If the importer’s address is missing, for example, they can add it themselves. The checklist updates immediately. The user then prints the bilingual sticker, saves it as a PDF, downloads a text file or copies the text. A warning remains visible at download if required details are missing. [Core journey](core-journey.md)

## Prioritisation

| MoSCoW category | Scope | Reason for the decision |
| --- | --- | --- |
| Must | Read the photo, translate and edit each field, check required details, export the label, support English and Kazakh in the interface, and explain errors | These features complete the journey and meet the course requirements for language choice and error handling. |
| Should | Two food samples, two prepared Korean cosmetics demos and a per-visitor request limit | Samples let a user try the journey without a product in hand. The limit constrains AI usage. |
| Could | Sticker templates and multiple photos of one product | Templates need information about printers. Combining several sides of a package adds work beyond the single-photo journey. |
| Won’t in this version | Accounts, saved labels, payments, batch uploads and live analysis of non-food products | These introduce data storage, payment processing, additional AI calls or different labelling rules. |

Customer interview evidence for these priorities is **[TO FILL]**. [Prioritisation table](moscow.md)

## Technology, architecture and dependencies

Next.js 16 keeps the React interface and the server route in one TypeScript project. The browser checks the file type and size, then sends the image to `POST /api/analyze`. The server checks the actual file signature and passes the image, instructions and a JSON schema to Google Gemini through the official SDK. Gemini reads and translates the label in the same operation. After a 503 the server can retry once within the original time limit. The sample buttons open prepared results in the browser. The server cleans the response before the user sees it. Each of the eleven text fields has a place for the original, Kazakh and Russian text. The EAC mark is recorded separately. [Technical overview](technical-overview.md)

Review and export run in the browser. Editing a translation updates the checklist without another model call. The application has no database. The server holds an image in memory for the request, and the browser remembers only the interface language after the page closes. The hosting platform serves the app, while Gemini availability and quota govern new photo analyses. Google’s handling of images depends on the terms for the key in use. [Technical overview](technical-overview.md) · [Privacy and accessibility](privacy-security-accessibility.md)

## Testing and iteration

The project records 18 passing rule checks and 22 passing browser checks. The rule tests cover invalid files and missing fields. The browser checks exercise editing, downloading, switching languages and recovering from errors, including on a 390 px display. A local stand-in for Gemini supplied valid and broken answers. In production, the home page loaded and the server rejected a text upload with HTTP 415. Gemini returned source text and both translations for eight of eleven fields on an English label and six on a Turkish label. An independent ingredients excerpt returned just the composition field after a timeout on its first upload. A blank image and a severely blurred label both triggered the expected unreadable-label error. These counts describe extraction coverage. Translation quality awaits human review. [Testing](testing.md) · [Live-run log](real-run-results.md)

The user-testing plan calls for at least five participants who import, sell or label packaged food. Each participant will prepare a bilingual label, identify missing details, add an importer, export the result and recover from an unsupported upload. The team will record completion, help needed and the severity of each problem. Each change should be traceable to an observation from a session. [User-testing plan](testing.md)

| Evidence still needed | Entry |
| --- | --- |
| User-testing observations and outcomes | [TO FILL] |
| At least three changes following user testing, with the observation behind each change | [TO FILL] |

## Limitations

The checklist covers the presence of general label details. A person must verify the source text, translation, numbers and suitability of the finished label. A curved or blurred package can leave fields unreadable, and the MVP processes one side at a time. Closing the page discards edits. The in-memory request limit resets on restart and is local to each server instance. Screen-reader use and printing on a real sticker printer still need testing. [Technical overview](technical-overview.md) · [Testing](testing.md)
