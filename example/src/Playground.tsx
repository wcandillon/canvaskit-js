import type { AnimationValue, Info } from "./components";
import { mix, NativeCanvas, useLoop, useOnDrawNative } from "./components";

const drawSun = (
  progress: AnimationValue,
  ctx: CanvasRenderingContext2D,
  { width, height, center }: Info
) => {
  const r = mix(progress.value, width / 4, width / 8);
  ctx.save();
  ctx.translate(center[0], center[1]);
  ctx.fillStyle = "rgba(80, 180, 255, 1)";
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.translate(-center[0], -center[1]);
  ctx.restore();

  ctx.beginPath();
  ctx.rect(0, center[1], width, center[1]);
  ctx.clip();
  ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
  ctx.fillRect(0, 0, width, height);

  // canvas.drawColor(Float32Array.of(0, 0, 0, 0.3));
  // canvas.saveLayer(undefined, undefined, filter);
  // canvas.restore();
};

export const Playground = () => {
  const progress = useLoop();
  const onDraw = useOnDrawNative(drawSun.bind(null, progress));
  return <NativeCanvas onDraw={onDraw} deps={[progress]} />;
};
