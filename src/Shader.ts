import type { Shader } from "canvaskit-wasm";

import { HostObject } from "./HostObject";
import type { SkiaRenderingContext } from "./Values";

export class ShaderLite extends HostObject<Shader> implements Shader {
  constructor(private readonly ctx: HTMLCanvasElement) {
    super();
  }

  shade(ctx: SkiaRenderingContext) {
    return ctx.createPattern(this.ctx, "repeat")!;
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
