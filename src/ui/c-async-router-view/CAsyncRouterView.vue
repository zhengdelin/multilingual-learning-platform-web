<template>
  <RouterView>
    <template #default="{ Component }">
      <Suspense :timeout="0">
        <component :is="Component"></component>
        <template #fallback>
          <div v-loading></div>
        </template>
      </Suspense>
    </template>
  </RouterView>
</template>

<script setup lang="ts"></script>

<style scoped></style>
