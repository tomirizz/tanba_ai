// All interface text in English and Kazakh.
// To change wording, edit the string here; nothing else needs to change.
// Every key must exist in both languages: TypeScript reports a missing one.

export type UiLang = "en" | "kk";

export const UI_LANGS: { id: UiLang; short: string; name: string }[] = [
  { id: "en", short: "EN", name: "English" },
  { id: "kk", short: "ҚАЗ", name: "Қазақша" },
];

const en = {
  tagline: "Label localisation for imported food",
  langSwitch: "Interface language",

  stepUpload: "Upload",
  stepReview: "Check and edit",
  stepDownload: "Download",
  stepsLabel: "Progress",

  heroTitle: "Turn a foreign food label into Kazakh and Russian",
  heroText:
    "Upload a photo of the label. Tańba AI reads it, translates each part and shows which required details are missing.",
  dropTitle: "Choose a label photo",
  dropHint: "JPG, PNG or WEBP, up to 8 MB. You can also drag a file here.",
  privacy:
    "Your photo is sent to the Google Gemini AI service to be read. Tańba AI does not store it.",
  samplesTitle: "No photo at hand? Try a sample label",
  sampleOat: "Oat cookies, label in English",
  sampleChocolate: "Hazelnut chocolate, label in Turkish",

  analyzing: "Reading and translating the label…",
  analyzingHint: "This usually takes up to half a minute.",

  reviewTitle: "Check the translation",
  reviewText: "AI can make mistakes. Read every line and correct it before you print.",
  demoNote:
    "Demo mode: AI is not connected, so this is a prepared example. Editing and download work as usual.",
  photoAlt: "The label photo you uploaded",
  sourceLanguage: "Label language",
  colOriginal: "On the label",
  colKk: "Kazakh",
  colRu: "Russian",
  notFound: "Not found on the label",
  fieldFor: "{field}, {lang}",

  checkTitle: "Required details",
  checkSummary: "Filled in: {found} of {total}",
  statusOk: "Filled in",
  statusMissing: "Missing",
  statusOptional: "Only if it applies",
  eacName: "EAC mark",
  eacLabel: "The package has the EAC mark",
  checkNote:
    "The list follows TR CU 022/2011, article 4, part 4.1. It is a quick self-check, not legal advice.",
  missingWarning:
    "Required details still missing: {n}. You can continue, but the label may not pass inspection.",
  btnBack: "Choose another photo",
  btnContinue: "Continue to download",

  downloadTitle: "Your label is ready",
  downloadText: "Print it as a sticker or save the text.",
  stickerLabel: "Finished label in Kazakh and Russian",
  btnPrint: "Print or save as PDF",
  btnTxt: "Download text file",
  btnCopy: "Copy text",
  copied: "Copied",
  btnEdit: "Back to editing",
  btnRestart: "Start a new label",

  errorTitle: "Something needs your attention",
  btnDismiss: "Close",
  errNoFile: "No photo was received. Choose a photo and try again.",
  errFileType: "This file type is not supported. Choose a JPG, PNG or WEBP photo.",
  errFileSize: "This photo is larger than 8 MB. Choose a smaller photo or compress it.",
  errNoLabel:
    "No label text was found in this photo. Take a sharper, well-lit photo where the text is readable.",
  errAiNotConfigured:
    "AI is not connected yet, so your own photos cannot be read. Try a sample label.",
  errAiFailed:
    "The AI service did not respond. Your photo was not saved. Try again in a minute.",
  errRateLimited: "Too many requests. Wait a few minutes and try again.",
  errNetwork: "No connection to the server. Check your internet and try again.",

  footer: "Tańba AI is a student MVP. Always have a person check the final label.",
};

export type TextKey = keyof typeof en;

