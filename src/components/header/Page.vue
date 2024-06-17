<template>
  <n-h1 class="border-b">
    <div class="flex items-center gap-4 my-5">
      <slot name="title">
        <span class="flex-none">
          {{ title }}
        </span>
      </slot>
      <div class="flex items-center" v-if="showFilter">
        <n-input placeholder="篩選" v-model:value.lazy="filterText"></n-input>
      </div>
    </div>
  </n-h1>
</template>
<script setup lang="ts">
import { useVModel } from "@/composable/useVModel";

const props = withDefaults(
  defineProps<{
    title?: string;
    showFilter?: boolean;
    filterText?: string;
  }>(),
  {},
);
const emit = defineEmits(["update:filterText"]);
const filterText = useVModel({
  props,
  propName: "filterText",
  emit,
});
</script>
<style scoped lang="scss"></style>
