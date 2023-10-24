import { QuadraticPathComponent } from "../c2d";

type ConicCurve = {
  p0: DOMPoint;
  p1: DOMPoint;
  p2: DOMPoint;
  w: number;
};

// Utility function to interpolate between two points
const lerp = (a: DOMPoint, b: DOMPoint, t: number): DOMPoint =>
  new DOMPoint(a.x + t * (b.x - a.x), a.y + t * (b.y - a.y));

// Utility function to get the midpoint of two points
const midPoint = (a: DOMPoint, b: DOMPoint): DOMPoint => lerp(a, b, 0.5);

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
  const dx = curve.p2.x - curve.p0.x;
  const dy = curve.p2.y - curve.p0.y;
  const d = Math.abs(
    dx * (curve.p0.y - curve.p1.y) - dy * (curve.p0.x - curve.p1.x)
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
  p0: DOMPoint,
  p1: DOMPoint,
  p2: DOMPoint,
  w: number
) => {
  return chopCurve({ p0, p1, p2, w });
};
