import type { Canvas as CKCanvas } from "canvaskit-wasm";

import type { AnimationValue, Info } from "./components";
import { Canvas, mix, useLoop, useOnDraw } from "./components";

const paraStyle = new CanvasKit.ParagraphStyle({
  textStyle: {
    color: CanvasKit.BLACK,
    fontFamilies: ["sans-serif"],
    fontSize: 64,
  },
  //textAlign: CanvasKit.TextAlign.Left,
  maxLines: 7,
  ellipsis: "...",
});

const tf = CanvasKit.TypefaceFontProvider.Make();

const text =
  "The quick brown fox 🦊 ate a zesty hamburgerfons 🍔.\nThe 👩‍👩‍👧‍👧 laughed.";

const builder = CanvasKit.ParagraphBuilder.MakeFromFontProvider(paraStyle, tf);
builder.addText(text);
const paragraph = builder.build();

const paint = new CanvasKit.Paint();
paint.setColor(CanvasKit.BLACK);
paint.setStyle(CanvasKit.PaintStyle.Stroke);
paint.setStrokeWidth(4);

const padding = 64;

const wrapTo = 400;
const height = 600;

const drawParagraph = (
  _progress: AnimationValue,
  canvas: CKCanvas,
  _info: Info
) => {
  // mix(progress.value, padding + 100, padding + 1024);
  canvas.drawLine(padding + wrapTo, 0, padding + wrapTo, height, paint);

  paragraph.layout(wrapTo);
  canvas.drawParagraph(paragraph, padding, padding);
};

export const Paragraph = () => {
  const progress = useLoop();
  const onDraw = useOnDraw(drawParagraph.bind(null, progress));
  return (
    <div style={{ display: "flex", flex: 1 }}>
      <div style={{ flex: 1, display: "flex" }}>
        <Canvas onDraw={onDraw} deps={[progress]} />
      </div>
      <div style={{ flex: 1, display: "flex", position: "relative" }}>
        <div style={{ width: wrapTo, fontSize: 64, fontFamily: "sans-serif" }}>
          The quick brown fox 🦊 ate a zesty hamburgerfons 🍔. The 👩‍👩‍👧‍👧 laughed.
        </div>
        <div
          style={{
            backgroundColor: "black",
            width: 4,
            height,
            position: "absolute",
            top: 0,
            left: wrapTo,
          }}
        />
      </div>
    </div>
  );
};
