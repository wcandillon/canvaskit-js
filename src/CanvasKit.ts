/* eslint-disable no-bitwise */
/* eslint-disable camelcase */
import type {
  ColorSpace as CKColorSpace,
  Image,
  EmulatedCanvas2D,
  CanvasKit as ICanvasKit,
  AffinityEnumValues,
  AnimatedImage,
  ColorChannelEnumValues,
  ColorFilterFactory,
  ColorIntArray,
  ColorMatrixHelpers,
  ContourMeasureIterConstructor,
  DecorationStyleEnumValues,
  DefaultConstructor,
  EmbindEnumEntity,
  FontCollectionFactory,
  FontConstructor,
  FontMgrFactory,
  GlyphRunFlagValues,
  GrDirectContext,
  ImageDataConstructor,
  ImageInfo,
  InputFlattenedPointArray,
  InputMatrix,
  InputRect,
  InputVector3,
  MallocObj,
  ManagedSkottieAnimation,
  Matrix4x4Helpers,
  Paint,
  ParagraphBuilderFactory,
  ParagraphStyleConstructor,
  PartialImageInfo,
  Path,
  PathConstructorAndFactory,
  PathEffectFactory,
  PictureRecorder,
  PlaceholderAlignmentEnumValues,
  RectHeightStyleEnumValues,
  RectWidthStyleEnumValues,
  SkPicture,
  SkottieAnimation,
  SoundMap,
  Surface,
  TextAlignEnumValues,
  TextBaselineEnumValues,
  TextBlobFactory,
  TextDirectionEnumValues,
  TextHeightBehaviorEnumValues,
  TextStyleConstructor,
  TextureSource,
  TonalColorsInput,
  TonalColorsOutput,
  TypedArrayConstructor,
  TypefaceFactory,
  TypefaceFontProviderFactory,
  VectorHelpers,
  Vertices,
  WebGLOptions,
  WebGPUCanvasContext,
  WebGPUCanvasOptions,
} from "canvaskit-wasm";

import { Matrix3 } from "./Matrix3";
import type { ColorSpaceJS, ImageFormatEnum } from "./Contants";
import {
  ColorSpace,
  AlphaType,
  BlendMode,
  BlurStyle,
  ClipOp,
  ColorType,
  FillType,
  FilterMode,
  FontEdging,
  FontHinting,
  FontSlant,
  FontWeight,
  FontWidth,
  ImageFormat,
  MipmapMode,
  PaintStyle,
  Path1DEffectStyle,
  PathOp,
  PathVerb,
  PointMode,
  StrokeCap,
  StrokeJoin,
  TileMode,
  VertexMode,
} from "./Contants";
import { SurfaceJS } from "./Surface";
import { PaintJS } from "./Paint";
import { ShaderFactory } from "./Shader";
import { ColorAsInt, MallocObjJS } from "./Values";
import { PathJS } from "./Path";
import { ImageFilterFactory } from "./ImageFilter";
import { MaskFilterFactory } from "./MaskFilter";
import { GrDirectContextJS } from "./GrDirectContext";
import { EmulatedCanvas2DJS } from "./EmulatedCanvas2D";
import { ImageJS } from "./Image";
import { RuntimeEffectFactory } from "./RuntimeEffect";
import {
  createOffscreenTexture,
  createTexture,
  makeImageFromEncodedAsync,
  resolveContext,
} from "./Core/Platform";

export class CanvasKitJS implements ICanvasKit {
  private static instance: ICanvasKit | null = null;

  private contextes: CanvasRenderingContext2D[] = [];
  private _colorCtx: OffscreenCanvasRenderingContext2D | null = null;

  private constructor() {}

  get colorCtx(): OffscreenCanvasRenderingContext2D {
    if (this._colorCtx === null) {
      this._colorCtx = createOffscreenTexture(1, 1, {
        willReadFrequently: true,
      });
    }
    return this._colorCtx;
  }

  static getInstance() {
    if (this.instance === null) {
      this.instance = new CanvasKitJS();
    }
    return this.instance;
  }

  Color(r: number, g: number, b: number, a = 1): Float32Array {
    return new Float32Array([r / 255, g / 255, b / 255, a]);
  }

  Color4f(
    r: number,
    g: number,
    b: number,
    a?: number | undefined
  ): Float32Array {
    return Float32Array.of(r, g, b, a ?? 1);
  }

