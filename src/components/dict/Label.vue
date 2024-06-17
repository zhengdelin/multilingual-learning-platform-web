<template>
  <span class="text-p1 h-6 w-6 rounded-1 bg-red-800 text-white flex justify-center items-center flex-none">
    <slot>
      {{ text }}
    </slot>
  </span>
</template>
<script setup lang="ts">
defineProps<{ text?: string }>();
</script>
<style scoped lang="scss"></style>
