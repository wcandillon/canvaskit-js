import type { PathProperties } from "./PathComponent";
import type { Polyline } from "./Polyline";

export class PolylineContour implements PathProperties {
  cumulativeLengths: number[];

  constructor(private polylines: Polyline[]) {
    this.cumulativeLengths = this.calculateCumulativeLengths();
  }

  pointAtLength(length: number) {
    const index = this.findPolylineIndex(length);
    const polyline = this.polylines[index];
    const segmentPosition = length - (this.cumulativeLengths[index - 1] ?? 0);
    return polyline.pointAtLength(segmentPosition);
  }

  tangentAtLength(length: number) {
    const index = this.findPolylineIndex(length);
    const polyline = this.polylines[index];
    const segmentPosition = length - (this.cumulativeLengths[index - 1] ?? 0);
    return polyline.tangentAtLength(segmentPosition);
  }

  getTAtLength(length: number) {
    const index = this.findPolylineIndex(length);
    const polyline = this.polylines[index];
    const segmentPosition = length - (this.cumulativeLengths[index - 1] ?? 0);
    return polyline.getTAtLength(segmentPosition);
  }

  length(): number {
    return this.cumulativeLengths[this.cumulativeLengths.length - 1];
  }

  private findPolylineIndex(length: number) {
    if (length < 0 || length > this.length()) {
      throw new Error(`Length out of bounds ${length} - ${this.length()}`);
    } else if (length === this.length()) {
      return this.cumulativeLengths.length - 1;
    }

    const index = this.cumulativeLengths.findIndex((l) => l > length);
    if (index < 0) {
      throw new Error("No polyline found");
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
