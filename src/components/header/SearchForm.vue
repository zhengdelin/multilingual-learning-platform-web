<template>
  <FormProvider @submit="handleSearch">
    <n-input-group>
      <!-- <n-select ref="searchInputRef" filterable placeholder="/" :options="options" @update:value="onSelectChange">
        <template #empty> 查無資料 </template>
      </n-select> -->
      <n-input ref="searchInputRef" placeholder="/" v-model:value="searchText"></n-input>
      <InputRecord @record-success="handleRecordSuccess" />
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

// function onSelectChange(text: string) {
//   searchText.value = text;
//   handleSearch();
// }

// const store = computed(() => useStoreByLanguage(lang.value));
// const entries = computed(() => store.value?.entries || []);
// const getData = () => store.value?.getEntries();
// getData();
// const options = computed(() => entries.value.map((i) => ({ label: i, value: i })));

// watch(lang, () => {
//   getData();
// });

function handleRecordSuccess(text: string) {
  searchText.value = text;
}

const searchInputRef = ref(null as any);
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
