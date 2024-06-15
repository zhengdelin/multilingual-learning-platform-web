import { LanguageMap } from "@/constants/language";
import { Language } from "@/types/modules";
import { RouteParams } from "vue-router";

export function useRouteParamsLanguageMap(params: RouteParams) {
  const lang = params.lang as Language;
  return LanguageMap[lang];
}
