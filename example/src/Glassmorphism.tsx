import type { Canvas as CKCanvas } from "canvaskit-wasm";

import type { AnimationValue, Info } from "./components";
import { mix, Canvas, useLoop, useOnDraw } from "./components";

const drawSun = (
  progress: AnimationValue,
  canvas: CKCanvas,
  { width, center }: Info
) => {
  const r = mix(progress.value, width / 4, width / 2);
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
  // canvas.save();
  canvas.translate(center[0], center[1]);
  canvas.drawCircle(0, 0, r, paint);
  canvas.translate(-center[0], -center[1]);
  // canvas.restore();
  // const filter = CanvasKit.ImageFilter.MakeBlur(
  //   10,
  //   10,
  //   CanvasKit.TileMode.Clamp,
  //   null
  // );
  // canvas.clipRect(
  //   CanvasKit.XYWHRect(0, r, 2 * r, r),
  //   CanvasKit.ClipOp.Intersect,
  //   true
  // );
  // canvas.drawColor(Float32Array.of(0, 0, 0, 0.3));
  // canvas.saveLayer(undefined, undefined, filter);
  // canvas.restore();
};

export const Glassmorphism = () => {
  const progress = useLoop();
  const onDraw = useOnDraw(drawSun.bind(null, progress));
  return <Canvas onDraw={onDraw} deps={[progress]} />;
};