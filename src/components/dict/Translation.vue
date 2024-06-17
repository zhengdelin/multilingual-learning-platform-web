<template>
  <c-empty :data="translations" text="查無翻譯">
    <div v-for="translation in translations" :key="translation.label" class="row">
      <DictLabel :text="translation.label"></DictLabel>
      <component :is="translation.render"></component>
    </div>
    <template #empty>
      <div class="row">查無翻譯</div>
    </template>
  </c-empty>
</template>
<script setup lang="tsx">
import { useXrefTranslate } from "@/composable/useXrefTranslate";
import { Language } from "@/types/modules";
import { PhraseOrWordDefinitionView } from "@/types/modules/dictionary";
import SearchableText from "./SearchableText.vue";
import TextParser from "./TextParser.vue";
const props = defineProps<{
  text: string;
  translation?: PhraseOrWordDefinitionView["translation"];
}>();

const langToChineseMap = {
  Deutsch: "德",
  English: "英",
  francais: "法",
};

const hakkaXrefTranslate = useXrefTranslate(Language.HAKKA);
const minnanXrefTranslate = useXrefTranslate(Language.MINNAN);
await Promise.all([hakkaXrefTranslate.init(), minnanXrefTranslate.init()]);

function getTranslationRender(items: string[], lang: Language) {
  return items.map((t, idx) => {
    return (
      <>
        <SearchableText text={t} toLang={lang}></SearchableText>
        {idx < items.length - 1 ? "、" : ""}
      </>
    );
  });
}

const translations = computed(() => {
  const { translation, text } = props;
  const items: {
    label: string;
    render: () => JSX.Element;
  }[] = [];
  const hakkaTranslation = hakkaXrefTranslate.translate(text);
  const minnanTranslation = minnanXrefTranslate.translate(text);

  if (minnanTranslation?.length) {
    items.push({
      label: "閩",
      render: () => <div>{getTranslationRender(minnanTranslation, Language.MINNAN)}</div>,
    });
  }
  if (hakkaTranslation?.length) {
    items.push({
      label: "客",
      render: () => <div>{getTranslationRender(hakkaTranslation, Language.HAKKA)}</div>,
    });
  }

  if (translation) {
    const order = ["English", "francais", "Deutsch"];
    order.forEach((key) => {
      const value = translation[key as keyof typeof translation];
      if (value) {
        items.push({
          label: langToChineseMap[key as keyof typeof langToChineseMap],
          render: () => (
            <span>
              <TextParser
                text={value.join(" ,")}
                v-slots={{
                  all: ({ textList }: { textList: { text: string }[] }) => <div>{textList.map((i) => i.text)}</div>,
                }}
              ></TextParser>{" "}
            </span>
          ),
        });
      } else {
        //
      }
    });
  }

  return items;
});
</script>
<style scoped lang="scss">
.row {
  @apply flex items-center gap-2 px-2 py-4 border border-b-0 last:border-b;
}
</style>
