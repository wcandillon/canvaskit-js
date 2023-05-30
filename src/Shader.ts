import type { Shader } from "canvaskit-wasm";

import { HostObject } from "./HostObject";
import type { SkiaRenderingContext } from "./Values";
import type { RTContext } from "./RuntimeEffect";

export abstract class ShaderLite extends HostObject<Shader> implements Shader {
  constructor() {
    super();
  }

  // TODO: Should it be offscreen canvas?
  abstract getTexture(): OffscreenCanvas;
  abstract shade(ctx: SkiaRenderingContext): CanvasPattern;
}

export class RuntimeEffectShader extends ShaderLite {
  constructor(private readonly ctx: RTContext) {
    super();
  }

  // TODO: only have getTexture and delete shade
  getTexture() {
    return this.ctx.canvas;
  }

  shade(ctx: SkiaRenderingContext) {
    const { gl, canvas } = this.ctx;
    canvas.width = ctx.canvas.width;
    canvas.height = ctx.canvas.height;
    gl.viewport(0, 0, ctx.canvas.width, ctx.canvas.height);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    return ctx.createPattern(canvas, "no-repeat")!;
  }
}

export class ColorShader extends ShaderLite {
  private canvas = new OffscreenCanvas(300, 150);
  constructor(private readonly color: string) {
    super();
  }

  getTexture() {
    const { canvas } = this;
    canvas.width = 256;
    canvas.height = 256;
    const ctx2d = canvas.getContext("2d")!;
    ctx2d.fillStyle = this.color;
    ctx2d.fillRect(0, 0, canvas.width, canvas.height);
    return this.canvas;
  }

  shade(ctx: SkiaRenderingContext) {
    const { canvas } = this;
    canvas.width = ctx.canvas.width;
    canvas.height = ctx.canvas.height;
    const ctx2d = canvas.getContext("2d")!;
    ctx2d.fillStyle = this.color;
    ctx2d.fillRect(0, 0, canvas.width, canvas.height);
    return ctx.createPattern(canvas, "no-repeat")!;
  }
}

// const normalizeInputColorArray = (input: InputFlexibleColorArray) => {
//   if (input instanceof Float32Array || input instanceof Uint32Array) {
//     const colors: Color[] = [];
//     for (let i = 0; i < input.length; i += 4) {
//       const result = input.subarray(i, i + 4);
//       if (result instanceof Float32Array) {
//         colors.push(result);
//       } else {
//         colors.push(
//           ...Array.from(result).map((c) => uIntColorToCanvasKitColor(c))
//         );
//       }
//     }
//     return colors;
//   } else {
//     return input;
//   }
// };
