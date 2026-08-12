import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

declare global {
  interface Window {
    createUnityInstance?: (
      canvas: HTMLCanvasElement,
      config: Record<string, unknown>,
      onProgress?: (progress: number) => void,
    ) => Promise<UnityInstance>
  }
}

export interface UnityInstance {
  Quit: () => Promise<void>
}

export type UnityLoadStatus =
  | { phase: 'loading'; progress: number }
  | { phase: 'ready' }
  | { phase: 'error'; message: string }

export interface UseUnityInstanceOptions {
  loaderUrl: string
  config: Record<string, unknown>
}

function loadScript(src: string) {
  return new Promise<HTMLScriptElement>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.onload = () => resolve(script)
    script.onerror = () => reject(new Error(`could not load script ${src}`))
    document.body.appendChild(script)
  })
}

export function useUnityInstance(
  canvasRef: Ref<HTMLCanvasElement | null | undefined>,
  options: UseUnityInstanceOptions,
) {
  const status = ref<UnityLoadStatus>({ phase: 'loading', progress: 0 })

  let unityInstance: UnityInstance | null = null
  let loaderScript: HTMLScriptElement | null = null

  onMounted(async () => {
    try {
      loaderScript = await loadScript(options.loaderUrl)

      if (!window.createUnityInstance || !canvasRef.value) {
        throw new Error('createUnityInstance undefined or canvas element not found')
      }

      unityInstance = await window.createUnityInstance(canvasRef.value, options.config, (p) => {
        status.value = { phase: 'loading', progress: Math.round(p * 100) }
      })
      status.value = { phase: 'ready' }
    } catch (err) {
      status.value = { phase: 'error', message: err instanceof Error ? err.message : String(err) }
    }
  })

  onBeforeUnmount(async () => {
    await unityInstance?.Quit().catch(() => {})
    loaderScript?.remove()
  })

  return { status }
}
