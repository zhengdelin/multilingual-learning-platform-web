import { useRouteParamsLanguageMap } from "@/composable/useLanguage";
import { defineRouteConfig } from "vite-plugin-routes-generator";
export default defineRouteConfig({
  meta: {
    title: (to) => {
      return useRouteParamsLanguageMap(to.params);
    },
  },
});
