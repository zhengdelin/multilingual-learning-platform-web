<template>
  <n-popover style="width: 100%; max-width: 450px" placement="bottom-end" trigger="manual" :show="isModalShow">
    <template #trigger>
      <n-button v-bind="$attrs" @click="handleClick">
        <IconMicrophone class="icon" />
      </n-button>
    </template>
    <div v-if="!isRecordFinish" class="flex items-center gap-2">
      <div class="flex-1 mr-2">....錄音中</div>
      <!-- <n-button @click="onPauseButtonClick">
        <IconPause v-if="isRecording" class="icon" />
        <IconStart v-else class="icon" />
      </n-button> -->
      <n-button @click="onStopRecordClick">
        <IconStop class="icon" />
      </n-button>
    </div>
    <div class="flex flex-col gap-2" v-else>
      <audio :src="audioSrc" controls></audio>
      <div class="flex justify-end items-center gap-2">
        <n-button @click="onReRecordClick">重新錄製</n-button>
        <n-button @click="handleUpload" :loading="uploadLoading">確認上傳</n-button>
      </div>
    </div>
  </n-popover>
</template>
<script setup lang="ts">
import { $api } from "@/api";
import { useRouteParamsLang } from "@/composable/useLanguage";
import { useLoading } from "@/composable/useLoading";
import { $message } from "@/composable/useMessage";

const emit = defineEmits<{
  recordSuccess: [text: string];
}>();

const { lang } = useRouteParamsLang();

const isModalShow = ref(false);
const isRecording = ref(false);
const isRecordFinish = ref(false);
const audioSrc = ref("");
const audioBlob = ref<Blob>();

const stopRecord = ref<() => void>(() => {});

function init() {
  stopRecord.value = () => {};
  isRecording.value = false;
  isRecordFinish.value = false;
  audioSrc.value = "";
  audioBlob.value = undefined;
}

async function handleClick() {
  if (isRecording.value) {
    // onStopRecordClick();
    $message.error("錄音中，請先停止錄音。");
    return;
  }
  if (isModalShow.value) {
    isModalShow.value = false;
    return;
  }
  await onStartRecordClick();
}

async function onStartRecordClick() {
  init();
  try {
    const stream = await window.navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    isModalShow.value = true;
    // 錄音
    startRecord(stream);
  } catch {
    $message.error("無法獲取麥克風權限，請至設定中開啟該權限。");
  }
}

function startRecord(mediaStream: MediaStream) {
  const { stopRecord: handleStopRecord } = _startRecord(mediaStream);
  stopRecord.value = handleStopRecord;
}

