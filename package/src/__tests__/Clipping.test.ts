import { checkImage, skia } from "./setup";

describe("Clipping", () => {
  it("Clip Rect", async () => {
    const image = await skia.draw(({ CanvasKit, width, canvas }) => {
      const r = width / 2;
      canvas.drawColor(CanvasKit.BLACK);
      const paint = new CanvasKit.Paint();
      const colors = ["#FFF723", "#E70696"].map((cl) =>
        CanvasKit.parseColorString(cl)
      );
      paint.setShader(
        CanvasKit.Shader.MakeLinearGradient(
          [0, 0],
          [0, 2 * r],
          colors,
          null,
          CanvasKit.TileMode.Clamp
        )
      );
      canvas.drawCircle(r, r, r, paint);

      canvas.clipRect(
        CanvasKit.XYWHRect(0, r, 2 * r, r),
        CanvasKit.ClipOp.Intersect,
        true
      );
      canvas.drawColor(Float32Array.of(0, 0, 0, 0.3));
    });
    checkImage(image, "snapshots/clipping/rect.png");
  });
});
