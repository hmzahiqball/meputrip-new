import { useLayoutEffect, useRef, useState } from "react";
import type { Viewport } from "../utils/mapGeometry";

export function useMapViewport() {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<Viewport>({ width: 1040, height: 420 });
  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    const measure = () => {
      const width = Math.round(node.clientWidth),
        height = Math.round(node.clientHeight);
      if (width && height)
        setSize((previous) =>
          previous.width === width && previous.height === height
            ? previous
            : { width, height },
        );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return { ref, size };
}
