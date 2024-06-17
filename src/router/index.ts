import { App } from "vue";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { generateRoutes } from "./lib";

export const routes = generateRoutes({
  components: import.meta.glob(`../views/**\/*.vue`),
  routeConfigs: import.meta.glob(`../views/**\/*.ts`, {
    eager: true, //轉成模塊
    import: "default", //取出模塊的default
  }),
});

const router = createRouter({
  history: createWebHistory(),
  routes: routes as RouteRecordRaw[],
});

router.beforeEach((to) => {
  if (to.meta.title) {
    const _title = typeof to.meta.title === "string" ? () => to.meta.title : to.meta.title;
    const title = _title(to);
    document.title = `${title ? title + " - " : ""}多語言學習平台`;
  } else {
    document.title = `多語言學習平台`;
  }
});

export function installRouter(app: App) {
  app.use(router);
}
