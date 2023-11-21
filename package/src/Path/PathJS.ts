import type {
  Path as SkPath,
  EmbindEnumEntity,
  InputCommands,
  InputFlattenedPointArray,
  VerbList,
  WeightList,
  InputRRect,
  InputRect,
  StrokeOpts,
} from "canvaskit-wasm";

import { vec, type Path as NativePath, toRad } from "../c2d";
import { HostObject } from "../HostObject";
import { transformPoint, type Matrix3x3 } from "../Core/Matrix";
import {
  FillType,
  FillTypeEnum,
  PathVerb,
  normalizeArray,
  rectToXYWH,
  rrectToXYWH,
} from "../Core";

import { PathBuilder } from "./PathBuilder";
import { parseSVG } from "./SVG";
import { DashPathEffect, TrimPathEffect } from "./PathEffects";

export class PathJS extends HostObject<"Path"> implements SkPath {
  private path: PathBuilder;
  private fillType: CanvasFillRule = "nonzero";

  constructor(path?: PathBuilder) {
    super("Path");
    this.path = path ?? new PathBuilder();
  }

  private swap(path: NativePath) {
    this.path = new PathBuilder(path);
    return this;
  }

  getPath() {
    return this.path.getPath();
  }

  addArc(inputBounds: InputRect, startAngle: number, sweepAngle: number) {
    this.path.addArc(
      rectToXYWH(inputBounds),
      toRad(startAngle),
      toRad(sweepAngle),
      false
    );
    return this;
  }

  addCircle(x: number, y: number, r: number, isCCW?: boolean) {
    this.addOval([x - r, y - r, x + r, y + r], isCCW);
    return this;
  }

  addOval(oval: InputRect, _isCCW?: boolean, _startIndex?: number) {
    this.path.addOval(rectToXYWH(oval));
    return this;
  }

  addPath(newPath: PathJS, _matrix: Matrix3x3) {
    this.path.addPath(newPath.path.getPath());
    return this;
  }

  addPoly(input: InputFlattenedPointArray, close: boolean) {
    const points = normalizeArray(input);
    points.forEach((x, index) => {
      const y = points[index + 1];
      if (index === 0) {
        // TODO: only inject move if needed
        this.path.moveTo(vec(x, y));
      }
      if (index % 2 === 0) {
        this.path.lineTo(vec(x, y));
      }
    });
    if (close) {
      this.path.close();
    }
    return this;
  }
  addRect(input: InputRect, _isCCW?: boolean) {
    this.path.addRect(rectToXYWH(input));
    return this;
  }
  addRRect(input: InputRRect, _isCCW?: boolean) {
    const rrect = rrectToXYWH(input);
    this.path.addRoundedRect(rrect, rrect.radii);
    return this;
  }
  addVerbsPointsWeights(
    _verbs: VerbList,
    _points: InputFlattenedPointArray,
    _weights?: WeightList | undefined
  ): SkPath {
    throw new Error("Method not implemented.");
  }
  arc(
    _x: number,
    _y: number,
    _r: number,
    _startAngle: number,
    _endAngle: number,
    _isCCW?: boolean
  ): SkPath {
    throw new Error("Method not implemented.");
  }
  arcToOval(
    _oval: InputRect,
    _startAngle: number,
    _endAngle: number,
    _forceMoveTo: boolean
  ): SkPath {
    throw new Error("Method not implemented.");
  }
  arcToRotated(
    _rx: number,
    _ry: number,
    _xAxisRotate: number,
    _useSmallArc: boolean,
    _isCCW: boolean,
    _x: number,
    _y: number
  ): SkPath {
    throw new Error("Method not implemented.");
  }

  arcToTangent(
    _x1: number,
    _y1: number,
    _x2: number,
    _y2: number,
    _radius: number
  ): SkPath {
    throw new Error("Method not implemented.");
  }

  close() {
    this.path.close();
    return this;
  }

  computeTightBounds(outputArray?: Float32Array | undefined) {
    const result = outputArray ?? new Float32Array(4);
    this.path.getPath().computeTightBounds(result);
    return result;
  }
  conicTo(x1: number, y1: number, x2: number, y2: number, w: number) {
    this.path.conicTo(vec(x1, y1), vec(x2, y2), w);
    return this;
  }
  contains(x: number, y: number) {
    const offscreen = new OffscreenCanvas(1, 1);
    const ctx = offscreen.getContext("2d")!;
    const path = this.getPath2D();
    const result = ctx.isPointInPath(path, x, y);
    return result;
  }
  copy(): SkPath {
    return PathJS.MakeFromCmds(this.toCmds())!;
  }
  countPoints(): number {
    return this.path.getPath().getPoints().length;
  }
  cubicTo(
    cpx1: number,
    cpy1: number,
    cpx2: number,
    cpy2: number,
    x: number,
    y: number,
    relative = false
  ) {
    this.path.cubicCurveTo(
      vec(cpx1, cpy1),
      vec(cpx2, cpy2),
      vec(x, y),
      relative
    );
    return this;
  }
  dash(on: number, off: number, phase: number) {
    const pe = new DashPathEffect(on, off, phase);
    this.swap(pe.filterPath(this.path.getPath()));
    return true;
  }
  equals(_other: SkPath): boolean {
    throw new Error("Method not implemented.");
  }
  getBounds(outputArray?: Float32Array | undefined): Float32Array {
    const result = outputArray ?? new Float32Array(4);
    calculateBounds(this.path.getPath().getPoints(), result);
    return result;
  }

