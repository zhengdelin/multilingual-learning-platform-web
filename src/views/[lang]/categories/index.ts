import { useRouteParamsLanguageMap } from "@/composable/useRouteParamsLanguageMap";
import { defineRouteConfig } from "vite-plugin-routes-generator";

export default defineRouteConfig({
  meta: {
    title(to) {
      const langText = useRouteParamsLanguageMap(to.params);
      return `${langText}分類`;
    },
  },
});
