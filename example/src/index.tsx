import React from "react";
import ReactDOM from "react-dom/client";
import { CanvasKitJS } from "canvaskit-js";
import type { CanvasKit } from "canvaskit-wasm";

import App from "./App";

declare global {
  var CanvasKit: CanvasKit;
}

global.CanvasKit = CanvasKitJS.getInstance();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
