import { skia } from "../setup";

describe("Font", () => {
  it("should get the font size", async () => {
    const size = await skia.eval(({ CanvasKit, assets: { RobotoMedium } }) => {
      const font = new CanvasKit.Font(RobotoMedium, 32);
      return font.getSize();
    });
    expect(size).toBe(32);
  });
  // it("getGlyphIDs", () => {
  //   const typefaceRef = RealCanvasKit.Typeface.MakeFreeTypeFaceFromData(
  //     new Uint8Array(RobotoMediumData)
  //   )!;
  //   const idsRef = typefaceRef.getGlyphIDs("AEGIS ægis");

  //   const typeface = CanvasKit.Typeface.MakeFreeTypeFaceFromData(
  //     new Uint8Array(RobotoMediumData)
  //   )!;
  //   const ids = typeface.getGlyphIDs("AEGIS ægis");
  //   expect(ids.length).toEqual(idsRef.length); // one glyph id per glyph
  //   for (let i = 0; i < ids.length; i++) {
  //     expect(ids[i]).toEqual(idsRef[i]);
  //   }
  // });
  // it("getGlyphIDs", async () => {
  //   const typeface = RealCanvasKit.Typeface.MakeFreeTypeFaceFromData(
  //     new Uint8Array(RobotoMediumData)
  //   );
  //   const fontRef = new RealCanvasKit.Font(typeface, 32);
  //   const idsRef = fontRef.getGlyphIDs("AEGIS ægis");
  //   const ids = await skia.eval(({ CanvasKit, assets: { RobotoMedium } }) => {
  //     const font = new CanvasKit.Font(RobotoMedium, 32);
  //     return Array.from(font.getGlyphIDs("AEGIS ægis"));
  //   });
  //   expect(ids.length).toEqual(idsRef.length); // one glyph id per glyph
  //   expect(ids[0]).toEqual(idsRef[0]);
  // });
  // it("should get the font metrics", async () => {
  //   const typeface = RealCanvasKit.Typeface.MakeFreeTypeFaceFromData(
  //     new Uint8Array(RobotoMediumData)
  //   );
  //   const fontRef = new RealCanvasKit.Font(typeface, 32);
  //   const metricsRef = fontRef.getMetrics();
  //   const metrics = await skia.eval(
  //     ({ CanvasKit, assets: { RobotoMedium } }) => {
  //       const font = new CanvasKit.Font(RobotoMedium, 32);
  //       return font.getMetrics();
  //     }
  //   );
  //   expect(metrics).toEqual(metricsRef);
  // });
});
