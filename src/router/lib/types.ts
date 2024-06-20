import type { PluginOption } from "vite";
import type { RouteRecordRaw } from "vue-router";
export interface RouteConfig extends Pick<RouteRecordRaw, "meta" | "beforeEnter" | "redirect"> {
  name?: string;
  /**
   * 路由參數驗證，會直接接在path後面
   * @example
   * 404路由: (.*)* -> /:notFound(.*)*
   * id路由: (\\d+) -> /:id(\\d+)
   */
  validation?: string;
  [key: string]: any;
}
export type ComponentModule = () => Promise<unknown>;
export type ComponentModules = Record<string, ComponentModule>;
export type RouteConfigModule = any;
export type RouteConfigModules = Record<string, RouteConfigModule>;
export interface GenerateRoutesConfig {
  /**
   * @example import.meta.glob(`../views/**\/*.vue`)
   */
  components: ComponentModules;
  /**
     * @example
     * import.meta.glob<PageConfigComp>(`../views/**\/*.vue`, {
          eager: true, //轉成模塊
          import: "default", //取出模塊的default
       })
     */
  routeConfigs: RouteConfigModules;
}

/**
 *
 * @param config 傳入函數時 僅在自訂義宏中有用
 * @returns
 */
export declare function defineRouteConfig(config: RouteConfig | (() => RouteConfig)): RouteConfig | (() => RouteConfig);
declare function getDefineRouteConfigBlock(code: string): string | undefined;
/**
 * 將會解析script setup中的defineRouteConfig方法
 * 為Component實例添加__routeMeta屬性
 * @param config
 * @returns
 */
export declare function viteRoutesGenerator(
  _getDefineRouteConfigBlock?: typeof getDefineRouteConfigBlock,
): PluginOption;
/**
 * 依照views之下的檔案取得路由
 * @param config
 * @returns
 */
export declare function generateRoutes(config: GenerateRoutesConfig): RouteRecordRaw[];
export {};
