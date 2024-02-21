import type {
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
  Paragraph,
  Paint as CKPaint,
  Surface,
  TextBlob,
  Vertices,
  Canvas as CKCanvas,
} from "canvaskit-wasm";

import {
  Canvas as NativeCanvas,
  Path as NativePath,
  DrawableFill,
  DrawableText,
  DrawableDRRect,
  DrawableImageRect,
  DrawableImage,
  ImageFilter,
} from "../c2d";
import { PaintJS } from "../Paint";
import type { ColorSpaceJS, InputColor } from "../Core";
import {
  intAsColor,
  rectToXYWH,
  rrectToXYWH,
  rrectToPath2D,
  BlendMode,
} from "../Core";
import { HostObject } from "../HostObject";
import { nativeMatrix } from "../Core/Matrix";
import { PathJS } from "../Path";
import type { ImageJS } from "../Image";
import type { ImageFilterJS } from "../ImageFilter";
import type { FontJS } from "../Text";
import type { PictureJS } from "../Picture";

export class CanvasJS extends HostObject<"Canvas"> implements CKCanvas {
  private ctx: NativeCanvas;
  private width: number;
  private height: number;
  private saveCount = 0;

  constructor(ctx: CanvasRenderingContext2D) {
    super("Canvas");
    this.width = ctx.canvas.width;
    this.height = ctx.canvas.height;
    this.ctx = new NativeCanvas(ctx);
  }

  clear(color: InputColor): void {
    const paint = new PaintJS();
    paint.setColor(color);
    paint.setBlendMode(BlendMode.Clear);
    this.drawPaint(paint);
  }

  clipPath(path: PathJS, _op: EmbindEnumEntity, _doAntiAlias: boolean): void {
    this._clip(path.getPath());
  }
  clipRect(rect: InputRect, _op: EmbindEnumEntity, _doAntiAlias: boolean) {
    const { x, y, width, height } = rectToXYWH(rect);
    const path = new NativePath();
    path.moveTo(new DOMPoint(x, y));
    path.lineTo(new DOMPoint(x + width, y));
    path.lineTo(new DOMPoint(x + width, y + height));
    path.lineTo(new DOMPoint(x, y + height));
    path.close();
    this._clip(path);
  }
  clipRRect(rrect: InputRRect, _op: EmbindEnumEntity, _doAntiAlias: boolean) {
    const { x, y, width, height, radii } = rrectToXYWH(rrect);
    const path = new PathJS();
    path.addRRect([
      x,
      y,
      width,
      height,
      radii.topLeft.x,
      radii.topLeft.y,
      radii.topRight.x,
      radii.topRight.y,
      radii.bottomRight.x,
      radii.bottomRight.y,
      radii.bottomLeft.x,
      radii.bottomLeft.y,
    ]);
    this._clip(path.getPath());
  }

