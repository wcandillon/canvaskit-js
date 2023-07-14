import { RobotoMediumData, skia } from "../setup";

describe("Font", () => {
  it("should get the font size", async () => {
    const size = await skia.eval(({ CanvasKit, assets: { RobotoMedium } }) => {
      const font = new CanvasKit.Font(RobotoMedium, 32);
      return font.getSize();
    });
    expect(size).toBe(32);
  });
  it("getGlyphIDs", async () => {
    const typeface = RealCanvasKit.Typeface.MakeFreeTypeFaceFromData(
      new Uint8Array(RobotoMediumData)
    );
    const fontRef = new RealCanvasKit.Font(typeface, 32);
    const idsRef = fontRef.getGlyphIDs("AEGIS ægis");
    const ids = await skia.eval(({ CanvasKit, assets: { RobotoMedium } }) => {
      const font = new CanvasKit.Font(RobotoMedium, 32);
      return Array.from(font.getGlyphIDs("AEGIS ægis"));
    });
    expect(ids.length).toEqual(idsRef.length); // one glyph id per glyph
    expect(ids[0]).toEqual(idsRef[0]);
  });
  it("should get the font metrics", async () => {
    const typeface = RealCanvasKit.Typeface.MakeFreeTypeFaceFromData(
      new Uint8Array(RobotoMediumData)
    );
    const fontRef = new RealCanvasKit.Font(typeface, 32);
    const metricsRef = fontRef.getMetrics();
    const metrics = await skia.eval(
      ({ CanvasKit, assets: { RobotoMedium } }) => {
        const font = new CanvasKit.Font(RobotoMedium, 32);
        return font.getMetrics();
      }
    );
    expect(metrics).toEqual(metricsRef);
  });
});
