import { parseFontTable } from "../../Text/Parser";
import type { ICMap } from "../../Text/Parser/opentype/cmap";
import type { INames } from "../../Text/Parser/opentype/name";
import {
  Pacifico,
  RoboBlackItalic,
  RobotoLightData,
  RobotoMediumData,
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

const getName = (names: INames) => {
  return names.postScriptName.en;
};

describe("Opentype", () => {
  it("should read the font metadata properly", () => {
    let name = getName(parseFontTable(RobotoLightData.buffer).namesTable);
    expect(name).toBe("Roboto-Light");
    name = getName(parseFontTable(RoboBlackItalic.buffer).namesTable);
    expect(name).toBe("Roboto-BlackItalic");
    name = getName(parseFontTable(RobotoMediumData.buffer).namesTable);
    expect(name).toBe("Roboto-Medium");
    name = getName(parseFontTable(Pacifico.buffer).namesTable);
    expect(name).toBe("Pacifico-Regular");
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
