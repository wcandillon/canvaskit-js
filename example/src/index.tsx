import { Fragment, StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { CanvasKitJS } from "canvaskit-js";
import type { CanvasKit } from "canvaskit-wasm";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Breathe } from "./Breathe";
import { Menu } from "./Menu";
import { Glassmorphism } from "./Glassmorphism";
import { Playground } from "./Playground";
import { Shaders } from "./Shaders";
import { Shader } from "./Shader";
import { Compare } from "./Compare";
import { CanvasKitProvider } from "./components/CanvasKitContext";

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
const router = createBrowserRouter([
  {
    path: "/",
    element: <Menu />,
  },
  {
    path: "/breathe",
    element: <Breathe />,
  },
  {
    path: "/glassmorphism",
    element: <Glassmorphism />,
  },
  {
    path: "/shader",
    element: <Shader />,
  },
  {
    path: "/shaders",
    element: <Shaders />,
  },
  {
    path: "/compare",
    element: <Compare />,
  },
  {
    path: "/playground",
    element: <Playground />,
  },
]);
root.render(
  <Wapper>
    <CanvasKitProvider>
      <RouterProvider router={router} />
    </CanvasKitProvider>
  </Wapper>
);
