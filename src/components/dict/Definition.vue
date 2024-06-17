<template>
  <div class="flex flex-col">
    <div>
      <DictSearchableTextParser :text="definition.f" :marked-text="markedText"> </DictSearchableTextParser>
    </div>
    <div v-for="rawText in definition.e" :key="rawText">
      <DictSearchableTextParser :text="rawText" :marked-text="markedText"> </DictSearchableTextParser>
    </div>
    <div v-for="rawText in definition.q" :key="rawText">
      <DictSearchableTextParser :text="rawText" :marked-text="markedText"> </DictSearchableTextParser>
    </div>
    <div v-if="definition.s" class="flex gap-1 items-center">
      <DictLabel text="似"></DictLabel>
      <div>
        <DictSearchableTextParser :text="definition.s" :marked-text="markedText"> </DictSearchableTextParser>
      </div>
    </div>
    <div v-if="definition.a" class="flex gap-1 items-center">
      <DictLabel text="反"></DictLabel>
      <div>
        <DictSearchableTextParser :text="definition.a" :marked-text="markedText"> </DictSearchableTextParser>
      </div>
    </div>
    <div v-for="rawText in definition.l" :key="rawText">
      <DictSearchableTextParser :text="rawText" :marked-text="markedText"> </DictSearchableTextParser>
    </div>
  </div>
</template>
<script setup lang="ts">
import { DefinitionView } from "@/types/modules/dictionary";

defineProps<{
  definition: DefinitionView;
}>();

const route = useRoute();
const markedText = computed(() => route.query.keyword as string);
</script>
<style scoped lang="scss"></style>
