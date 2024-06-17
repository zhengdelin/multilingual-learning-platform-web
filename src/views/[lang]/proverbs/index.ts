import { useRouteParamsLanguageMap } from "@/composable/useLanguage";
import { defineRouteConfig } from "vite-plugin-routes-generator";

export default defineRouteConfig({
  meta: {
    title(to) {
      const langText = useRouteParamsLanguageMap(to.params);
      return `${langText}諺語`;
    },
  },

  // path: "radicals",
});
