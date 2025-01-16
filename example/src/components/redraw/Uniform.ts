type TypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array;

// class Uniform<T extends Record<string, TypedArray>> {
//   public data: Int8Array;
const getTypeAlignment = (array: TypedArray): number => {
  // Float32Array and Int32Array are 4 bytes
  if (array instanceof Float32Array || array instanceof Int32Array) {
    if (array.length <= 1) {
      return 4;
    } // Single value
    if (array.length <= 4) {
      return 8;
    } // vec2/vec3/vec4
    return 16; // matrices
  }
  // Add other type checks as needed
  return 4; // Default alignment
};

const getAlignedOffset = (offset: number, alignment: number): number => {
  return Math.ceil(offset / alignment) * alignment;
};

export const makeUniform = <T extends Record<keyof T, TypedArray>>(
  uniform: T
) => {
  // First pass: calculate total size with alignment
  let totalSize = 0;
  for (const key in uniform) {
    const value = uniform[key];
    const alignment = getTypeAlignment(value);
    totalSize = getAlignedOffset(totalSize, alignment);
    totalSize += value.byteLength;
  }

  // Round up total size to 16 bytes for uniform buffer requirements
  totalSize = Math.ceil(totalSize / 16) * 16;
  const data = new Uint8Array(totalSize);

  // Second pass: copy data with proper alignment
  let offset = 0;
  for (const key in uniform) {
    const value = uniform[key];
    const alignment = getTypeAlignment(value);
    offset = getAlignedOffset(offset, alignment);

    const view = new Uint8Array(value.buffer);
    data.set(view, offset);
    offset += value.byteLength;
  }

  return data;
};
