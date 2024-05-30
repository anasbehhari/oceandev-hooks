import { useCallback, useEffect, useRef, useState } from 'react';

interface ScrollPosition {
  x: number;
  y: number;
}

type ScrollDirection = 'top' | 'bottom' | 'left' | 'right';

interface ScrollToOptions {
  direction?: ScrollDirection;
  position?: Partial<ScrollPosition>;
}

/**
 * Custom hook to manage scroll position within a scrollable container.
 *
 * @param {ScrollPosition} [initialScrollPosition] - Optional initial scroll position.
 * @returns {readonly [ScrollPosition, React.RefObject<T>, (options?: ScrollToOptions) => void, boolean]} An array containing:
 * - `scrollPosition`: The current scroll position `{ x, y }`.
 * - `scrollContainerRef`: A ref object to attach to the scrollable container.
 * - `scrollTo`: A function to scroll the container to specified coordinates or direction.
 * - `isAtBottom`: A boolean indicating if the container is scrolled to the bottom.
 */
function useScrollPosition<T extends HTMLElement = HTMLElement>(
  initialScrollPosition?: ScrollPosition
) {
  // State to store the current scroll position
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>(
    initialScrollPosition || {
      x: 0,
      y: 0,
    }
  );

  // State to indicate if the scroll position is at the bottom of the container
  const [isAtBottom, setIsAtBottom] = useState<boolean>(false);

  // Ref to store the reference to the scrollable container element
  const scrollContainerRef = useRef<T>(null);

  /**
   * Scroll the container to the specified coordinates or direction with smooth behavior.
   */
  const scrollTo = useCallback((options?: ScrollToOptions) => {
    if (scrollContainerRef.current) {
      const { direction, position } = options || {};

      let left = position?.x;
      let top = position?.y;

      switch (direction) {
        case 'top':
          top = 0;
          break;
        case 'bottom':
          top = scrollContainerRef.current.scrollHeight;
          break;
        case 'left':
          left = 0;
          break;
        case 'right':
          left = scrollContainerRef.current.scrollWidth;
          break;
      }

      scrollContainerRef.current.scrollTo({
        left: left !== undefined ? left : scrollContainerRef.current.scrollLeft,
        top: top !== undefined ? top : scrollContainerRef.current.scrollTop,
        behavior: 'smooth',
      });
    }
  }, []);

  useEffect(() => {
    /**
     * Update the scroll position state based on the current scroll position
     * of the scrollable container.
     */
    const updateScrollPosition = () => {
      if (scrollContainerRef.current) {
        const {
          clientHeight = 0,
          scrollHeight = 0,
          scrollTop = 0,
        } = scrollContainerRef.current;

        // Check if the scroll position is at the bottom
        setIsAtBottom(scrollHeight - scrollTop === clientHeight);

        // Update the scroll position state
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

    const resetOnElementChange = (mutationList: any) => {
      for (const mutation of mutationList) {
        if (mutation.type === 'childList' && currentRef) {
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
        }
      }
    };

    if (currentRef) {
      // Add scroll event listener to update scroll position
      currentRef.addEventListener('scroll', updateScrollPosition);

      // Set initial scroll position if provided
      if (initialScrollPosition) {
        currentRef.scrollTo({
          left: initialScrollPosition.x,
          top: initialScrollPosition.y,
        });
      }

      // Observe changes in the container's children
      const observer = new MutationObserver(resetOnElementChange);
      observer.observe(currentRef, {
        attributes: true,
        childList: true,
        subtree: true,
      });

      // Cleanup function to remove the scroll event listener and disconnect the observer
      return () => {
        currentRef.removeEventListener('scroll', updateScrollPosition);
        observer.disconnect();
      };
    }
  }, []);

  // Return the scroll position, ref, scrollTo function, and isAtBottom state
  return [scrollPosition, scrollContainerRef, scrollTo, isAtBottom] as const;
}

export default useScrollPosition;
