import type { Color } from "canvaskit-wasm";

export const NativeColor = (color: Color) => {
  return `rgba(${[
    color[0] * 255,
    color[1] * 255,
    color[2] * 255,
    color[3],
  ].join(", ")})`;
};
