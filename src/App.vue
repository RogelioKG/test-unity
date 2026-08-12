<script setup lang="ts">
import UnityGame from './components/UnityGame.vue'
</script>

<template>
  <main class="page">
    <h1 class="title">Unity Demo</h1>
    <UnityGame />
  </main>
</template>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 2rem 1rem;
}

.title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text);
}
</style>
