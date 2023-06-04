import type { Rect } from "canvaskit-wasm";

interface Size {
  width: number;
  height: number;
}

type Fit =
  | "cover"
  | "contain"
  | "fill"
  | "fitHeight"
  | "fitWidth"
  | "none"
  | "scaleDown";

export const fitRects = (fit: Fit, inp: Rect, out: Rect) => {
  const inscribe = (
    { width, height }: Size,
    rect: { x: number; y: number; width: number; height: number }
  ) => {
    const halfWidthDelta = (rect.width - width) / 2.0;
    const halfHeightDelta = (rect.height - height) / 2.0;
    return Float32Array.of(
      rect.x + halfWidthDelta,
      rect.y + halfHeightDelta,
      width,
      height
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const applyBoxFit = (fit: Fit, input: Size, output: Size) => {
    const size = (width = 0, height = 0) => ({ width, height });

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
          src = size(
            (input.height * output.width) / output.height,
            input.height
          );
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
        throw new Error(`Unknown fit: ${fit}`);
    }
    return { src, dst };
  };

  const rect = inp;
  const [x, y, width, height] = out;
  const sizes = applyBoxFit(
    fit,
    { width: rect[2], height: rect[3] },
    { width, height }
  );
  const src = inscribe(sizes.src, {
    x: rect[0],
    y: rect[1],
    width: rect[2],
    height: rect[3],
  });
  const dst = inscribe(sizes.dst, {
    x,
    y,
    width,
    height,
  });
  return { src, dst };
};
