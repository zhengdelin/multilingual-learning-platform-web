<template>
  <FormProvider @submit="handleSearch">
    <n-input-group>
      <n-input placeholder="搜尋..." v-model:value="searchText">
        <template #prefix>
          <!-- <n-icon :component="FlashOutline" /> -->
        </template>
      </n-input>
      <n-button type="primary" attr-type="submit">搜尋</n-button>
    </n-input-group>
  </FormProvider>
</template>
<script setup lang="ts">
const router = useRouter();
const searchText = ref("");
function handleSearch() {
  if (searchText.value) {
    router.push({ path: "/search", query: { keyword: searchText.value } });
  }
}
</script>
<style scoped lang="scss"></style>
