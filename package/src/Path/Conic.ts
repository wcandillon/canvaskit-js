import type { Point } from "canvaskit-wasm";

import { QuadraticPathComponent } from "./PathComponents";

type ConicCurve = {
  p0: Point;
  p1: Point;
  p2: Point;
  w: number;
};

// Utility function to interpolate between two points
const lerp = (a: Point, b: Point, t: number): Point =>
  new Float32Array([a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])]);

// Utility function to get the midpoint of two points
const midPoint = (a: Point, b: Point): Point => lerp(a, b, 0.5);

// Function to split a conic curve into two at the midpoint
const splitCurve = (curve: ConicCurve): [ConicCurve, ConicCurve] => {
  const p01 = midPoint(curve.p0, curve.p1);
  const p12 = midPoint(curve.p1, curve.p2);
  const p0112 = midPoint(p01, p12);

  return [
    {
      p0: curve.p0,
      p1: p01,
      p2: p0112,
      w: curve.w,
    },
    {
      p0: p0112,
      p1: p12,
      p2: curve.p2,
      w: curve.w,
    },
  ];
};

// Function to check if a conic curve can be approximated by a quadratic Bezier
const isCloseEnough = (curve: ConicCurve, tolerance = 0.01): boolean => {
  const dx = curve.p2[0] - curve.p0[0];
  const dy = curve.p2[1] - curve.p0[1];
  const d = Math.abs(
    dx * (curve.p0[1] - curve.p1[1]) - dy * (curve.p0[0] - curve.p1[0])
  );

  return d < tolerance;
};

// Function to convert a conic curve into a quadratic Bezier
const toQuadratic = (curve: ConicCurve) =>
  new QuadraticPathComponent(curve.p0, curve.p1, curve.p2);

// Function to recursively chop a conic curve into quadratic Beziers
const chopCurve = (
  curve: ConicCurve,
  curves: QuadraticPathComponent[] = []
) => {
  if (isCloseEnough(curve)) {
    curves.push(toQuadratic(curve));
  } else {
    const [left, right] = splitCurve(curve);
    chopCurve(left, curves);
    chopCurve(right, curves);
  }

  return curves;
};

export const ConvertConicToQuads = (
  p0: Point,
  p1: Point,
  p2: Point,
  w: number
) => {
  return chopCurve({ p0, p1, p2, w });
};
