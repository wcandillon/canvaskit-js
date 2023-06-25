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

import { HostObject } from "../HostObject";
import type { Matrix3x3 } from "../Matrix3";
import { toRad } from "../math/index";
import { PathVerb, normalizeArray, rectToXYWH, rrectToXYWH } from "../Core";
import { vec } from "../Vector";

import { PathBuilder } from "./PathBuilder";
import { parseSVG } from "./SVGParser";

export class PathJS extends HostObject<"Path"> implements SkPath {
  private path: PathBuilder;

  constructor(path?: PathBuilder) {
    super("Path");
    this.path = path ?? new PathBuilder();
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

  addPath(_newPath: PathJS, _matrix: Matrix3x3): SkPath | null {
    throw new Error("Method not implemented.");
  }

  addPoly(_points: InputFlattenedPointArray, _close: boolean): SkPath {
    throw new Error("Method not implemented.");
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
    _r: number
  ): SkPath {
    throw new Error("Method not implemented.");
  }

  close() {
    this.path.close();
    return this;
  }

  computeTightBounds(_outputArray?: Float32Array | undefined): Float32Array {
    throw new Error("Method not implemented.");
  }
  conicTo(
    _x1: number,
    _y1: number,
    _x2: number,
    _y2: number,
    _w: number
  ): SkPath {
    throw new Error("Method not implemented.");
  }
  contains(_x: number, _y: number): boolean {
    throw new Error("Method not implemented.");
  }
  copy(): SkPath {
    // TODO: this could be better
    return PathJS.MakeFromSVGString(this.toSVGString())!;
  }
  countPoints(): number {
    throw new Error("Method not implemented.");
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
  dash(_on: number, _off: number, _phase: number): boolean {
    throw new Error("Method not implemented.");
  }
  equals(_other: SkPath): boolean {
    throw new Error("Method not implemented.");
  }
  getBounds(_outputArray?: Float32Array | undefined): Float32Array {
    throw new Error("Method not implemented.");
  }
  getFillType(): EmbindEnumEntity {
    throw new Error("Method not implemented.");
  }
  getPoint(
    _index: number,
    _outputArray?: Float32Array | undefined
  ): Float32Array {
    throw new Error("Method not implemented.");
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
  offset(_dx: number, _dy: number): SkPath {
    throw new Error("Method not implemented.");
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
  reset(): void {
    throw new Error("Method not implemented.");
  }
  rewind(): void {
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
  setFillType(_fill: EmbindEnumEntity): void {
    throw new Error("Method not implemented.");
  }
  setIsVolatile(_volatile: boolean): void {
    throw new Error("Method not implemented.");
  }
  simplify(): boolean {
    throw new Error("Method not implemented.");
  }
  stroke(_opts?: StrokeOpts | undefined): SkPath | null {
    throw new Error("Method not implemented.");
  }
  toCmds(): Float32Array {
    return Float32Array.of(...this.path.path.toCmds().flat());
  }
  toSVGString() {
    return this.path.path.toSVGString();
  }
  transform(_m: Matrix3x3): SkPath {
    throw new Error("Method not implemented.");
  }
  trim(_startT: number, _stopT: number, _isComplement: boolean): SkPath | null {
    throw new Error("Method not implemented.");
  }

  // TODO: to remove. We don't need it to draw the path
  getPath2D() {
    return new Path2D(this.toSVGString());
  }

  static CanInterpolate(_path1: SkPath, _path2: SkPath): boolean {
    throw new Error("Function not implemented.");
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
    _start: SkPath,
    _end: SkPath,
    _weight: number
  ): SkPath | null {
    throw new Error("Function not implemented.");
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
