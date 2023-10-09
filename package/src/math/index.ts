export const mix = (value: number, x: number, y: number) =>
  x * (1 - value) + y * value;

export const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

export const saturate = (value: number) => clamp(value, 0, 1);

export const toDeg = (rad: number) => (rad * 180) / Math.PI;

export const toRad = (deg: number) => (deg * Math.PI) / 180;

export const TAU = 2 * Math.PI;
export const PI_OVER_2 = Math.PI / 2;

export const ARC_APPROXIMATION_MAGIC = 0.551915024494;
