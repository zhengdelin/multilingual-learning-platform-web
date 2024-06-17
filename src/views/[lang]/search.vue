<template>
  <div v-loading="loading" class="mb-20">
    <c-empty :data="data" text="查無資料">
      <template #default="{ data }">
        <div v-show="!loading">
          <template v-for="polyDef in data.h" :key="polyDef.p">
            <HeaderPage>
              <template #title>
                <div class="font-regular">
                  <DictRubyText
                    :text="data.t"
                    :pinyin="
                      withLanguage({
                        chinese: polyDef.p,
                        minnan: polyDef.T,
                      })
                    "
                    :zhuyin="polyDef.b"
                    :show-text-to-speech="![Language.MINNAN, Language.HAKKA].includes(lang)"
                  ></DictRubyText>
                </div>
              </template>
            </HeaderPage>
            <DictDefinitionsContainer :definitions="polyDef.d"> </DictDefinitionsContainer>
          </template>
          <Suspense :timeout="0">
            <template #fallback>
              <div class="h-[300px] relative">
                <Loading></Loading>
              </div>
            </template>
            <DictTranslation :translation="data.translation" :text="keyword"></DictTranslation>
          </Suspense>
        </div>
      </template>
      <template #empty>
        <HeaderPage :title="keyword" />
        <p class="text-center">查無相關資料</p>
      </template>
    </c-empty>
  </div>
</template>
<script setup lang="ts">
import { $api } from "@/api";
import { useLanguageCondition, useRouteParamsLang } from "@/composable/useLanguage";
import { Language } from "@/types/modules";

// import { computed } from 'vue'

const { lang, route } = useRouteParamsLang();
const keyword = computed(() => route.query.keyword as string);
const { withLanguage } = useLanguageCondition();

const { data, loading } = await $api.dictionary.search(lang, keyword);
</script>
<style scoped lang="scss"></style>
