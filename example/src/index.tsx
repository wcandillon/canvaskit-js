import React from "react";
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
if (strictMode) {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  root.render(<App />);
}
