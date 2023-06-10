import type { Canvas as CKCanvas } from "canvaskit-wasm";

import type { AnimationValue, Info } from "./components";
import { useClock, Canvas, useOnDraw } from "./components";

const filter = CanvasKit.RuntimeEffect.Make(`precision mediump float;

uniform float iTime;
uniform vec2 iResolution;

void main() {
  vec4 o = vec4(0);
  vec2 p = vec2(0), c=p, u=gl_FragCoord.xy*2.-iResolution.xy;
  float a;
  for (float i=0.0; i<4e2; i++) {
    a = i/2e2-1.;
    p = cos(i*2.4+iTime+vec2(0,11))*sqrt(1.-a*a);
    c = u/iResolution.y+vec2(p.x,a)/(p.y+2.);
    o += (cos(i+vec4(0,2,4,0))+1.)/dot(c,c)*(1.-p.y)/3e4;
  }
  gl_FragColor = o;
}`)!;

const drawShader = (
  progress: AnimationValue,
  canvas: CKCanvas,
  { width, height }: Info
) => {
  const paint = new CanvasKit.Paint();
  paint.setShader(filter.makeShader([progress.value, width, height]));
  canvas.drawColor(CanvasKit.BLACK);
  canvas.drawPaint(paint);
};

export const Shader = () => {
  const progress = useClock();
  const onDraw = useOnDraw(drawShader.bind(null, progress), []);
  return <Canvas onDraw={onDraw} deps={[progress]} />;
};
