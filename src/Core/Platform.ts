import { ImageFormatEnum } from "../Contants";
import { ImageJS } from "../Image";

export const createTexture = (
  width: number,
  height: number,
  colorSpace: "srgb" | "p3-display" = "srgb",
  alpha = true
) => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.style.display = "none";
  const ctx = canvas.getContext("2d", {
    colorSpace,
    alpha,
  } as CanvasRenderingContext2DSettings);
  if (!ctx) {
    throw new Error("Could not create 2d context");
  }
  return ctx;
};

export const resolveContext = (
  canvas: string | HTMLCanvasElement,
  colorSpace: PredefinedColorSpace = "srgb",
  alpha = true
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
  return resolved.getContext("2d", {
    colorSpace,
    alpha,
  } as CanvasRenderingContext2DSettings);
};

export const makeImageFromEncodedAsync = (
  bytes: Uint8Array | ArrayBuffer,
  imageFormat: ImageFormatEnum
) => {
  let type = "image/png";
  if (imageFormat === ImageFormatEnum.JPEG) {
    type = "image/jpeg";
  } else if (imageFormat === ImageFormatEnum.WEBP) {
    type = "image/webp";
  }
  const blob = new Blob([bytes], { type });
  const url = URL.createObjectURL(blob);
  const img = new window.Image();
  img.src = url;
  return new Promise((resolve, reject) => {
    img.onload = () => {
      img.width = img.naturalWidth;
      img.height = img.naturalHeight;
      const result = new ImageJS(img);
      if (!result) {
        reject();
      }
      resolve(result);
    };
  });
};
