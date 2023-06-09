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

const filter = CanvasKit.RuntimeEffect.Make(`precision mediump float;

uniform sampler2D child;
uniform float r;

void main() {
  vec2 xy = gl_FragCoord.xy;
  xy.x += sin(xy.y / r) * 4.0;
  gl_FragColor = texture2D(child, gl_FragCoord.xy);
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
  const transform = fitbox("contain", input, output);
  canvas.concat(transform);

  //canvas.drawImageRect(image, src, dst, paint);
  const paint = new CanvasKit.Paint();
  paint.setShader(
    filter.makeShaderWithChildren(
      [mix(progress.value, 1, 100)],
      [
        image.makeShaderOptions(
          CanvasKit.TileMode.Clamp,
          CanvasKit.TileMode.Clamp,
          CanvasKit.FilterMode.Linear,
          CanvasKit.MipmapMode.None,
          CanvasKit.Matrix.identity()
        ),
      ]
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
