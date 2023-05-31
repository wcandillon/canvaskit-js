import type { Shader } from "canvaskit-wasm";

import { HostObject } from "../HostObject";

export abstract class ShaderJS extends HostObject<Shader> implements Shader {
  constructor() {
    super();
  }

  abstract getTexture(
    width: number,
    height: number
  ): OffscreenCanvas | HTMLCanvasElement;
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
