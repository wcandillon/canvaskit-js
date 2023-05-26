export * from "./Coordinates";

export const mix = (value: number, x: number, y: number) =>
  x * (1 - value) + y * value;

export const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};
