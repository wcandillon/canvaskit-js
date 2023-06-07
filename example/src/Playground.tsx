import type { AnimationValue, Info } from "./components";
import { mix, NativeCanvas, useLoop, useOnDrawNative } from "./components";

const drawSun = (
  progress: AnimationValue,
  ctx: CanvasRenderingContext2D,
  { width, center }: Info
) => {
  const r = mix(progress.value, width / 4, width / 8);
  ctx.fillStyle = "blue";
  ctx.beginPath();
  ctx.arc(center[0], center[1], r, 0, Math.PI * 2);
  ctx.fill();
  // canvas.drawColor(CanvasKit.BLACK);
  // const paint = new CanvasKit.Paint();
  // const colors = ["#FFF723", "#E70696"].map((cl) =>
  //   CanvasKit.parseColorString(cl)
  // );
  // paint.setShader(
  //   CanvasKit.Shader.MakeLinearGradient(
  //     [center[0], center[1] - r],
  //     [center[0], center[1] + r],
  //     colors,
  //     null,
  //     CanvasKit.TileMode.Clamp
  //   )
  // );
  // canvas.save();
  // canvas.translate(center[0], center[1]);
  // canvas.drawCircle(0, 0, r, paint);
  // canvas.translate(-center[0], -center[1]);
  // canvas.restore();

  // canvas.clipRect(
  //   CanvasKit.XYWHRect(0, center[1], width, center[1]),
  //   CanvasKit.ClipOp.Intersect,
  //   true
  // );
  // canvas.drawColor(Float32Array.of(0, 0, 0, 0.3));
  // canvas.saveLayer(undefined, undefined, filter);
  // canvas.restore();
};

export const Playground = () => {
  const progress = useLoop();
  const onDraw = useOnDrawNative(drawSun.bind(null, progress));
  return <NativeCanvas onDraw={onDraw} deps={[progress]} />;
};