const kk: Record<TextKey, string> = {
  tagline: "Импорттық азық-түлік заттаңбаларын бейімдеу",
  langSwitch: "Интерфейс тілі",

  stepUpload: "Жүктеу",
  stepReview: "Тексеру және түзету",
  stepDownload: "Жүктеп алу",
  stepsLabel: "Барысы",

  heroTitle: "Шетелдік азық-түлік заттаңбасын қазақ және орыс тілдеріне аударыңыз",
  heroText:
    "Заттаңбаның фотосын жүктеңіз. Tańba AI мәтінді оқып, әр бөлігін аударады және қандай міндетті мәліметтер жетіспейтінін көрсетеді.",
  dropTitle: "Заттаңба фотосын таңдаңыз",
  dropHint: "JPG, PNG немесе WEBP, 8 МБ-қа дейін. Файлды осы жерге сүйреп әкелуге де болады.",
  privacy:
    "Фотоңыз мәтінді оқу үшін Google Gemini AI қызметіне жіберіледі. Tańba AI оны сақтамайды.",
  samplesTitle: "Қолыңызда фото жоқ па? Үлгі заттаңбаны байқап көріңіз",
  sampleOat: "Сұлы печеньесі, ағылшын тіліндегі заттаңба",
  sampleChocolate: "Жаңғақты шоколад, түрік тіліндегі заттаңба",

  analyzing: "Заттаңба оқылып, аударылып жатыр…",
  analyzingHint: "Әдетте бұл жарты минутқа дейін созылады.",

  reviewTitle: "Аударманы тексеріңіз",
  reviewText: "AI қателесуі мүмкін. Басып шығармас бұрын әр жолды оқып, түзетіңіз.",
  demoNote:
    "Демо режимі: AI қосылмаған, сондықтан бұл алдын ала дайындалған мысал. Түзету мен жүктеп алу әдеттегідей жұмыс істейді.",
  photoAlt: "Сіз жүктеген заттаңба фотосы",
  sourceLanguage: "Заттаңба тілі",
  colOriginal: "Заттаңбада",
  colKk: "Қазақша",
  colRu: "Орысша",
  notFound: "Заттаңбадан табылмады",
  fieldFor: "{field}, {lang}",

  checkTitle: "Міндетті мәліметтер",
  checkSummary: "Толтырылды: {found} / {total}",
  statusOk: "Толтырылған",
  statusMissing: "Жетіспейді",
  statusOptional: "Қажет болған жағдайда ғана",
  eacName: "EAC белгісі",
  eacLabel: "Қаптамада EAC белгісі бар",
  checkNote:
    "Тізім КО ТР 022/2011 техникалық регламентінің 4-бабының 4.1-бөлігіне негізделген. Бұл жылдам өзін-өзі тексеру, заңгерлік кеңес емес.",
  missingWarning:
    "Әлі жетіспейтін міндетті мәліметтер: {n}. Жалғастыруға болады, бірақ заттаңба тексерістен өтпеуі мүмкін.",
  btnBack: "Басқа фото таңдау",
  btnContinue: "Жүктеп алуға өту",

  downloadTitle: "Заттаңбаңыз дайын",
  downloadText: "Оны жапсырма ретінде басып шығарыңыз немесе мәтінін сақтаңыз.",
  stickerLabel: "Қазақ және орыс тілдеріндегі дайын заттаңба",
  btnPrint: "Басып шығару немесе PDF ретінде сақтау",
  btnTxt: "Мәтіндік файлды жүктеп алу",
  btnCopy: "Мәтінді көшіру",
  copied: "Көшірілді",
  btnEdit: "Түзетуге оралу",
  btnRestart: "Жаңа заттаңба бастау",

  errorTitle: "Назар аударыңыз",
  btnDismiss: "Жабу",
  errNoFile: "Фото қабылданбады. Фото таңдап, қайталап көріңіз.",
  errFileType: "Бұл файл түріне қолдау көрсетілмейді. JPG, PNG немесе WEBP фотосын таңдаңыз.",
  errFileSize: "Бұл фото 8 МБ-тан үлкен. Кішірек фото таңдаңыз немесе оны сығыңыз.",
  errNoLabel:
    "Бұл фотодан заттаңба мәтіні табылмады. Мәтіні анық оқылатын, жарық жақсы түскен фото түсіріңіз.",
  errAiNotConfigured:
    "AI әлі қосылмаған, сондықтан өз фотоларыңызды оқу мүмкін емес. Үлгі заттаңбаны байқап көріңіз.",
  errAiFailed:
    "AI қызметі жауап бермеді. Фотоңыз сақталған жоқ. Бір минуттан кейін қайталап көріңіз.",
  errRateLimited: "Сұраулар тым көп. Бірнеше минут күтіп, қайталап көріңіз.",
  errNetwork: "Сервермен байланыс жоқ. Интернетті тексеріп, қайталап көріңіз.",

  footer: "Tańba AI — студенттік MVP. Дайын заттаңбаны әрқашан адам тексеруі керек.",
};

const DICTIONARIES: Record<UiLang, Record<TextKey, string>> = { en, kk };

// Returns the text for a key, replacing {placeholders} with values.
export function translate(
  lang: UiLang,
  key: TextKey,
  values: Record<string, string | number> = {},
): string {
  let text = DICTIONARIES[lang][key];
  for (const [name, value] of Object.entries(values)) {
    text = text.replace(`{${name}}`, String(value));
  }
  return text;
}
