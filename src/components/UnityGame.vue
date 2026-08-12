<script setup lang="ts">
import { useId, useTemplateRef } from 'vue'
import { useUnityInstance } from '../composables/useUnityInstance'

const props = withDefaults(
  defineProps<{
    loaderUrl?: string
    dataUrl?: string
    frameworkUrl?: string
    codeUrl?: string
    streamingAssetsUrl?: string
    companyName?: string
    productName?: string
    productVersion?: string
    decompressionFallback?: boolean
  }>(),
  {
    loaderUrl: `${import.meta.env.BASE_URL}unity-build/Build.loader.js`,
    dataUrl: `${import.meta.env.BASE_URL}unity-build/Build.data.br`,
    frameworkUrl: `${import.meta.env.BASE_URL}unity-build/Build.framework.js.br`,
    codeUrl: `${import.meta.env.BASE_URL}unity-build/Build.wasm.br`,
    streamingAssetsUrl: `${import.meta.env.BASE_URL}unity-build/StreamingAssets`,
    companyName: 'YourCompany',
    productName: 'YourGame',
    productVersion: '1.0',
    decompressionFallback: true,
  },
)

const canvasId = useId()
const canvasRef = useTemplateRef<HTMLCanvasElement>('canvasEl')

const { status } = useUnityInstance(canvasRef, {
  loaderUrl: props.loaderUrl,
  config: {
    dataUrl: props.dataUrl,
    frameworkUrl: props.frameworkUrl,
    codeUrl: props.codeUrl,
    streamingAssetsUrl: props.streamingAssetsUrl,
    companyName: props.companyName,
    productName: props.productName,
    productVersion: props.productVersion,
    // For browsers that do not support Brotli
    decompressionFallback: props.decompressionFallback,
  },
})
</script>

<template>
  <div class="unity-container">
    <div v-if="status.phase === 'loading'" class="unity-overlay">
      <div class="spinner" />
      <p>Loading… {{ status.progress }}%</p>
    </div>
    <div v-else-if="status.phase === 'error'" class="unity-overlay unity-error">
      <p>{{ status.message }}</p>
    </div>
    <canvas :id="canvasId" ref="canvasEl" class="unity-canvas" tabindex="-1"></canvas>
  </div>
</template>

<style scoped>
.unity-container {
  position: relative;
  width: 100%;
  max-width: 1280px;
  aspect-ratio: 16 / 9;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 12px;
  background: var(--color-surface);
  box-shadow: 0 12px 32px rgb(0 0 0 / 0.3);
}

.unity-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.unity-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: #fff;
  font-size: 0.95rem;
  pointer-events: none;
}

.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid rgb(255 255 255 / 0.2);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.unity-error {
  color: var(--color-danger);
  padding: 1.5rem;
  text-align: center;
}
</style>
