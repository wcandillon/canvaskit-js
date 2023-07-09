import { fontMetadata } from "../../Text/FontMetadata";
import { Pacifico, RobotoLight, RobotoMedium, RoboBlackItalic } from "../setup";

describe("FontMgr", () => {
  it("should read the font metadata properly", () => {
    expect(fontMetadata(RobotoLight.buffer)).toBe("Roboto");
    expect(fontMetadata(RoboBlackItalic.buffer)).toBe("Roboto");
    expect(fontMetadata(RobotoMedium.buffer)).toBe("Roboto");
    expect(fontMetadata(Pacifico.buffer)).toBe("Pacifico");
  });
});
