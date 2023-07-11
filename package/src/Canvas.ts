import type {
  Canvas,
  ColorIntArray,
  CubicResampler,
  EmbindEnumEntity,
  FilterOptions,
  Font,
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
  SkPicture,
  Surface,
  TextBlob,
  Vertices,
} from "canvaskit-wasm";

import { PaintJS, nativeBlendMode } from "./Paint";
import type { ColorSpaceJS, GrDirectContextJS, InputColor } from "./Core";
import {
  DrawableRect,
  DrawablePath,
  nativeColor,
  createTexture,
  intAsColor,
  rectToXYWH,
  rrectToXYWH,
  DrawableCircle,
  DrawableText,
} from "./Core";
import { HostObject } from "./HostObject";
import { convertDOMMatrixTo3x3, normalizeMatrix } from "./Matrix3";
import { toRad } from "./math";
import type { PathJS } from "./Path";
import type { ImageJS } from "./Image";
import type { ImageFilterJS } from "./ImageFilter";
import type { SVGContext } from "./SVG";
import type { FontJS } from "./Text";
import type { ParagraphJS } from "./Text/Paragraph";

interface CanvasContext {
  imageFilter?: ImageFilterJS;
  isLayer?: boolean;
  ctx: CanvasRenderingContext2D;
  clip?: Path2D;
}

export class CanvasJS extends HostObject<"Canvas"> implements Canvas {
  private stack: CanvasContext[] = [];

  constructor(
    readonly drawingCtx: CanvasRenderingContext2D,
    public readonly svgCtx: SVGContext,
    public readonly grCtx: GrDirectContextJS
  ) {
    super("Canvas");
    this.stack.push({ ctx: drawingCtx });
  }

  get layer() {
    return this.stack[this.stack.length - 1];
  }

  get ctx() {
    return this.stack[this.stack.length - 1].ctx;
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
  concat(m: InputMatrix): void {
    const matrix = normalizeMatrix(m);
    const a = matrix[0]; // scale x
    const b = matrix[3]; // skew y
    const c = matrix[1]; // skew x
    const d = matrix[4]; // scale y
    const e = matrix[2]; // translate x
    const f = matrix[5]; // translate y
    this.ctx.transform(a, b, c, d, e, f);
  }
  drawArc(
    _oval: InputRect,
    _startAngle: number,
    _sweepAngle: number,
    _useCenter: boolean,
    _paint: Paint
  ): void {
    throw new Error("Method not implemented.");
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
  drawDRRect(_outer: InputRRect, _inner: InputRRect, _paint: Paint): void {
    throw new Error("Method not implemented.");
  }
  drawGlyphs(
    _glyphs: InputGlyphIDArray,
    _positions: InputFlattenedPointArray,
    _x: number,
    _y: number,
    _font: Font,
    _paint: Paint
  ): void {
    throw new Error("Method not implemented.");
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
    paint.apply(this.paintCtx, new DrawablePath(path.getPath2D()));
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
  drawPicture(_skp: SkPicture): void {
    throw new Error("Method not implemented.");
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
    throw new Error("Method not implemented.");
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
  getLocalToDevice(): Float32Array {
    throw new Error("Method not implemented.");
  }
  getSaveCount(): number {
    return this.stack.length - 1;
  }
  getTotalMatrix(): number[] {
    return convertDOMMatrixTo3x3(this.ctx.getTransform());
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
    if (this.stack.length === 1) {
      // do nothing
      return;
    }
    const { isLayer, imageFilter, ctx } = this.stack.pop()!;
    if (isLayer) {
      if (imageFilter) {
        const paint = new PaintJS();
        paint.setImageFilter(imageFilter);
        paint.apply(this.paintCtx, () => {
          this.ctx.resetTransform();
          this.ctx.drawImage(
            ctx.canvas,
            0,
            0,
            ctx.canvas.width,
            ctx.canvas.height
          );
        });
      } else {
        this.ctx.save();
        this.ctx.resetTransform();
        this.ctx.drawImage(
          ctx.canvas,
          0,
          0,
          ctx.canvas.width,
          ctx.canvas.height
        );
        this.ctx.restore();
      }
    }
    // TODO: should it be on the else branch?
    this.ctx.restore();
  }
  restoreToCount(saveCount: number): void {
    for (let i = 1; i <= saveCount; i++) {
      this.restore();
    }
  }
  rotate(rot: number, rx: number, ry: number): void {
    this.ctx.translate(rx, ry);
    this.ctx.rotate(toRad(rot));
    this.ctx.translate(-rx, -ry);
  }
  save(): number {
    const { ctx, clip } = this.layer;
    ctx.save();
    this.stack.push({ ctx, clip });
    return this.getSaveCount();
  }
  saveLayer(
    paint?: PaintJS,
    _bounds?: InputRect | null,
    imageFilter?: ImageFilterJS | null,
    _flags?: number
  ): number {
    const saveCount = this.save();
    const { ctx, clip } = this.layer;
    const { canvas } = ctx;
    const { width, height } = canvas;
    const layer = createTexture(width, height);
    if (paint) {
      paint.apply({ ctx: layer, svgCtx: this.svgCtx }, () => {
        layer.drawImage(canvas, 0, 0, width, height);
      });
    } else {
      layer.drawImage(canvas, 0, 0);
    }
    layer.setTransform(this.ctx.getTransform());
    const newClip = clip ? new Path2D() : undefined;
    if (newClip) {
      newClip.addPath(clip!);
      layer.clip(clip!);
    }

    this.stack.push({
      ctx: layer,
      imageFilter: imageFilter ?? undefined,
      //      clip: newClip,
      isLayer: true,
    });
    return saveCount;
  }
  scale(sx: number, sy: number): void {
    this.ctx.scale(sx, sy);
  }
  skew(sx: number, sy: number): void {
    const rSx = Math.tan(sx);
    const rSy = Math.tan(sy);
    this.ctx.transform(1, rSy, rSx, 1, 0, 0);
  }
  translate(x: number, y: number): void {
    this.ctx.translate(x, y);
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
