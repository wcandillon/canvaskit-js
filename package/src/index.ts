import type { CanvasKit, CanvasKitInitOptions } from "canvaskit-wasm";

import { CanvasKitJS } from "./CanvasKit";
import {
  Path,
  Paint,
  Canvas,
  BlurImageFilter,
  Shader,
  ShaderContext,
} from "./c2d";

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
  window.C2D = {
    Path,
    Paint,
    Canvas,
    BlurImageFilter,
    Shader,
    ShaderContext,
  };
}

// eslint-disable-next-line import/no-default-export
export default CanvasKitInit;