  getNativeFillType() {
    return this.fillType;
  }

  getFillType() {
    if (this.fillType === "evenodd") {
      return FillType.EvenOdd;
    }
    return FillType.Winding;
  }
  getPoint(index: number, outputArray?: Float32Array) {
    const result = outputArray ?? new Float32Array(2);
    const point = this.path.getPath().getPoints()[index];
    result[0] = point.x;
    result[1] = point.y;
    return result;
  }
  isEmpty(): boolean {
    throw new Error("Method not implemented.");
  }
  isVolatile(): boolean {
    throw new Error("Method not implemented.");
  }
  lineTo(x: number, y: number, relative = false) {
    this.path.lineTo(vec(x, y), relative);
    return this;
  }
  makeAsWinding(): SkPath | null {
    throw new Error("Method not implemented.");
  }
  moveTo(x: number, y: number, relative = false) {
    this.path.moveTo(vec(x, y), relative);
    return this;
  }
  offset(dx: number, dy: number): SkPath {
    return this.transform([1, 0, dx, 0, 1, dy, 0, 0, 1]);
  }
  op(_other: SkPath, _op: EmbindEnumEntity): boolean {
    throw new Error("Method not implemented.");
  }
  quadTo(x1: number, y1: number, x2: number, y2: number, relative = false) {
    this.path.quadraticCurveTo(vec(x1, y1), vec(x2, y2), relative);
    return this;
  }
  rArcTo(
    _rx: number,
    _ry: number,
    _xAxisRotate: number,
    _useSmallArc: boolean,
    _isCCW: boolean,
    _dx: number,
    _dy: number
  ): SkPath {
    throw new Error("Method not implemented.");
  }
  rConicTo(
    _dx1: number,
    _dy1: number,
    _dx2: number,
    _dy2: number,
    _w: number
  ): SkPath {
    throw new Error("Method not implemented.");
  }
  rCubicTo(
    cpx1: number,
    cpy1: number,
    cpx2: number,
    cpy2: number,
    x: number,
    y: number
  ) {
    this.cubicTo(cpx1, cpy1, cpx2, cpy2, x, y, true);
    return this;
  }
  reset() {
    this.path = new PathBuilder();
    this.fillType = "nonzero";
  }
  rewind() {
    this.reset();
  }
  rLineTo(x: number, y: number): SkPath {
    this.path.lineTo(vec(x, y), true);
    return this;
  }
  rMoveTo(x: number, y: number) {
    this.path.moveTo(vec(x, y), true);
    return this;
  }
  rQuadTo(x1: number, y1: number, x2: number, y2: number) {
    this.path.quadraticCurveTo(vec(x1, y1), vec(x2, y2), true);
    return this;
  }
  setFillType(fill: EmbindEnumEntity): void {
    if (fill.value === FillTypeEnum.EvenOdd) {
      this.fillType = "evenodd";
    } else {
      this.fillType = "nonzero";
    }
  }
  setIsVolatile(_volatile: boolean) {}

  simplify(): boolean {
    throw new Error("Method not implemented.");
  }

  stroke(_opts?: StrokeOpts | undefined): SkPath | null {
    throw new Error("Method not implemented.");
  }

  toCmds() {
    return Float32Array.of(...this.path.getPath().toCmds());
  }

  toSVGString() {
    return this.path.getPath().toSVGString();
  }

  transform(m3: Matrix3x3): SkPath {
    const path = new PathBuilder();
    const cmds = this.toCmds();
    let i = 0;
    while (i < cmds.length) {
      const cmd = cmds[i++];
      if (cmd === PathVerb.Move) {
        const to = transformPoint(m3, cmds[i++], cmds[i++]);
        path.moveTo(to);
      } else if (cmd === PathVerb.Line) {
        const to = transformPoint(m3, cmds[i++], cmds[i++]);
        path.lineTo(to);
      } else if (cmd === PathVerb.Cubic) {
        const cp1 = transformPoint(m3, cmds[i++], cmds[i++]);
        const cp2 = transformPoint(m3, cmds[i++], cmds[i++]);
        const to = transformPoint(m3, cmds[i++], cmds[i++]);
        path.cubicCurveTo(cp1, cp2, to);
      } else if (cmd === PathVerb.Quad) {
        const cp = transformPoint(m3, cmds[i++], cmds[i++]);
        const to = transformPoint(m3, cmds[i++], cmds[i++]);
        path.quadraticCurveTo(cp, to);
      } else if (cmd === PathVerb.Close) {
        // TODO: is this correct?
        //i++;
        path.close();
      }
    }
    this.path = path;
    return this;
  }

