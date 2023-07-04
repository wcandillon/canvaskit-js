import type { Point } from "canvaskit-wasm";

import { PathVerb } from "../Core";
import { saturate } from "../math";

import type { PathComponent } from "./PathComponent";
import {
  LinearPathComponent,
  QuadraticPathComponent,
  CubicPathComponent,
} from "./PathComponent";

class Contour {
  components: PathComponent[] = [];

  constructor(public closed: boolean) {}

  getSegment(startT: number, stopT: number) {
    const trimmedContour = new Contour(false);
    const totalLength = this.length();
    const start = saturate(startT) * totalLength;
    const stop = saturate(stopT) * totalLength;
    if (start >= stop) {
      return trimmedContour;
    }
    let offset = 0;
    this.components.forEach((contour) => {
      const contourLength = contour.length();
      const nextOffset = offset + contourLength;
      if (nextOffset <= start || offset >= stop) {
        return;
      }
      const t0 = (start - offset) / contourLength;
      const t1 = (stop - offset) / contourLength;
      const partialContour = contour.getSegment(t0, t1);
      trimmedContour.components.push(partialContour);
      offset = nextOffset;
    });
    return trimmedContour;
  }

  enumerateComponents(
    linearApplier?: Applier<LinearPathComponent>,
    quadApplier?: Applier<QuadraticPathComponent>,
    cubicApplier?: Applier<CubicPathComponent>
  ) {
    this.components.forEach((comp, index) => {
      if (comp instanceof LinearPathComponent && linearApplier) {
        linearApplier(comp, index);
      } else if (comp instanceof QuadraticPathComponent && quadApplier) {
        quadApplier(comp, index);
      } else if (comp instanceof CubicPathComponent && cubicApplier) {
        cubicApplier(comp, index);
      }
    });
  }

  // TODO: memoize length computation?
  length() {
    return this.components.reduce((acc, c) => acc + c.length(), 0);
  }

  getLastComponent() {
    return this.components[this.components.length - 1];
  }

  toCmds() {
    if (this.components.length === 0) {
      return [];
    }
    const [comp] = this.components;
    const cmds = [PathVerb.Move, comp.p1[0], comp.p1[1]];
    const cmdToAdd = this.components.map((c) => c.toCmd());
    if (this.closed) {
      cmdToAdd[cmdToAdd.length - 1] = [PathVerb.Close];
    }
    cmds.push(...cmdToAdd.flat());
    return cmds;
  }

  toSVGString() {
    if (this.components.length === 0) {
      return "";
    }
    const [comp] = this.components;
    const cmds = [`M${comp.p1[0]} ${comp.p1[1]}`];
    cmds.push(...this.components.map((c) => c.toSVGString()));
    if (this.closed) {
      cmds[cmds.length - 1] = "Z";
    }
    return cmds.join(" ");
  }
}

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

type Applier<T> = (comp: T, index: number) => void;

export class Path {
  // private convexity = Convexity.Unknown;
  // private fillType = FillType.NonZero;

  contours: Contour[] = [];

  get contour() {
    // SVG doesn't allow for contourless path but Skia add moveTo(0, 0) automatically
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
