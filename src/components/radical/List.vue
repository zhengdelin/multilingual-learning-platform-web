<template>
  <div>
    <template v-for="(items, idx) in data" :key="idx">
      <div v-if="items?.length" class="flex items-center flex-wrap gap-2 border-b py-2">
        <span class="flex-none p-2 bg-red-700 text-white rounded-1 w-6 h-6 flex items-center justify-center">{{
          idx
        }}</span>
        <div class="flex flex-wrap flex-1">
          <RouterLink
            v-for="item in items"
            :key="item"
            :to="to(item)"
            class="text-lg hover:bg-slate-100 p-1 rounded-1 h-8 w-8 flex justify-center items-center"
            >{{ item }}</RouterLink
          >
        </div>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
import { WordsFromRadicalView } from "@/types/modules/dictionary";
import { RouteLocationRaw } from "vue-router";

withDefaults(
  defineProps<{
    data: WordsFromRadicalView;
    to(item: string): RouteLocationRaw;
  }>(),
  {},
);
</script>
<style scoped lang="scss"></style>
