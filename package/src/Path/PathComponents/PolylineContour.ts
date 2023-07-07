import type { PathProperties } from "./PathComponent";
import type { Polyline } from "./Polyline";

export class PolylineContour implements PathProperties {
  cumulativeLengths: number[];

  constructor(private polylines: Polyline[]) {
    this.cumulativeLengths = this.calculateCumulativeLengths();
  }

  pointAtLength(length: number) {
    const { polyline, offset } = this.findPolyline(length);
    return polyline.pointAtLength(length - offset);
  }

  tangentAtLength(length: number) {
    const { polyline, offset } = this.findPolyline(length);
    return polyline.tangentAtLength(length - offset);
  }

  getTAtLength(length: number) {
    const { polyline, offset } = this.findPolyline(length);
    return polyline.getTAtLength(length - offset);
  }

  length(): number {
    return this.cumulativeLengths[this.cumulativeLengths.length - 1];
  }

  private findPolyline(length: number) {
    const index = this.findPolylineIndex(length);
    const offset = length - (this.cumulativeLengths[index - 1] ?? 0);

    return { polyline: this.polylines[index], offset };
  }

  private findPolylineIndex(length: number) {
    if (length < 0 || length > this.length()) {
      throw new Error(`Length out of bounds ${length} - ${this.length()}`);
    }

    const index = this.cumulativeLengths.findIndex((l) => l > length);
    if (index < 0) {
      return this.polylines.length - 1;
    }
    return index;
  }

  private calculateCumulativeLengths() {
    const cumulativeLengths = [this.polylines[0].length()];
    for (let i = 1; i < this.polylines.length; i++) {
      cumulativeLengths[i] =
        cumulativeLengths[i - 1] + this.polylines[i].length();
    }
    return cumulativeLengths;
  }
}
