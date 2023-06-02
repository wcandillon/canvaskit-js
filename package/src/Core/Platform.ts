export const createTexture = (
  width: number,
  height: number,
  options?: CanvasRenderingContext2DSettings
) => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.style.display = "none";
  const ctx = canvas.getContext("2d", options);
  if (!ctx) {
    throw new Error("Could not create 2d context");
  }
  return ctx;
};

export const createOffscreenTexture = (
  width: number,
  height: number,
  options?: CanvasRenderingContext2DSettings
) => {
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext("2d", options);
  if (!ctx) {
    throw new Error("Could not create 2d context");
  }
  return ctx;
};

export const resolveContext = (
  canvas: string | HTMLCanvasElement,
  options?: CanvasRenderingContext2DSettings
) => {
  let resolved: HTMLCanvasElement;
  if (typeof canvas === "string") {
    const el = document.getElementById(canvas) as HTMLCanvasElement;
    if (!el) {
      return null;
    }
    resolved = el;
  } else {
    resolved = canvas;
  }
  return resolved.getContext("2d", options);
};
