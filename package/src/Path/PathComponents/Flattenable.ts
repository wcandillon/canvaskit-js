import type { PathProperties } from "./PathComponent";

export abstract class Flatennable implements PathProperties {
  private _polyline: PathProperties | null = null;

  abstract createPolyline(): PathProperties;

  get polyline() {
    if (this._polyline === null) {
      this._polyline = this.createPolyline();
    }
    return this._polyline;
  }

  tAtLength(length: number) {
    return this.polyline.tAtLength(length);
  }

  pointAtLength(length: number) {
    return this.polyline.pointAtLength(length);
  }

  tangentAtLength(length: number) {
    return this.polyline.tangentAtLength(length);
  }

  length(): number {
    return this.polyline.length();
  }
}
