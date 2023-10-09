/* eslint-disable @typescript-eslint/no-explicit-any */
export class CanvasProxyHandler
  implements ProxyHandler<CanvasRenderingContext2D>
{
  private commands: string[] = [];

  get(
    target: CanvasRenderingContext2D,
    property: keyof CanvasRenderingContext2D
  ) {
    const origProperty = target[property];
    if (typeof origProperty === "function") {
      return (...args: any[]) => {
        const cmd = `ctx.${String(property)}(${args
          .map((arg) => JSON.stringify(arg))
          .join(", ")});`;
        if (property === "save") {
          this.commands.push("<layer>");
        } else if (property === "restore") {
          this.commands.push("</layer>");
        } else {
          this.commands.push(cmd);
        }
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
    this.commands.push(`ctx.${String(property)} = ${JSON.stringify(value)};`);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    target[property] = value;
    return true; // indicates that the assignment succeeded
  }

  flush() {
    console.log(`<drawing>${this.commands.join("\n")}</drawing>`);
  }
}
