import type { Canvas as CKCanvas, Image } from "canvaskit-wasm";

import type { AnimationValue, Info } from "./components";
import { Canvas, useLoop, useOnDraw, useImage, fitRects } from "./components";
import zurich from "./assets/zurich.jpg";

const drawShader = (
  image: Image | null,
  _progress: AnimationValue,
  canvas: CKCanvas,
  { width, height }: Info
) => {
  if (!image) {
    return;
  }
  const input = CanvasKit.XYWHRect(0, 0, image.width(), image.height());
  const output = CanvasKit.XYWHRect(0, 0, width, height);
  const paint = new CanvasKit.Paint();
  const { src, dst } = fitRects("cover", input, output);
  canvas.drawImageRect(image, src, dst, paint);
};

export const Shaders = () => {
  const image = useImage(zurich);
  const progress = useLoop();
  const onDraw = useOnDraw(drawShader.bind(null, image, progress), [image]);

  return <Canvas onDraw={onDraw} deps={[progress]} />;
};
