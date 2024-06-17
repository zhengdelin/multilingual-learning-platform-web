<template>
  <DictTextToSpeechProvider :text="text">
    <template #default="{ toggle, isPlaying }">
      <div :class="[{ group: !disabled }]">
        <slot></slot>
        <DictPlayLabel
          :class="['opacity-0 group-hover:opacity-100 transition duration-100', { 'opacity-100': isPlaying }]"
          @click="toggle"
          :active="isPlaying"
        ></DictPlayLabel>
      </div>
    </template>
  </DictTextToSpeechProvider>
</template>
<script setup lang="ts">
defineProps<{
  text: string;
  disabled?: boolean;
}>();
</script>
<style scoped lang="scss"></style>
