import type { Point } from "canvaskit-wasm";

import {
  ContourComponent,
  LinearPathComponent,
  QuadraticPathComponent,
  CubicPathComponent,
} from "./PathComponent";

// enum Convexity {
//   Unknown,
//   Convex,
// }

// enum FillType {
//   NonZero, // The default winding order.
//   Odd,
//   Positive,
//   Negative,
//   AbsGeqTwo,
// }

enum ComponentType {
  Linear,
  Quadratic,
  Cubic,
  Contour,
}

interface ComponentIndexPair {
  index: number;
  type: ComponentType;
}

export class Path {
  // private convexity = Convexity.Unknown;
  // private fillType = FillType.NonZero;

  private components: ComponentIndexPair[] = [];
  private linears: LinearPathComponent[] = [];
  private quads: QuadraticPathComponent[] = [];
  private cubics: CubicPathComponent[] = [];
  private contours: ContourComponent[] = [];

  toCmds() {
    return this.components.map(({ type, index }) => {
      switch (type) {
        case ComponentType.Linear:
          return this.linears[index].toCmd();
        case ComponentType.Quadratic:
          return this.quads[index].toCmd();
        case ComponentType.Cubic:
          return this.cubics[index].toCmd();
        case ComponentType.Contour:
          return this.contours[index].toCmd();
      }
    });
  }

  addLinearComponent(p1: Point, p2: Point) {
    this.components.push({
      index: this.linears.length,
      type: ComponentType.Linear,
    });
    this.linears.push(new LinearPathComponent(p1, p2));
    return this;
  }
  addQuadraticComponent(p1: Point, cp: Point, p2: Point) {
    this.components.push({
      index: this.quads.length,
      type: ComponentType.Quadratic,
    });
    this.quads.push(new QuadraticPathComponent(p1, cp, p2));
    return this;
  }
  addCubicComponent(p1: Point, cp1: Point, cp2: Point, p2: Point) {
    this.components.push({
      index: this.cubics.length,
      type: ComponentType.Cubic,
    });
    this.cubics.push(new CubicPathComponent(p1, cp1, cp2, p2));
    return this;
  }
  addContourComponent(destination: Point, isClosed = false) {
    if (
      this.components.length > 0 &&
      this.components[this.components.length - 1].type === ComponentType.Contour
    ) {
      // Never insert contiguous contours.
      this.contours[this.contours.length - 1] = new ContourComponent(
        destination,
        isClosed
      );
    } else {
      this.contours.push(new ContourComponent(destination, isClosed));
      this.components.push({
        index: this.contours.length - 1,
        type: ComponentType.Contour,
      });
    }
    return this;
  }
  setContourClosed(isClosed: boolean) {
    this.contours[this.contours.length - 1].isClosed = isClosed;
  }
}
