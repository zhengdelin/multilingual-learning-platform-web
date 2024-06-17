<template>
  <n-layout-header class="flex justify-between items-center px-5 py-4" bordered>
    <n-dropdown v-model="curActive" :options="options" placement="bottom-start" trigger="click" @select="handleSelect">
      <n-button>{{ curActiveLabel }}</n-button>
    </n-dropdown>
    <HeaderSearchForm />
  </n-layout-header>
</template>
<script setup lang="ts">
import { useRouteParamsLang } from "@/composable/useLanguage";
import { useStore } from "@/store";
import { useBilateralStore } from "@/store/bilateral";
import { useChineseStore } from "@/store/chinese";
import { useMinnanStore } from "@/store/minnan";
import { Language } from "@/types/modules";
import { flatTree } from "@/utils/object";
type Option = {
  label?: string;
  key?: string;
  root?: boolean;
  children?: Option[];
  type?: string;
  source?: string;
  parent?: Option;
  onClick?: (key: string) => void;
};

enum MenuKey {
  CHINESE = Language.CHINESE,
  MINNAN = Language.MINNAN,
  HAKKA = Language.HAKKA,
  BILATERAL = Language.BILATERAL,
  CHINESE_RADICALS = "chinese-radicals",
  MINNAN_PROVERBS = "minnan-proverbs",
  HAKKA_PROVERBS = "hakka-proverbs",
  BILATERAL_RADICALS = "bilateral-radicals",
}

const router = useRouter();
const { lang } = useRouteParamsLang();
const chineseStore = useChineseStore();
const minnanStore = useMinnanStore();
const bilateralStore = useBilateralStore();
chineseStore.getCategories();
minnanStore.getCategories();
bilateralStore.getCategories();

const toCategoryPage = (lang: string, category: string) => router.push(`/${lang}/categories/${category}`);
const toProverbsPage = (lang: string) => router.push(`/${lang}/proverbs`);
const toRadicalsPage = (lang: string) => router.push(`/${lang}/radicals`);
const toLanguageIndexPage = (lang: string) => router.push(`/${lang}`);
const options = computed<Option[]>(() => [
  {
    label: "國語辭典",
    key: MenuKey.CHINESE,
    onClick: () => toLanguageIndexPage(MenuKey.CHINESE),
  },
  {
    label: "分類",
    key: "chinese-category",
    children: chineseStore.categories,
    source: MenuKey.CHINESE,
    onClick: (key: string) => toCategoryPage(MenuKey.CHINESE, key),
  },

  {
    label: "部首表",
    key: MenuKey.CHINESE_RADICALS,
    source: MenuKey.CHINESE,
    onClick: () => toRadicalsPage(MenuKey.CHINESE),
  },
  {
    type: "divider",
    key: "d1",
  },
  {
    label: "臺灣閩南語",
    key: MenuKey.MINNAN,
    onClick: () => toLanguageIndexPage(MenuKey.MINNAN),
  },
  {
    label: "分類",
    key: "minnan-category",
    children: minnanStore.categories,
    source: MenuKey.MINNAN,
    onClick: (key: string) => toCategoryPage(MenuKey.MINNAN, key),
  },
  {
    label: "諺語",
    key: MenuKey.MINNAN_PROVERBS,
    source: MenuKey.MINNAN,
    onClick: () => toProverbsPage(MenuKey.MINNAN),
  },
  {
    type: "divider",
    key: "d3",
  },
  {
    label: "臺灣客家語",
    key: MenuKey.HAKKA,
    onClick: () => toLanguageIndexPage(MenuKey.HAKKA),
  },
  {
    label: "諺語",
    key: MenuKey.HAKKA_PROVERBS,
    source: MenuKey.HAKKA,
    onClick: () => toProverbsPage(MenuKey.HAKKA),
  },
  {
    type: "divider",
    key: "d4",
  },
  {
    label: "兩岸辭典",
    key: MenuKey.BILATERAL,
    onClick: () => toLanguageIndexPage(MenuKey.BILATERAL),
  },
  {
    label: "分類",
    key: "bilateral-category",
    children: bilateralStore.categories,
    source: MenuKey.BILATERAL,
    onClick: (key: string) => toCategoryPage(MenuKey.BILATERAL, key),
  },
  {
    label: "部首表",
    key: MenuKey.BILATERAL_RADICALS,
    source: MenuKey.BILATERAL,
    onClick: () => toRadicalsPage(MenuKey.BILATERAL),
  },
]);

const flattedOptionsMap = computed(() =>
  flatTree(options.value, (item, _, parent) => {
    return { ...item, parent };
  }).mapBy((i) => i.key),
);

const store = useStore();
const curActive = computed(() => {
  return lang.value;
});
const curActiveLabel = computed(() => {
  return flattedOptionsMap.value[curActive.value]?.label;
});

function findRootParent(option: Option) {
  if (!option.parent) {
    return option;
  }
  return findRootParent(option.parent);
}

function handleSelect(key: string, option: any) {
  // console.log("option :>> ", option);
  let onClick: Option["onClick"];
  if (option.root) {
    store.setCurLanguage(key as any);
    onClick = option.onClick;
  } else {
    const rootParent = findRootParent(flattedOptionsMap.value[option.key]);
    store.setCurLanguage((rootParent.source || rootParent.key) as any);
    onClick = rootParent.onClick;
  }
  onClick?.(key);
}
</script>
<style scoped lang="scss"></style>
