import { CanvasKitJS } from "./CanvasKit";

export * from "./CanvasKit";

if (window) {
  window.CanvasKit = CanvasKitJS.getInstance();
}
