import type { Shader } from "canvaskit-wasm";

import { HostObject } from "./HostObject";
import type { RTContext } from "./RuntimeEffect";
import { addFilters, noise } from "./Filters";

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

  getTexture(width: number, height: number) {
    const { gl, canvas } = this.ctx;
    canvas.width = width;
    canvas.height = height;
    this.ctx.children.forEach(({ shader, location, index }) => {
      gl.activeTexture(gl[`TEXTURE${index}` as "TEXTURE0"]);
      // Upload the image into the texture
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        // TODO: remove hardcoding
        shader.getTexture(width, height)
      );
      // Use the texture
      gl.uniform1i(location, index);
    });
    gl.viewport(0, 0, width, height);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    return this.ctx.canvas;
  }
}

export class ColorShader extends ShaderLite {
  private canvas = new OffscreenCanvas(0, 0);
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

export class FractalNoise extends ShaderLite {
  private canvas = new OffscreenCanvas(0, 0);

  private static count = 0;
  private readonly id: string;

  constructor(
    private readonly baseFreqX: number,
    private readonly baseFreqY: number,
    private readonly octaves: number,
    private readonly seed: number,
    private readonly tileW: number,
    private readonly tileH: number
  ) {
    super();
    FractalNoise.count++;
    this.id = `fractal-noise-${FractalNoise.count}`;
  }

  getTexture(width: number, height: number) {
    const { canvas } = this;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d")!;
    const n = noise(
      this.baseFreqX,
      this.baseFreqY,
      this.octaves,
      this.seed,
      this.tileW,
      this.tileH
    );
    addFilters(this.id, n);
    ctx.filter = `url(#${this.id})`;
    ctx.fillStyle = "transparent";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return canvas;
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
