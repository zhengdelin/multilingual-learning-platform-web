import { defineRouteConfig } from "vite-plugin-routes-generator";
export default defineRouteConfig({
  meta: {
    title: (to) => {
      return (to.query.keyword as string) || "";
    },
  },
  name: "search",
});
