import type { PathProperties } from "./PathComponent";
import type { Polyline } from "./Polyline";

export abstract class Flatennable implements PathProperties {
  private _polyline: Polyline | null = null;

  abstract createPolyline(): Polyline;

  get polyline(): Polyline {
    if (this._polyline === null) {
      this._polyline = this.createPolyline();
    }
    return this._polyline;
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
