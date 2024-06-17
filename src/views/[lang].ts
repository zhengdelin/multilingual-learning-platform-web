import { defineRouteConfig } from "vite-plugin-routes-generator";
export default defineRouteConfig({
  //define your validate here
  // validate: (to) => {
  //   return true;
  // },
  // 只允許 :lang 為 chinese/english/minnan/hakka/bilateral
  validation: "(chinese|english|minnan|hakka|bilateral)",
});
