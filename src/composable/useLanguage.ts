import { LanguageMap } from "@/constants/language";
import { useBilateralStore } from "@/store/bilateral";
import { useChineseStore } from "@/store/chinese";
import { useHakkaStore } from "@/store/hakka";
import { useMinnanStore } from "@/store/minnan";
import { Language } from "@/types/modules";
import { RouteParams } from "vue-router";

export function useRouteParamsLang() {
  const route = useRoute();
  const lang = computed(() => route.params.lang as Language);
  return { route, lang };
}
export function useRouteParamsLanguageMap(params: RouteParams) {
  const lang = params.lang as Language;
  return LanguageMap[lang];
}

export function useLanguageCondition() {
  const { lang } = useRouteParamsLang();
  return {
    withLanguage: (conditions: Partial<Record<Language, any>>) => conditions[lang.value],
  };
}

export function useStoreByLanguage(lang: Language) {
  return {
    [Language.CHINESE]: () => useChineseStore(),
    [Language.MINNAN]: () => useMinnanStore(),
    [Language.HAKKA]: () => useHakkaStore(),
    [Language.BILATERAL]: () => useBilateralStore(),
    [Language.ENGLISH]: () => null,
  }[lang]?.();
}
