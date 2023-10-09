import type { Canvas as CKCanvas } from "canvaskit-wasm";

import type { AnimationValue, Info } from "./components";
import { mix, Canvas, useLoop, useOnDraw } from "./components";

const filter = CanvasKit.ImageFilter.MakeBlur(
  50,
  50,
  CanvasKit.TileMode.Clamp,
  null
);
const paint = new CanvasKit.Paint();
const colors = ["#FFF723", "#E70696"].map((cl) =>
  CanvasKit.parseColorString(cl)
);
paint.setMaskFilter(
  CanvasKit.MaskFilter.MakeBlur(CanvasKit.BlurStyle.Solid, 50, true)
);

const drawSun = (
  progress: AnimationValue,
  canvas: CKCanvas,
  { width, center }: Info
) => {
  const r = mix(progress.value, width / 4, width / 8);
  canvas.drawColor(CanvasKit.BLACK);
  paint.setShader(
    CanvasKit.Shader.MakeLinearGradient(
      [center[0], center[1] - r],
      [center[0], center[1] + r],
      colors,
      null,
      CanvasKit.TileMode.Clamp
    )
  );
  canvas.save();
  canvas.drawCircle(center[0], center[1], r, paint);
  canvas.restore();
  canvas.clipRect(
    CanvasKit.XYWHRect(0, center[1], width, center[1]),
    CanvasKit.ClipOp.Intersect,
    true
  );
  canvas.drawColor(Float32Array.of(0, 0, 0, 0.3));
  canvas.saveLayer(undefined, undefined, filter);
  canvas.restore();
};

export const Glassmorphism = () => {
  const progress = useLoop();
  const onDraw = useOnDraw(drawSun.bind(null, progress));
  return <Canvas onDraw={onDraw} deps={[progress]} />;
};
