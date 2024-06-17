<template>
  <HeaderPage title="部首表"></HeaderPage>
  <div v-loading="loading">
    <c-empty :data="data" text="查無資料">
      <RadicalList
        v-show="!loading"
        :data="(data as RadicalListView)"
        :to="(item:string) => `/${lang}/radicals/${item}`"
      ></RadicalList>
    </c-empty>
  </div>
</template>
<script setup lang="ts">
import { $api } from "@/api";
import { useRouteParamsLang } from "@/composable/useLanguage";
import { RadicalListView } from "@/types/modules/dictionary";

const { lang } = useRouteParamsLang();
const { data, loading } = await $api.dictionary.getRadicals(lang);
</script>
<style scoped lang="scss"></style>
