import type { Point } from "canvaskit-wasm";

export const vec = (x: number, y: number) => Float32Array.of(x, y);
export type Vector = Point;