function _startRecord(mediaStream: MediaStream) {
  isRecording.value = true;
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const mediaNode = audioContext.createMediaStreamSource(mediaStream);

  // 創建一個jsNode
  const jsNode = createJSNode(audioContext);

  // 需要连到扬声器消费掉outputBuffer，process回调才能触发
  // 并且由于不给outputBuffer设置内容，所以扬声器不会播放出声音
  jsNode.connect(audioContext.destination);
  const leftDataList: any[] = [],
    rightDataList: any[] = [];
  jsNode.onaudioprocess = (event) => {
    let audioBuffer = event.inputBuffer;
    let leftChannelData = audioBuffer.getChannelData(0),
      rightChannelData = audioBuffer.getChannelData(1);
    // console.log(leftChannelData, rightChannelData);
    leftDataList.push(leftChannelData.slice(0));
    rightDataList.push(rightChannelData.slice(0));
  };
  // 把mediaNode连接到jsNode
  mediaNode.connect(jsNode);

  function createJSNode(audioContext: AudioContext) {
    const BUFFER_SIZE = 4096;
    const INPUT_CHANNEL_COUNT = 2;
    const OUTPUT_CHANNEL_COUNT = 2;

    return audioContext.createScriptProcessor(BUFFER_SIZE, INPUT_CHANNEL_COUNT, OUTPUT_CHANNEL_COUNT);
  }

  function stopRecord() {
    let leftData = mergeArray(leftDataList),
      rightData = mergeArray(rightDataList);

    const allData = interleaveLeftAndRight(leftData, rightData);
    const wavBuffer = createWavFile(allData);

    const blob = new Blob([wavBuffer], { type: "audio/wav" });
    audioBlob.value = blob;
    const url = URL.createObjectURL(blob);
    audioSrc.value = url;
    // const a = document.createElement("a");
    // a.href = url;
    // a.download = "recording.wav";
    // a.click();
    isRecording.value = false;
    isRecordFinish.value = true;

    // 停止录音
    mediaStream.getAudioTracks()[0].stop();
    mediaNode.disconnect();
    jsNode.disconnect();
  }

  // 交叉合并左右声道的数据
  function interleaveLeftAndRight(left: any, right: any) {
    let totalLength = left.length + right.length;
    let data = new Float32Array(totalLength);
    for (let i = 0; i < left.length; i++) {
      let k = i * 2;
      data[k] = left[i];
      data[k + 1] = right[i];
    }
    return data;
  }

  function mergeArray(list: any[]) {
    let length = list.length * list[0].length;
    let data = new Float32Array(length),
      offset = 0;
    for (let i = 0; i < list.length; i++) {
      data.set(list[i], offset);
      offset += list[i].length;
    }
    return data;
  }

  function createWavFile(audioData: any) {
    const WAV_HEAD_SIZE = 44;
    let buffer = new ArrayBuffer(audioData.length * 2 + WAV_HEAD_SIZE),
      // 需要用一个view来操控buffer
      view = new DataView(buffer);
    // 写入wav头部信息
    // RIFF chunk descriptor/identifier
    writeUTFBytes(view, 0, "RIFF");
    // RIFF chunk length
    view.setUint32(4, 44 + audioData.length * 2, true);
    // RIFF type
    writeUTFBytes(view, 8, "WAVE");
    // format chunk identifier
    // FMT sub-chunk
    writeUTFBytes(view, 12, "fmt ");
    // format chunk length
    view.setUint32(16, 16, true);
    // sample format (raw)
    view.setUint16(20, 1, true);
    // stereo (2 channels)
    view.setUint16(22, 2, true);
    // sample rate
    view.setUint32(24, 44100, true);
    // byte rate (sample rate * block align)
    view.setUint32(28, 44100 * 2, true);
    // block align (channel count * bytes per sample)
    view.setUint16(32, 2 * 2, true);
    // bits per sample
    view.setUint16(34, 16, true);
    // data sub-chunk
    // data chunk identifier
    writeUTFBytes(view, 36, "data");
    // data chunk length
    view.setUint32(40, audioData.length * 2, true);

    // 写入PCM数据
    let length = audioData.length;
    let index = 44;
    let volume = 1;
    for (let i = 0; i < length; i++) {
      view.setInt16(index, audioData[i] * (0x7fff * volume), true);
      index += 2;
    }
    return buffer;
  }
  function writeUTFBytes(view: any, offset: any, string: any) {
    var lng = string.length;
    for (var i = 0; i < lng; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  return {
    stopRecord,
  };
}

// function onPauseButtonClick() {
//   if (isRecording.value) {
//     mediaRecorder.value?.pause();
//   } else {
//     mediaRecorder.value?.resume();
//   }
// }

function onStopRecordClick() {
  //   isModalShow.value = false;
  // mediaRecorder.value?.stop();
  stopRecord.value();
}

function onReRecordClick() {
  onStartRecordClick();
}

const { loading: uploadLoading, execute: executeUploadLoading } = useLoading();

async function handleUpload() {
  if (!audioBlob.value) {
    return;
  }
  const data = await executeUploadLoading(() => $api.speechToText.transform(lang.value, audioBlob.value as Blob));
  if (!data.data.value) {
    $message.error("識別失敗");
  } else {
    emit("recordSuccess", data.data.value);
  }
  isModalShow.value = false;
}
</script>
<style scoped lang="scss">
.icon {
  width: 16px;
  height: 16px;
}
</style>
