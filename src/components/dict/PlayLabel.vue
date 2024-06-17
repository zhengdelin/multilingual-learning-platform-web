<template>
  <DictLabel :class="['inline-flex cursor-pointer']">
    <slot v-if="active" name="active">
      <IconPause class="icon"></IconPause>
    </slot>
    <slot v-else name="inactive">
      <IconStart class="icon" />
    </slot>
  </DictLabel>
</template>
<script setup lang="ts">
defineProps<{
  active: boolean;
}>();
</script>
<style scoped lang="scss">
.icon {
  width: 16px;
  height: 16px;
}
</style>
