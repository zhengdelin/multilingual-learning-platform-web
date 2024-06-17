<template>
  <HeaderPage :title="radical + '部'"></HeaderPage>
  <c-empty :data="data" text="查無文字">
    <RadicalList
      :data="(data as WordsFromRadicalView)"
      :loading="loading"
      :to="(item:string) => ({path: `/${lang}/search`, query: {keyword: item}})"
    ></RadicalList>
  </c-empty>
</template>
<script setup lang="ts">
import { $api } from "@/api";
import { useRouteParamsLang } from "@/composable/useLanguage";
import { WordsFromRadicalView } from "@/types/modules/dictionary";

const { route, lang } = useRouteParamsLang();
const radical = computed(() => route.params.radical as string);

const { data, loading } = await $api.dictionary.getRadical(lang, radical);
</script>
<style scoped lang="scss"></style>
