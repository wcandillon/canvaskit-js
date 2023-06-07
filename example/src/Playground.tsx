import type { AnimationValue, Info } from "./components";
import { mix, NativeCanvas, useLoop, useOnDrawNative } from "./components";

const drawSun = (
  progress: AnimationValue,
  ctx: CanvasRenderingContext2D,
  { width, height, center }: Info
) => {
  const r = mix(progress.value, width / 4, width / 8);
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, width, height);
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.translate(center[0], center[1]);
  ctx.fillStyle = "rgba(80, 180, 255, 1)";
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.translate(-center[0], -center[1]);
  ctx.restore();

  const {
    x,
    y,
    width: w,
    height: h,
  } = { x: 0, y: center[1], width, height: center[1] };
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
  ctx.fillRect(0, 0, width, height);

  const layer = document.createElement("canvas");
  layer.width = ctx.canvas.width;
  layer.height = ctx.canvas.height;
  const layerCtx = layer.getContext("2d")!;
  layerCtx.drawImage(ctx.canvas, 0, 0);
  //console.log(ctx.getTransform());
  //layerCtx.setTransform(ctx.getTransform());

  //ctx.save();
  // ctx.scale(2, 2);
  ctx.filter = "blur(10px)";
  ctx.drawImage(layer, 0, 0, width, height);
  // ctx.restore();
};

export const Playground = () => {
  const progress = useLoop();
  const onDraw = useOnDrawNative(drawSun.bind(null, progress));
  return <NativeCanvas onDraw={onDraw} deps={[progress]} />;
};
