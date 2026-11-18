# Core journey (step A1)

The core journey is the one path a user must be able to finish without help.
Everything in the MVP serves this path.

**User:** an importer or shop owner who sells imported packaged food in Kazakhstan.

**Goal:** get a label in Kazakh and Russian for a product whose label is in another language.

| # | The user | The app | Result |
| --- | --- | --- | --- |
| 1 | Opens the site and picks the interface language (English or Kazakh) | Shows the upload screen in that language and remembers the choice | The user understands what to do |
| 2 | Uploads a photo of the label, or picks a sample | Checks the file type and size, shows a progress screen | The photo is accepted |
| 3 | Waits | Sends the photo to the AI, which reads the text and translates each part into Kazakh and Russian | A table of label details in three columns: original, Kazakh, Russian |
| 4 | Reads and corrects the translations | Recounts the required details after every edit | The user sees "Filled in: N of 10" and what is missing |
| 5 | Adds missing details (for example, the importer) and confirms the EAC mark | Updates the check | The missing list gets shorter |
| 6 | Goes to download | Builds the finished label as a sticker with two language blocks | A print-ready label |
| 7 | Prints, saves as PDF, downloads a text file or copies the text | — | The user leaves with a usable label |

## Non-ideal cases the app handles

| Case | What the user sees |
| --- | --- |
| The file is not a JPG, PNG or WEBP photo | "This file type is not supported…" The file is not sent |
| The photo is larger than 8 MB | "This photo is larger than 8 MB…" |
| The photo has no readable label text | "No label text was found in this photo…" |
| The AI service fails or does not answer | "The AI service did not respond. Your photo was not saved…" |
| The AI quota or the visitor's request limit is used up | "Too many requests…" |
| No internet connection | "No connection to the server…" |
| No AI key is set (demo mode) | Samples work; an uploaded photo gets "AI is not connected yet…" |
| Required details are still missing at download | A warning, but the user can continue |

Every message exists in English and Kazakh, says what happened and what to do next,
and returns the user to a working screen.

For the live demonstration, the easiest case to show is the first one: choose a PDF file.