  private _clip(path: NativePath) {
    this.ctx.clip(path);
  }
  concat(m: InputMatrix) {
    const m3 = nativeMatrix(m);
    this.ctx.concat(m3);
  }
  drawArc(
    oval: InputRect,
    startAngle: number,
    sweepAngle: number,
    _useCenter: boolean,
    paint: PaintJS
  ): void {
    const path = new PathJS();
    const rct = rectToXYWH(oval);
    path.arc(
      rct.width / 2,
      rct.height / 2,
      rct.width / 2,
      startAngle,
      sweepAngle
    );
    this.ctx.drawPath(path.getPath(), paint.getPaint());
  }
  drawAtlas(
    _atlas: Image,
    _srcRects: InputFlattenedRectangleArray,
    _dstXforms: InputFlattenedRSXFormArray,
    _paint: CKPaint,
    _blendMode?: EmbindEnumEntity | null | undefined,
    _colors?: ColorIntArray | null | undefined,
    _sampling?: CubicResampler | FilterOptions | undefined
  ): void {
    throw new Error("Method not implemented.");
  }
  drawCircle(cx: number, cy: number, radius: number, paint: PaintJS) {
    const path = new PathJS();
    path.addCircle(cx, cy, radius);
    this.ctx.drawPath(path.getPath(), paint.getPaint());
  }
  drawColor(color: InputColor, blendMode?: EmbindEnumEntity | undefined): void {
    const paint = new PaintJS();
    paint.setColor(color);
    if (blendMode) {
      paint.setBlendMode(blendMode);
    }
    this.drawPaint(paint);
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
    this.ctx.draw(
      new DrawableDRRect(rrectToPath2D(outerInput), rrectToPath2D(innerInput)),
      paint.getPaint()
    );
  }
  drawGlyphs(
    _glyphs: InputGlyphIDArray,
    _positions: InputFlattenedPointArray,
    _x: number,
    _y: number,
    _font: FontJS,
    _paint: PaintJS
  ): void {
    throw new Error("Method not implemented.");
  }
  drawImage(img: ImageJS, x: number, y: number, _paint?: PaintJS): void {
    const paint = _paint || new PaintJS();
    this.ctx.draw(new DrawableImage(img.getImage(), x, y), paint.getPaint());
  }
  drawImageCubic(
    _img: Image,
    _left: number,
    _top: number,
    _B: number,
    _C: number,
    _paint?: PaintJS | null | undefined
  ): void {
    throw new Error("Method not implemented.");
  }
  drawImageOptions(
    _img: Image,
    _left: number,
    _top: number,
    _fm: EmbindEnumEntity,
    _mm: EmbindEnumEntity,
    _paint?: PaintJS | null | undefined
  ): void {
    throw new Error("Method not implemented.");
  }
  drawImageNine(
    _img: Image,
    _center: InputIRect,
    _dest: InputRect,
    _filter: EmbindEnumEntity,
    _paint?: PaintJS | null | undefined
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
    this.ctx.draw(
      new DrawableImageRect(
        img.getImage(),
        src.x,
        src.y,
        src.width,
        src.height,
        dest.x,
        dest.y,
        dest.width,
        dest.height
      ),
      paint.getPaint()
    );
  }
  drawImageRectCubic(
    _img: Image,
    _src: InputRect,
    _dest: InputRect,
    _B: number,
    _C: number,
    _paint?: PaintJS | null | undefined
  ): void {
    throw new Error("Method not implemented.");
  }
  drawImageRectOptions(
    _img: Image,
    _src: InputRect,
    _dest: InputRect,
    _fm: EmbindEnumEntity,
    _mm: EmbindEnumEntity,
    _paint?: PaintJS | null | undefined
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
    const path = new PathJS();
    path.moveTo(x0, y0);
    path.lineTo(x1, y1);
    this.ctx.drawPath(path.getPath(), paint.getPaint());
  }
  drawOval(_oval: InputRect, _paint: PaintJS): void {
    throw new Error("Method not implemented.");
  }
  drawPaint(paint: PaintJS) {
    this.ctx.draw(new DrawableFill(this.width, this.height), paint.getPaint());
  }
  drawParagraph(_p: Paragraph, _x: number, _y: number): void {
    throw new Error("Method not implemented.");
  }
  drawPath(path: PathJS, paint: PaintJS): void {
    this.ctx.drawPath(path.getPath(), paint.getPaint());
  }
  drawPatch(
    _cubics: InputFlattenedPointArray,
    _colors?: ColorIntArray | Float32Array[] | null | undefined,
    _texs?: InputFlattenedPointArray | null | undefined,
    _mode?: EmbindEnumEntity | null | undefined,
    _paint?: PaintJS | undefined
  ): void {
    throw new Error("Method not implemented.");
  }
  drawPicture(pic: PictureJS) {
    pic.canvas.replay(this);
  }
  drawPoints(
    _mode: EmbindEnumEntity,
    _points: InputFlattenedPointArray,
    _paint: PaintJS
  ): void {
    throw new Error("Method not implemented.");
  }
  drawRect(rect: InputRect, paint: PaintJS) {
    const path = new PathJS();
    path.addRect(rect);
    this.ctx.drawPath(path.getPath(), paint.getPaint());
  }
  drawRect4f(
    left: number,
    top: number,
    right: number,
    bottom: number,
    paint: PaintJS
  ) {
    this.drawRect(Float32Array.of(left, top, right, bottom), paint);
  }
  drawRRect(rrect: InputRRect, paint: PaintJS): void {
    const path = new PathJS();
    path.addRRect(rrect);
    this.ctx.drawPath(path.getPath(), paint.getPaint());
  }
  drawShadow(
    _path: PathJS,
    _zPlaneParams: InputVector3,
    _lightPos: InputVector3,
    _lightRadius: number,
    _ambientColor: InputColor,
    _spotColor: InputColor,
    _flags: number
  ): void {
    throw new Error("Method not implemented.");
  }
  drawText(
    str: string,
    x: number,
    y: number,
    paint: PaintJS,
    font: FontJS
  ): void {
    this.ctx.draw(
      new DrawableText(str, x, y, font.fontStyle()),
      paint.getPaint()
    );
  }
  drawTextBlob(_blob: TextBlob, _x: number, _y: number, _paint: PaintJS): void {
    throw new Error("Method not implemented.");
  }
  drawVertices(
    _verts: Vertices,
    _mode: EmbindEnumEntity,
    _paint: PaintJS
  ): void {
    throw new Error("Method not implemented.");
  }
  getDeviceClipBounds(_output?: Int32Array | undefined): Int32Array {
    throw new Error("Method not implemented.");
  }
  getLocalToDevice() {
    const m = this.ctx.getMatrix();
    return Float32Array.of(
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
      m.m44
    );
  }
  getSaveCount() {
    return this.saveCount;
  }
  getTotalMatrix() {
    const matrix = this.ctx.getMatrix();
    return [
      matrix.m11,
      matrix.m21,
      matrix.m41,
      matrix.m12,
      matrix.m22,
      matrix.m42,
      matrix.m14,
      matrix.m24,
      matrix.m44,
    ];
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
    this.ctx.restore();
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
    this.ctx.save();
    return ++this.saveCount;
  }
  saveLayer(
    _paint?: PaintJS,
    _bounds?: InputRect | null,
    imageFilter?: ImageFilterJS | null,
    _flags?: number
  ) {
    this.ctx.save(
      imageFilter ? new ImageFilter(imageFilter.filters) : undefined
    );
    return ++this.saveCount;
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
    this.concat(new DOMMatrix().translate(x, y));
  }
  writePixels(
    _pixels: number[] | Uint8Array,
    _width: number,
    _height: number,
    _destX: number,
    _destY: number,
    _alphaType?: EmbindEnumEntity | undefined,
    _colorType?: EmbindEnumEntity | undefined,
    _colorSpace?: ColorSpaceJS | undefined
  ): boolean {
    throw new Error("Method not implemented.");
  }
}
