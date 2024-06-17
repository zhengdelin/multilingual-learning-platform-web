export type Category = string | CategoryList | { [key in string]: Category };
export type CategoryList = Array<string | { [key in string]: Category }>;
export type PhrasesFromCategory = string[];

export type RadicalList = string[][];
export type WordsFromRadical = string[][];

export type ProverbList = string[];

export interface Definition {
  /** 定義 parsable */
  f: string;
  /** 舉例  parsable */
  e?: string[];
  /** 類型 parsable: 名詞動詞... */
  type?: string;
  /** 通義詞 */
  l?: string[];
  /** 反義詞 */
  a?: string;
  /** 同義詞 */
  s?: string;
  /** 出處？用例？ parsable */
  q?: string[];
}

/** 多音字定義 */
export interface PolyphonicDefinition {
  /** 語音的id */
  "="?: string;
  /** 注音符號 */
  b?: string;
  /** 羅馬拼音 */
  p?: string;
  d: Definition[];

  /** 台語的羅馬拼音 */
  T?: string;
}

export interface PhraseOrWordDefinition {
  /** 不同讀音的定義 */
  h: PolyphonicDefinition[];
  /** 字/詞 parsable */
  t: string;

  /** 含部首筆畫 */
  c?: number;
  /** 不含部首筆畫 */
  n?: number;
  /** 部首 */
  r?: string;
  translation?: {
    Deutsch: string[];
    English: string[];
    francais: string[];
  };
  Deutsch?: string;
  English?: string;
  francais?: string;
}
