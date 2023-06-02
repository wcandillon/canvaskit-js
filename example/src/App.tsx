import { useEffect, useRef } from "react";

function App() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) {
      throw new Error("Canvas not found");
    }
    const surface = CanvasKit.MakeWebGLCanvasSurface(ref.current);
    if (!surface) {
      throw new Error("Could not make canvas surface");
    }
    const canvas = surface.getCanvas();
    const paint = new CanvasKit.Paint();
    paint.setColor(CanvasKit.Color(0, 1, 1));
    canvas.drawPaint(paint);
  }, []);
  return <canvas style={{ width: "100%", height: "100vh" }} ref={ref} />;
}

// eslint-disable-next-line import/no-default-export
export default App;
