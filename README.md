# test-unity

Vue 3 + Vite project embedding a Unity WebGL build.

## Unity WebGL Integration

Place these four files in `public/unity-build/` (no `index.html` / `TemplateData/` needed — the Vue app has its own loading screen in `src/components/UnityGame.vue`):

```
public/
├── favicon.svg
└── unity-build/
    ├── Build.data.br
    ├── Build.framework.js.br
    ├── Build.loader.js
    └── Build.wasm.br
```

`UnityGame.vue` loads `Build.loader.js` on mount and calls `createUnityInstance` to render into a `<canvas>`.

### Brotli compression

- Best: server sets `Content-Encoding: br` (needs Nginx/CDN config; `vite dev` handles this automatically).
- Fallback: `decompressionFallback: true` (currently on by default in `UnityGame.vue`) — decompresses in-browser, no server config needed, slightly more CPU.

### StreamingAssets

If used, place in `public/unity-build/StreamingAssets/` (already set as `streamingAssetsUrl`).

## Why `public/`?

`public/` bypasses Vite's build pipeline — required because:
- Unity's loader fetches hardcoded filenames; Vite would hash them under `src/` and break loading.
- `.br`/`.wasm` aren't JS modules — importing from `src/` would confuse Vite's bundler.
- Paths must stay identical between dev and build; `public/` guarantees that.