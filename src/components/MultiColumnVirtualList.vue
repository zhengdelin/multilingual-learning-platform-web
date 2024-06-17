<template>
  <n-virtual-list style="max-height: 75vh" :items="(chunkedData as any)" :item-size="itemSize">
    <template #default="{ item: texts }">
      <slot name="row" :texts="texts">
        <div :key="texts" :class="['row', rowClass]">
          <template v-for="text in texts" :key="text">
            <slot :text="text">{{ text }}</slot>
          </template>
        </div>
      </slot>
    </template>
  </n-virtual-list>
</template>
<script setup lang="ts">
const props = withDefaults(defineProps<{ data: any[]; chunkSize?: number; rowClass?: string; itemSize?: number }>(), {
  chunkSize: 3,
  itemSize: 42,
});

const chunkedData = computed(() => props.data.chunk(props.chunkSize));
</script>
<style scoped lang="scss">
.row {
  display: grid;
  grid-template-columns: repeat(v-bind("chunkSize"), 1fr);
}
</style>
