import type { EmbindEnumEntity } from "canvaskit-wasm";

export const nativeBlendMode = (
  mode: EmbindEnumEntity
): GlobalCompositeOperation => {
  const blendModesMap: Record<number, GlobalCompositeOperation> = {
    0: "copy", // Clear
    1: "copy", // Src
    2: "destination-over", // Dst
    3: "source-over", // SrcOver
    4: "destination-over", // DstOver
    5: "source-in", // SrcIn
    6: "destination-in", // DstIn
    7: "source-out", // SrcOut
    8: "destination-out", // DstOut
    9: "source-atop", // SrcATop
    10: "destination-atop", // DstATop
    11: "xor", // Xor
    12: "lighter", // Plus
    13: "multiply", // Modulate (closest match)
    14: "screen", // Screen
    15: "overlay", // Overlay
    16: "darken", // Darken
    17: "lighten", // Lighten
    18: "color-dodge", // ColorDodge
    19: "color-burn", // ColorBurn
    20: "hard-light", // HardLight
    21: "soft-light", // SoftLight
    22: "difference", // Difference
    23: "exclusion", // Exclusion
    24: "multiply", // Multiply
    25: "hue", // Hue
    26: "saturation", // Saturation
    27: "color", // Color
    28: "luminosity", // Luminosity
  };
  const val = blendModesMap[mode.value];
  if (val === undefined) {
    throw new Error(`Unknown blend mode: ${mode}`);
  }
  return val;
};
