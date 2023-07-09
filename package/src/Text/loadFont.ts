import { postScriptName } from "./fontMetadata";

export const loadFont = (data: ArrayBuffer, familynameAlias?: string) => {
  const familyName = familynameAlias ?? postScriptName(data);
  const font = new FontFace(familyName, data);
  font.load();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  document.fonts.add(font);
  return familyName;
};
