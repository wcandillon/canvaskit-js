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
  heightMultiplier: 1.6,
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

// 300 -> 600

const drawParagraph = (
  progress: AnimationValue,
  canvas: CKCanvas,
  _info: Info
) => {
  const wrapTo = mix(progress.value, padding + 200, padding + 1000);
  const height = 600;
  canvas.drawLine(padding + wrapTo, 0, padding + wrapTo, height, paint);

  paragraph.layout(wrapTo);
  canvas.drawParagraph(paragraph, padding, padding);
};

export const Paragraph2 = () => {
  const progress = useLoop();
  const onDraw = useOnDraw(drawParagraph.bind(null, progress));
  return (
    <div style={{ display: "flex", flex: 1 }}>
      <Canvas onDraw={onDraw} deps={[progress]} />
    </div>
  );
};
