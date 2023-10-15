import { dist } from "../Vector";

export type PolylineItem = { t: number; point: DOMPoint };

export class Polyline {
  private readonly cumulativeLengths: number[];

  constructor(readonly items: PolylineItem[]) {
    this.cumulativeLengths = this.calculateCumulativeLengths();
  }

  length() {
    return this.cumulativeLengths[this.cumulativeLengths.length - 1];
  }

  tAtLength(length: number) {
    if (length === 0) {
      return 0;
    } else if (length === this.length()) {
      return 1;
    }
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

  computeTightBounds() {
    if (this.items.length === 0) {
      throw new Error("The polyline has no points to determine bounds.");
    }

    let minX = this.items[0].point.x;
    let minY = this.items[0].point.y;
    let maxX = this.items[0].point.x;
    let maxY = this.items[0].point.y;

    for (const item of this.items) {
      const { x, y } = item.point;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }

    return Float32Array.of(minX, minY, maxX, maxY);
  }
}

const lerp = (t: number, a: number, b: number) => (1 - t) * a + t * b;

export const linearSolve = (t: number, p0: DOMPoint, p1: DOMPoint) =>
  new DOMPoint(lerp(t, p0.x, p1.x), lerp(t, p0.y, p1.y));

export const linearSolveDerivative = (p1: DOMPoint, p2: DOMPoint) => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const magnitude = Math.hypot(dx, dy);
  return new DOMPoint(dx / magnitude, dy / magnitude);
};
