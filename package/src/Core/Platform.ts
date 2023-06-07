/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO: rename
export const createTexture = (
  width: number,
  height: number,
  options?: CanvasRenderingContext2DSettings
) => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", options);
  if (!ctx) {
    throw new Error("Could not create 2d context");
  }
  return ctx;
};

// TODO: rename
export const createOffscreenTexture = (
  width: number,
  height: number,
  options?: CanvasRenderingContext2DSettings
) => {
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext("2d", options);
  if (!ctx) {
    throw new Error("Could not create 2d context");
  }
  return ctx;
};

class Context2DProxyHandler implements ProxyHandler<CanvasRenderingContext2D> {
  get(
    target: CanvasRenderingContext2D,
    property: keyof CanvasRenderingContext2D
  ) {
    const origProperty = target[property];
    if (typeof origProperty === "function") {
      return function (...args: any[]) {
        console.log(
          `${String(property)}(${args.map((a) => a.toString().join(", "))})`
        );
        return (origProperty as (...args: any[]) => any).apply(target, args);
      };
    } else {
      return origProperty;
    }
  }
  set(
    target: CanvasRenderingContext2D,
    property: keyof CanvasRenderingContext2D,
    value: any
  ) {
    console.log(`${String(property)}=`, value);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    target[property] = value;
    return true; // indicates that the assignment succeeded
  }
}

export const resolveContext = (
  canvas: string | HTMLCanvasElement,
  options?: CanvasRenderingContext2DSettings
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
  return new Proxy(
    resolved.getContext("2d", options)!,
    new Context2DProxyHandler()
  );
};

// const WARN_ON_UNUSED_PARAMETERS = false;

// export const unusedParameter = (name: string) => {
//   if (WARN_ON_UNUSED_PARAMETERS) {
//     try {
//       throw new Error();
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     } catch (e: any) {
//       console.warn(`Unused parameter ${name} in ${e.stack}`);
//     }
//   }
// };
