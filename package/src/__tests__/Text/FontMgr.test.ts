import { postScriptName } from "../../Text/fontMetadata";
import {
  Pacifico,
  RobotoLightData,
  RobotoMediumData,
  RoboBlackItalic,
} from "../setup";

describe("FontMgr", () => {
  it("should read the font metadata properly", () => {
    expect(postScriptName(RobotoLightData.buffer)).toBe("Roboto-Light");
    expect(postScriptName(RoboBlackItalic.buffer)).toBe("Roboto-BlackItalic");
    expect(postScriptName(RobotoMediumData.buffer)).toBe("Roboto-Medium");
    expect(postScriptName(Pacifico.buffer)).toBe("Pacifico-Regular");
  });
});
