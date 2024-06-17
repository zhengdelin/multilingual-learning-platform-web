import {
  CategoryView,
  CategoryViewList,
  PhraseOrWordDefinitionView,
  PhrasesFromCategoryView,
  ProverbListView,
  RadicalListView,
  WordsFromRadicalView,
} from "@/types/modules/dictionary";
import { $query, WatchableParams } from "../..";
import {
  Category,
  CategoryList,
  PhraseOrWordDefinition,
  PhrasesFromCategory,
  ProverbList,
  RadicalList,
  WordsFromRadical,
} from "./index.dto";

export default {
  getCategories: (lang: string) =>
    $query.get<CategoryList, CategoryViewList>(
      `/${lang}/categories`,
      {},
      {},
      {
        transform(input) {
          const stringToCategoryView = (item: string) => ({
            label: item,
            key: item,
          });

          const transformObjectCategory = (item: Record<string, Category>): CategoryViewList => {
            return Object.keys(item).map((key) => {
              const value = item[key];
              if (typeof value === "string") return stringToCategoryView(value);
              else if (Array.isArray(value)) {
                return {
                  label: key,
                  key,
                  children: transformCategories(value),
                };
              } else {
                value;
                return {
                  label: key,
                  key,
                  children: transformObjectCategory(value),
                };
              }
            });
          };

          const transformCategories = (items: CategoryList): CategoryView[] => {
            const transformed = [] as CategoryView[];
            for (const item of items) {
              if (typeof item === "string") {
                transformed.push(stringToCategoryView(item));
              } else {
                transformed.push(...transformObjectCategory(item));
              }
            }
            return transformed;
          };

          return transformCategories(input);
        },
      },
    ),

  getCategory: (lang: WatchableParams<string>, category: WatchableParams<string>) =>
    $query.get<PhrasesFromCategory, PhrasesFromCategoryView>(
      () => `/${lang.value}/categories/${category.value}`,
      undefined,
      undefined,
      {
        watch: [category, lang],
      },
    ),
  getRadicals: (lang: WatchableParams<string>) =>
    $query.get<RadicalList, RadicalListView>(() => `/${lang.value}/radicals`, undefined, undefined, { watch: [lang] }),
  getRadical: (lang: WatchableParams<string>, radical: WatchableParams<string>) =>
    $query.get<WordsFromRadical, WordsFromRadicalView>(
      () => `/${lang.value}/radicals/${radical.value}`,
      undefined,
      undefined,
      {
        watch: [radical, lang],
      },
    ),
  getProverbs: (lang: WatchableParams<string>) =>
    $query.get<ProverbList, ProverbListView>(() => `/${lang.value}/proverbs`, undefined, undefined, { watch: [lang] }),

  search: (lang: WatchableParams<string>, keyword: WatchableParams<string>) => {
    return $query.get<PhraseOrWordDefinition, PhraseOrWordDefinitionView>(
      () => `/${lang.value}/search/${keyword.value}`,
      undefined,
      undefined,
      {
        watch: [lang, keyword],
        transform(input) {
          // if()
          return input;
        },
      },
    );
  },

  getXref: (lang: string) => $query.get(`/${lang}/xref`),
  getEntries: (lang: string) => $query.get(`/${lang}/entries`),
} as const;
