# canvaskit-js
A polyfill of CanvasKit that uses browser APIs directly.

This is a technical preview and is highly experimental.
The goal of `canvaskit-js` is to be indistinguishable `canvaskit-wasm`.
However, there are three main differences between the two projects:
* [Image decoding is asynchronous](docs/api/image.md)
* [Shaders are written using the GLSL syntax](docs/api/runtime-effect.md)
* [Not all APIs are supported](docs/api/support.md)

## Browser Support

| Browser     |   | Notes                                  |
|-------------|---|----------------------------------------|
| Chrome      | ✅ |                                        |
| Edge        | ✅ |                                        |
| Firefox     | ✅ | Shaders support in progress            |
| Safari 17   | ⚠️ | No shaders nor image filters available  |
| Safari 17.4 | ✅ | No image filters available             |


## Installation

```sh
npm install [canvaskit-js URL]
# or
yarn install [canvaskit-js URL]
```

## Getting Started

### React Native Skia

## Library development