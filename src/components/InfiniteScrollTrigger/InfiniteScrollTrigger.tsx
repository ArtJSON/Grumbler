import { useState, useEffect, RefObject, useRef } from "react";

function useOnScreen(ref: RefObject<any>, rootMargin = "0px") {
  // State and setter for storing whether element is visible
  const [isIntersecting, setIntersecting] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update our state when observer callback fires
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
      observer.unobserve(ref.current);
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount
  return isIntersecting;
}

interface InfiniteScrollTriggerProps {
  onScreenEnter: () => void;
}

export default function InfiniteScrollTrigger({
  onScreenEnter,
}: InfiniteScrollTriggerProps) {
  const ref = useRef<HTMLInputElement | null>(null);
  const isInViewport = useOnScreen(ref);

  useEffect(() => {
    if (isInViewport) {
      onScreenEnter();
    }
  }, [isInViewport]);

  return <div ref={ref} />;
}
