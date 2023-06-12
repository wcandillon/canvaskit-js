import type {
  CanvasKit,
  RuntimeEffect,
  Canvas as SkCanvas,
} from "canvaskit-wasm";
import { useMemo } from "react";

import type { AnimationValue, Info } from "./components";
import { useClock, useOnDraw } from "./components";
import { CanvasWASM } from "./components/CanvasWASM";
import { useCanvasKitWASM } from "./components/CanvasKitContext";

const drawShader = (
  progress: AnimationValue,
  rt: RuntimeEffect,
  CanvasKit: CanvasKit,
  canvas: SkCanvas,
  { width, height }: Info
) => {
  const paint = new CanvasKit.Paint();
  paint.setShader(rt.makeShader([progress.value, width, height]));
  canvas.drawColor(CanvasKit.BLACK);
  canvas.drawPaint(paint);
};

export const Shader1 = () => {
  const CanvasKit = useCanvasKitWASM();
  const progress = useClock();
  const rt = useMemo(() => {
    return CanvasKit.RuntimeEffect.Make(`
uniform float iTime;
uniform vec2 iResolution;

// Source: @XorDev https://twitter.com/XorDev/status/1475524322785640455
vec4 main(vec2 FC) {
  vec4 o = vec4(0);
  vec2 p = vec2(0), c=p, u=FC.xy*2.-iResolution.xy;
  float a;
  for (float i=0; i<4e2; i++) {
    a = i/2e2-1.;
    p = cos(i*2.4+iTime+vec2(0,11))*sqrt(1.-a*a);
    c = u/iResolution.y+vec2(p.x,a)/(p.y+2.);
    o += (cos(i+vec4(0,2,4,0))+1.)/dot(c,c)*(1.-p.y)/3e4;
  }
  return o;
}
`)!;
  }, [CanvasKit.RuntimeEffect]);
  const onDraw = useOnDraw(drawShader.bind(null, progress, rt, CanvasKit), []);
  return <CanvasWASM onDraw={onDraw} deps={[progress]} />;
};
