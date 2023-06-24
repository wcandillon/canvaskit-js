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
import { rectToXYWH, rrectToXYWH } from "../Core";

import { PathBuilder } from "./PathBuilder";

export class PathJS extends HostObject<"Path"> implements SkPath {
  private path = new PathBuilder();

  constructor() {
    super("Path");
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

  close(): SkPath {
    throw new Error("Method not implemented.");
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
    throw new Error("Method not implemented.");
  }
  countPoints(): number {
    throw new Error("Method not implemented.");
  }
  cubicTo(
    _cpx1: number,
    _cpy1: number,
    _cpx2: number,
    _cpy2: number,
    _x: number,
    _y: number
  ): SkPath {
    throw new Error("Method not implemented.");
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
  lineTo(_x: number, _y: number): SkPath {
    throw new Error("Method not implemented.");
  }
  makeAsWinding(): SkPath | null {
    throw new Error("Method not implemented.");
  }
  moveTo(_x: number, _y: number): SkPath {
    throw new Error("Method not implemented.");
  }
  offset(_dx: number, _dy: number): SkPath {
    throw new Error("Method not implemented.");
  }
  op(_other: SkPath, _op: EmbindEnumEntity): boolean {
    throw new Error("Method not implemented.");
  }
  quadTo(_x1: number, _y1: number, _x2: number, _y2: number): SkPath {
    throw new Error("Method not implemented.");
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
    _cpx1: number,
    _cpy1: number,
    _cpx2: number,
    _cpy2: number,
    _x: number,
    _y: number
  ): SkPath {
    throw new Error("Method not implemented.");
  }
  reset(): void {
    throw new Error("Method not implemented.");
  }
  rewind(): void {
    this.reset();
  }
  rLineTo(_x: number, _y: number): SkPath {
    throw new Error("Method not implemented.");
  }
  rMoveTo(_x: number, _y: number): SkPath {
    throw new Error("Method not implemented.");
  }
  rQuadTo(_x1: number, _y1: number, _x2: number, _y2: number): SkPath {
    throw new Error("Method not implemented.");
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
    throw new Error("Method not implemented.");
  }
  toSVGString(): string {
    throw new Error("Method not implemented.");
  }
  transform(_m: Matrix3x3): SkPath {
    throw new Error("Method not implemented.");
  }
  trim(_startT: number, _stopT: number, _isComplement: boolean): SkPath | null {
    throw new Error("Method not implemented.");
  }

  getPath2D() {
    return new Path2D(this.toSVGString());
  }

  static CanInterpolate(_path1: SkPath, _path2: SkPath): boolean {
    throw new Error("Function not implemented.");
  }
  static MakeFromCmds(_cmds: InputCommands): SkPath | null {
    throw new Error("Method not implemented.");
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
  static MakeFromSVGString(_d: string): SkPath | null {
    throw new Error("Method not implemented.");
  }
  static MakeFromVerbsPointsWeights(
    _verbs: VerbList,
    _points: InputFlattenedPointArray,
    _weights?: WeightList | undefined
  ): SkPath {
    throw new Error("Function not implemented.");
  }
}
