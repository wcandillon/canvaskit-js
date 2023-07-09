import { fontMetadata } from "./FontMetadata";

export const loadFont = (data: ArrayBuffer, familynameAlias?: string) => {
  const familyName = familynameAlias ?? fontMetadata(data);
  // Create a Blob from the byte array.
  const blob = new Blob([new Uint8Array(data)], {
    type: "application/octet-stream",
  });
  // Create an Object URL from the Blob.
  const url = URL.createObjectURL(blob);
  // Now, inject new style to the document
  const style = document.createElement("style");
  style.innerHTML = `
@font-face {
    font-family: '${familyName}';
    src: url(${url});
}`;
  document.head.appendChild(style);
  return familyName;
};
