import type { Point } from "canvaskit-wasm";

import { dist, vec } from "../../Vector";

export type LinearLUTItem = { t: number; point: Point };

export interface LUT {
  tAtLength(length: number): number;
  length(): number;
}

export class LinearLUT implements LUT {
  private readonly cumulativeLengths: number[];

  constructor(private readonly items: LinearLUTItem[]) {
    this.cumulativeLengths = this.calculateCumulativeLengths();
  }

  length() {
    return this.cumulativeLengths[this.cumulativeLengths.length - 1];
  }

  tAtLength(length: number) {
    const index = this.findIndex(length);
    if (index === -1) {
      throw new Error(`Index not found for length ${length}`);
    }
    const prev = this.items[index - 1].t;
    const next = this.items[index].t;
    const l1 = this.cumulativeLengths[index - 1];
    const l2 = this.cumulativeLengths[index];
    return lerp((length - l1) / (l2 - l1), prev, next);
  }

  private findIndex(length: number): number {
    if (length < 0 || length > this.length()) {
      throw new Error(`Length out of bounds ${length} - ${this.length()}`);
    } else if (length === this.length()) {
      return this.cumulativeLengths.length - 1;
    }

    const index = this.cumulativeLengths.findIndex((l) => l > length);
    return index;
  }

  private calculateCumulativeLengths(): number[] {
    const cumulativeLengths: number[] = [0];
    for (let i = 1; i < this.items.length; i++) {
      const previousItem = this.items[i - 1];
      const currentItem = this.items[i];
      const segmentLength = dist(currentItem.point, previousItem.point);
      cumulativeLengths[i] = cumulativeLengths[i - 1] + segmentLength;
    }
    return cumulativeLengths;
  }
}

const lerp = (t: number, a: number, b: number) => (1 - t) * a + t * b;

export const linearSolve = (t: number, p0: Point, p1: Point) =>
  vec(lerp(t, p0[0], p1[0]), lerp(t, p0[1], p1[1]));

export const linearSolveDerivative = (p1: Point, p2: Point) => {
  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  const magnitude = Math.hypot(dx, dy);
  return vec(dx / magnitude, dy / magnitude);
};
