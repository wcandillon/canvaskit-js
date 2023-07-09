import { getFontMetadata } from "../../Text/Fontname";
import { Pacifico, RobotoLight, RobotoMedium } from "../setup";

describe("FontMgr", () => {
  it("should read the font metadata properly", () => {
    let metadata = getFontMetadata(RobotoLight);
    expect(metadata.typoFamilyName).toEqual("Roboto");
    expect(metadata.typoSubfamilyName).toEqual("Light");
    metadata = getFontMetadata(RobotoMedium);
    expect(metadata.typoFamilyName).toEqual("Roboto");
    expect(metadata.typoSubfamilyName).toEqual("Medium");
    metadata = getFontMetadata(Pacifico);
    console.log({ metadata });
    expect(metadata.fontFamily).toEqual("Pacifico");
    expect(metadata.fontSubfamily).toEqual("Regular");
  });
});
