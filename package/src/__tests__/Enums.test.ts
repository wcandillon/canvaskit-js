import type { EmbindEnumEntity } from "canvaskit-wasm";

import { PathVerb, mapKeys } from "../Core";

import "./setup";

interface CanvasKitEnum {
  [key: string]: EmbindEnumEntity;
}

type EnumName = keyof typeof RealCanvasKit;
const enums: EnumName[] = [
  "VertexMode",
  "BlurStyle",
  "PointMode",
  "TileMode",
  "ClipOp",
  // Images
  "AlphaType",
  "ColorType",
  "ImageFormat",
  "MipmapMode",
  "FilterMode",
  // Paint
  "PaintStyle",
  "StrokeCap",
  "StrokeJoin",
  "BlendMode",
  // Font
  "FontHinting",
  "FontEdging",
  "FontSlant",
  "FontWidth",
  "FontWeight",

  // Path
  "PathOp",
  "FillType",
  "Path1DEffect",

  // Paragraph
  "TextAlign",
  "TextBaseline",
  "TextDirection",
  "TextHeightBehavior",
  "DecorationStyle",
  "PlaceholderAlignment",
  "RectHeightStyle",
  "RectWidthStyle",
  "ColorChannel",
];

describe("Enums", () => {
  test.each(enums)("%s", (name) => {
    const realCanvasKitEnum = RealCanvasKit[name] as unknown as CanvasKitEnum;
    const canvasKitEnum = CanvasKit[name] as unknown as CanvasKitEnum;
    mapKeys(realCanvasKitEnum).forEach((key) => {
      if (key === "values") {
        const keys = mapKeys(canvasKitEnum.values);
        const expectedKeys = Object.keys(realCanvasKitEnum.values);
        expect(keys).toEqual(expectedKeys);
        keys.forEach((index) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          expect((canvasKitEnum.values[index] as any).value).toBe(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (realCanvasKitEnum.values[index] as any).value
          );
        });
      } else {
        expect(canvasKitEnum[key].value).toBe(realCanvasKitEnum[key].value);
      }
    });
  });

  it("Checks color type enum", () => {
    expect(CanvasKit.ColorType.Alpha_8.value).toBe(
      RealCanvasKit.ColorType.Alpha_8.value
    );
    expect(CanvasKit.ColorType.Gray_8.value).toBe(
      RealCanvasKit.ColorType.Gray_8.value
    );
    expect(CanvasKit.ColorType.RGBA_F16.value).toBe(
      RealCanvasKit.ColorType.RGBA_F16.value
    );
    expect(CanvasKit.ColorType.RGBA_F32.value).toBe(
      RealCanvasKit.ColorType.RGBA_F32.value
    );
  });

  it("Should match Path enums values with CanvasKit", () => {
    expect(PathVerb.Close).toBe(CanvasKit.CLOSE_VERB);
    expect(PathVerb.Conic).toBe(CanvasKit.CONIC_VERB);
    expect(PathVerb.Cubic).toBe(CanvasKit.CUBIC_VERB);
    expect(PathVerb.Line).toBe(CanvasKit.LINE_VERB);
    expect(PathVerb.Move).toBe(CanvasKit.MOVE_VERB);
    expect(PathVerb.Quad).toBe(CanvasKit.QUAD_VERB);
  });
  it("Should match Paragraph enums values with CanvasKit", () => {
    expect(CanvasKit.TextDirection.RTL.value).toBe(
      RealCanvasKit.TextDirection.RTL.value
    );
    expect(CanvasKit.TextDirection.LTR.value).toBe(
      RealCanvasKit.TextDirection.LTR.value
    );
    expect(RealCanvasKit.LineThroughDecoration).toBe(
      CanvasKit.LineThroughDecoration
    );
    expect(RealCanvasKit.NoDecoration).toBe(CanvasKit.NoDecoration);
    expect(RealCanvasKit.UnderlineDecoration).toBe(
      CanvasKit.UnderlineDecoration
    );
    expect(RealCanvasKit.OverlineDecoration).toBe(CanvasKit.OverlineDecoration);

    expect(RealCanvasKit.ShadowTransparentOccluder).toBe(
      CanvasKit.ShadowTransparentOccluder
    );
    expect(RealCanvasKit.ShadowGeometricOnly).toBe(
      CanvasKit.ShadowGeometricOnly
    );
    expect(RealCanvasKit.ShadowDirectionalLight).toBe(
      CanvasKit.ShadowDirectionalLight
    );
    expect(RealCanvasKit.GlyphRunFlags.IsWhiteSpace).toBe(
      CanvasKit.GlyphRunFlags.IsWhiteSpace
    );
  });
  it("Should match shadow enums values with CanvasKit", () => {
    expect(RealCanvasKit.ShadowTransparentOccluder).toBe(
      CanvasKit.ShadowTransparentOccluder
    );
    expect(RealCanvasKit.ShadowGeometricOnly).toBe(
      CanvasKit.ShadowGeometricOnly
    );
    expect(RealCanvasKit.ShadowDirectionalLight).toBe(
      CanvasKit.ShadowDirectionalLight
    );
  });
});
