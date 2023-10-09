import type { RefObject } from "react";
import { useLayoutEffect } from "react";

const DOM_LAYOUT_HANDLER_NAME = "__reactLayoutHandler";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type OnLayout = ((event: any) => void) | undefined;
export type CanvasRef = HTMLCanvasElement & {
  __reactLayoutHandler: OnLayout;
};

let resizeObserver: ResizeObserver | null = null;

const getObserver = () => {
  if (resizeObserver == null) {
    resizeObserver = new window.ResizeObserver(function (entries) {
      entries.forEach((entry) => {
        const node = entry.target as CanvasRef;
        const { left, top, width, height } = entry.contentRect;
        const onLayout = node[DOM_LAYOUT_HANDLER_NAME];
        if (typeof onLayout === "function") {
          // setTimeout 0 is taken from react-native-web (UIManager)
          setTimeout(
            () =>
              onLayout({
                timeStamp: Date.now(),
                nativeEvent: { layout: { x: left, y: top, width, height } },
                currentTarget: 0,
                target: 0,
                bubbles: false,
                cancelable: false,
                defaultPrevented: false,
                eventPhase: 0,
                isDefaultPrevented() {
                  throw new Error("Method not supported on web.");
                },
                isPropagationStopped() {
                  throw new Error("Method not supported on web.");
                },
                persist() {
                  throw new Error("Method not supported on web.");
                },
                preventDefault() {
                  throw new Error("Method not supported on web.");
                },
                stopPropagation() {
                  throw new Error("Method not supported on web.");
                },
                isTrusted: true,
                type: "",
              }),
            0
          );
        }
      });
    });
  }
  return resizeObserver;
};

export const useElementLayout = (
  ref: RefObject<CanvasRef>,
  onLayout: OnLayout
) => {
  const observer = getObserver();

  useLayoutEffect(() => {
    const node = ref.current;
    if (node !== null) {
      node[DOM_LAYOUT_HANDLER_NAME] = onLayout;
    }
  }, [ref, onLayout]);

  useLayoutEffect(() => {
    const node = ref.current;
    if (node != null && observer != null) {
      if (typeof node[DOM_LAYOUT_HANDLER_NAME] === "function") {
        observer.observe(node);
      } else {
        observer.unobserve(node);
      }
    }
    return () => {
      if (node != null && observer != null) {
        observer.unobserve(node);
      }
    };
  }, [observer, ref]);
};
