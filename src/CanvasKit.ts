/* eslint-disable no-fallthrough */
/* eslint-disable no-bitwise */
/* eslint-disable camelcase */
import { CanvasKit } from "canvaskit-wasm";
import type {
  AffinityEnumValues,
  AnimatedImage,
  ColorChannelEnumValues,
  ColorFilterFactory,
  ColorIntArray,
  ColorMatrixHelpers,
  ColorSpace,
  ColorSpaceEnumValues,
  ContourMeasureIterConstructor,
  DecorationStyleEnumValues,
  DefaultConstructor,
  EmbindEnumEntity,
  EmulatedCanvas2D,
  FontCollectionFactory,
  FontConstructor,
  FontMgrFactory,
  GlyphRunFlagValues,
  GrDirectContext,
  Image,
  ImageDataConstructor,
  ImageFilterFactory,
  ImageInfo,
  InputFlattenedPointArray,
  InputMatrix,
  InputRect,
  InputVector3,
  MallocObj,
  ManagedSkottieAnimation,
  MaskFilterFactory,
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
  RuntimeEffectFactory,
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
import {
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
import { SurfaceLite } from "./Surface";
import { PaintLite } from "./Paint";
import { ShaderFactory } from "./ShaderFactory";
import { MallocObjLite, clampColorComp } from "./Values";
import { PathLite } from "./Path";

function valueOrPercent(aStr: string) {
  if (aStr === undefined) {
    return 1; // default to opaque.
  }
  const a = parseFloat(aStr);
  if (aStr && aStr.indexOf("%") !== -1) {
    return a / 100;
  }
  return a;
}

export class CanvasKitLite implements CanvasKit {
  private static instance: CanvasKit | null = null;
  private constructor() {}

  static getInstance() {
    if (this.instance === null) {
      this.instance = new CanvasKitLite();
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
    // default to opaque
    if (a === undefined) {
      a = 255;
    }
    // This is consistent with how Skia represents colors in C++, as an unsigned int.
    // This is also consistent with how Flutter represents colors:
    return (
      ((clampColorComp(a) << 24) |
        (clampColorComp(r) << 16) |
        (clampColorComp(g) << 8) |
        ((clampColorComp(b) << 0) & 0xfffffff)) >>>
      0
    ); // This makes the value an unsigned int.
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
    colorMap?: Record<string, Float32Array> | undefined
  ): Float32Array {
    colorStr = colorStr.toLowerCase();
    // See https://drafts.csswg.org/css-color/#typedef-hex-color
    if (colorStr.startsWith("#")) {
      let r,
        g,
        b,
        a = 255;
      switch (colorStr.length) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        case 9: // 8 hex chars #RRGGBBAA
          a = parseInt(colorStr.slice(7, 9), 16);
        case 7: // 6 hex chars #RRGGBB
          r = parseInt(colorStr.slice(1, 3), 16);
          g = parseInt(colorStr.slice(3, 5), 16);
          b = parseInt(colorStr.slice(5, 7), 16);
          break;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        case 5: // 4 hex chars #RGBA
          // multiplying by 17 is the same effect as
          // appending another character of the same value
          // e.g. e => ee == 14 => 238
          a = parseInt(colorStr.slice(4, 5), 16) * 17;
        case 4: // 6 hex chars #RGB
          r = parseInt(colorStr.slice(1, 2), 16) * 17;
          g = parseInt(colorStr.slice(2, 3), 16) * 17;
          b = parseInt(colorStr.slice(3, 4), 16) * 17;
          break;
      }
      return CanvasKit.Color(r as number, g as number, b as number, a / 255);
    } else if (colorStr.startsWith("rgba")) {
      // Trim off rgba( and the closing )
      colorStr = colorStr.slice(5, -1);
      const nums = colorStr.split(",");
      return CanvasKit.Color(
        +nums[0],
        +nums[1],
        +nums[2],
        valueOrPercent(nums[3])
      );
    } else if (colorStr.startsWith("rgb")) {
      // Trim off rgba( and the closing )
      colorStr = colorStr.slice(4, -1);
      const nums = colorStr.split(",");
      // rgb can take 3 or 4 arguments
      return CanvasKit.Color(
        +nums[0],
        +nums[1],
        +nums[2],
        valueOrPercent(nums[3])
      );
    } else if (colorStr.startsWith("gray(")) {
      // TODO(kjlubick)
    } else if (colorStr.startsWith("hsl")) {
      // TODO(kjlubick)
    } else if (colorMap) {
      // Try for named color
      const nc = colorMap[colorStr];
      if (nc !== undefined) {
        return nc;
      }
    }
    return this.BLACK;
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
    return new MallocObjLite(new TypedArray(len));
  }
  MallocGlyphIDs(_len: number): MallocObj {
    throw new Error("Method not implemented.");
  }
  Free(_m: MallocObj): void {}
  MakeCanvasSurface(canvas: string | HTMLCanvasElement): Surface | null {
    if (typeof canvas === "string") {
      throw new Error("Method not implemented");
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Unable to get 2d context from canvas");
    }
    return new SurfaceLite(ctx);
  }
  MakeRasterDirectSurface(
    _ii: ImageInfo,
    _pixels: MallocObj,
    _bytesPerRow: number
  ): Surface | null {
    throw new Error("Method not implemented.");
  }
  MakeSWCanvasSurface(_canvas: string | HTMLCanvasElement): Surface | null {
    throw new Error("Method not implemented.");
  }
  MakeWebGLCanvasSurface(
    _canvas: string | HTMLCanvasElement,
    _colorSpace?: ColorSpace | undefined,
    _opts?: WebGLOptions | undefined
  ): Surface | null {
    throw new Error("Method not implemented.");
  }
  MakeSurface(_width: number, _height: number): Surface | null {
    throw new Error("Method not implemented.");
  }
  GetWebGLContext(
    _canvas: HTMLCanvasElement,
    _opts?: WebGLOptions | undefined
  ): number {
    throw new Error("Method not implemented.");
  }
  MakeGrContext(_ctx: number): GrDirectContext | null {
    throw new Error("Method not implemented.");
  }
  MakeWebGLContext(_ctx: number): GrDirectContext | null {
    throw new Error("Method not implemented.");
  }
  MakeOnScreenGLSurface(
    _ctx: GrDirectContext,
    _width: number,
    _height: number,
    _colorSpace: ColorSpace,
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
    _colorSpace: ColorSpace
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
    _colorSpace: ColorSpace,
    _width?: number | undefined,
    _height?: number | undefined
  ): Surface | null {
    throw new Error("Method not implemented.");
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  MakeRenderTarget(..._args: any[]): Surface | null {
    throw new Error("Method not implemented.");
  }
  MakeLazyImageFromTextureSource(
    _src: TextureSource,
    _info?: ImageInfo | PartialImageInfo | undefined,
    _srcIsPremul?: boolean | undefined
  ): Image {
    throw new Error("Method not implemented.");
  }
  deleteContext(_ctx: number): void {
    throw new Error("Method not implemented.");
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
  MakeCanvas(_width: number, _height: number): EmulatedCanvas2D {
    throw new Error("Method not implemented.");
  }
  MakeImage(
    _info: ImageInfo,
    _bytes: number[] | Uint8Array | Uint8ClampedArray,
    _bytesPerRow: number
  ): Image | null {
    throw new Error("Method not implemented.");
  }
  MakeImageFromEncoded(_bytes: Uint8Array | ArrayBuffer): Image | null {
    throw new Error("Method not implemented.");
  }
  MakeImageFromCanvasImageSource(_src: CanvasImageSource): Image {
    throw new Error("Method not implemented.");
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
  Paint: DefaultConstructor<Paint> = PaintLite;
  Path = PathLite as unknown as PathConstructorAndFactory;
  PictureRecorder!: DefaultConstructor<PictureRecorder>;
  TextStyle!: TextStyleConstructor;
  ParagraphBuilder!: ParagraphBuilderFactory;
  ColorFilter!: ColorFilterFactory;
  FontCollection!: FontCollectionFactory;
  FontMgr!: FontMgrFactory;
  ImageFilter!: ImageFilterFactory;
  MaskFilter!: MaskFilterFactory;
  PathEffect!: PathEffectFactory;
  RuntimeEffect!: RuntimeEffectFactory;
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
  ColorSpace!: ColorSpaceEnumValues;
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
  gpu?: boolean | undefined;
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