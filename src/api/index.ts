import { useAxios } from "@/api/config";
import { $message } from "@/composable/useMessage";
import { createUseAxiosAsyncData } from "use-axios-async-data";
import dictionary from "./modules/dictionary/index";
import global from "./modules/global";
import textToSpeech from "./modules/text-to-speech";
const $axios = useAxios("/api", {
  onRequestSuccess: (config) => {
    console.log("onRequestSuccess :>> ", config);
  },
  onResponseSuccessShowToast({ config, data }) {
    if (config.method !== "get" && data.notify) {
      $message.success(data.message);
    }
  },

  onResponseErrorShowToast(payload) {
    const { error } = payload;
    if (error.notify) {
      $message.error(error.message);
    }
  },

  onResponseError({ error }) {
    if (error.status === 401) {
      // 憑證過期重新登入
      // const store = useStore();
      // const router = useRouter();
      // nextTick(store.removeUser);
      // router.push({
      //   name: "login",
      // });
    } else if (error.status === 403) {
      //
    }
  },
});
export const $query = createUseAxiosAsyncData<{ message: string; statusCode: number; error: string }>($axios);

export type WatchableParams<T> = Ref<T>;
export const $api = {
  isSuccess: <T extends ApiResponse>(data: T | null): data is T => !!data?.success,
  global,
  dictionary,
  textToSpeech,
};
