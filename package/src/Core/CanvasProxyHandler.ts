/* eslint-disable @typescript-eslint/no-explicit-any */
export class CanvasProxyHandler
  implements ProxyHandler<CanvasRenderingContext2D>
{
  constructor() {
    console.log("===========");
    console.log("New Drawing");
    console.log("===========");
  }

  get(
    target: CanvasRenderingContext2D,
    property: keyof CanvasRenderingContext2D
  ) {
    const origProperty = target[property];
    if (typeof origProperty === "function") {
      return (...args: any[]) => {
        console.log(
          `${String(property)}(${args
            .map((arg) => JSON.stringify(arg))
            .join(", ")});`
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
    console.log(`${String(property)} = ${JSON.stringify(value)};`);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    target[property] = value;
    return true; // indicates that the assignment succeeded
  }
}
