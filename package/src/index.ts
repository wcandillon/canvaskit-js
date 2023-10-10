import type { CanvasKit, CanvasKitInitOptions } from "canvaskit-wasm";

import { CanvasKitJS } from "./CanvasKit";

export * from "./CanvasKit";

declare global {
  interface Window {
    CanvasKit: CanvasKit;
    CanvasKitJS: CanvasKit;
    CanvasKitInit: (opts?: CanvasKitInitOptions) => Promise<CanvasKit>;
  }
}

const CanvasKitInit = () =>
  new Promise((resolve) => resolve(CanvasKitJS.getInstance()));

if (window) {
  window.CanvasKitJS = CanvasKitJS.getInstance();
}

// eslint-disable-next-line import/no-default-export
export default CanvasKitInit;
