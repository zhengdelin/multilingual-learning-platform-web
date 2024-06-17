import { Language } from "@/types/modules";
import { useRouteParamsLang, useStoreByLanguage } from "./useLanguage";

export function useXrefTranslate(to: Language) {
  const { lang } = useRouteParamsLang();
  const store = computed(() => useStoreByLanguage(lang.value));
  const xref = computed(() => (store.value as any)?.xref?.[to] || {});

  function translate(key: string) {
    const translation = xref.value?.[key] as string;
    if (!translation) return [];
    console.log("translation :>> ", translation);
    return translation.split(",").map((i) => (i ? i : key));
  }

  const init = () => (store.value as any)?.getXref();

  return {
    xref,
    translate,
    init,
  };
}
