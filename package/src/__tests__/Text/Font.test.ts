import { RobotoMediumData, skia, MaterialIconsData } from "../setup";

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
  it("should get the glyph bounds (1)", async () => {
    const typeface = RealCanvasKit.Typeface.MakeFreeTypeFaceFromData(
      new Uint8Array(RobotoMediumData)
    );
    const fontRef = new RealCanvasKit.Font(typeface, 32);
    const idsRef = fontRef.getGlyphIDs("A");
    const boundsRef = fontRef.getGlyphBounds(idsRef);
    const bounds = await skia.eval(
      ({ CanvasKit, assets: { RobotoMedium } }) => {
        const font = new CanvasKit.Font(RobotoMedium, 32);
        const glyphs = font.getGlyphIDs("A");
        return font.getGlyphBounds(glyphs);
      }
    );
    expect(boundsRef.length).toEqual(idsRef.length * 4); // one glyph id per glyph
    expect(Object.keys(bounds).length).toEqual(idsRef.length * 4); // one glyph id per glyph
    expect(Object.values(bounds)).toBeApproximatelyEqual(
      Object.values(boundsRef),
      1
    );
  });
  it("should get the glyph bounds (2)", async () => {
    const typeface = RealCanvasKit.Typeface.MakeFreeTypeFaceFromData(
      new Uint8Array(RobotoMediumData)
    );
    const fontRef = new RealCanvasKit.Font(typeface, 32);
    const idsRef = fontRef.getGlyphIDs("AEGIS ægis");
    const boundsRef = fontRef.getGlyphBounds(idsRef);
    const bounds = await skia.eval(
      ({ CanvasKit, assets: { RobotoMedium } }) => {
        const font = new CanvasKit.Font(RobotoMedium, 32);
        const glyphs = font.getGlyphIDs("AEGIS ægis");
        return font.getGlyphBounds(glyphs);
      }
    );
    expect(boundsRef.length).toEqual(idsRef.length * 4); // one glyph id per glyph
    expect(Object.keys(bounds).length).toEqual(idsRef.length * 4); // one glyph id per glyph
    expect(Object.values(bounds)).toBeApproximatelyEqual(
      Object.values(boundsRef),
      5
    );
  });
  it("should get the glyph bounds of MaterialIcons-Regular", async () => {
    const typeface = RealCanvasKit.Typeface.MakeFreeTypeFaceFromData(
      new Uint8Array(MaterialIconsData)
    );
    const fontRef = new RealCanvasKit.Font(typeface, 32);
    const idsRef = [0];
    const boundsRef = fontRef.getGlyphBounds(idsRef);
    const bounds = await skia.eval(
      ({ CanvasKit, assets: { MaterialIcons } }) => {
        const font = new CanvasKit.Font(MaterialIcons, 32);
        const glyphs = new Uint16Array([0]);
        return font.getGlyphBounds(glyphs);
      }
    );
    expect(boundsRef.length).toEqual(idsRef.length * 4); // one glyph id per glyph
    expect(Object.keys(bounds).length).toEqual(idsRef.length * 4); // one glyph id per glyph
    expect(Object.values(bounds)).toBeApproximatelyEqual(
      Object.values(boundsRef),
      1
    );
  });
  // Material UI: MaterialIcons-Regular
  // Glyph: 0
  // it("should get the font metrics", async () => {
  //   const typeface = RealCanvasKit.Typeface.MakeFreeTypeFaceFromData(
  //     new Uint8Array(RobotoMediumData)
  //   );
  //   const fontRef = new RealCanvasKit.Font(typeface, 32);
  //   const metricsRef = fontRef.getMetrics();
  //   const metrics = await skia.eval(
  //     ({ CanvasKit, assets: { RobotoMedium } }) => {
  //       const font = new CanvasKit.Font(RobotoMedium, 32);
  //       const glyphs = font.getGlyphIDs("AEGIS ægis");
  //       font.getGlyphBounds(glyphs);
  //       return font.getMetrics();
  //     }
  //   );
  //   expect(metrics).toEqual(metricsRef);
  // });
});
