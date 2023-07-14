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
  console.log(cmap.glyphIndexArray);
  for (let i = 0; i < result.length; i++) {
    const codepoint = str.codePointAt(i)!;
    const index = cmap.glyphIndexArray![codepoint];
    console.log(index[i]);
    result[i] = 0;
  }
  return result;
};

describe("FontMgr", () => {
  it("should read the font metadata properly", () => {
    const typefaceRef = RealCanvasKit.Typeface.MakeFreeTypeFaceFromData(
      new Uint8Array(RobotoMediumData)
    )!;
    const idsRef = typefaceRef.getGlyphIDs("AEGIS ægis");
    console.log(idsRef);

    const cmap = parseFontTable(RobotoLightData.buffer).cmap!;
    console.log(getGlyphIDs("AEGIS ægis", cmap));
    // expect(parseFontTable(RobotoLightData.buffer)).toBe("Roboto-Light");
    // expect(parseFontTable(RoboBlackItalic.buffer)).toBe("Roboto-BlackItalic");
    // expect(parseFontTable(RobotoMediumData.buffer)).toBe("Roboto-Medium");
    // expect(parseFontTable(Pacifico.buffer)).toBe("Pacifico-Regular");
  });
});
