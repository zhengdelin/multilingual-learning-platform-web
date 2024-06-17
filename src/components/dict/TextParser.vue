<template>
  <slot name="all" :textList="parsedText">
    <template v-for="text in parsedText" :key="text.text">
      <slot :text="text">
        {{ text }}
      </slot>
    </template>
  </slot>
</template>
<script setup lang="ts">
const props = defineProps<{
  text: string;
}>();
type ParsedType = "word" | "punctuation" | "label";
type ParsedTextResult = { type: ParsedType; text: string };
function parseText(text?: string): ParsedTextResult[] {
  if (!text) return [];
  if (text.length === 1) return [{ type: "word", text }];
  //   to ['木本', '植物']
  // console.log("text :>> ", text);
  // text = text.replace("⃝", "");
  const matches = text.match(/(`.*?~)|[^(`.*?~)]/g);
  if (!matches) return [{ type: "word", text }];
  const parsedTexts: ParsedTextResult[] = [];
  for (const match of matches) {
    if (match.startsWith("`") && match.endsWith("~")) {
      parsedTexts.push({
        type: "word",
        text: match.replace(/[`~]/g, ""),
      });
    } else if (match.endsWith("⃝")) {
      parsedTexts[parsedTexts.length - 1].type = "label";
    } else {
      parsedTexts.push({
        type: "punctuation",
        text: match,
      });
    }
  }
  return parsedTexts;
}

const parsedText = computed(() => {
  return parseText(props.text);
});
</script>
<style scoped lang="scss"></style>
