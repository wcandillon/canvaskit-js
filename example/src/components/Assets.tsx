import type { Image } from "canvaskit-wasm";
import { useEffect, useState } from "react";

export const useImage = (url: string) => {
  const [image, setImage] = useState<Image | null>(null);
  useEffect(() => {
    const img = new window.Image();
    img.src = url;
    img.onload = () => {
      img.width = img.naturalWidth;
      img.height = img.naturalHeight;
      const result = CanvasKit.MakeImageFromCanvasImageSource(img);
      setImage(result);
    };
  }, [url]);
  return image;
};
