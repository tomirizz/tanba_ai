// Sample labels and their prepared results.
// They let anyone try the full journey without a label photo, and they keep
// the app usable in demo mode, when no AI key is set.
// The companies on the samples are invented.

import { emptyFields, type AnalyzeResult } from "./fields";

export const SAMPLE_IDS = ["oat-cookies", "hazelnut-chocolate"] as const;

export type SampleId = (typeof SAMPLE_IDS)[number];

export function isSampleId(value: unknown): value is SampleId {
  return typeof value === "string" && (SAMPLE_IDS as readonly string[]).includes(value);
}

export function sampleImagePath(id: SampleId): string {
  return `/samples/${id}.png`;
}

function oatCookies(): AnalyzeResult {
  const fields = emptyFields();
  fields.name = {
    original: "Oat cookies with chocolate chips",
    kk: "Шоколад түйіршіктері қосылған сұлы печеньесі",
    ru: "Овсяное печенье с шоколадной крошкой",
  };
  fields.composition = {
    original:
      "Oat flakes (38%), wheat flour, sugar, palm oil, chocolate chips (10%) (cocoa mass, sugar, cocoa butter, emulsifier: soy lecithin), raising agent: sodium bicarbonate, salt. Contains gluten and soy. May contain traces of milk and nuts.",
    kk: "Сұлы жармасы (38%), бидай ұны, қант, пальма майы, шоколад түйіршіктері (10%) (какао массасы, қант, какао майы, эмульгатор: соя лецитині), қопсытқыш: натрий бикарбонаты, тұз. Құрамында глютен және соя бар. Сүт пен жаңғақ іздері болуы мүмкін.",
    ru: "Овсяные хлопья (38%), пшеничная мука, сахар, пальмовое масло, шоколадная крошка (10%) (какао тёртое, сахар, масло какао, эмульгатор: соевый лецитин), разрыхлитель: гидрокарбонат натрия, соль. Содержит глютен и сою. Может содержать следы молока и орехов.",
  };
  fields.quantity = {
    original: "Net weight 200 g",
    kk: "Таза салмағы 200 г",
    ru: "Масса нетто 200 г",
  };
  fields.manufactureDate = {
    original: "Production date: 12.09.2026",
    kk: "12.09.2026",
    ru: "12.09.2026",
  };
  fields.shelfLife = {
    original: "Best before: 12.06.2027",
    kk: "12.06.2027 дейін",
    ru: "до 12.06.2027",
  };
  fields.storage = {
    original: "Store in a cool, dry place away from direct sunlight.",
    kk: "Салқын, құрғақ жерде, тікелей күн сәулесінен қорғап сақтаңыз.",
    ru: "Хранить в прохладном сухом месте, вдали от прямых солнечных лучей.",
  };
  fields.manufacturer = {
    original: "Northfield Bakery Ltd, 14 Mill Lane, Leeds, United Kingdom",
    kk: "Northfield Bakery Ltd, 14 Mill Lane, Лидс, Ұлыбритания",
    ru: "Northfield Bakery Ltd, 14 Mill Lane, Лидс, Великобритания",
  };
  fields.nutrition = {
    original:
      "Per 100 g: energy 1950 kJ / 465 kcal, fat 19 g, carbohydrate 64 g, protein 7 g",
    kk: "100 г өнімде – энергетикалық құндылығы 1950 кДж / 465 ккал, майлар 19 г, көмірсулар 64 г, ақуыздар 7 г",
    ru: "в 100 г продукта – энергетическая ценность 1950 кДж / 465 ккал, жиры 19 г, углеводы 64 г, белки 7 г",
  };
  return { sourceLanguage: "English", fields, eacMark: false, mode: "demo" };
}

function hazelnutChocolate(): AnalyzeResult {
  const fields = emptyFields();
  fields.name = {
    original: "Fındıklı sütlü çikolata",
    kk: "Орман жаңғағы қосылған сүтті шоколад",
    ru: "Молочный шоколад с фундуком",
  };
  fields.composition = {
    original:
      "Şeker, kakao yağı, tam yağlı süt tozu, fındık (%15), kakao kitlesi, emülgatör: soya lesitini, aroma verici: vanilin. Süt, fındık ve soya içerir.",
    kk: "Қант, какао майы, майлы құрғақ сүт, орман жаңғағы (15%), какао массасы, эмульгатор: соя лецитині, хош иістендіргіш: ванилин. Құрамында сүт, орман жаңғағы және соя бар.",
    ru: "Сахар, масло какао, сухое цельное молоко, фундук (15%), какао тёртое, эмульгатор: соевый лецитин, ароматизатор: ванилин. Содержит молоко, фундук и сою.",
  };
  fields.quantity = {
    original: "Net: 80 g",
    kk: "Таза салмағы 80 г",
    ru: "Масса нетто 80 г",
  };
  fields.shelfLife = {
    original: "Son tüketim tarihi: 03.2027",
    kk: "03.2027 дейін",
    ru: "до 03.2027",
  };
  fields.storage = {
    original: "Serin ve kuru yerde saklayınız.",
    kk: "Салқын және құрғақ жерде сақтаңыз.",
    ru: "Хранить в прохладном и сухом месте.",
  };
  fields.manufacturer = {
    original: "Anadolu Tatlı Gıda A.Ş., İstanbul, Türkiye",
    kk: "Anadolu Tatlı Gıda A.Ş., Стамбұл, Түркия",
    ru: "Anadolu Tatlı Gıda A.Ş., Стамбул, Турция",
  };
  return { sourceLanguage: "Turkish", fields, eacMark: false, mode: "demo" };
}

export function demoResult(id: SampleId): AnalyzeResult {
  return id === "oat-cookies" ? oatCookies() : hazelnutChocolate();
}