  trim(startT: number, stopT: number, isComplement: boolean) {
    const pe = new TrimPathEffect(startT, stopT, isComplement);
    return this.swap(pe.filterPath(this.path.getPath()));
  }

  getPath2D() {
    const path = new Path2D();
    const cmds = this.toCmds();
    let i = 0;
    while (i < cmds.length) {
      const cmd = cmds[i++];
      if (cmd === PathVerb.Move) {
        path.moveTo(cmds[i++], cmds[i++]);
      } else if (cmd === PathVerb.Line) {
        path.lineTo(cmds[i++], cmds[i++]);
      } else if (cmd === PathVerb.Cubic) {
        path.bezierCurveTo(
          cmds[i++],
          cmds[i++],
          cmds[i++],
          cmds[i++],
          cmds[i++],
          cmds[i++]
        );
      } else if (cmd === PathVerb.Quad) {
        path.quadraticCurveTo(cmds[i++], cmds[i++], cmds[i++], cmds[i++]);
      } else if (cmd === PathVerb.Close) {
        i++;
        path.closePath();
      }
    }
    return path;
  }

  static CanInterpolate(path1: PathJS, path2: PathJS): boolean {
    const p1 = path1.getPath();
    const p2 = path2.getPath();
    let result = true;
    p1.contours.forEach((contour, index) => {
      const otherContour = p2.contours[index];
      if (contour.components.length !== otherContour.components.length) {
        result = false;
        return;
      }
      contour.components.forEach((component, j) => {
        const otherComponent = otherContour.components[j];
        if (component.type !== otherComponent.type) {
          result = false;
          return;
        }
      });
    });
    return result;
  }

  static MakeFromCmds(input: InputCommands): SkPath | null {
    const cmds = normalizeArray(input);
    const path = new PathBuilder();
    let i = 0;
    while (i < cmds.length) {
      const cmd = cmds[i++];
      if (cmd === PathVerb.Move) {
        path.moveTo(vec(cmds[i++], cmds[i++]));
      } else if (cmd === PathVerb.Line) {
        path.lineTo(vec(cmds[i++], cmds[i++]));
      } else if (cmd === PathVerb.Cubic) {
        path.cubicCurveTo(
          vec(cmds[i++], cmds[i++]),
          vec(cmds[i++], cmds[i++]),
          vec(cmds[i++], cmds[i++])
        );
      } else if (cmd === PathVerb.Quad) {
        path.quadraticCurveTo(
          vec(cmds[i++], cmds[i++]),
          vec(cmds[i++], cmds[i++])
        );
      } else if (cmd === PathVerb.Close) {
        i++;
        path.close();
      }
    }
    return new PathJS(path);
  }
  static MakeFromOp(
    _one: SkPath,
    _two: SkPath,
    _op: EmbindEnumEntity
  ): SkPath | null {
    throw new Error("Function not implemented.");
  }
  static MakeFromPathInterpolation(
    start: SkPath,
    end: SkPath,
    t: number
  ): SkPath | null {
    const cmd1 = start.toCmds();
    const cmd2 = end.toCmds();
    const cmd3 = cmd1.map((cmd, index) => {
      const c = cmd2[index];
      if (c === cmd) {
        return cmd;
      }
      return (1 - t) * c + t * cmd;
    });
    return PathJS.MakeFromCmds(cmd3);
  }
  static MakeFromSVGString(d: string) {
    try {
      return new PathJS(parseSVG(d));
    } catch (e) {
      return null;
    }
  }
  static MakeFromVerbsPointsWeights(
    _verbs: VerbList,
    _points: InputFlattenedPointArray,
    _weights?: WeightList | undefined
  ): SkPath {
    throw new Error("Function not implemented.");
  }
}

const calculateBounds = (points: DOMPoint[], outputArray: Float32Array) => {
  if (!points.length) {
    throw new Error("No points provided");
  }

  let left = Infinity;
  let top = Infinity;
  let right = -Infinity;
  let bottom = -Infinity;

  for (const point of points) {
    const x = point.x;
    const y = point.y;

    if (x < left) {
      left = x;
    }
    if (x > right) {
      right = x;
    }
    if (y < top) {
      top = y;
    }
    if (y > bottom) {
      bottom = y;
    }
  }
  outputArray[0] = left;
  outputArray[1] = top;
  outputArray[2] = right;
  outputArray[3] = bottom;
};
