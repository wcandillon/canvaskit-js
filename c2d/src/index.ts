import { Paint } from "./Paint";
import { Path } from "./Path";
import { Canvas } from "./Canvas";
import { BlurImageFilter } from "./ImageFilter";
import { makeShader } from "./Shader/GLSL";
import { GLSLShader } from "./Shader";

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
      GLSLShader: typeof GLSLShader;
      makeShader: typeof makeShader;
    };
  }
}

window.C2D = {
  Path,
  Paint,
  Canvas,
  BlurImageFilter,
  GLSLShader,
  makeShader,
};
