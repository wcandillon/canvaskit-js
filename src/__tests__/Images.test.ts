import { checkImage, skia } from "./setup";

describe("Images", () => {
  it("should display an image", async () => {
    const image = await skia.eval(
      ({ CanvasKit, width, height, canvas, center }) => {
        const paint = new CanvasKit.Paint();
        const image = CanvasKit.MakeImageFromEncoded(
          CanvasKit.getDataUriAsBytes(
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAADElEQVQImWNgoBMAAABpAAFEI8ARAAAAAElFTkSuQmCC"
          )
        );
        canvas.drawImage(image, 0, 0, paint);
      }
    );
    checkImage(image, "snapshots/image.png");
  });
);