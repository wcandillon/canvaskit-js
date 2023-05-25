export const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

export const clampColorComp = (c: number) => {
  return Math.round(Math.max(0, Math.min(c || 0, 255)));
};
