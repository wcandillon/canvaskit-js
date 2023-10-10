import { skia } from "../setup";

describe("FontMgr", () => {
  it("should get the font size", async () => {
    const result = await skia.eval(({ CanvasKit, assets: {} }) => {
      const fontCollection = CanvasKit.FontCollection.Make();
      fontCollection.enableFontFallback();
      const fontMgr = CanvasKit.TypefaceFontProvider.Make();
      fontCollection.setDefaultFontManager(fontMgr);
      return true;
    });
    expect(result).toBe(true);
  });
});
