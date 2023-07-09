import { postScriptName } from "../../Text/fontMetadata";
import { Pacifico, RobotoLight, RobotoMedium, RoboBlackItalic } from "../setup";

describe("FontMgr", () => {
  it("should read the font metadata properly", () => {
    expect(postScriptName(RobotoLight.buffer)).toBe("Roboto");
    expect(postScriptName(RoboBlackItalic.buffer)).toBe("Roboto");
    expect(postScriptName(RobotoMedium.buffer)).toBe("Roboto");
    expect(postScriptName(Pacifico.buffer)).toBe("Pacifico");
  });
});
