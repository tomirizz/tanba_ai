// The parts of a food label that Tańba AI reads, translates and checks.
// The list follows TR CU 022/2011, article 4, part 4.1, point 1.
// Point 7 of that list (manufacturer and importer) is split into two rows,
// because imported goods usually arrive without the importer's details.

export const FIELD_IDS = [
  "name",
  "composition",
  "quantity",
  "manufactureDate",
  "shelfLife",
  "storage",
  "manufacturer",
  "importer",
  "nutrition",
  "usage",
  "gmo",
] as const;

export type FieldId = (typeof FIELD_IDS)[number];

// "required": must be on every packaged food label.
// "conditional": needed only when it applies to the product.
export type FieldLevel = "required" | "conditional";

export type OutputLang = "kk" | "ru";

export type FieldDef = {
  id: FieldId;
  level: FieldLevel;
  label: { en: string; kk: string; ru: string };
  // false: the finished label prints the text alone, without a title in front.
  // The product name and the quantity ("Net weight 200 g") explain themselves.
  printTitle: boolean;
};

export const FIELDS: FieldDef[] = [
  {
    id: "name",
    level: "required",
    printTitle: false,
    label: { en: "Product name", kk: "Өнімнің атауы", ru: "Наименование" },
  },
  {
    id: "composition",
    level: "required",
    printTitle: true,
    label: { en: "Ingredients", kk: "Құрамы", ru: "Состав" },
  },
  {
    id: "quantity",
    level: "required",
    printTitle: false,
    label: { en: "Net quantity", kk: "Мөлшері", ru: "Количество" },
  },
  {
    id: "manufactureDate",
    level: "required",
    printTitle: true,
    label: {
      en: "Date of manufacture",
      kk: "Дайындалған күні",
      ru: "Дата изготовления",
    },
  },
  {
    id: "shelfLife",
    level: "required",
    printTitle: true,
    label: { en: "Shelf life", kk: "Жарамдылық мерзімі", ru: "Срок годности" },
  },
  {
    id: "storage",
    level: "required",
    printTitle: true,
    label: {
      en: "Storage conditions",
      kk: "Сақтау шарттары",
      ru: "Условия хранения",
    },
  },
  {
    id: "manufacturer",
    level: "required",
    printTitle: true,
    label: {
      en: "Manufacturer and address",
      kk: "Дайындаушы және мекенжайы",
      ru: "Изготовитель и адрес",
    },
  },
  {
    id: "importer",
    level: "required",
    printTitle: true,
    label: {
      en: "Importer and address",
      kk: "Импорттаушы және мекенжайы",
      ru: "Импортёр и адрес",
    },
  },
  {
    id: "nutrition",
    level: "required",
    printTitle: true,
    label: {
      en: "Nutrition facts",
      kk: "Тағамдық құндылығы",
      ru: "Пищевая ценность",
    },
  },
  {
    id: "usage",
    level: "conditional",
    printTitle: true,
    label: {
      en: "Instructions for use",
      kk: "Қолдану жөніндегі ұсынымдар",
      ru: "Рекомендации по использованию",
    },
  },
  {
    id: "gmo",
    level: "conditional",
    printTitle: true,
    label: {
      en: "GMO information",
      kk: "ГМО туралы мәлімет",
      ru: "Сведения о ГМО",
    },
  },
];

// One label part: the text as printed, plus its two translations.
export type LabelField = { original: string; kk: string; ru: string };

export type LabelFields = Record<FieldId, LabelField>;

// What the server sends back to the browser after reading a photo.
export type AnalyzeResult = {
  sourceLanguage: string;
  fields: LabelFields;
  eacMark: boolean;
  // "ai": read by the AI service. "demo": a prepared example, no AI call.
  mode: "ai" | "demo";
};

export function emptyFields(): LabelFields {
  const fields = {} as LabelFields;
  for (const id of FIELD_IDS) {
    fields[id] = { original: "", kk: "", ru: "" };
  }
  return fields;
}
