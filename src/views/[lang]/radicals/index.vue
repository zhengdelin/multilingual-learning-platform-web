<template>
  <div>{{ lang }}</div>
</template>
<script setup lang="ts">
const route = useRoute();
const lang = computed(() => route.params.lang as string);
</script>
<style scoped lang="scss"></style>
