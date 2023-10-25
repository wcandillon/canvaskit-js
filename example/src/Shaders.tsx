import type { Canvas as CKCanvas, Image } from "canvaskit-wasm";

import type { AnimationValue, Info } from "./components";
import {
  mix,
  fitbox,
  Canvas,
  useLoop,
  useOnDraw,
  useImage,
} from "./components";
import zurich from "./assets/zurich.jpg";

const filter = CanvasKit.RuntimeEffect.Make(`
uniform sampler2D child;
uniform vec2 resolution;
uniform float r;

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 xy = fragCoord.xy;
  xy.x += sin(xy.y / r) * 4.0;
  xy /= resolution;
  fragColor = texture2D(child, xy).rbga;
}`)!;

const drawShader = (
  image: Image | null,
  progress: AnimationValue,
  canvas: CKCanvas,
  { width, height }: Info
) => {
  if (!image) {
    return;
  }
  const input = CanvasKit.XYWHRect(0, 0, image.width(), image.height());
  const output = CanvasKit.XYWHRect(0, 0, width, height);
  const transform = fitbox("cover", input, output);
  const imageShader = image.makeShaderOptions(
    CanvasKit.TileMode.Clamp,
    CanvasKit.TileMode.Clamp,
    CanvasKit.FilterMode.Linear,
    CanvasKit.MipmapMode.None,
    transform
  );

  const paint = new CanvasKit.Paint();
  paint.setShader(
    filter.makeShaderWithChildren(
      [width, height, mix(progress.value, 1, 100)],
      [imageShader]
    )
  );
  canvas.drawPaint(paint);
};

export const Shaders = () => {
  const image = useImage(zurich);
  const progress = useLoop();
  const onDraw = useOnDraw(drawShader.bind(null, image, progress), [image]);

  return <Canvas onDraw={onDraw} deps={[progress]} />;
};
