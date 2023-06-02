import { Canvas, useOnDraw } from "./components";

function App() {
  const onDraw = useOnDraw((canvas, { width, height }) => {
    const paint = new CanvasKit.Paint();
    paint.setColor(CanvasKit.Color4f(0, 1, 1, 1));
    canvas.drawRect(CanvasKit.XYWHRect(0, 0, width, height), paint);
  });
  return <Canvas onDraw={onDraw} />;
}

// eslint-disable-next-line import/no-default-export
export default App;
