import { checkImage, skia } from "./setup";

describe("Shaders", () => {
  it("should blend Colors", async () => {
    const image = await skia.draw(({ CanvasKit, canvas }) => {
      const color = `
void mainImage(out vec4 fragColor, in vec2 fragCoord){
  fragColor = vec4(1.0, 0.0, 1.0, 1.0);
}
`;
      const child1 = CanvasKit.RuntimeEffect.Make(color);
      if (!child1) {
        throw new Error("Could not create RuntimeEffect");
      }
      const child2 = CanvasKit.Shader.MakeColor(
        Float32Array.of(1, 1, 0, 1),
        CanvasKit.ColorSpace.SRGB
      );
      const shader = CanvasKit.Shader.MakeBlend(
        CanvasKit.BlendMode.Multiply,
        child1.makeShader([]),
        child2
      );
      const paint = new CanvasKit.Paint();
      paint.setShader(shader);
      canvas.drawPaint(paint);
    });
    checkImage(image, "snapshots/shaders/blend-shader.png");
  });
});
