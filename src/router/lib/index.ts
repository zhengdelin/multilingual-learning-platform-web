import type { PluginOption } from "vite";
// import serializeJavascript from "serialize-javascript";
import type { RouteRecordRaw } from "vue-router";
import {
  ComponentModule,
  ComponentModules,
  GenerateRoutesConfig,
  RouteConfig,
  RouteConfigModule,
  RouteConfigModules,
} from "./types.ts";

/**
 *
 * @param config 傳入函數時 僅在自訂義宏中有用
 * @returns
 */
export function defineRouteConfig(config: RouteConfig | (() => RouteConfig)) {
  return config;
}

const isProd = process.env.NODE_ENV === "production";
const ROUTE_CONFIG_KEY = "__routeConfig";
let mode: "setup" | "configFile" = "configFile";

function getDefineRouteConfigBlock(code: string) {
  return code.match(/defineRouteConfig\((.|\n)*?}(\))?\);/)?.[0];
}

/**
 * 將會解析script setup中的defineRouteConfig方法
 * 為Component實例添加__routeMeta屬性
 * @param config
 * @returns
 */
export function viteRoutesGenerator(_getDefineRouteConfigBlock = getDefineRouteConfigBlock): PluginOption {
  const serializeJavascript = require("serialize-javascript");

  function isViewPage(path: string) {
    const regex = isProd ? /views\/.*\.vue\?vue&type=script/ : /views\/.*\.vue$/;
    return regex.test(path);
  }

  return {
    name: "routes-generator",
    transform(code, id) {
      if (!isViewPage(id)) return;

      const defineRouteConfigBlock = _getDefineRouteConfigBlock(code);
      if (!defineRouteConfigBlock) return code;

      code = code.replace(defineRouteConfigBlock, "");
      try {
        (<any>globalThis).defineRouteConfig = defineRouteConfig;
        const routeMeta = serializeJavascript(eval(defineRouteConfigBlock));

        // 取代掉
        return code.replace(/(__name: ".*",)/, (v) => {
          return `${v}\n  ${`__routeConfig`}: ${routeMeta},`;
        });
      } catch (error) {
        console.log("viteRoutesGeneratorCustomBlock :>> ", error);
        return code;
      } finally {
        (<any>globalThis).defineRouteConfig = undefined;
      }

      // if (!new RegExp(`vue&type=${customBlockName}`).test(id)) return;

      // const lang = id.match(/(?<=&lang\.).*?(?=&|$)/)?.[0];
      // if (!lang) return;

      // // console.log("id :>> ", id, code);
      // // try {
      // //   console.log(V.parse(code));
      // // } catch (error) {
      // //   console.log("error :>> ", error);
      // // }
      // // console.log("code :>> ", import(path.resolve(id)));
      // const routeMeta: string | object = code;
      // // console.log("routeMeta :>> ", routeMeta);
      // if (lang === "ts" || lang === "js") {
      //   // routeMeta = serializeJavascript(eval(`(()=>{${code}})()`));
      // }
      // return `export default Comp => {
      //     Comp.__routeMeta = ${{}};
      // }`;
    },
  };
}

function transformModules(componentModules: ComponentModules, routeConfigModules: RouteConfigModules) {
  const getRouteConfig = (() => {
    if (mode === "configFile") {
      return (pagePath: string) => routeConfigModules[pagePath.replace(".vue", ".ts")];
    }

    // mode === setup
    return (pagePath: string) => routeConfigModules[pagePath]?.[ROUTE_CONFIG_KEY];
  })();

  return Object.keys(componentModules)
    .reduce((prev, pagePath) => {
      const routePath =
        pagePath
          // ../views/[PageNotFound].vue -> /[PageNotFound].vue
          // /[PageNotFound].vue -> /[PageNotFound]
          .replace(/.*\/views|\.vue/g, "")
          // /[PageNotFound] -> /:PageNotFound
          .replace(/\[(.*?)\]/g, ":$1")
          // /:PageNotFound -> /:pageNotFound
          .replace(/(?<=\/:?)(.)/g, (_, t) => `${t.toLowerCase()}`) || "/";
      const component = componentModules[pagePath];
      const config = getRouteConfig(pagePath);
      return prev.push([routePath, component, config]), prev;
    }, [] as Array<[routePath: string, component: ComponentModule, routeConfig: RouteConfigModule]>)
    .sort((a, b) => {
      return a[0].localeCompare(b[0]);
    });
}

/**
 * 依照views之下的檔案取得路由
 * @param config
 * @returns
 */
export function generateRoutes(config: GenerateRoutesConfig) {
  const { components: componentModules, routeConfigs: routeConfigModules } = config;

  const transformedModules = transformModules(componentModules, routeConfigModules);

  const result: RouteRecordRaw[] = [];
  const routeTreeMap: Record<string, RouteRecordRaw> = {};

  function getRouteName(list: string[]) {
    return list.join("-") || "index";
  }

  function replaceDynamicRouteName(list: string[]) {
    return list.map((name) => name.replace(":", ""));
  }

  for (const [routePath, importComponent, _routeConfig] of transformedModules) {
    let routeConfig = _routeConfig || {};
    if (typeof routeConfig === "function") {
      routeConfig = routeConfig();
    }

    //依照路徑取出路由名稱陣列並將:xxx替換為xxx
    const dynamicRouteNameList = routePath.split("/").filter(Boolean),
      routeNameList = replaceDynamicRouteName(dynamicRouteNameList),
      routeName = getRouteName(routeNameList);
    const layer = routeNameList.length,
      isFirstLayer = layer === 1;

    routeTreeMap[routeName] = (() => {
      // const _path = isFirstLayer ? routePath : dynamicRouteNameList.slice(1).join("/");
      let path = routePath;
      path = path.replace(/\/index$/, "") + (routeConfig.validation || "");

      return Object.assign(
        {
          //替換掉結尾的index字串，ex: /index => /
          path,
          name: routeName,
          children: routeTreeMap[routeName]?.children || [],
        },
        routeConfig,
        {
          component: importComponent,
        },
      ) as RouteRecordRaw;
    })();

    const curRoute = routeTreeMap[routeName];
    if (isFirstLayer) result.push(curRoute);
    else {
      //nameList數量大於1時 表示要找上一層的route
      const parentName = getRouteName(routeNameList.slice(0, routeNameList.length - 1));
      // console.log("routeTreeMap[parentName] :>> ", routeNameList, routeTreeMap[parentName]);

      const parentRoute = routeTreeMap[parentName];
      if (parentRoute) {
        // routeTreeMap[parentName] ||= { path: "", children: [] };
        // console.log("curRoute.path, parentRoute.path :>> ", curRoute.path, parentRoute.path, curRoute.path.match);
        // curRoute.path = curRoute.path.replace(new RegExp(`^${parentRoute.path}/`), "");
        curRoute.path = curRoute.path.split("/").slice(layer).join("/");
        parentRoute.children?.push(curRoute);
        // console.log("curRoute, parentRoute :>> ", curRoute, parentRoute);

        //若為子頁面並且為index，則設置父頁面redirect回該子頁面
        if (routeName.endsWith("index")) {
          parentRoute.redirect = { name: routeName };
        }
      } else {
        result.push(curRoute);
      }
    }
  }

  return result;
}
