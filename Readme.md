# canvaskit-js

A polyfill for CanvasKit that uses browser APIs.
This project a technical preview and is highly experimental.

## Feature Support

The goal of `canvaskit-js` is to be indistinguishable from `canvaskit-wasm`.
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

The URL of each package version is available on the [Github Releases](https://github.com/wcandillon/canvaskit-js/releases).

```sh
npm install canvaskit-js@https://bit.ly/canvaskit-js_v102
# or
yarn add canvaskit-js@https://bit.ly/canvaskit-js_v102
```

## Getting Started

Once installed, the CanvasKit instance is available via the asynchronous `CanvasKitInit` method. However, it is also accessible synchronously via `CanvasKitJS.getInstance()`.

```tsx
import {CanvasKitInit, CanvasKitJS} from "canvaskit-js";

// The asynchronous method still works
CanvasKitInit({}).then((CanvasKit) => {
    global.CanvasKit = CanvasKit;
});

// But you can also access this synchronously now
global.CanvasKit = CanvasKitJS.getInstance();
```

To create a surface, you can pass an HTML canvas element directly via `MakeCanvasSurface`. However, we also polyfill other surface creation methods such as `MakeWebGLCanvasSurface` or `MakeSWCanvasSurface`. Please note that when using `MakeWebGLCanvasSurface`, we still create a Canvas2D context behind the scenes, not a WebGL one.

```tsx
// MakeWebGLCanvasSurface actually creates a Canvas2D behind the scenes
const surface = CanvasKit.MakeWebGLCanvasSurface(document.getElementById("myCanvas"));
const canvas = surface.getCanvas();
```

From there, the APIs are identical, [except for these differences](#feature-support).

```tsx
const width = 252;
const height = 252;
const r = 92;

const paint = new CanvasKit.Paint();
paint.setBlendMode(CanvasKit.BlendMode.Multiply);

// Cyan Circle
const cyan = paint.copy();
cyan.setColor(CanvasKit.CYAN);
canvas.drawCircle(r, r, r, cyan);
      
// Magenta Circle
const magenta = paint.copy();
magenta.setColor(CanvasKit.MAGENTA);
canvas.drawCircle(width - r, r, r, magenta);

// Yellow Circle
const yellow = paint.copy();
yellow.setColor(CanvasKit.YELLOW);
canvas.drawCircle(width / 2, height - r, r, yellow);
```

### React Native Skia

CanvasKitJS works seamlessly with React Native Skia. However, you need to modify the way CanvasKit is loaded. We simply need to add the CanvasKit instance to the global namespace.

Consider the following React Native Skia loading code:
```tsx
import { LoadSkiaWeb } from "@shopify/react-native-skia/lib/module/web";

LoadSkiaWeb().then(async () => {
  const App = (await import("./src/App")).default;
  AppRegistry.registerComponent("Example", () => App);
});
```

It becomes:

```tsx
import {CanvasKitJS} from "canvaskit-js";

(async () => {
  global.CanvasKit = CanvasKitJS.getInstance();
  const App = (await import("./src/App")).default;
  AppRegistry.registerComponent("Example", () => App);
})();
```

The `useImage` hook from React Native Skia won't work; see [image support](docs/api/image.md).

## Library development

This repository contains three folders:
  * `package/` for the main library
  * `example/` for demos and examples
  * `docs/` for documentation

Here's a list of useful commands for contributing to the project. We use yarn, but these should also work with npm.

In the `package` folder, you can run the following commands:

```sh
cd package
yarn install # installs dependencies
yarn build # builds the library
yarn watch # builds the library on every change
yarn test # runs e2e tests
```

In the example app, you can run the following commands. If you have the `yarn watch` command running in the `package` folder, you will be able to see the changes in real time in the example app.

```
cd example
yarn install
yarn start
```
