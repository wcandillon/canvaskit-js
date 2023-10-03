export interface TightBounds {
  computeTightBounds(): Float32Array;
}

export const computeTightBounds = (col: TightBounds[]) => {
  // Initialize with the bounds of the first object
  let [top, left, bottom, right] = col[0].computeTightBounds();

  for (const obj of col) {
    const [currTop, currLeft, currBottom, currRight] = obj.computeTightBounds();

    // Update aggregate bounds
    top = Math.min(top, currTop);
    left = Math.min(left, currLeft);
    bottom = Math.max(bottom, currBottom);
    right = Math.max(right, currRight);
  }

  return Float32Array.of(left, top, right, bottom);
};
