export const projectPoint = (matrix: DOMMatrix, point: DOMPoint) => {
  const p = new DOMPoint(point.x, point.y, 0, 1).matrixTransform(matrix);
  return new DOMPoint(p.x / p.w, p.y / p.w);
};

export const dist = (p1: DOMPoint, p2: DOMPoint) =>
  Math.hypot(p2.x - p1.x, p2.y - p1.y);

export const vec = (x: number, y: number) => new DOMPoint(x, y);

export const equals = (p1: DOMPoint, p2: DOMPoint) =>
  p1.x === p2.x && p1.y === p2.y;

export const plus = (p1: DOMPoint, p2: DOMPoint) =>
  new DOMPoint(p1.x + p2.x, p1.y + p2.y);

export const minus = (p1: DOMPoint, p2: DOMPoint) =>
  new DOMPoint(p1.x - p2.x, p1.y - p2.y);

export const multiply = (p1: DOMPoint, p2: DOMPoint) =>
  new DOMPoint(p1.x * p2.x, p1.y * p2.y);

export const divide = (p1: DOMPoint, p2: DOMPoint) =>
  new DOMPoint(p1.x / p2.x, p1.y / p2.y);

export const multiplyScalar = (p: DOMPoint, scale: number) =>
  new DOMPoint(p.x * scale, p.y * scale);

export const divideScalar = (p: DOMPoint, d: number) =>
  new DOMPoint(p.x / d, p.y / d);

export const negate = (p: DOMPoint) => new DOMPoint(-p.x, -p.y);

export const dot = (p1: DOMPoint, p2: DOMPoint): number =>
  p1.x * p2.x + p1.y * p2.y;

export const cross = (p1: DOMPoint, p2: DOMPoint): number =>
  p1.x * p2.y - p1.y * p2.x;

export const magnitude = (p: DOMPoint): number =>
  Math.sqrt(p.x * p.x + p.y * p.y);

export const normalize = (p: DOMPoint) => {
  const m = magnitude(p);
  return new DOMPoint(p.x / m, p.y / m);
};

export const angleTo = (p1: DOMPoint, p2: DOMPoint) =>
  Math.atan2(p2.y - p1.y, p2.x - p1.x);
