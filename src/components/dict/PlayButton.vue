<template>
  <n-button :size="'small'" :class="['inline-flex cursor-pointer']" :loading="loading">
    <slot v-if="active" name="active">
      <IconPause class="icon"></IconPause>
    </slot>
    <slot v-else name="inactive">
      <IconStart class="icon" />
    </slot>
  </n-button>
</template>
<script setup lang="ts">
defineProps<{
  active: boolean;
  loading?: boolean;
}>();
</script>
<style scoped lang="scss">
.icon {
  width: 16px;
  height: 16px;
}
</style>
