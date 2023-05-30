import type { InputColor, Shader } from "canvaskit-wasm";

import { HostObject } from "./HostObject";
import type { SkiaRenderingContext } from "./Values";
import { NativeColor } from "./Values";

export class ShaderLite extends HostObject<Shader> implements Shader {
  constructor(protected readonly ctx: HTMLCanvasElement) {
    super();
  }

  getTexture() {
    return this.ctx;
  }

  // TODO: delete
  shade(ctx: SkiaRenderingContext) {
    return ctx.createPattern(this.ctx, "repeat")!;
  }
}

export class ColorShader extends ShaderLite {
  constructor(color: InputColor) {
    super(document.createElement("canvas"));
    this.ctx.width = 256;
    this.ctx.height = 256;
    this.ctx.getContext("2d")!.fillStyle = NativeColor(color);
    this.ctx.getContext("2d")!.fillRect(0, 0, this.ctx.width, this.ctx.height);
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
