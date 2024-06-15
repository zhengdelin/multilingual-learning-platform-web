// https://pinia.vuejs.org/ssr/nuxt.html
// npm i pinia
import { Language } from "@/types/modules";
import { createPinia, defineStore } from "pinia";
import { App } from "vue";
export function installPinia(app: App) {
  app.use(createPinia());
}

export const useStore = defineStore("index", () => {
  const curLanguage = ref(Language.CHINESE);

  function setCurLanguage(lang: Language) {
    curLanguage.value = lang;
  }
  return {
    curLanguage,
    setCurLanguage,
  };
});
