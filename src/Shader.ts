import type { Shader } from "canvaskit-wasm";

import { HostObject } from "./HostObject";
import type { RTContext } from "./RuntimeEffect";

export abstract class ShaderLite extends HostObject<Shader> implements Shader {
  constructor() {
    super();
  }

  abstract getTexture(width: number, height: number): OffscreenCanvas;
}

export class RuntimeEffectShader extends ShaderLite {
  constructor(private readonly ctx: RTContext) {
    super();
  }

  // TODO: only have getTexture and delete shade
  getTexture(width: number, height: number) {
    const { gl, canvas } = this.ctx;
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    return this.ctx.canvas;
  }
}

export class ColorShader extends ShaderLite {
  private canvas = new OffscreenCanvas(300, 150);
  constructor(private readonly color: string) {
    super();
  }

  getTexture(width: number, height: number) {
    const { canvas } = this;
    canvas.width = width;
    canvas.height = height;
    const ctx2d = canvas.getContext("2d")!;
    ctx2d.fillStyle = this.color;
    ctx2d.fillRect(0, 0, canvas.width, canvas.height);
    return this.canvas;
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
