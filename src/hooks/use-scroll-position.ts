import { useCallback, useEffect, useRef, useState } from 'react';
interface ScrollPosition {
  x: number;
  y: number;
}

function useScrollPosition<T extends HTMLElement = HTMLElement>(
  initialScrollPosition?: ScrollPosition
) {
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({
    x: 0,
    y: 0,
  });
  const [isAtBottom, setIsAtBottom] = useState<boolean>(false);
  const scrollContainerRef = useRef<T>(null);

  const scrollToTop = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, []);

  useEffect(() => {
    const updateScrollPosition = () => {
      if (scrollContainerRef.current) {
        const {
          clientHeight = 0,
          scrollHeight = 0,
          scrollTop = 0,
        } = scrollContainerRef.current;
        setIsAtBottom(scrollHeight - scrollTop === clientHeight);
        setScrollPosition({
          x: scrollContainerRef.current.scrollLeft,
          y: scrollContainerRef.current.scrollTop,
        });
      } else {
        setScrollPosition({ x: 0, y: 0 });
        setIsAtBottom(false);
      }
    };

    const currentRef = scrollContainerRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', updateScrollPosition);
      if (initialScrollPosition) {
        currentRef.scrollTo({
          left: initialScrollPosition.x,
          top: initialScrollPosition.y,
          behavior: 'smooth',
        });
      }
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener('scroll', updateScrollPosition);
      }
    };
  }, [initialScrollPosition]);

  return [scrollPosition, scrollContainerRef, scrollToTop, isAtBottom] as const;
}

export default useScrollPosition;
