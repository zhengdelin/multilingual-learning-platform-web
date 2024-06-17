import { $api } from "@/api";
import { Language } from "@/types/modules";
import { isObjectNullOrEmpty } from "@/utils/object";

export function useXrefModule(lang: Language) {
  const xref = ref({});
  async function getXref() {
    if (isObjectNullOrEmpty(xref.value)) {
      const data = await $api.dictionary.getXref(lang);
      xref.value = data.data.value || {};
    }
    return xref.value;
  }

  return {
    xref,
    getXref,
  };
}
