import type {
  MallocObj,
  TypedArray,
  TypedArrayConstructor,
} from "canvaskit-wasm";

export class MallocObjJS<T extends TypedArray> implements MallocObj {
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

export const isMalloc = (v: unknown): v is MallocObj => {
  return typeof v === "object" && v !== null && "toTypedArray" in v;
};

export const normalizeArray = <T>(
  arr: MallocObj | T | number[],
  Constructor: TypedArrayConstructor = Float32Array
) => {
  if (isMalloc(arr)) {
    return arr.toTypedArray() as T;
  } else if (Array.isArray(arr)) {
    return new Constructor(arr) as T;
  }
  return arr;
};
