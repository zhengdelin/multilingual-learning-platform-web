<template>
  <slot :isPlaying="isPlaying" :play="onPlayClick" :pause="pause" :toggle="handleClick">
    <DictPlayLabel v-bind="$attrs" @click="handleClick" :active="isPlaying"></DictPlayLabel>
  </slot>
</template>
<script setup lang="ts">
import { $api } from "@/api";
import { debounce } from "@/composable/useDebounceThrottle";
import { useRouteParamsLang } from "@/composable/useLanguage";

const props = defineProps<{
  text: string;
}>();

const { lang } = useRouteParamsLang();

const isPlaying = ref(false);
const audioURL = ref("");
const audioEl = ref<HTMLAudioElement>();
const handleClick = debounce(
  async (_: Event) => {
    if (isPlaying.value) {
      pause();
    } else {
      await onPlayClick();
    }
  },
  {
    delay: 200,
    immediately: true,
  },
);

function pause() {
  isPlaying.value = false;
  audioEl.value?.pause();
}

async function onPlayClick() {
  if (audioURL.value) {
    if (audioEl.value) {
      play();
    } else {
      createAudio();
      play();
    }
    return;
  }
  const { data } = await $api.textToSpeech.transform(lang.value, props.text);
  if (typeof data.value === "string") {
    audioURL.value = data.value;
    createAudio();
    play();
  }
}

function play() {
  if (!audioEl.value) {
    return;
  }
  isPlaying.value = true;
  audioEl.value?.play();
}

function createAudio() {
  if (audioEl.value) {
    return;
  }
  const audio = new Audio(audioURL.value);
  audioEl.value = audio;
  audioEl.value?.addEventListener("ended", () => {
    pause();
  });
}
</script>
<style scoped lang="scss"></style>
