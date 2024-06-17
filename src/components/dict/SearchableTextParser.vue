<template>
  <DictTextParser :text="text">
    <template #default="{ text }">
      <span v-if="text.type === 'label'" class="inline-block mr-1 align-top">
        <DictLabel :text="text.text"></DictLabel>
      </span>
      <DictSearchableText
        v-else
        class="text-lg"
        :text="text.text"
        :disabled="text.type === 'punctuation'"
        v-bind="searchableTextProps"
        :marked-text="markedText"
      ></DictSearchableText>
    </template>
  </DictTextParser>
</template>
<script setup lang="ts">
defineProps<{ text: string; searchableTextProps?: Record<string, any>; markedText?: MaybeArray<string> }>();
</script>
<style scoped lang="scss"></style>
