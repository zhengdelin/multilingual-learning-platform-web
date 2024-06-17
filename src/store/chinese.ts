// https://pinia.vuejs.org/ssr/nuxt.html
// npm i pinia
import { $api } from "@/api";
import { Language } from "@/types/modules";
import { CategoryView } from "@/types/modules/dictionary";
import { defineStore } from "pinia";
import { useEntriesModule } from "./modules/entries";
import { useXrefModule } from "./modules/xref";

export const useChineseStore = defineStore("chinese", () => {
  const categories = ref<CategoryView[]>([]);

  async function getCategories() {
    if (!categories.value.length) {
      const data = await $api.dictionary.getCategories(Language.CHINESE);
      categories.value = data.data.value || [];
    }
    return categories.value;
  }

  return {
    categories,
    getCategories,

    ...useXrefModule(Language.CHINESE),
    ...useEntriesModule(Language.CHINESE),
  };
});
