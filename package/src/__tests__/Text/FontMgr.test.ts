import { parseFontTable } from "../../Text/Parser";
import type { ICMap } from "../../Text/Parser/cmap/cmap";
import {
  //Pacifico,
  RobotoLightData,
  RobotoMediumData,
  // RobotoMediumData,
  // RoboBlackItalic,
} from "../setup";

const getGlyphIDs = (str: string, cmap: ICMap) => {
  const result = new Uint16Array(str.length);
  for (let i = 0; i < result.length; i++) {
    const codepoint = str.codePointAt(i)!;
    const index = cmap.glyphIndexMap![codepoint] ?? 0;
    result[i] = index;
  }
  return result;
};

describe("FontMgr", () => {
  it("should read the font metadata properly", () => {
    // expect(postScriptName(RobotoLight.buffer)).toBe("Roboto-Light");
    // expect(postScriptName(RoboBlackItalic.buffer)).toBe("Roboto-BlackItalic");
    // expect(postScriptName(RobotoMedium.buffer)).toBe("Roboto-Medium");
    // expect(postScriptName(Pacifico.buffer)).toBe("Pacifico-Regular");
  });
  it("should read the font glyph properly", () => {
    const typefaceRef = RealCanvasKit.Typeface.MakeFreeTypeFaceFromData(
      new Uint8Array(RobotoMediumData)
    )!;
    const idsRef = typefaceRef.getGlyphIDs("AEGIS ægis");

    const cmap = parseFontTable(RobotoLightData.buffer).cmap!;
    const ids = getGlyphIDs("AEGIS ægis", cmap);
    expect(ids).toEqual(idsRef);
  });
});