  ColorAsInt(r: number, g: number, b: number, a = 1): number {
    return ColorAsInt(r, g, b, a);
  }

  getColorComponents(color: Float32Array): number[] {
    return [
      Math.floor(color[0] * 255),
      Math.floor(color[1] * 255),
      Math.floor(color[2] * 255),
      color[3],
    ];
  }

  parseColorString(
    colorStr: string,
    _colorMap?: Record<string, Float32Array> | undefined
  ): Float32Array {
    this.colorCtx.fillStyle = colorStr;
    this.colorCtx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = this.colorCtx.getImageData(0, 0, 1, 1).data;
    return Float32Array.of(r / 255, g / 255, b / 255, a / 255);
  }

  multiplyByAlpha(c: Float32Array, alpha: number): Float32Array {
    return this.Color4f(c[0], c[1], c[2], c[3] * alpha);
  }

  computeTonalColors(_colors: TonalColorsInput): TonalColorsOutput {
    throw new Error("Method not implemented.");
  }

  LTRBRect(
    left: number,
    top: number,
    right: number,
    bottom: number
  ): Float32Array {
    return new Float32Array([left, top, right, bottom]);
  }
  XYWHRect(x: number, y: number, width: number, height: number): Float32Array {
    return this.LTRBRect(x, y, x + width, y + height);
  }
  LTRBiRect(
    left: number,
    top: number,
    right: number,
    bottom: number
  ): Int32Array {
    return new Int32Array([left, top, right, bottom]);
  }
  XYWHiRect(x: number, y: number, width: number, height: number): Int32Array {
    return this.LTRBiRect(x, y, x + width, y + height);
  }
  RRectXY(
    rect: Exclude<InputRect, MallocObj>,
    rx: number,
    ry: number
  ): Float32Array {
    return Float32Array.of(
      rect[0],
      rect[1],
      rect[2],
      rect[3],
      rx,
      ry,
      rx,
      ry,
      rx,
      ry,
      rx,
      ry
    );
  }
  getShadowLocalBounds(
    _ctm: InputMatrix,
    _path: Path,
    _zPlaneParams: InputVector3,
    _lightPos: InputVector3,
    _lightRadius: number,
    _flags: number,
    _dstRect?: Float32Array | undefined
  ): Float32Array | null {
    throw new Error("Method not implemented.");
  }
  Malloc(TypedArray: TypedArrayConstructor, len: number): MallocObj {
    return new MallocObjJS(new TypedArray(len));
  }
  MallocGlyphIDs(_len: number): MallocObj {
    throw new Error("Method not implemented.");
  }
  Free(_m: MallocObj): void {}
  MakeCanvasSurface(canvas: string | HTMLCanvasElement): Surface | null {
    const ctx = resolveContext(canvas);
    if (!ctx) {
      return null;
    }
    return new SurfaceJS(ctx);
  }
  MakeRasterDirectSurface(
    _ii: ImageInfo,
    _pixels: MallocObj,
    _bytesPerRow: number
  ): Surface | null {
    throw new Error("Method not implemented.");
  }
  MakeSWCanvasSurface(canvas: string | HTMLCanvasElement): Surface | null {
    return this.MakeCanvasSurface(canvas);
  }
  MakeWebGLCanvasSurface(
    canvas: string | HTMLCanvasElement,
    colorSpace?: ColorSpaceJS | undefined,
    _opts?: WebGLOptions | undefined
  ): Surface | null {
    const ctx = resolveContext(canvas, {
      colorSpace: colorSpace?.getNativeValue(),
    });
    if (!ctx) {
      return null;
    }
    return new SurfaceJS(ctx);
  }
  MakeSurface(width: number, height: number): Surface | null {
    const ctx = createTexture(width, height);
    return new SurfaceJS(ctx);
  }
  GetWebGLContext(
    canvas: HTMLCanvasElement,
    _opts?: WebGLOptions | undefined
  ): number {
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Unable to get 2d context from canvas");
    }
    this.contextes.push(ctx);
    return this.contextes.length - 1;
  }
  MakeGrContext(ctx: number): GrDirectContext | null {
    return new GrDirectContextJS(this.contextes[ctx]);
  }
  MakeWebGLContext(ctx: number): GrDirectContext | null {
    return new GrDirectContextJS(this.contextes[ctx]);
  }
  MakeOnScreenGLSurface(
    _ctx: GrDirectContext,
    _width: number,
    _height: number,
    _colorSpace: CKColorSpace,
    _sampleCount?: number | undefined,
    _stencil?: number | undefined
  ): Surface | null {
    throw new Error("Method not implemented.");
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  MakeGPUDeviceContext(_device: any): GrDirectContext | null {
    throw new Error("Method not implemented.");
  }
  MakeGPUTextureSurface(
    _ctx: GrDirectContext,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _texture: any,
    _width: number,
    _height: number,
    _colorSpace: CKColorSpace
  ): Surface | null {
    throw new Error("Method not implemented.");
  }
  MakeGPUCanvasContext(
    _ctx: GrDirectContext,
    _canvas: HTMLCanvasElement,
    _opts?: WebGPUCanvasOptions | undefined
  ): WebGPUCanvasContext | null {
    throw new Error("Method not implemented.");
  }
  MakeGPUCanvasSurface(
    _canvasContext: WebGPUCanvasContext,
    _colorSpace: CKColorSpace,
    _width?: number | undefined,
    _height?: number | undefined
  ): Surface | null {
    throw new Error("Method not implemented.");
  }
  MakeRenderTarget(
    grCtx: GrDirectContextJS,
    ..._args: [number, number] | [ImageInfo]
  ): Surface | null {
    return new SurfaceJS(grCtx.ctx);
  }
  MakeLazyImageFromTextureSource(
    _src: TextureSource,
    _info?: ImageInfo | PartialImageInfo | undefined,
    _srcIsPremul?: boolean | undefined
  ): Image {
    throw new Error("Method not implemented.");
  }
  deleteContext(ctx: number): void {
    this.contextes.splice(ctx, 1);
  }
  getDecodeCacheLimitBytes(): number {
    throw new Error("Method not implemented.");
  }
  getDecodeCacheUsedBytes(): number {
    throw new Error("Method not implemented.");
  }
  setDecodeCacheLimitBytes(_size: number): void {
    throw new Error("Method not implemented.");
  }
  MakeAnimatedImageFromEncoded(
    _bytes: Uint8Array | ArrayBuffer
  ): AnimatedImage | null {
    throw new Error("Method not implemented.");
  }
  MakeCanvas(width: number, height: number): EmulatedCanvas2D {
    const texture = createTexture(width, height);
    return new EmulatedCanvas2DJS(texture.canvas);
  }
  MakeImage(
    { width, height, colorSpace }: ImageInfo,
    data: number[] | Uint8Array | Uint8ClampedArray,
    _bytesPerRow: number
  ): Image | null {
    const imageData = new ImageData(
      data instanceof Uint8ClampedArray ? data : new Uint8ClampedArray(data),
      width,
      height,
      {
        colorSpace: colorSpace
          ? (colorSpace as ColorSpaceJS).getNativeValue()
          : "srgb",
      }
    );
    return new ImageJS(imageData);
  }
  MakeImageFromEncodedAsync(
    bytes: Uint8Array | ArrayBuffer,
    imageFormat: ImageFormatEnum
  ) {
    return makeImageFromEncodedAsync(bytes, imageFormat);
  }
  MakeImageFromEncoded(_bytes: Uint8Array | ArrayBuffer): Image | null {
    throw new Error(
      `MakeImageFromEncoded in CanvasKit is synchronous and not supported on Web.
      Use MakeImageFromEncodedAsync instead.
      `
    );
  }
  MakeImageFromCanvasImageSource(src: CanvasImageSource): Image {
    return new ImageJS(src);
  }
  MakePicture(_bytes: Uint8Array | ArrayBuffer): SkPicture | null {
    throw new Error("Method not implemented.");
  }
  MakeVertices(
    _mode: EmbindEnumEntity,
    _positions: InputFlattenedPointArray,
    _textureCoordinates?: InputFlattenedPointArray | null | undefined,
    _colors?: Float32Array | ColorIntArray | null | undefined,
    _indices?: number[] | null | undefined,
    _isVolatile?: boolean | undefined
  ): Vertices {
    throw new Error("Method not implemented.");
  }
  MakeAnimation(_json: string): SkottieAnimation {
    throw new Error("Method not implemented.");
  }
  MakeManagedAnimation(
    _json: string,
    _assets?: Record<string, ArrayBuffer> | undefined,
    _filterPrefix?: string | undefined,
    _soundMap?: SoundMap | undefined
  ): ManagedSkottieAnimation {
    throw new Error("Method not implemented.");
  }
  ImageData!: ImageDataConstructor;
  ParagraphStyle!: ParagraphStyleConstructor;
  ContourMeasureIter!: ContourMeasureIterConstructor;
  Font!: FontConstructor;
  Paint: DefaultConstructor<Paint> = PaintJS;
  Path = PathJS as unknown as PathConstructorAndFactory;
  PictureRecorder!: DefaultConstructor<PictureRecorder>;
  TextStyle!: TextStyleConstructor;
  ParagraphBuilder!: ParagraphBuilderFactory;
  ColorFilter!: ColorFilterFactory;
  FontCollection!: FontCollectionFactory;
  FontMgr!: FontMgrFactory;
  ImageFilter = ImageFilterFactory;
  MaskFilter = MaskFilterFactory;
  PathEffect!: PathEffectFactory;
  RuntimeEffect = RuntimeEffectFactory;
  Shader = ShaderFactory;
  TextBlob!: TextBlobFactory;
  Typeface!: TypefaceFactory;
  TypefaceFontProvider!: TypefaceFontProviderFactory;
  ColorMatrix!: ColorMatrixHelpers;
  Matrix = Matrix3;
  M44!: Matrix4x4Helpers;
  Vector!: VectorHelpers;
  AlphaType = AlphaType;
  BlendMode = BlendMode;
  BlurStyle = BlurStyle;
  ClipOp = ClipOp;
  ColorChannel!: ColorChannelEnumValues;
  ColorType = ColorType;
  FillType = FillType;
  FilterMode = FilterMode;
  FontEdging = FontEdging;
  FontHinting = FontHinting;
  GlyphRunFlags!: GlyphRunFlagValues;
  ImageFormat = ImageFormat;
  MipmapMode = MipmapMode;
  PaintStyle = PaintStyle;
  Path1DEffect = Path1DEffectStyle;
  PathOp = PathOp;
  PointMode = PointMode;
  ColorSpace = ColorSpace;
  StrokeCap = StrokeCap;
  StrokeJoin = StrokeJoin;
  TileMode = TileMode;
  VertexMode = VertexMode;
  TRANSPARENT = new Float32Array([0, 0, 0, 0]);
  BLACK = new Float32Array([0, 0, 0, 1]);
  WHITE = new Float32Array([1, 1, 1, 1]);
  RED = new Float32Array([1, 0, 0, 1]);
  GREEN = new Float32Array([0, 1, 0, 1]);
  BLUE = new Float32Array([0, 0, 1, 1]);
  YELLOW = new Float32Array([1, 1, 0, 1]);
  CYAN = new Float32Array([0, 1, 1, 1]);
  MAGENTA = new Float32Array([1, 0, 1, 1]);
  MOVE_VERB = PathVerb.Move;
  LINE_VERB = PathVerb.Line;
  QUAD_VERB = PathVerb.Quad;
  CONIC_VERB = PathVerb.Conic;
  CUBIC_VERB = PathVerb.Cubic;
  CLOSE_VERB = PathVerb.Close;
  SaveLayerInitWithPrevious = 1 << 2;
  SaveLayerF16ColorType = 1 << 4;
  ShadowTransparentOccluder!: number;
  ShadowGeometricOnly!: number;
  ShadowDirectionalLight!: number;
  gpu = true;
  managed_skottie?: boolean | undefined = undefined;
  rt_effect?: boolean | undefined = undefined;
  skottie?: boolean | undefined;
  Affinity!: AffinityEnumValues;
  DecorationStyle!: DecorationStyleEnumValues;
  FontSlant = FontSlant;
  FontWeight = FontWeight;
  FontWidth = FontWidth;
  PlaceholderAlignment!: PlaceholderAlignmentEnumValues;
  RectHeightStyle!: RectHeightStyleEnumValues;
  RectWidthStyle!: RectWidthStyleEnumValues;
  TextAlign!: TextAlignEnumValues;
  TextBaseline!: TextBaselineEnumValues;
  TextDirection!: TextDirectionEnumValues;
  TextHeightBehavior!: TextHeightBehaviorEnumValues;
  NoDecoration!: number;
  UnderlineDecoration!: number;
  OverlineDecoration!: number;
  LineThroughDecoration!: number;
}
