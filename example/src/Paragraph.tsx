import type { Canvas as CKCanvas } from "canvaskit-wasm";

import type { AnimationValue, Info } from "./components";
import { Canvas, mix, useLoop, useOnDraw } from "./components";

const paraStyle = new CanvasKit.ParagraphStyle({
  textStyle: {
    color: CanvasKit.BLACK,
    fontFamilies: ["Roboto"],
    fontSize: 28,
  },
  // textAlign: CanvasKit.TextAlign.Left,
});

const tf = CanvasKit.TypefaceFontProvider.Make();

const text =
  "The quick brown fox 🦊 ate a zesty hamburgerfons 🍔.\nThe 👩‍👩‍👧‍👧 laughed.";

const builder = CanvasKit.ParagraphBuilder.MakeFromFontProvider(paraStyle, tf);
builder.addText(text);
const paragraph = builder.build();

const drawParagraph = (
  progress: AnimationValue,
  canvas: CKCanvas,
  _info: Info
) => {
  paragraph.layout(mix(progress.value, 100, 1024));
  canvas.drawParagraph(paragraph, 16, 16);
};

export const Paragraph = () => {
  const progress = useLoop();
  const onDraw = useOnDraw(drawParagraph.bind(null, progress));
  return <Canvas onDraw={onDraw} deps={[progress]} />;
};
