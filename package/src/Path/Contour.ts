import { PathVerb } from "../Core";
import { saturate } from "../math";

import type { PathComponent } from "./PathComponents";
import {
  CubicPathComponent,
  LinearPathComponent,
  QuadraticPathComponent,
} from "./PathComponents";

export type Applier<T> = (comp: T, index: number) => void;

export class Contour {
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
    this.components.forEach((component) => {
      const componentLength = component.length();
      const nextOffset = offset + componentLength;
      if (nextOffset <= start || offset >= stop) {
        offset = nextOffset;
        return;
      }
      const t0 = Math.max(0, (start - offset) / componentLength);
      const t1 = Math.min(1, (stop - offset) / componentLength);
      //console.log(`component.getSegment(${t0}, ${t1});`);
      const partialContour = component.getSegment(t0, t1);
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
