import type { CanvasKit, CanvasKitInitOptions } from "canvaskit-wasm";

import { CanvasKitJS } from "./CanvasKit";
import { LinearGradient } from "./c2d/Shader";
import {
  Path,
  Paint,
  Canvas,
  BlurImageFilter,
  WebGLShader,
  ShaderContext,
  TextureShaderContext,
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
    WebGLShader,
    ShaderContext,
    TextureShaderContext,
    LinearGradient,
  };
}

// eslint-disable-next-line import/no-default-export
export default CanvasKitInit;
