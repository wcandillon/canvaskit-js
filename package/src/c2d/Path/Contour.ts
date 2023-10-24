import type { PathComponent } from "./PathComponents";
import {
  CubicPathComponent,
  LinearPathComponent,
  QuadraticPathComponent,
} from "./PathComponents";
import { computeTightBounds, type TightBounds } from "./PathComponents/Bounds";
import { PathVerb } from "./PathComponents/PathVerb";

export type Applier<T> = (comp: T, index: number) => void;

export class Contour implements TightBounds {
  components: PathComponent[] = [];

  constructor(public closed: boolean) {}

  computeTightBounds() {
    return computeTightBounds(this.components);
  }

  getPosTanAtLength(length: number) {
    let offset = 0;
    for (const component of this.components) {
      const componentLength = component.length();
      const nextOffset = offset + componentLength;
      if (nextOffset >= length) {
        const l0 = Math.max(0, length - offset);
        const t = component.tAtLength(l0);
        const pos = component.solve(t);
        const tan = component.solveDerivative(t);
        return [pos, tan];
      }
      offset = nextOffset;
    }
    throw new Error("length out of bounds");
  }

  getSegment(start: number, stop: number) {
    const trimmedContour = new Contour(false);
    if (start >= stop) {
      return trimmedContour;
    }
    let offset = 0;
    this.components.forEach((component) => {
      const componentLength = component.length();
      const nextOffset = offset + componentLength;
      if (nextOffset <= start || offset >= stop) {
        offset = nextOffset;
        return;
      }
      const l0 = Math.max(0, start - offset);
      const l1 = Math.min(componentLength, stop - offset);
      const partialContour = component.segment(l0, l1);
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
    const cmds = [PathVerb.Move, comp.p1.x, comp.p1.y];
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
    const cmds = [`M${comp.p1.x} ${comp.p1.y}`];
    cmds.push(...this.components.map((c) => c.toSVGString()));
    if (this.closed) {
      cmds[cmds.length - 1] = "Z";
    }
    return cmds.join(" ");
  }
}
