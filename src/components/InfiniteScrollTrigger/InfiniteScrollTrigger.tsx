import { useState, useEffect, RefObject, useRef } from "react";

function useOnScreen(ref: RefObject<any>, rootMargin = "0px") {
  const [isIntersecting, setIntersecting] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIntersecting(entry!.isIntersecting);
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
  }, []);
  return isIntersecting;
}

interface InfiniteScrollTriggerProps {
  active: boolean;
  onScreenEnter: () => void;
}

export default function InfiniteScrollTrigger({
  onScreenEnter,
  active,
}: InfiniteScrollTriggerProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInViewport = useOnScreen(ref);

  useEffect(() => {
    if (isInViewport) {
      onScreenEnter();
    }
  }, [isInViewport]);

  return <div ref={ref}></div>;
}
