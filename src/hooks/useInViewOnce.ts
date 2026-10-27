import { useEffect, useRef, useState } from "react";

/** Reveal once on entry; never hide content again after scrolling or preference changes. */
export function useInViewOnce<T extends Element = HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;
    const reveal = () => {
      setVisible(true);
      observer?.disconnect();
    };
    const handlePreference = () => {
      if (motion.matches) reveal();
    };

    if (motion.matches || !("IntersectionObserver" in window)) {
      reveal();
    } else {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) reveal();
        },
        { threshold: 0.08, rootMargin: "0px 0px -24px 0px" },
      );
      observer.observe(node);
    }
    motion.addEventListener("change", handlePreference);
    return () => {
      observer?.disconnect();
      motion.removeEventListener("change", handlePreference);
    };
  }, []);

  return { ref, visible };
}
