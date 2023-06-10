import type { ReactNode } from "react";
import { useContext, createContext, useEffect, useState } from "react";
import type { CanvasKit } from "canvaskit-wasm";
import CanvasKitInit from "canvaskit-wasm";

const CanvasKitContext = createContext<CanvasKit | null>(null);

export const useCanvasKitWASM = () => {
  const CanvasKit = useContext(CanvasKitContext);
  if (!CanvasKit) {
    throw new Error("CanvasKit not initialized");
  }
  return CanvasKit;
};

interface CanvasKitProviderProps {
  children: ReactNode | ReactNode[];
}

export const CanvasKitProvider = ({ children }: CanvasKitProviderProps) => {
  const [CanvasKit, setCanvasKit] = useState<CanvasKit | null>(null);
  useEffect(() => {
    CanvasKitInit({
      locateFile: (file) =>
        "https://unpkg.com/canvaskit-wasm@0.38.1/bin/" + file,
    }).then((Ck) => {
      setCanvasKit(Ck);
    });
  }, []);
  if (CanvasKit === null) {
    return null;
  }
  return (
    <CanvasKitContext.Provider value={CanvasKit}>
      {children}
    </CanvasKitContext.Provider>
  );
};
