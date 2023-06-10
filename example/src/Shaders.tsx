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
import zurich from "./assets/zurich2.jpg";

const filter = CanvasKit.RuntimeEffect.Make(`precision mediump float;

uniform sampler2D child;
uniform float r;
uniform vec2 resolution;

void main() {
  vec2 uv = gl_FragCoord.xy/vec2(256.0, 256.0);
  vec2 flippedUV = vec2(uv.x, 1.0 - uv.y);
  gl_FragColor = texture2D(child, flippedUV);
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
  // paint.setShader(imageShader!);
  paint.setShader(
    filter.makeShaderWithChildren(
      [mix(progress.value, 1, 100), width, height],
      [imageShader!]
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
