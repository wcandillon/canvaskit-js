import type { Point } from "canvaskit-wasm";

import { PathVerb } from "../Core";

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

type Applier<T> = (comp: T, index: number) => void;

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

  getLastComponent() {
    if (this.components.length === 0) {
      return null;
    }
    const { index, type } = this.components[this.components.length - 1];
    switch (type) {
      case ComponentType.Linear:
        return this.linears[index];
      case ComponentType.Quadratic:
        return this.quads[index];
      case ComponentType.Cubic:
        return this.cubics[index];
      case ComponentType.Contour:
        return this.contours[index];
      default:
        throw new Error(`Unknown component type: ${type}`);
    }
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

  enumerateComponents(
    linearApplier?: Applier<LinearPathComponent>,
    quadApplier?: Applier<QuadraticPathComponent>,
    cubicApplier?: Applier<CubicPathComponent>,
    contourApplier?: Applier<ContourComponent>
  ) {
    this.components.forEach(({ index, type }) => {
      switch (type) {
        case ComponentType.Linear:
          if (linearApplier) {
            linearApplier(this.linears[index], index);
          }
          break;
        case ComponentType.Quadratic:
          if (quadApplier) {
            quadApplier(this.quads[index], index);
          }
          break;
        case ComponentType.Cubic:
          if (cubicApplier) {
            cubicApplier(this.cubics[index], index);
          }
          break;
        case ComponentType.Contour:
          if (contourApplier) {
            contourApplier(this.contours[index], index);
          }
          break;
      }
    });
  }

  toCmds() {
    return this.components.flatMap(({ type, index }, j) => {
      switch (type) {
        case ComponentType.Linear:
          const next = this.components[j + 1];
          const nextIsClosedContour =
            next &&
            next.type === ComponentType.Contour &&
            this.contours[next.index - 1].isClosed;
          if (nextIsClosedContour) {
            return [];
          }
          return this.linears[index].toCmd();
        case ComponentType.Quadratic:
          return this.quads[index].toCmd();
        case ComponentType.Cubic:
          return this.cubics[index].toCmd();
        case ComponentType.Contour:
          const lastContour = this.contours[index - 1];
          const shouldMove = j !== this.components.length - 1;
          const shouldClose = !!(lastContour && lastContour.isClosed);
          return this.contours[index].toCmd(shouldClose, shouldMove);
        default:
          throw new Error(`Unknown component type: ${type}`);
      }
    });
  }

  toSVGString() {
    let svg = "";
    const cmds = this.toCmds();
    let i = 0;
    while (i < cmds.length) {
      const cmd = cmds[i++];
      if (cmd === PathVerb.Move) {
        svg += `M${cmds[i++]} ${cmds[i++]} `;
      } else if (cmd === PathVerb.Line) {
        svg += `L${cmds[i++]} ${cmds[i++]} `;
      } else if (cmd === PathVerb.Cubic) {
        svg += `C${cmds[i++]} ${cmds[i++]} ${cmds[i++]} ${cmds[i++]} ${
          cmds[i++]
        } ${cmds[i++]} `;
      } else if (cmd === PathVerb.Quad) {
        svg += `Q${cmds[i++]} ${cmds[i++]} ${cmds[i++]} ${cmds[i++]} `;
      } else if (cmd === PathVerb.Close) {
        i++;
        svg += "Z ";
      }
    }
    return svg.trim();
  }
}
