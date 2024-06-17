// https://pinia.vuejs.org/ssr/nuxt.html
// npm i pinia

import { Language } from "@/types/modules";
import { defineStore } from "pinia";
import { useXrefModule } from "./modules/xref";

export const useHakkaStore = defineStore("hakka", () => {
  // const categories = ref<CategoryView[]>([]);
  // async function getCategories() {
  //   if (!categories.value.length) {
  //     const data = await $api.dictionary.getCategories(Language.MINNAN);
  //     categories.value = data.data.value || [];
  //   }
  //   return categories.value;
  // }
  // return {
  //   categories,
  //   getCategories,
  // };
  return {
    ...useXrefModule(Language.HAKKA),
  };
});
