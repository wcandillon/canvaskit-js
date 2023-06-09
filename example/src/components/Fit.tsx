import type { Rect } from "canvaskit-wasm";

const exhaustiveCheck = (a: never): never => {
  throw new Error(`Unknown transformation: ${a}`);
};

const rect = (rct: Float32Array) => ({
  x: rct[0],
  y: rct[1],
  width: rct[2] - rct[0],
  height: rct[3] - rct[1],
});

interface Size {
  width: number;
  height: number;
}

export type Fit =
  | "cover"
  | "contain"
  | "fill"
  | "fitHeight"
  | "fitWidth"
  | "none"
  | "scaleDown";

export const size = (width = 0, height = 0) => ({ width, height });

export const fitbox = (fit: Fit, src: Rect, dst: Rect) => {
  const rects = fitRects(fit, src, dst);
  return rect2rect(rects.src, rects.dst);
};

export const rect2rect = (_src: Rect, _dst: Rect) => {
  const src = rect(_src);
  const dst = rect(_dst);
  const scaleX = dst.width / src.width;
  const scaleY = dst.height / src.height;
  const translateX = dst.x - src.x * scaleX;
  const translateY = dst.y - src.y * scaleY;
  const m = new DOMMatrix();
  m.translateSelf(translateX, translateY);
  m.scaleSelf(scaleX, scaleY);
  return m;
};

export const fitRects = (fit: Fit, _rect: Rect, _dst: Rect) => {
  const rct = rect(_rect);
  const { x, y, width, height } = rect(_dst);
  const sizes = applyBoxFit(
    fit,
    { width: rct.width, height: rct.height },
    { width, height }
  );
  const src = inscribe(sizes.src, rct);
  const dst = inscribe(sizes.dst, {
    x,
    y,
    width,
    height,
  });
  return { src, dst };
};

const inscribe = (
  { width, height }: Size,
  rct: { x: number; y: number; width: number; height: number }
) => {
  const halfWidthDelta = (rct.width - width) / 2.0;
  const halfHeightDelta = (rct.height - height) / 2.0;
  return CanvasKit.XYWHRect(
    rct.x + halfWidthDelta,
    rct.y + halfHeightDelta,
    width,
    height
  );
};

const applyBoxFit = (fit: Fit, input: Size, output: Size) => {
  let src = size(),
    dst = size();
  if (
    input.height <= 0.0 ||
    input.width <= 0.0 ||
    output.height <= 0.0 ||
    output.width <= 0.0
  ) {
    return { src, dst };
  }
  switch (fit) {
    case "fill":
      src = input;
      dst = output;
      break;
    case "contain":
      src = input;
      if (output.width / output.height > src.width / src.height) {
        dst = size((src.width * output.height) / src.height, output.height);
      } else {
        dst = size(output.width, (src.height * output.width) / src.width);
      }
      break;
    case "cover":
      if (output.width / output.height > input.width / input.height) {
        src = size(input.width, (input.width * output.height) / output.width);
      } else {
        src = size((input.height * output.width) / output.height, input.height);
      }
      dst = output;
      break;
    case "fitWidth":
      src = size(input.width, (input.width * output.height) / output.width);
      dst = size(output.width, (src.height * output.width) / src.width);
      break;
    case "fitHeight":
      src = size((input.height * output.width) / output.height, input.height);
      dst = size((src.width * output.height) / src.height, output.height);
      break;
    case "none":
      src = size(
        Math.min(input.width, output.width),
        Math.min(input.height, output.height)
      );
      dst = src;
      break;
    case "scaleDown":
      src = input;
      dst = input;
      const aspectRatio = input.width / input.height;
      if (dst.height > output.height) {
        dst = size(output.height * aspectRatio, output.height);
      }
      if (dst.width > output.width) {
        dst = size(output.width, output.width / aspectRatio);
      }
      break;
    default:
      exhaustiveCheck(fit);
  }
  return { src, dst };
};
