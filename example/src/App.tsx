import { Fragment, StrictMode } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Breathe } from "./Breathe";
import { Menu } from "./Menu";
import { Glassmorphism } from "./Glassmorphism";
import { Playground } from "./Playground";
import { Shaders } from "./Shaders";
import { Shader } from "./Shader";
import { CanvasKitProvider } from "./components/CanvasKitContext";
import { Shader1 } from "./Shader1";
import { Shader2 } from "./Shader2";
import { Hello } from "./Hello";
import { Paragraph } from "./Paragraph";
import { Paragraph2 } from "./Paragraph2";

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
    path: "/paragraph",
    element: <Paragraph />,
  },
  {
    path: "/paragraph2",
    element: <Paragraph2 />,
  },
  {
    path: "/shader1",
    element: <Shader1 />,
  },
  {
    path: "/shader2",
    element: <Shader2 />,
  },
  {
    path: "/playground",
    element: <Playground />,
  },
  {
    path: "/hello",
    element: <Hello />,
  },
]);

const App = () => {
  return (
    <Wapper>
      <CanvasKitProvider>
        <RouterProvider router={router} />
      </CanvasKitProvider>
    </Wapper>
  );
};

// eslint-disable-next-line import/no-default-export
export default App;
