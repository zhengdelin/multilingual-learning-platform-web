<template>
  <DictTextToSpeechProvider :text="text">
    <template #default="{ toggle, isPlaying, loading }">
      <div :class="[{ group: !disabled }]">
        <slot></slot>
        <DictPlayButton
          :class="['opacity-0 group-hover:opacity-100 transition duration-100', { 'opacity-100': isPlaying }]"
          @click="toggle"
          :active="isPlaying"
          :loading="loading"
        ></DictPlayButton>
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
