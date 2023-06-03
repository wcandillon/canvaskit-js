export const mix = (value: number, x: number, y: number) =>
  x * (1 - value) + y * value;

export const clamp = (value: number, lowerBound: number, upperBound: number) =>
  Math.min(Math.max(lowerBound, value), upperBound);

export const toDeg = (rad: number) => (rad * 180) / Math.PI;

export const toRad = (deg: number) => (deg * Math.PI) / 180;
