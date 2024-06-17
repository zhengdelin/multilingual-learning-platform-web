<template>
  <span v-if="disabled" v-bind="$attrs" :class="['text', markedClass]">
    <slot :text="text">{{ text }}</slot>
  </span>
  <RouterLink
    v-bind="$attrs"
    v-else
    :to="{ path: `/${toLang}/search`, query: { keyword: text } }"
    :class="['text', markedClass]"
  >
    <slot :text="text">
      {{ text }}
    </slot>
  </RouterLink>
</template>
<script setup lang="ts">
import { useRouteParamsLang } from "@/composable/useLanguage";
import { Language } from "@/types/modules";
const props = defineProps<{
  text: string;
  disabled?: boolean;
  markedText?: MaybeArray<string>;
  toLang?: Language;
}>();

const { lang } = useRouteParamsLang();

const toLang = computed(() => props.toLang || lang.value);
const markedClass = computed(() => {
  const markedText = Array.isArray(props.markedText) ? props.markedText : [props.markedText];
  if (markedText.includes(props.text)) {
    return "marked";
  }
  return "";
});
</script>
<style scoped lang="scss">
.text {
  @apply hover:bg-slate-100 border border-transparent hover:border-cyan-300;
  &.marked {
    @apply underline font-bold;
  }
}
</style>
