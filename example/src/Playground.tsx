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

export const Playground2 = () => {
  const progress = useLoop();
  const onDraw = useOnDrawNative(drawSun.bind(null, progress));
  return <NativeCanvas onDraw={onDraw} deps={[progress]} />;
};

// "#FFF723", "#E70696"

export const onDrawShader = (
  ctx: CanvasRenderingContext2D,
  start: DOMPoint,
  end: DOMPoint
) => {
  const grd = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
  grd.addColorStop(0, "#FFF723");
  grd.addColorStop(1, "#E70696");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  return ctx.canvas;
};

const project = (point: DOMPoint, matrix: DOMMatrix) => {
  const vector = new DOMPoint(point.x, point.y, point.z);
  const projected = vector.matrixTransform(matrix);
  return projected;
};

export const onDrawCircle = (
  ctx: CanvasRenderingContext2D,
  { width, center }: Info
) => {
  const r = width / 4;
  ctx.translate(center[0], center[1]);
  ctx.rotate(Math.PI / 4);

  const shader = document.createElement("canvas");
  shader.width = ctx.canvas.width;
  shader.height = ctx.canvas.height;
  const shaderCtx = shader.getContext("2d")!;
  const m3 = ctx.getTransform();
  onDrawShader(
    shaderCtx,
    project(new DOMPoint(0, 0), m3),
    project(new DOMPoint(r, r), m3)
  );

  const pattern = ctx.createPattern(shader, "no-repeat")!;
  pattern.setTransform(m3.invertSelf());

  ctx.fillStyle = pattern;
  ctx.beginPath();
  ctx.roundRect(-r, -r, r * 2, r * 2, r / 2);
  ctx.fill();

  ctx.translate(-center[0], -center[1]);
};

export const Playground = () => {
  return (
    <div>
      <NativeCanvas onDraw={onDrawCircle} />
    </div>
  );
};
