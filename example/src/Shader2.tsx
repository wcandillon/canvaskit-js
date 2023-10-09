import type {
  CanvasKit,
  Image,
  RuntimeEffect,
  Canvas as SkCanvas,
} from "canvaskit-wasm";
import { useMemo } from "react";

import type { AnimationValue, Info } from "./components";
import { fitbox, mix, useLoop, useOnDraw } from "./components";
import { CanvasWASM, useImageWASM } from "./components/CanvasWASM";
import { useCanvasKitWASM } from "./components/CanvasKitContext";
import zurich from "./assets/zurich2.jpg";

const drawShader = (
  image: Image | null,
  progress: AnimationValue,
  rt: RuntimeEffect,
  CanvasKit: CanvasKit,
  canvas: SkCanvas,
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
    rt.makeShaderWithChildren([mix(progress.value, 1, 100)], [imageShader])
  );
  canvas.drawColor(CanvasKit.BLACK);
  canvas.drawPaint(paint);
};

export const Shader2 = () => {
  const CanvasKit = useCanvasKitWASM();
  const image = useImageWASM(CanvasKit, zurich);
  const progress = useLoop();
  const rt = useMemo(() => {
    return CanvasKit.RuntimeEffect.Make(`
uniform shader image;
uniform float r;

half4 main(float2 xy) {   
  xy.x += sin(xy.y / r) * 4;
  return image.eval(xy).rbga;
}
`)!;
  }, [CanvasKit.RuntimeEffect]);
  const onDraw = useOnDraw(
    drawShader.bind(null, image, progress, rt, CanvasKit),
    [image]
  );
  if (!image) {
    return null;
  }
  return <CanvasWASM onDraw={onDraw} deps={[progress]} />;
};
