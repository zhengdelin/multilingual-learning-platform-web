import {
  Definition,
  PhraseOrWordDefinition,
  PhrasesFromCategory,
  PolyphonicDefinition,
  ProverbList,
  RadicalList,
  WordsFromRadical,
} from "@/api/modules/dictionary/index.dto";

export type CategoryView = {
  label: string;
  key: string;
  children?: CategoryView[];
  // ch
};
export type CategoryViewList = CategoryView[];
export type PhrasesFromCategoryView = PhrasesFromCategory;

export type RadicalListView = RadicalList;
export type WordsFromRadicalView = WordsFromRadical;

export type ProverbListView = ProverbList;

export type DefinitionView = Definition;
export type PolyphonicDefinitionView = PolyphonicDefinition;
export type PhraseOrWordDefinitionView = PhraseOrWordDefinition;
