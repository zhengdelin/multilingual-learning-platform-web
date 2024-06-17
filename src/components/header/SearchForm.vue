<template>
  <FormProvider @submit="handleSearch">
    <n-input-group>
      <n-input ref="searchInputRef" placeholder="/" v-model:value="searchText">
        <template #prefix>
          <!-- <n-icon :component="FlashOutline" /> -->
        </template>
      </n-input>
      <n-button type="primary" attr-type="submit">搜尋</n-button>
    </n-input-group>
  </FormProvider>
</template>
<script setup lang="ts">
import { useRouteParamsLang } from "@/composable/useLanguage";

const router = useRouter();
const { lang } = useRouteParamsLang();
const searchText = ref("");
function handleSearch() {
  if (searchText.value) {
    router.push({ path: `/${lang.value}/search`, query: { keyword: searchText.value } });
  }
}

const searchInputRef = ref<HTMLInputElement | null>(null);
onMounted(() => {
  window.addEventListener("keydown", (e) => {
    // key /
    if (e.code === "Slash") {
      e.preventDefault();
      searchInputRef.value?.focus();
    }
  });
});
</script>
<style scoped lang="scss"></style>
