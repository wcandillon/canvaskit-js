import type { Point } from "canvaskit-wasm";

import { dist, vec } from "../../Vector";

import type { PathProperties } from "./PathComponent";

export class Polyline implements PathProperties {
  readonly points: Point[];
  cumulativeLengths: number[];

  constructor(points: Point[]) {
    this.points = points;
    this.cumulativeLengths = this.calculateCumulativeLengths();
  }

  length() {
    return this.cumulativeLengths[this.cumulativeLengths.length - 1];
  }

  getPointAtLength(length: number) {
    const index = this.findIndex(length);

    const previousPoint = this.points[index - 1];
    const currentPoint = this.points[index];
    const segmentLength =
      this.cumulativeLengths[index] - this.cumulativeLengths[index - 1];
    const segmentPosition =
      (length - this.cumulativeLengths[index - 1]) / segmentLength;

    return vec(
      previousPoint[0] + segmentPosition * (currentPoint[0] - previousPoint[0]),
      previousPoint[1] + segmentPosition * (currentPoint[1] - previousPoint[1])
    );
  }

  getTangentAtLength(length: number) {
    const index = this.findIndex(length);

    const previousPoint = this.points[index - 1];
    const currentPoint = this.points[index];

    return derivativeSolve(previousPoint, currentPoint);
  }

  private findIndex(length: number) {
    if (length < 0 || length > this.length()) {
      throw new Error("Length out of bounds");
    }

    const index = this.cumulativeLengths.findIndex((l) => l > length);
    if (index < 0) {
      throw new Error("No point found");
    }
    return index;
  }

  private calculateCumulativeLengths() {
    const cumulativeLengths = [0];
    for (let i = 1; i < this.points.length; i++) {
      const previousPoint = this.points[i - 1];
      const currentPoint = this.points[i];
      const segmentLength = dist(previousPoint, currentPoint);
      cumulativeLengths[i] = cumulativeLengths[i - 1] + segmentLength;
    }
    return cumulativeLengths;
  }
}

export const linearSolve = (t: number, p0: Point, p1: Point) =>
  vec((1 - t) * p0[0] + t * p1[0], (1 - t) * p0[1] + t * p1[1]);

export const derivativeSolve = (p1: Point, p2: Point) => {
  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  const magnitude = Math.hypot(dx, dy);
  return vec(dx / magnitude, dy / magnitude);
};
