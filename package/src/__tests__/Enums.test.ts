import type { EmbindEnum } from "canvaskit-wasm";

import {
  AlphaTypeEnum,
  BlendModeEnum,
  BlurStyleEnum,
  ClipOpEnum,
  ColorTypeEnum,
  FillTypeEnum,
  FilterModeEnum,
  FontEdgingEnum,
  FontHintingEnum,
  FontSlantEnum,
  FontWeightEnum,
  FontWidthEnum,
  ImageFormatEnum,
  MipmapModeEnum,
  PaintStyleEnum,
  Path1DEffectStyleEnum,
  PathOpEnum,
  PathVerb,
  PointMode,
  StrokeCapEnum,
  StrokeJoinEnum,
  TextAlignEnum,
  TextBaselineEnum,
  TextDirectionEnum,
  TextHeightBehaviorEnum,
  TileModeEnum,
  VertexModeEnum,
  mapKeys,
} from "../Core";

import "./setup";

const checkEnum = <T>(skiaEnum: T, canvasKitEnum: EmbindEnum) => {
  mapKeys(canvasKitEnum.values).forEach((key) => {
    const namedKey = skiaEnum[key as keyof T] as keyof T;
    const expected = skiaEnum[namedKey];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const selectedEnum = canvasKitEnum[namedKey];
    if (selectedEnum) {
      expect(selectedEnum).toBeDefined();
      expect(expected).toBe(selectedEnum.value);
    }
  });
};

describe("Enums", () => {
  it("Should match Paint enums values with CanvasKit", () => {
    checkEnum(PaintStyleEnum, CanvasKit.PaintStyle);
    checkEnum(StrokeCapEnum, CanvasKit.StrokeCap);
    checkEnum(StrokeJoinEnum, CanvasKit.StrokeJoin);
    checkEnum(BlendModeEnum, CanvasKit.BlendMode);
  });
  it("Should match TileMode enums values with CanvasKit", () => {
    checkEnum(TileModeEnum, CanvasKit.TileMode);
  });
  it("Should match Font enums values with CanvasKit", () => {
    checkEnum(FontHintingEnum, CanvasKit.FontHinting);
    checkEnum(FontEdgingEnum, CanvasKit.FontEdging);
    checkEnum(FontSlantEnum, CanvasKit.FontSlant);
    checkEnum(FontWidthEnum, CanvasKit.FontWidth);
    checkEnum(FontWeightEnum, CanvasKit.FontWeight);
  });
  it("Should match PointMode enums values with CanvasKit", () => {
    checkEnum(PointMode, CanvasKit.PointMode);
  });
  it("Should match Image enums values with CanvasKit", () => {
    checkEnum(ColorTypeEnum, CanvasKit.ColorType);
    checkEnum(AlphaTypeEnum, CanvasKit.AlphaType);
    checkEnum(ImageFormatEnum, CanvasKit.ImageFormat);
    checkEnum(MipmapModeEnum, CanvasKit.MipmapMode);
    checkEnum(FilterModeEnum, CanvasKit.FilterMode);
  });
  it("Should match Path enums values with CanvasKit", () => {
    checkEnum(PathOpEnum, CanvasKit.PathOp);
    checkEnum(FillTypeEnum, CanvasKit.FillType);
    checkEnum(Path1DEffectStyleEnum, CanvasKit.Path1DEffect);
    expect(PathVerb.Close).toBe(CanvasKit.CLOSE_VERB);
    expect(PathVerb.Conic).toBe(CanvasKit.CONIC_VERB);
    expect(PathVerb.Cubic).toBe(CanvasKit.CUBIC_VERB);
    expect(PathVerb.Line).toBe(CanvasKit.LINE_VERB);
    expect(PathVerb.Move).toBe(CanvasKit.MOVE_VERB);
    expect(PathVerb.Quad).toBe(CanvasKit.QUAD_VERB);
  });
  it("Should match BlurStyle enums values with CanvasKit", () => {
    checkEnum(BlurStyleEnum, CanvasKit.BlurStyle);
  });
  it("Should match VertexMode enums values with CanvasKit", () => {
    checkEnum(VertexModeEnum, CanvasKit.VertexMode);
  });
  it("Should match Canvas enums values with CanvasKit", () => {
    checkEnum(ClipOpEnum, CanvasKit.ClipOp);
  });
  it("Should match Paragraph enums values with CanvasKit", () => {
    checkEnum(TextAlignEnum, CanvasKit.TextAlign);
    checkEnum(TextBaselineEnum, CanvasKit.TextBaseline);
    checkEnum(TextDirectionEnum, CanvasKit.TextDirection);
    checkEnum(TextHeightBehaviorEnum, CanvasKit.TextHeightBehavior);
  });
});
