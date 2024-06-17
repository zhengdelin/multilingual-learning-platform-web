<template>
  <div v-for="(definitions, key) in groupedDefinitions" :key="key" class="mb-4">
    <DictTextParser v-if="key !== 'undefined'" :text="key">
      <template #default="{ text }">
        <DictLabel :text="text.text"></DictLabel>
      </template>
    </DictTextParser>
    <DictDefinitionList :definitions="definitions"></DictDefinitionList>
  </div>
</template>
<script setup lang="ts">
import { DefinitionView } from "@/types/modules/dictionary";

const props = defineProps<{
  definitions: DefinitionView[];
}>();

const groupedDefinitions = computed(() => {
  return props.definitions.groupBy("type");
});
</script>
<style scoped lang="scss"></style>
