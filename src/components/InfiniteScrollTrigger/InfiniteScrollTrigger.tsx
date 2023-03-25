import { useState, useEffect, type RefObject, useRef } from "react";

function useOnScreen(ref: RefObject<HTMLElement>, rootMargin = "0px") {
  const [isIntersecting, setIntersecting] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) {
          setIntersecting(entry.isIntersecting);
        }
      },
      {
        rootMargin,
      }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [ref, rootMargin]);

  return isIntersecting;
}

interface InfiniteScrollTriggerProps {
  onScreenEnter: () => void;
}

export default function InfiniteScrollTrigger({
  onScreenEnter,
}: InfiniteScrollTriggerProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInViewport = useOnScreen(ref);

  useEffect(() => {
    if (isInViewport) {
      onScreenEnter();
    }
  }, [isInViewport, onScreenEnter]);

  return <div ref={ref} />;
}
