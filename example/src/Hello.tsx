/* eslint-disable max-len */
import type { Canvas as CKCanvas } from "canvaskit-wasm";

import type { AnimationValue, Info } from "./components";
import { Canvas, useOnDraw, useLoop, fitbox } from "./components";

// https://www.shadertoy.com/view/XsVSzW
const plasma = CanvasKit.RuntimeEffect.Make(`
uniform float iTime;
uniform vec2 iResolution;

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
	float time=iTime*1.0;
	vec2 uv = (fragCoord.xy / iResolution.xx-0.5)*8.0;
    vec2 uv0=uv;
	float i0=1.0;
	float i1=1.0;
	float i2=1.0;
	float i4=0.0;
	for(int s=0;s<7;s++)
	{
		vec2 r;
		r=vec2(cos(uv.y*i0-i4+time/i1),sin(uv.x*i0-i4+time/i1))/i2;
        r+=vec2(-r.y,r.x)*0.3;
		uv.xy+=r;
        
		i0*=1.93;
		i1*=1.15;
		i2*=1.7;
		i4+=0.05+0.1*time*i1;
	}
  float r=sin(uv.x-time)*0.5+0.5;
  float b=sin(uv.y+time)*0.5+0.5;
  float g=sin((uv.x+uv.y+sin(time*0.5))*0.5)*0.5+0.5;
	fragColor = vec4(r,g,b,1.0);
}`)!;

// const colors = [
//   "#3FCEBC",
//   "#3СВСЕВ",
//   "#5F96E7",
//   "#816FE3",
//   "#9F5EE2",
//   "#BD4CEO",
//   "#DE589F",
//   "#FF645E",
//   "#FDA859",
//   "#FAEC54",
//   "#9EE671",
//   "#41E08D",
// ].map((cl) => CanvasKit.parseColorString(cl));

const pad = 50;

const paint = new CanvasKit.Paint();
paint.setStyle(CanvasKit.PaintStyle.Stroke);
paint.setStrokeWidth(pad);
paint.setStrokeCap(CanvasKit.StrokeCap.Round);
paint.setStrokeJoin(CanvasKit.StrokeJoin.Round);
// paint.setShader(
//   CanvasKit.Shader.MakeLinearGradient(
//     Float32Array.of(0, 0),
//     Float32Array.of(1838.4, 0),
//     colors,
//     null,
//     CanvasKit.TileMode.Clamp
//   )
// );

const path = CanvasKit.Path.MakeFromSVGString(
  "M50 798.409C50 798.409 172.047 665.479 275.44 546.213C456.322 337.625 654.197 94.016 486.028 53.2177C424.924 38.3733 378.131 101.103 349.064 150.425C229.094 353.427 191.818 689.933 190.253 971.626C222.865 873.493 340.025 614.976 454.214 622.095C586.099 630.3 470.44 827.97 500.05 913.589C545.789 1034.23 671.541 940.533 741.045 891.434C855.841 810.285 929.497 743.852 929.497 645.623C929.497 521.44 758.006 561.249 719.708 660.595C689.78 738.169 690.962 854.531 738.873 912.791C796.974 983.47 925.313 995.122 1003.6 926.582C1082.88 857.148 1139.29 754.514 1184.07 685.783C1296.63 512.885 1489.68 280.737 1440.81 101.582C1434.17 77.2243 1413.02 58.6128 1387.79 57.6232C1263.73 52.8027 1226.1 322.333 1205.37 418.519C1184.39 515.949 1108.97 839.91 1198.22 941.267C1298.26 1054.66 1431.96 843.389 1490.64 745.288C1503.41 724.985 1515.97 703.021 1527.11 685.91C1639.71 513.012 1832.76 280.864 1783.86 101.71C1777.25 77.3519 1756.1 58.7404 1730.87 57.7508C1606.81 52.9304 1569.18 322.461 1548.45 418.646C1527.43 516.077 1452.05 840.037 1541.3 941.394C1641.3 1054.79 1802.83 853.381 1835.54 749.087C1882.49 599.238 1989.81 553.46 2117.48 581.265C1974.03 537.753 1861.79 643.133 1835.54 750.045C1816.92 825.927 1838.35 906.47 1920.53 949.918C2141.85 1066.89 2379.05 681.505 2117.48 581.265C2062.42 586.373 2038.4 659.414 2061.2 732.87C2096.34 848.401 2256.04 862.128 2348 822.958"
)!;
const bounds = path.computeTightBounds();
const output = CanvasKit.XYWHRect(275, 100, 350, 400);
const transform = fitbox("cover", bounds, output);
path.transform(transform);

const drawShader = (
  progress: AnimationValue,
  canvas: CKCanvas,
  { width, height }: Info
) => {
  paint.setShader(plasma.makeShader([progress.value, width, height]));
  const pathToDraw = path.copy().trim(0, 1 - progress.value, false)!;
  canvas.save();
  canvas.drawPath(pathToDraw, paint);
  canvas.restore();
};

export const Hello = () => {
  const progress = useLoop();
  const onDraw = useOnDraw(drawShader.bind(null, progress), []);
  return <Canvas onDraw={onDraw} deps={[progress]} />;
};
