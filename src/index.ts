import { CanvasKitLite } from "./CanvasKit";

export * from "./CanvasKit";

if (window) {
  window.CanvasKit = CanvasKitLite.getInstance();
}
