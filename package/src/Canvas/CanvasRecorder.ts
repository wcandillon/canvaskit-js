/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  Canvas,
  ColorIntArray,
  ColorSpace,
  CubicResampler,
  EmbindEnumEntity,
  FilterOptions,
  Font,
  Image,
  ImageFilter,
  ImageInfo,
  InputColor,
  InputFlattenedPointArray,
  InputFlattenedRSXFormArray,
  InputFlattenedRectangleArray,
  InputGlyphIDArray,
  InputIRect,
  InputMatrix,
  InputRRect,
  InputRect,
  InputVector3,
  MallocObj,
  Paint,
  Paragraph,
  Path,
  Rect,
  SkPicture,
  Surface,
  TextBlob,
  Vertices,
} from "canvaskit-wasm";

import { HostObject } from "../HostObject";

type Command = {
  name: string;
  args: any[];
};

class RecordingContext {
  private saveCount = 0;

  save(): number {
    return this.saveCount++;
  }

  restore(): void {
    this.saveCount--;
  }
}

export class CanvasRecorder extends HostObject<"Canvas"> implements Canvas {
  private ctx = new RecordingContext();
  private commands: Command[] = [];

  constructor(readonly bounds: Rect) {
    super("Canvas");
  }

  replay(canvas: Canvas) {
    this.commands.forEach((cmd) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      canvas[cmd.name](...cmd.args);
    });
  }

  clear(color: InputColor): void {
    this.commands.push({ name: "clear", args: [color] });
  }

  clipPath(path: Path, op: EmbindEnumEntity, doAntiAlias: boolean): void {
    this.commands.push({ name: "clipPath", args: [path, op, doAntiAlias] });
  }

  clipRect(rect: InputRect, op: EmbindEnumEntity, doAntiAlias: boolean): void {
    this.commands.push({ name: "clipRect", args: [rect, op, doAntiAlias] });
  }

  clipRRect(
    rrect: InputRRect,
    op: EmbindEnumEntity,
    doAntiAlias: boolean
  ): void {
    this.commands.push({ name: "clipRRect", args: [rrect, op, doAntiAlias] });
  }

  concat(m: InputMatrix): void {
    this.commands.push({ name: "concat", args: [m] });
  }

  drawArc(
    oval: InputRect,
    startAngle: number,
    sweepAngle: number,
    useCenter: boolean,
    paint: Paint
  ): void {
    this.commands.push({
      name: "drawArc",
      args: [oval, startAngle, sweepAngle, useCenter, paint],
    });
  }

  drawAtlas(
    atlas: Image,
    srcRects: InputFlattenedRectangleArray,
    dstXforms: InputFlattenedRSXFormArray,
    paint: Paint,
    blendMode?: EmbindEnumEntity | null | undefined,
    colors?: ColorIntArray | null | undefined,
    sampling?: CubicResampler | FilterOptions | undefined
  ): void {
    this.commands.push({
      name: "drawAtlas",
      args: [atlas, srcRects, dstXforms, paint, blendMode, colors, sampling],
    });
  }

  drawCircle(cx: number, cy: number, radius: number, paint: Paint): void {
    this.commands.push({ name: "drawCircle", args: [cx, cy, radius, paint] });
  }

  drawColor(color: InputColor, blendMode?: EmbindEnumEntity | undefined): void {
    this.commands.push({ name: "drawColor", args: [color, blendMode] });
  }

  drawColorComponents(
    r: number,
    g: number,
    b: number,
    a: number,
    blendMode?: EmbindEnumEntity | undefined
  ): void {
    this.commands.push({
      name: "drawColorComponents",
      args: [r, g, b, a, blendMode],
    });
  }

  drawColorInt(color: number, blendMode?: EmbindEnumEntity | undefined): void {
    this.commands.push({ name: "drawColorInt", args: [color, blendMode] });
  }

  drawDRRect(outer: InputRRect, inner: InputRRect, paint: Paint): void {
    this.commands.push({ name: "drawDRRect", args: [outer, inner, paint] });
  }

  drawGlyphs(
    glyphs: InputGlyphIDArray,
    positions: InputFlattenedPointArray,
    x: number,
    y: number,
    font: Font,
    paint: Paint
  ): void {
    this.commands.push({
      name: "drawGlyphs",
      args: [glyphs, positions, x, y, font, paint],
    });
  }

  drawImage(
    img: Image,
    left: number,
    top: number,
    paint?: Paint | null | undefined
  ): void {
    this.commands.push({ name: "drawImage", args: [img, left, top, paint] });
  }

  drawImageCubic(
    img: Image,
    left: number,
    top: number,
    B: number,
    C: number,
    paint?: Paint | null | undefined
  ): void {
    this.commands.push({
      name: "drawImageCubic",
      args: [img, left, top, B, C, paint],
    });
  }

  drawImageOptions(
    img: Image,
    left: number,
    top: number,
    fm: EmbindEnumEntity,
    mm: EmbindEnumEntity,
    paint?: Paint | null | undefined
  ): void {
    this.commands.push({
      name: "drawImageOptions",
      args: [img, left, top, fm, mm, paint],
    });
  }

  drawImageNine(
    img: Image,
    center: InputIRect,
    dest: InputRect,
    filter: EmbindEnumEntity,
    paint?: Paint | null | undefined
  ): void {
    this.commands.push({
      name: "drawImageNine",
      args: [img, center, dest, filter, paint],
    });
  }

  drawImageRect(
    img: Image,
    src: InputRect,
    dest: InputRect,
    paint: Paint,
    fastSample?: boolean | undefined
  ): void {
    this.commands.push({
      name: "drawImageRect",
      args: [img, src, dest, paint, fastSample],
    });
  }

  drawImageRectCubic(
    img: Image,
    src: InputRect,
    dest: InputRect,
    B: number,
    C: number,
    paint?: Paint | null | undefined
  ): void {
    this.commands.push({
      name: "drawImageRectCubic",
      args: [img, src, dest, B, C, paint],
    });
  }

  drawImageRectOptions(
    img: Image,
    src: InputRect,
    dest: InputRect,
    fm: EmbindEnumEntity,
    mm: EmbindEnumEntity,
    paint?: Paint | null | undefined
  ): void {
    this.commands.push({
      name: "drawImageRectOptions",
      args: [img, src, dest, fm, mm, paint],
    });
  }

  drawLine(x0: number, y0: number, x1: number, y1: number, paint: Paint): void {
    this.commands.push({ name: "drawLine", args: [x0, y0, x1, y1, paint] });
  }

  drawOval(oval: InputRect, paint: Paint): void {
    this.commands.push({ name: "drawOval", args: [oval, paint] });
  }

  drawPaint(paint: Paint): void {
    this.commands.push({ name: "drawPaint", args: [paint] });
  }

  drawParagraph(p: Paragraph, x: number, y: number): void {
    this.commands.push({ name: "drawParagraph", args: [p, x, y] });
  }

  drawPath(path: Path, paint: Paint): void {
    this.commands.push({ name: "drawPath", args: [path, paint] });
  }

  drawPatch(
    cubics: InputFlattenedPointArray,
    colors?: ColorIntArray | Float32Array[] | null | undefined,
    texs?: InputFlattenedPointArray | null | undefined,
    mode?: EmbindEnumEntity | null | undefined,
    paint?: Paint | undefined
  ): void {
    this.commands.push({
      name: "drawPatch",
      args: [cubics, colors, texs, mode, paint],
    });
  }

  drawPicture(skp: SkPicture): void {
    this.commands.push({ name: "drawPicture", args: [skp] });
  }

  drawPoints(
    mode: EmbindEnumEntity,
    points: InputFlattenedPointArray,
    paint: Paint
  ): void {
    this.commands.push({ name: "drawPoints", args: [mode, points, paint] });
  }

  drawRect(rect: InputRect, paint: Paint): void {
    this.commands.push({ name: "drawRect", args: [rect, paint] });
  }

  drawRect4f(
    left: number,
    top: number,
    right: number,
    bottom: number,
    paint: Paint
  ): void {
    this.commands.push({
      name: "drawRect4f",
      args: [left, top, right, bottom, paint],
    });
  }

  drawRRect(rrect: InputRRect, paint: Paint): void {
    this.commands.push({ name: "drawRRect", args: [rrect, paint] });
  }

  drawShadow(
    path: Path,
    zPlaneParams: InputVector3,
    lightPos: InputVector3,
    lightRadius: number,
    ambientColor: InputColor,
    spotColor: InputColor,
    flags: number
  ): void {
    this.commands.push({
      name: "drawShadow",
      args: [
        path,
        zPlaneParams,
        lightPos,
        lightRadius,
        ambientColor,
        spotColor,
        flags,
      ],
    });
  }

  drawText(str: string, x: number, y: number, paint: Paint, font: Font): void {
    this.commands.push({ name: "drawText", args: [str, x, y, paint, font] });
  }

  drawTextBlob(blob: TextBlob, x: number, y: number, paint: Paint): void {
    this.commands.push({ name: "drawTextBlob", args: [blob, x, y, paint] });
  }

  drawVertices(verts: Vertices, mode: EmbindEnumEntity, paint: Paint): void {
    this.commands.push({ name: "drawVertices", args: [verts, mode, paint] });
  }

  getDeviceClipBounds(output?: Int32Array | undefined): Int32Array {
    this.commands.push({ name: "getDeviceClipBounds", args: [output] });
    throw new Error("This method returns a value, hence can't be recorded.");
  }

  getLocalToDevice(): Float32Array {
    this.commands.push({ name: "getLocalToDevice", args: [] });
    throw new Error("This method returns a value, hence can't be recorded.");
  }

  getSaveCount(): number {
    this.commands.push({ name: "getSaveCount", args: [] });
    throw new Error("This method returns a value, hence can't be recorded.");
  }

  getTotalMatrix(): number[] {
    this.commands.push({ name: "getTotalMatrix", args: [] });
    throw new Error("This method returns a value, hence can't be recorded.");
  }

  makeSurface(info: ImageInfo): Surface | null {
    this.commands.push({ name: "makeSurface", args: [info] });
    throw new Error("This method returns a value, hence can't be recorded.");
  }

  readPixels(
    srcX: number,
    srcY: number,
    imageInfo: ImageInfo,
    dest?: MallocObj | undefined,
    bytesPerRow?: number | undefined
  ) {
    this.commands.push({
      name: "readPixels",
      args: [srcX, srcY, imageInfo, dest, bytesPerRow],
    });
    return null;
  }

  restore(): void {
    this.commands.push({ name: "restore", args: [] });
    this.ctx.restore();
  }

  restoreToCount(saveCount: number): void {
    this.commands.push({ name: "restoreToCount", args: [saveCount] });
    for (let i = 1; i <= saveCount; i++) {
      this.restore();
    }
  }

  rotate(rot: number, rx: number, ry: number): void {
    this.commands.push({ name: "rotate", args: [rot, rx, ry] });
  }

  save(): number {
    this.commands.push({ name: "save", args: [] });
    return this.ctx.save();
  }

  saveLayer(
    paint?: Paint | undefined,
    bounds?: InputRect | null | undefined,
    backdrop?: ImageFilter | null | undefined,
    flags?: number | undefined
  ): number {
    this.commands.push({
      name: "saveLayer",
      args: [paint, bounds, backdrop, flags],
    });
    return this.ctx.save();
  }

  scale(sx: number, sy: number): void {
    this.commands.push({ name: "scale", args: [sx, sy] });
  }

  skew(sx: number, sy: number): void {
    this.commands.push({ name: "skew", args: [sx, sy] });
  }

  translate(dx: number, dy: number): void {
    this.commands.push({ name: "translate", args: [dx, dy] });
  }

  writePixels(
    pixels: number[] | Uint8Array,
    srcWidth: number,
    srcHeight: number,
    destX: number,
    destY: number,
    alphaType?: EmbindEnumEntity | undefined,
    colorType?: EmbindEnumEntity | undefined,
    colorSpace?: ColorSpace | undefined
  ): boolean {
    this.commands.push({
      name: "writePixels",
      args: [
        pixels,
        srcWidth,
        srcHeight,
        destX,
        destY,
        alphaType,
        colorType,
        colorSpace,
      ],
    });
    return false;
  }
}
