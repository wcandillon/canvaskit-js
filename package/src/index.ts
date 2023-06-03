import type { CanvasKit } from "canvaskit-wasm";

import { CanvasKitJS } from "./CanvasKit";

export * from "./CanvasKit";

declare global {
  interface Window {
    CanvasKit: CanvasKit;
  }
}

if (window) {
  window.CanvasKit = CanvasKitJS.getInstance();
}
