import type { Point } from "canvaskit-wasm";

import type { PathComponent } from "./PathComponents";
import {
  LinearPathComponent,
  QuadraticPathComponent,
  CubicPathComponent,
} from "./PathComponents";
import type { Applier } from "./Contour";
import { Contour } from "./Contour";
import { computeTightBounds } from "./PathComponents/Bounds";

export class Path {
  contours: Contour[] = [];

  computeTightBounds(result: Float32Array) {
    const bounds = computeTightBounds(this.contours);
    result[0] = bounds[0];
    result[1] = bounds[1];
    result[2] = bounds[2];
    result[3] = bounds[3];
  }

  get contour() {
    // SVG doesn't allow for contourless path but Skia adds moveTo(0, 0) automatically
    // see SVGParser.test.ts
    if (this.contours.length === 0) {
      this.addContour();
    }
    return this.contours[this.contours.length - 1];
  }

  getContours() {
    return this.contours;
  }

  enumerateComponents(
    linearApplier?: Applier<LinearPathComponent>,
    quadApplier?: Applier<QuadraticPathComponent>,
    cubicApplier?: Applier<CubicPathComponent>,
    contourApplier?: Applier<Contour>
  ) {
    this.contours.forEach((c, index) => {
      if (contourApplier) {
        contourApplier(c, index);
      }
      c.enumerateComponents(linearApplier, quadApplier, cubicApplier);
    });
  }

  getPoints() {
    const points: Float32Array[] = [];
    this.contours.forEach((contour) => {
      contour.enumerateComponents(
        (linear) => {
          points.push(linear.p1);
          points.push(linear.p2);
        },
        (quad) => {
          points.push(quad.p1);
          points.push(quad.p2);
          points.push(quad.cp);
        },
        (cubic) => {
          points.push(cubic.p1);
          points.push(cubic.p2);
          points.push(cubic.cp1);
          points.push(cubic.cp2);
        }
      );
    });
    return points;
  }

  closeContour() {
    this.contour.closed = true;
    return this;
  }

  isLastContourClosed() {
    return this.contour.closed;
  }

  countContours() {
    return this.contours.length;
  }

  toCmds() {
    return this.contours.flatMap((c) => c.toCmds());
  }

  toSVGString() {
    return this.contours
      .map((c) => c.toSVGString())
      .join(" ")
      .trim();
  }

  length() {
    return this.contours.reduce((acc, c) => acc + c.length(), 0);
  }

  getLastComponent() {
    return this.contour.getLastComponent();
  }

  addComponent(comp: PathComponent) {
    this.contour.components.push(comp);
    return this;
  }

  addLinearComponent(p1: Point, p2: Point) {
    this.contour.components.push(new LinearPathComponent(p1, p2));
    return this;
  }

  addQuadraticComponent(p1: Point, cp: Point, p2: Point) {
    this.contour.components.push(new QuadraticPathComponent(p1, cp, p2));
    return this;
  }

  addCubicComponent(p1: Point, cp1: Point, cp2: Point, p2: Point) {
    this.contour.components.push(new CubicPathComponent(p1, cp1, cp2, p2));
    return this;
  }

  addContour(isClosed = false) {
    this.contours.push(new Contour(isClosed));
    return this;
  }
}
