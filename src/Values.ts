/* eslint-disable no-bitwise */
import type {
  Color,
  InputColor,
  InputCommands,
  InputIRect,
  InputRRect,
  InputRect,
  MallocObj,
  TypedArray,
} from "canvaskit-wasm";

export type SkiaRenderingContext =
  | CanvasRenderingContext2D
  | OffscreenCanvasRenderingContext2D;

export const vec = (x: number, y: number) => Float32Array.of(x, y);

const clampColorComp = (c: number) => {
  return Math.round(Math.max(0, Math.min(c || 0, 255)));
};

export const IntAsColor = (colorInt: number) => {
  let a = (colorInt >>> 24) & 255;
  let r = (colorInt >>> 16) & 255;
  let g = (colorInt >>> 8) & 255;
  let b = (colorInt >>> 0) & 255;

  //We might convert these to floating point values in the range [0,1] if necessary
  a = a / 255;
  r = r / 255;
  g = g / 255;
  b = b / 255;

  return Float32Array.of(r, g, b, a);
};

export const ColorAsInt = (r: number, g: number, b: number, a = 1) => {
  // default to opaque
  if (a === undefined) {
    a = 255;
  }
  // This is consistent with how Skia represents colors in C++, as an unsigned int.
  // This is also consistent with how Flutter represents colors:
  return (
    ((clampColorComp(a) << 24) |
      (clampColorComp(r) << 16) |
      (clampColorComp(g) << 8) |
      ((clampColorComp(b) << 0) & 0xfffffff)) >>>
    0
  ); // This makes the value an unsigned int.
};

export const NativeColor = (inputColor: InputColor) => {
  let color: Color;
  if (isMalloc(inputColor)) {
    color = inputColor.toTypedArray() as Color;
  } else {
    color = Float32Array.of(...inputColor);
  }
  return `rgba(${[
    Math.round(color[0] * 255),
    Math.round(color[1] * 255),
    Math.round(color[2] * 255),
    color[3],
  ].join(", ")})`;
};

export const uIntColorToCanvasKitColor = (c: number) => {
  return Float32Array.of(
    (c >> 16) & 0xff,
    (c >> 8) & 0xff,
    (c >> 0) & 0xff,
    ((c >> 24) & 0xff) / 255
  );
};

export class MallocObjLite<T extends TypedArray> implements MallocObj {
  byteOffset = 0;

  constructor(private arr: T) {}

  get length(): number {
    return this.arr.length;
  }

  subarray(start: number, end: number): TypedArray {
    return this.arr.subarray(start, end);
  }
  toTypedArray(): TypedArray {
    return this.arr;
  }
}

export const inputCmds = (input: InputCommands) => {
  if (Array.isArray(input)) {
    return input;
  } else if (input instanceof Float32Array) {
    return Array.from(input);
  }
  return Array.from(input.toTypedArray());
};

const isMalloc = (v: unknown): v is MallocObj => {
  return typeof v === "object" && v !== null && "toTypedArray" in v;
};

export const rectToXYWH = (r: InputRect | InputIRect) => {
  const rect = isMalloc(r) ? r.toTypedArray() : r;
  return {
    x: rect[0],
    y: rect[1],
    width: rect[2] - rect[0],
    height: rect[3] - rect[1],
  };
};

export const rrectToXYWH = (r: InputRRect) => {
  const rect = isMalloc(r) ? r.toTypedArray() : r;
  return {
    x: rect[0],
    y: rect[1],
    width: rect[2] - rect[0],
    height: rect[3] - rect[1],
    radii: Array.from(rect.slice(4, 8)),
  };
};

export const normalizeArray = <T>(arr: MallocObj | T | number[]) => {
  if (isMalloc(arr)) {
    return arr.toTypedArray() as T;
  } else if (Array.isArray(arr)) {
    return new Float32Array(arr);
  }
  return arr;
};
