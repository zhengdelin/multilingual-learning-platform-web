<template>
  <ul class="list-decimal pl-8 text-base">
    <li :class="['border-b py-1', liClass]" v-for="def in definitions" :key="def.f">
      <DictDefinition :definition="def"> </DictDefinition>
    </li>
  </ul>
</template>
<script setup lang="ts">
import { DefinitionView } from "@/types/modules/dictionary";
defineProps<{
  definitions: DefinitionView[];
  liClass?: string;
}>();
</script>
<style scoped lang="scss"></style>
