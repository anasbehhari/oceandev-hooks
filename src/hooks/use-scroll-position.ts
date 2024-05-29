import { useCallback, useEffect, useRef, useState } from 'react';

interface ScrollPosition {
  x: number;
  y: number;
}

/**
 * Custom hook to manage scroll position within a scrollable container.
 *
 * @param {ScrollPosition} [initialScrollPosition] - Optional initial scroll position.
 * @returns {readonly [ScrollPosition, React.RefObject<T>, () => void, boolean]} An array containing:
 * - `scrollPosition`: The current scroll position `{ x, y }`.
 * - `scrollContainerRef`: A ref object to attach to the scrollable container.
 * - `scrollToTop`: A function to scroll the container to the top.
 * - `isAtBottom`: A boolean indicating if the container is scrolled to the bottom.
 */
function useScrollPosition<T extends HTMLElement = HTMLElement>(
  initialScrollPosition?: ScrollPosition
) {
  // State to store the current scroll position
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({
    x: 0,
    y: 0,
  });

  // State to indicate if the scroll position is at the bottom of the container
  const [isAtBottom, setIsAtBottom] = useState<boolean>(false);

  // Ref to store the reference to the scrollable container element
  const scrollContainerRef = useRef<T>(null);

  /**
   * Scroll the container to the top with smooth behavior.
   */
  const scrollToTop = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
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

    if (currentRef) {
      // Add scroll event listener to update scroll position
      currentRef.addEventListener('scroll', updateScrollPosition);

      // Set initial scroll position if provided
      if (initialScrollPosition) {
        currentRef.scrollTo({
          left: initialScrollPosition.x,
          top: initialScrollPosition.y,
          behavior: 'smooth',
        });
      }
    }

    // Cleanup function to remove the scroll event listener
    return () => {
      if (currentRef) {
        currentRef.removeEventListener('scroll', updateScrollPosition);
      }
    };
  }, [initialScrollPosition]);

  // Return the scroll position, ref, scrollToTop function, and isAtBottom state
  return [scrollPosition, scrollContainerRef, scrollToTop, isAtBottom] as const;
}

export default useScrollPosition;
