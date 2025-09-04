
//src/hooks/useIntersectionObserver.ts
import { useEffect, useState } from "react";
// import { buildThresholdList } from "src/utils";

export default function useIntersectionObserver<T extends Element>(
    ref: React.RefObject<T | null>,
    options?: IntersectionObserverInit
) {
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
    const node = ref.current;
    if (!node) return;

    // SSR ve destek kontrolü
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
        return;
    }
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setEntry(entry);
      },
      options ?? {
        root: null,
        rootMargin: "0px",
        // threshold: buildThresholdList(),
        threshold: 1,
      }
    );

    if (ref.current) {
        observer.observe(node);

    }

      return () => observer.disconnect();
  }, [ref, options?.root, options?.rootMargin, options?.threshold]);

  return entry;
}
