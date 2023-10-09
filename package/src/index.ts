import type { CanvasKit, CanvasKitInitOptions } from "canvaskit-wasm";

import { CanvasKitJS } from "./CanvasKit";

export * from "./CanvasKit";

declare global {
  interface Window {
    CanvasKit: CanvasKit;
    CanvasKitInit: (opts?: CanvasKitInitOptions) => Promise<CanvasKit>;
  }
}

const CanvasKitInit = () =>
  new Promise((resolve) => resolve(CanvasKitJS.getInstance()));

// eslint-disable-next-line import/no-default-export
export default CanvasKitInit;

// if (window) {
//   window.CanvasKitInit = () =>
//     new Promise((resolve) => resolve(CanvasKitJS.getInstance()));
//   window.CanvasKit = CanvasKitJS.getInstance();
// }
