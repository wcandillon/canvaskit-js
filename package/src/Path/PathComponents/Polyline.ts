type Point = Float32Array;

export class Polyline {
  readonly points: Point[];
  cumulativeLengths: number[];

  constructor(points: Point[]) {
    this.points = points;
    this.cumulativeLengths = this.calculateCumulativeLengths();
  }

  calculateCumulativeLengths(): number[] {
    const cumulativeLengths = [0];
    for (let i = 1; i < this.points.length; i++) {
      const previousPoint = this.points[i - 1];
      const currentPoint = this.points[i];
      const segmentLength = Math.sqrt(
        Math.pow(currentPoint[0] - previousPoint[0], 2) +
          Math.pow(currentPoint[1] - previousPoint[1], 2)
      );
      cumulativeLengths[i] = cumulativeLengths[i - 1] + segmentLength;
    }
    return cumulativeLengths;
  }

  getPointAtLength(length: number): Point | null {
    if (
      length < 0 ||
      length > this.cumulativeLengths[this.cumulativeLengths.length - 1]
    ) {
      return null;
    }

    const index = this.cumulativeLengths.findIndex((l) => l > length);
    if (index < 0) {
      return null;
    }

    const previousPoint = this.points[index - 1];
    const currentPoint = this.points[index];
    const segmentLength =
      this.cumulativeLengths[index] - this.cumulativeLengths[index - 1];
    const segmentPosition =
      (length - this.cumulativeLengths[index - 1]) / segmentLength;

    return new Float32Array([
      previousPoint[0] + segmentPosition * (currentPoint[0] - previousPoint[0]),
      previousPoint[1] + segmentPosition * (currentPoint[1] - previousPoint[1]),
    ]);
  }

  getTangentAtLength(length: number): Point | null {
    if (
      length < 0 ||
      length > this.cumulativeLengths[this.cumulativeLengths.length - 1]
    ) {
      return null;
    }

    const index = this.cumulativeLengths.findIndex((l) => l > length);
    if (index < 0) {
      return null;
    }

    const previousPoint = this.points[index - 1];
    const currentPoint = this.points[index];

    // Calculate the normalized direction vector
    let dx = currentPoint[0] - previousPoint[0];
    let dy = currentPoint[1] - previousPoint[1];
    const mag = Math.sqrt(dx * dx + dy * dy);
    dx /= mag;
    dy /= mag;

    return new Float32Array([dx, dy]);
  }
}
