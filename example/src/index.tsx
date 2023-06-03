import { Fragment, StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { CanvasKitJS } from "canvaskit-js";
import type { CanvasKit } from "canvaskit-wasm";

import App from "./App";

declare global {
  // eslint-disable-next-line no-var
  var CanvasKit: CanvasKit;
}

global.CanvasKit = CanvasKitJS.getInstance();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
const strictMode = false;
const Wapper = strictMode ? StrictMode : Fragment;
root.render(
  <Wapper>
    <App />
  </Wapper>
);
