import type { EmbindEnumEntity } from "canvaskit-wasm";

export const getBlendMode = (mode: EmbindEnumEntity) => {
  switch (mode.value) {
    case 2:
      return "copy";
    case 3:
      return "source-over";
    case 4:
      return "destination-over";
    case 5:
      return "source-in";
    case 6:
      return "destination-in";
    case 7:
      return "source-out";
    case 8:
      return "destination-out";
    case 9:
      return "source-atop";
    case 10:
      return "destination-atop";
    case 11:
      return "xor";
    case 14:
      return "screen";
    case 15:
      return "overlay";
    case 16:
      return "darken";
    case 17:
      return "lighten";
    case 18:
      return "color-dodge";
    case 19:
      return "color-burn";
    case 20:
      return "hard-light";
    case 21:
      return "soft-light";
    case 22:
      return "difference";
    case 23:
      return "exclusion";
    case 24:
      return "multiply";
    case 25:
      return "hue";
    case 26:
      return "saturation";
    case 27:
      return "color";
    case 28:
      return "luminosity";
    default:
      throw new Error(`Unknown blend mode: ${mode.value}`);
  }
};
