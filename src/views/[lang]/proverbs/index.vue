<template>
  <HeaderPage title="諺語" show-filter v-model:filter-text="text"></HeaderPage>
  <div v-loading="loading">
    <c-empty :data="filteredData" text="查無相關諺語">
      <MultiColumnVirtualList v-show="!loading" :data="filteredData" :item-size="42" :chunk-size="3" row-class="mb-2 ">
        <template #default="{ text }">
          <RouterLink
            :to="{ path: `/${lang}/search`, query: { keyword: text } }"
            class="text-lg font-bold py-2 hover:bg-slate-100 list-item list-inside"
          >
            {{ text }}
          </RouterLink>
        </template>
      </MultiColumnVirtualList>
    </c-empty>
  </div>
</template>
<script setup lang="ts">
import { $api } from "@/api";
import { useRouteParamsLang } from "@/composable/useLanguage";
import { useSearchFilter } from "@/composable/useSearchFilter";

const { lang } = useRouteParamsLang();
const { data, loading } = await $api.dictionary.getProverbs(lang);

const text = ref("");
const filteredData = computed(() => {
  return useSearchFilter(data.value || [], text.value, (item, _, compareFun) => compareFun(item));
});
</script>
<style scoped lang="scss"></style>
