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
