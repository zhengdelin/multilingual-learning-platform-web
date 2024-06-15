<template>
  <form @submit.prevent="emit('submit')">
    <slot></slot>
  </form>
</template>
<script setup lang="ts">
const emit = defineEmits(["submit"]);
</script>
<style scoped lang="scss"></style>
