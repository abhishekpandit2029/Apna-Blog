import { useEffect, useRef, RefObject } from 'react';

interface UseIntersectionObserverProps {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  onIntersect: () => void;
  enabled?: boolean;
}

export const useIntersectionObserver = <T extends Element>({
  root = null,
  rootMargin = '100px',
  threshold = 0.1,
  onIntersect,
  enabled = true
}: UseIntersectionObserverProps): RefObject<T> => {
  const observer = useRef<IntersectionObserver | null>(null);
  const targetRef = useRef<T>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    // Clear existing observer
    if (observer.current) {
      observer.current.disconnect();
    }

    // Create new observer with debouncing
    let timeout: NodeJS.Timeout;
    observer.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          // Debounce the callback to prevent multiple rapid calls
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            onIntersect();
          }, 300);
        }
      },
      { root, rootMargin, threshold }
    );

    // Observe target element
    const currentTarget = targetRef.current;
    if (currentTarget) {
      observer.current.observe(currentTarget);
    }

    // Cleanup
    return () => {
      if (observer.current && currentTarget) {
        clearTimeout(timeout);
        observer.current.unobserve(currentTarget);
        observer.current.disconnect();
      }
    };
  }, [root, rootMargin, threshold, onIntersect, enabled]);

  return targetRef;
};