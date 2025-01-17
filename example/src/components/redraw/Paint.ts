import { ColorFactory, type Color } from "./Data";

export enum BlendMode {
  SrcOver, //!< r = s + (1-sa)*d
  Screen, //!< r = s + d - s*d
}

// https://github.com/google/skia/blob/main/src/sksl/sksl_gpu.sksl#L64
export const GPUBlendModes: Record<BlendMode, GPUBlendState> = {
  [BlendMode.SrcOver]: {
    color: {
      operation: "add",
      srcFactor: "one",
      dstFactor: "one-minus-src-alpha",
    },
    alpha: {
      operation: "add",
      srcFactor: "one",
      dstFactor: "one-minus-src-alpha",
    },
  },
  [BlendMode.Screen]: {
    color: {
      operation: "add",
      srcFactor: "one",
      dstFactor: "one-minus-src",
    },
    alpha: {
      operation: "add",
      srcFactor: "one",
      dstFactor: "one-minus-src",
    },
  },
};

export class Paint {
  _color: Color | null = null;
  _alpha = 1;
  blendMode = BlendMode.SrcOver;

  constructor() {}

  set color(color: Float32Array | string) {
    this._color = color instanceof Float32Array ? color : ColorFactory(color);
  }

  get color() {
    return this._color;
  }

  set alpha(alpha: number) {
    this.alpha = alpha;
    if (this.color) {
      this._color[3] = alpha;
    }
  }

  get alpha() {
    return this._alpha;
  }
}
