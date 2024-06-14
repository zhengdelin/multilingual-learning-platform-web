<script setup lang="ts">
import MessageContainer from "@/composable/useMessage/components/MessageContainer.vue";
import ModalContainer from "@/composable/useModal/components/ModalContainer.vue";
import { useCorrectVH } from "./composable/useCorrectVH";

onMounted(() => {
  useCorrectVH();
});
</script>

<template>
  <RouterView></RouterView>
  <MessageContainer></MessageContainer>;
  <ModalContainer>
    <template #loading>
      <div v-loading></div>
    </template>
  </ModalContainer>
</template>

<style></style>
