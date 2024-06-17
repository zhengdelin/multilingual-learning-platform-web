<template>
  <n-popover style="width: 100%; max-width: 450px" placement="bottom-end" trigger="manual" :show="isModalShow">
    <template #trigger>
      <n-button v-bind="$attrs" @click="handleClick">
        <IconMicrophone class="icon" />
      </n-button>
    </template>
    <div class="flex items-center gap-2">
      <div class="flex-1 mr-2">....錄音中</div>
      <n-button @click="onPauseButtonClick">
        <IconPause v-if="isRecording" class="icon" />
        <IconStart v-else class="icon" />
      </n-button>
      <n-button @click="onStopRecordClick">
        <IconStop class="icon" />
      </n-button>
    </div>
  </n-popover>
</template>
<script setup lang="ts">
import { $message } from "@/composable/useMessage";

const isModalShow = ref(false);
const mediaRecorder = ref<MediaRecorder | null>();
const isRecording = ref(false);

const getMediaRecorder = (stream?: MediaStream) => {
  if (stream) {
    mediaRecorder.value = new MediaRecorder(stream);
    return mediaRecorder.value;
  }
  return mediaRecorder.value;
};

async function handleClick() {
  if (isModalShow.value) {
    // onStopRecordClick();
    $message.error("錄音中，請先停止錄音。");
    return;
  }
  await onStartRecordClick();
}

async function onStartRecordClick() {
  try {
    const stream = await window.navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    isModalShow.value = true;
    // 錄音
    mediaRecorder.value = new MediaRecorder(stream);
    startRecord();
  } catch {
    $message.error("無法獲取麥克風權限，請至設定中開啟該權限。");
  }
}

function startRecord() {
  const recorder = getMediaRecorder();
  if (!recorder || recorder.state === "recording") {
    return;
  }
  isRecording.value = true;
  recorder.start();
  const audioChunks: BlobPart[] = [];
  recorder.ondataavailable = (e) => {
    console.log("e :>> ", e);
    audioChunks.push(e.data);
  };

  recorder.onstop = () => {
    const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
    const audioUrl = URL.createObjectURL(audioBlob);
    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = "recording.wav";
    a.click();
    isRecording.value = false;
    isModalShow.value = false;
  };

  recorder.onpause = () => {
    isRecording.value = false;
  };

  recorder.onresume = () => {
    isRecording.value = true;
  };
}

function onPauseButtonClick() {
  if (isRecording.value) {
    mediaRecorder.value?.pause();
  } else {
    mediaRecorder.value?.resume();
  }
}

function onStopRecordClick() {
  //   isModalShow.value = false;
  mediaRecorder.value?.stop();
}
</script>
<style scoped lang="scss">
.icon {
  width: 16px;
  height: 16px;
}
</style>
