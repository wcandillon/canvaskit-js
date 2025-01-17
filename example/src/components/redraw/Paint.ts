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
  private color: Color | null = null;
  private alpha = 1;
  private blendMode = BlendMode.SrcOver;

  constructor() {}

  setColor(color: Float32Array | string) {
    this.color = color instanceof Float32Array ? color : ColorFactory(color);
  }

  getColor() {
    return this.color;
  }

  setAlpha(alpha: number) {
    this.alpha = alpha;
    if (this.color) {
      this.color[3] = alpha;
    }
  }

  getAlpha() {
    return this.alpha;
  }

  setBlendMode(blendMode: BlendMode) {
    this.blendMode = blendMode;
  }

  getBlendMode() {
    return this.blendMode;
  }

  copy() {
    const paint = new Paint();
    paint.color = this.color;
    paint.alpha = this.alpha;
    paint.blendMode = this.blendMode;
    return paint;
  }
}
