import type { Point } from "canvaskit-wasm";

export const quadraticSolve = (
  t: number,
  p0: number,
  p1: number,
  p2: number
) => {
  return (
    (1 - t) * (1 - t) * p0 + //
    2 * (1 - t) * t * p1 + //
    t * t * p2
  );
};

export const getQuadraticArcLength = (
  p1: Point,
  cp: Point,
  p2: Point,
  t: number
) => {
  if (t === undefined) {
    t = 1;
  }
  const ax = p1[0] - 2 * cp[0] + p2[0];
  const ay = p1[1] - 2 * cp[1] + p2[0];
  const bx = 2 * cp[0] - 2 * p1[0];
  const by = 2 * cp[1] - 2 * p1[1];

  const A = 4 * (ax * ax + ay * ay);
  const B = 4 * (ax * bx + ay * by);
  const C = bx * bx + by * by;

  if (A === 0) {
    return (
      t * Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2))
    );
  }
  const b = B / (2 * A);
  const c = C / A;
  const u = t + b;
  const k = c - b * b;

  const uuk = u * u + k > 0 ? Math.sqrt(u * u + k) : 0;
  const bbk = b * b + k > 0 ? Math.sqrt(b * b + k) : 0;
  const term =
    b + Math.sqrt(b * b + k) !== 0 && (u + uuk) / (b + bbk) !== 0
      ? k * Math.log(Math.abs((u + uuk) / (b + bbk)))
      : 0;

  return (Math.sqrt(A) / 2) * (u * uuk - b * bbk + term);
};
