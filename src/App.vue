<script setup lang="ts">
import MessageContainer from "@/composable/useMessage/components/MessageContainer.vue";
import ModalContainer from "@/composable/useModal/components/ModalContainer.vue";
import { useCorrectVH } from "./composable/useCorrectVH";

onMounted(() => {
  useCorrectVH();
});
</script>

<template>
  <n-layout class="h-screen" content-class="flex flex-col">
    <HeaderBase></HeaderBase>
    <!-- <n-layout class="flex-1" has-sider> -->
    <!-- <AsideBase></AsideBase> -->
    <n-layout-content>
      <router-view></router-view>
    </n-layout-content>
    <!-- </n-layout> -->
  </n-layout>

  <MessageContainer></MessageContainer>
  <ModalContainer>
    <template #loading>
      <div v-loading></div>
    </template>
  </ModalContainer>
</template>

<style></style>
