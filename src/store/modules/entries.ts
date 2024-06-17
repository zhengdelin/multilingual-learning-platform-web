import { $api } from "@/api";
import { Language } from "@/types/modules";
import { isObjectNullOrEmpty } from "@/utils/object";

export function useEntriesModule(lang: Language) {
  const entries = ref([]);
  async function getEntries() {
    if (isObjectNullOrEmpty(entries.value)) {
      const data = await $api.dictionary.getEntries(lang);
      entries.value = data.data.value || {};
    }
    return entries.value;
  }

  return {
    entries,
    getEntries,
  };
}
