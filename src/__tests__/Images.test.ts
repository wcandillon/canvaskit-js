import { checkImage, skia } from "./setup";

describe("Images", () => {
  it("should display an image", async () => {
    const image = await skia.eval(({ canvas, assets: { zurich } }) => {
      canvas.drawImage(zurich, 0, 0, null);
    });
    checkImage(image, "snapshots/zurich.png", { overwrite: true });
  });
});
