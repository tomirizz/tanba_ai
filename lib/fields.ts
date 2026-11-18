export const FOOD_FIELD_IDS = [
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

export const FIELD_IDS = [...FOOD_FIELD_IDS, "warnings", "batch", "origin", "materials", "model", "specifications", "care", "otherDetails"] as const;
export const PRODUCT_CATEGORIES = ["cosmetics", "food", "other"] as const;
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

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
  {
    id: "warnings", level: "conditional", printTitle: true,
    label: { en: "Warnings", kk: "Ескертулер", ru: "Меры предосторожности" },
  },
  {
    id: "batch", level: "conditional", printTitle: true,
    label: { en: "Lot or batch", kk: "Партия нөмірі", ru: "Номер партии" },
  },
  {
    id: "origin", level: "conditional", printTitle: true,
    label: { en: "Country of origin", kk: "Шығарылған елі", ru: "Страна происхождения" },
  },
  {
    id: "materials", level: "conditional", printTitle: true,
    label: { en: "Materials", kk: "Материалдар", ru: "Материалы" },
  },
  {
    id: "model", level: "conditional", printTitle: true,
    label: { en: "Model", kk: "Модель", ru: "Модель" },
  },
  {
    id: "specifications", level: "conditional", printTitle: true,
    label: { en: "Specifications", kk: "Сипаттамалары", ru: "Характеристики" },
  },
  {
    id: "care", level: "conditional", printTitle: true,
    label: { en: "Care instructions", kk: "Күтім нұсқаулары", ru: "Уход" },
  },
  {
    id: "otherDetails", level: "conditional", printTitle: true,
    label: { en: "Other label details", kk: "Заттаңбадағы өзге мәліметтер", ru: "Другие сведения на этикетке" },
  },
];

const foodIds = new Set<FieldId>(FOOD_FIELD_IDS);
export const FOOD_FIELDS = FIELDS.filter(({ id }) => foodIds.has(id));

// Retain the familiar food worksheet. For other goods, show what was printed
// and keep those fields editable even if a translation is subsequently cleared.
export function reviewFields(category: ProductCategory, fields: LabelFields): FieldDef[] {
  return FIELDS.filter(({ id }) => (category === "food" && foodIds.has(id)) || Boolean(fields[id]?.original));
}

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
  category: ProductCategory;
};

export function emptyFields(): LabelFields {
  const fields = {} as LabelFields;
  for (const id of FIELD_IDS) {
    fields[id] = { original: "", kk: "", ru: "" };
  }
  return fields;
}
