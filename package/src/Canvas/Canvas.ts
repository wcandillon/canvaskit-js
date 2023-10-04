import type {
  Canvas,
  ColorIntArray,
  CubicResampler,
  EmbindEnumEntity,
  FilterOptions,
  Image,
  ImageInfo,
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
  Path,
  Surface,
  TextBlob,
  Vertices,
} from "canvaskit-wasm";

import { PaintJS, nativeBlendMode } from "../Paint";
import type { ColorSpaceJS, GrDirectContextJS, InputColor } from "../Core";
import {
  DrawableRect,
  DrawablePath,
  nativeColor,
  intAsColor,
  rectToXYWH,
  rrectToXYWH,
  DrawableCircle,
  DrawableText,
  DrawableDRRect,
  rrectToPath2D,
  normalizeArray,
  DrawableGlyphs,
} from "../Core";
import { HostObject } from "../HostObject";
import { nativeMatrix } from "../Core/Matrix";
import type { PathJS } from "../Path";
import type { ImageJS } from "../Image";
import type { ImageFilterJS } from "../ImageFilter";
import type { SVGContext } from "../SVG";
import type { FontJS } from "../Text";
import type { ParagraphJS } from "../Text/Paragraph";
import type { PictureJS } from "../Picture";

import { DrawingContext } from "./DrawingContext";

export class CanvasJS extends HostObject<"Canvas"> implements Canvas {
  private context: DrawingContext;

  constructor(
    ctx: CanvasRenderingContext2D,
    public readonly svgCtx: SVGContext,
    public readonly grCtx: GrDirectContextJS
  ) {
    super("Canvas");
    this.context = new DrawingContext(ctx);
  }

  get ctx() {
    return this.context.ctx!;
  }

  get paintCtx() {
    return { ctx: this.ctx, svgCtx: this.svgCtx };
  }

