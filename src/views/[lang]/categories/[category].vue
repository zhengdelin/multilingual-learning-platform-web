<template>
  <n-space vertical>
    <HeaderPage :title="category" v-model:filter-text="text" show-filter></HeaderPage>

    <div v-loading="loading">
      <c-empty :data="filteredData" text="查無資料">
        <MultiColumnVirtualList
          v-if="!isTheSameMeaningDifferentWordsPage"
          v-show="!loading"
          :data="filteredData"
          :item-size="42"
          :chunk-size="3"
          row-class="mb-2 "
        >
          <template #default="{ text }">
            <RouterLink
              :to="{ path: `/${lang}/search`, query: { keyword: text } }"
              class="text-lg font-bold py-2 hover:bg-slate-100 list-item list-inside"
            >
              {{ text }}
            </RouterLink>
          </template>
        </MultiColumnVirtualList>
        <template v-else>
          <div class="grid grid-cols-2">
            <DictLabel text="臺"></DictLabel>
            <DictLabel text="陸"></DictLabel>
          </div>
          <MultiColumnVirtualList
            v-show="!loading"
            :data="filteredData"
            :item-size="42"
            :chunk-size="1"
            row-class="mb-2 border-b"
          >
            <template #default="{ text: _text }">
              <div class="grid grid-cols-2">
                <RouterLink
                  v-for="text in getSplittedText(_text)"
                  :key="text"
                  :to="{ path: `/${lang}/search`, query: { keyword: text } }"
                  class="text-lg font-bold py-2 hover:bg-slate-100"
                >
                  {{ text }}
                </RouterLink>
              </div>
            </template>
          </MultiColumnVirtualList>
        </template>
      </c-empty>
    </div>
  </n-space>
</template>
<script setup lang="ts">
import { $api } from "@/api";
import { useRouteParamsLang } from "@/composable/useLanguage";
import { useSearchFilter } from "@/composable/useSearchFilter";

const { route, lang } = useRouteParamsLang();
const category = computed(() => route.params.category as string);

const { data, loading } = await $api.dictionary.getCategory(lang, category);
const text = ref("");
const filteredData = computed(() => {
  return useSearchFilter(data.value || [], text.value, (item, _, compareFun) => compareFun(item));
});

const isTheSameMeaningDifferentWordsPage = computed(() => category.value === "同實異名");

function getSplittedText(text: string) {
  return text.split(";").filter(Boolean);
}
</script>
<style scoped lang="scss"></style>
