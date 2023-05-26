export type Vector = { x: number; y: number };

export const normalize = (vector: Vector) => {
  const magnitude = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
  return {
    x: vector.x / magnitude,
    y: vector.y / magnitude,
  };
};

export const dot = (vector1: Vector, vector2: Vector) => {
  return vector1.x * vector2.x + vector1.y * vector2.y;
};

export const cross = (vector1: Vector, vector2: Vector) => {
  return vector1.x * vector2.y - vector1.y * vector2.x;
};

export const isFinite = (vector: Vector) => {
  return Number.isFinite(vector.x) && Number.isFinite(vector.y);
};

export const setLength = (vector: Vector, length: number) => {
  const normalizedVector = normalize(vector);
  return {
    x: normalizedVector.x * length,
    y: normalizedVector.y * length,
  };
};