  clear(color: InputColor): void {
    this.svgCtx.discardCacheIfNeeded();
    this.ctx.save();
    this.ctx.setTransform();
    this.ctx.globalCompositeOperation = "copy";
    this.ctx.fillStyle = nativeColor(color);
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.restore();
  }
  clipPath(path: PathJS, _op: EmbindEnumEntity, _doAntiAlias: boolean): void {
    this._clip(path.getPath2D());
  }
  clipRect(rect: InputRect, _op: EmbindEnumEntity, _doAntiAlias: boolean) {
    const { x, y, width, height } = rectToXYWH(rect);
    const path = new Path2D();
    path.rect(x, y, width, height);
    this._clip(path);
  }
  clipRRect(rrect: InputRRect, _op: EmbindEnumEntity, _doAntiAlias: boolean) {
    const { x, y, width, height, radii } = rrectToXYWH(rrect);
    const path = new Path2D();
    path.roundRect(x, y, width, height, [
      { x: radii.topLeft[0], y: radii.topLeft[1] },
      { x: radii.topRight[0], y: radii.topRight[1] },
      { x: radii.bottomRight[0], y: radii.bottomRight[1] },
      { x: radii.bottomLeft[0], y: radii.bottomLeft[1] },
    ]);
    this._clip(path);
  }
  private _clip(path: Path2D) {
    this.ctx.clip(path);
  }
  concat(m: InputMatrix) {
    const m3 = nativeMatrix(m);
    this.context.transform(m3);
  }
  drawArc(
    oval: InputRect,
    startAngle: number,
    sweepAngle: number,
    _useCenter: boolean,
    paint: PaintJS
  ): void {
    const path = new Path2D();
    const rct = rectToXYWH(oval);
    path.arc(
      rct.width / 2,
      rct.height / 2,
      rct.width / 2,
      startAngle,
      sweepAngle
    );
    paint.apply(this.paintCtx, new DrawablePath(path));
  }
  drawAtlas(
    _atlas: Image,
    _srcRects: InputFlattenedRectangleArray,
    _dstXforms: InputFlattenedRSXFormArray,
    _paint: Paint,
    _blendMode?: EmbindEnumEntity | null | undefined,
    _colors?: ColorIntArray | null | undefined,
    _sampling?: CubicResampler | FilterOptions | undefined
  ): void {
    throw new Error("Method not implemented.");
  }
  drawCircle(cx: number, cy: number, radius: number, paint: PaintJS) {
    paint.apply(this.paintCtx, new DrawableCircle(cx, cy, radius));
  }
  drawColor(color: InputColor, blendMode?: EmbindEnumEntity | undefined): void {
    this.ctx.save();
    this.ctx.setTransform();
    if (blendMode) {
      this.ctx.globalCompositeOperation = nativeBlendMode(blendMode);
    }
    this.ctx.fillStyle = nativeColor(color);
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.restore();
  }
  drawColorComponents(
    r: number,
    g: number,
    b: number,
    a: number,
    blendMode?: EmbindEnumEntity | undefined
  ): void {
    this.drawColor(Float32Array.of(r, g, b, a), blendMode);
  }
  drawColorInt(color: number, blendMode?: EmbindEnumEntity | undefined): void {
    this.drawColor(intAsColor(color), blendMode);
  }
  drawDRRect(outerInput: InputRRect, innerInput: InputRRect, paint: PaintJS) {
    paint.apply(
      this.paintCtx,
      new DrawableDRRect(rrectToPath2D(outerInput), rrectToPath2D(innerInput))
    );
  }
  drawGlyphs(
    glyphs: InputGlyphIDArray,
    positions: InputFlattenedPointArray,
    x: number,
    y: number,
    font: FontJS,
    paint: PaintJS
  ): void {
    paint.apply(
      this.paintCtx,
      new DrawableGlyphs(
        Array.from(normalizeArray(glyphs)),
        normalizeArray(positions),
        x,
        y,
        font
      )
    );
  }
  drawImage(img: ImageJS, left: number, top: number, paint?: PaintJS): void {
    if (paint) {
      paint.apply(this.paintCtx, () => {
        this.ctx.drawImage(img.getImage(), left, top);
      });
    } else {
      this.ctx.drawImage(img.getImage(), left, top);
    }
  }
  drawImageCubic(
    _img: Image,
    _left: number,
    _top: number,
    _B: number,
    _C: number,
    _paint?: Paint | null | undefined
  ): void {
    throw new Error("Method not implemented.");
  }
  drawImageOptions(
    _img: Image,
    _left: number,
    _top: number,
    _fm: EmbindEnumEntity,
    _mm: EmbindEnumEntity,
    _paint?: Paint | null | undefined
  ): void {
    throw new Error("Method not implemented.");
  }
  drawImageNine(
    _img: Image,
    _center: InputIRect,
    _dest: InputRect,
    _filter: EmbindEnumEntity,
    _paint?: Paint | null | undefined
  ): void {
    throw new Error("Method not implemented.");
  }
  drawImageRect(
    img: ImageJS,
    _src: InputRect,
    _dest: InputRect,
    paint: PaintJS,
    _fastSample?: boolean
  ): void {
    const src = rectToXYWH(_src);
    const dest = rectToXYWH(_dest);
    paint.apply(this.paintCtx, () => {
      this.ctx.drawImage(
        img.getImage(),
        src.x,
        src.y,
        src.width,
        src.height,
        dest.x,
        dest.y,
        dest.width,
        dest.height
      );
    });
  }
  drawImageRectCubic(
    _img: Image,
    _src: InputRect,
    _dest: InputRect,
    _B: number,
    _C: number,
    _paint?: Paint | null | undefined
  ): void {
    throw new Error("Method not implemented.");
  }
  drawImageRectOptions(
    _img: Image,
    _src: InputRect,
    _dest: InputRect,
    _fm: EmbindEnumEntity,
    _mm: EmbindEnumEntity,
    _paint?: Paint | null | undefined
  ): void {
    throw new Error("Method not implemented.");
  }
  drawLine(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    paint: PaintJS
  ): void {
    const path = new Path2D();
    path.moveTo(x0, y0);
    path.lineTo(x1, y1);
    paint.apply(this.paintCtx, new DrawablePath(path));
  }
  drawOval(_oval: InputRect, _paint: Paint): void {
    throw new Error("Method not implemented.");
  }
  drawPaint(paint: PaintJS) {
    const { width, height } = this.ctx.canvas;
    const m = this.ctx.getTransform().invertSelf();
    const topLeft = new DOMPoint(0, 0).matrixTransform(m);
    const topRight = new DOMPoint(width, 0).matrixTransform(m);
    const bottomRight = new DOMPoint(width, height).matrixTransform(m);
    const bottomLeft = new DOMPoint(0, height).matrixTransform(m);
    const path = new Path2D();
    path.moveTo(topLeft.x, topLeft.y);
    path.lineTo(topRight.x, topRight.y);
    path.lineTo(bottomRight.x, bottomRight.y);
    path.lineTo(bottomLeft.x, bottomLeft.y);
    path.closePath();
    paint.apply(this.paintCtx, new DrawablePath(path));
  }
  drawParagraph(p: ParagraphJS, x: number, y: number): void {
    p.drawParagraph(this.paintCtx.ctx, x, y);
  }
  drawPath(path: PathJS, paint: PaintJS): void {
    paint.apply(
      this.paintCtx,
      new DrawablePath(path.getPath2D(), path.getNativeFillType())
    );
  }
  drawPatch(
    _cubics: InputFlattenedPointArray,
    _colors?: ColorIntArray | Float32Array[] | null | undefined,
    _texs?: InputFlattenedPointArray | null | undefined,
    _mode?: EmbindEnumEntity | null | undefined,
    _paint?: Paint | undefined
  ): void {
    throw new Error("Method not implemented.");
  }
  drawPicture(pic: PictureJS) {
    pic.canvas.replay(this);
  }
  drawPoints(
    _mode: EmbindEnumEntity,
    _points: InputFlattenedPointArray,
    _paint: Paint
  ): void {
    throw new Error("Method not implemented.");
  }
  drawRect(rect: InputRect, paint: PaintJS) {
    const { x, y, width, height } = rectToXYWH(rect);
    paint.apply(this.paintCtx, new DrawableRect(x, y, width, height));
  }
  drawRect4f(
    left: number,
    top: number,
    right: number,
    bottom: number,
    paint: PaintJS
  ) {
    const width = right - left;
    const height = bottom - top;
    this.drawRect(Float32Array.of(left, top, width, height), paint);
  }
  drawRRect(rrect: InputRRect, paint: PaintJS): void {
    const { x, y, width, height, radii } = rrectToXYWH(rrect);
    const path = new Path2D();
    path.roundRect(x, y, width, height, [
      { x: radii.topLeft[0], y: radii.topLeft[1] },
      { x: radii.topRight[0], y: radii.topRight[1] },
      { x: radii.bottomRight[0], y: radii.bottomRight[1] },
      { x: radii.bottomLeft[0], y: radii.bottomLeft[1] },
    ]);
    paint.apply(this.paintCtx, new DrawablePath(path));
  }
  drawShadow(
    _path: Path,
    _zPlaneParams: InputVector3,
    _lightPos: InputVector3,
    _lightRadius: number,
    _ambientColor: InputColor,
    _spotColor: InputColor,
    _flags: number
  ): void {
    // throw new Error("Method not implemented.");
  }
  drawText(
    str: string,
    x: number,
    y: number,
    paint: PaintJS,
    font: FontJS
  ): void {
    paint.apply(this.paintCtx, new DrawableText(str, x, y, font.fontStyle()));
  }
  drawTextBlob(_blob: TextBlob, _x: number, _y: number, _paint: Paint): void {
    throw new Error("Method not implemented.");
  }
  drawVertices(_verts: Vertices, _mode: EmbindEnumEntity, _paint: Paint): void {
    throw new Error("Method not implemented.");
  }
  getDeviceClipBounds(_output?: Int32Array | undefined): Int32Array {
    throw new Error("Method not implemented.");
  }
  getLocalToDevice() {
    const m = this.ctx.getTransform();
    return new Float32Array([
      m.m11,
      m.m21,
      m.m31,
      m.m41,
      m.m12,
      m.m22,
      m.m32,
      m.m42,
      m.m13,
      m.m23,
      m.m33,
      m.m43,
      m.m14,
      m.m24,
      m.m34,
      m.m44,
    ]);
  }
  getSaveCount() {
    return this.context.saveCount();
  }
  getTotalMatrix(): number[] {
    const m = this.ctx.getTransform();
    return [m.a, m.c, m.e, m.b, m.d, m.f, 0, 0, 1];
  }
  makeSurface(_info: ImageInfo): Surface | null {
    throw new Error("Method not implemented.");
  }
  readPixels(
    _srcX: number,
    _srcY: number,
    _imageInfo: ImageInfo,
    _dest?: MallocObj | undefined,
    _bytesPerRow?: number | undefined
  ): Float32Array | Uint8Array | null {
    throw new Error("Method not implemented.");
  }
  restore() {
    const { layer, ctx } = this.context.restore()!;
    if (layer) {
      const { imageFilter } = layer;
      this.ctx.save();
      this.ctx.resetTransform();
      if (imageFilter) {
        const paint = new PaintJS();
        paint.setImageFilter(imageFilter);
        paint.apply(this.paintCtx, () => {
          this.ctx.drawImage(this.ctx.canvas, 0, 0);
        });
      } else {
        this.ctx.drawImage(ctx!.canvas, 0, 0);
      }
      this.ctx.restore();
    }
  }
  restoreToCount(saveCount: number): void {
    for (let i = 1; i <= saveCount; i++) {
      this.restore();
    }
  }
  rotate(rot: number, rx: number, ry: number) {
    const m = new DOMMatrix().translate(rx, ry).rotate(rot).translate(-rx, -ry);
    this.concat(m);
  }
  save() {
    return this.context.save();
  }
  saveLayer(
    paint?: PaintJS,
    bounds?: InputRect | null,
    imageFilter?: ImageFilterJS | null,
    flags?: number
  ) {
    return this.context.saveLayer({
      imageFilter: imageFilter ?? undefined,
      flags,
      bounds: bounds ? rectToXYWH(bounds) : undefined,
      paint,
    });
  }
  scale(sx: number, sy: number): void {
    const m = new DOMMatrix().scale(sx, sy);
    this.concat(m);
  }
  skew(sx: number, sy: number): void {
    const rSx = Math.tan(sx);
    const rSy = Math.tan(sy);
    const m = new DOMMatrix([1, rSy, rSx, 1, 0, 0]);
    this.concat(m);
  }
  translate(x: number, y: number): void {
    const m = new DOMMatrix().translate(x, y);
    this.concat(m);
  }
  writePixels(
    pixels: number[] | Uint8Array,
    width: number,
    height: number,
    destX: number,
    destY: number,
    _alphaType?: EmbindEnumEntity | undefined,
    _colorType?: EmbindEnumEntity | undefined,
    colorSpace?: ColorSpaceJS | undefined
  ): boolean {
    this.ctx.putImageData(
      {
        data: new Uint8ClampedArray(pixels),
        width,
        height,
        colorSpace: colorSpace ? colorSpace.getNativeValue() : "srgb",
      },
      destX,
      destY
    );
    return true;
  }
}
