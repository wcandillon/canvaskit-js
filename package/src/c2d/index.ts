import type { Paint } from "./Paint";
import type { Path } from "./Path";
import type { Canvas } from "./Canvas";
import type { BlurImageFilter } from "./ImageFilter";
import type { WebGLContext, WebGLShader, LinearGradient } from "./Shader";

export * from "./Canvas";
export * from "./ImageFilter";
export * from "./Paint";
export * from "./Path";
export * from "./Shader";
export * from "./SVG";
export * from "./Constants";
export * from "./Drawable";
export * from "./Math";

declare global {
  interface Window {
    C2D: {
      Canvas: typeof Canvas;
      Path: typeof Path;
      Paint: typeof Paint;
      BlurImageFilter: typeof BlurImageFilter;
      WebGLShader: typeof WebGLShader;
      WebGLContext: typeof WebGLContext;
      LinearGradient: typeof LinearGradient;
    };
  }
}
