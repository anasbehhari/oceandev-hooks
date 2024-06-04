import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook to detect clicks outside a specified element and manage open state.
 *
 * @template T - The type of the element to detect clicks outside of. Defaults to `HTMLElement`.
 * @param {() => void} onClickOutside - Function to call when a click outside the specified element is detected.
 * @returns {[boolean, () => void, React.RefObject<T>]} An array containing:
 * - `isOpen`: Boolean indicating if the element is open.
 * - `toggleOpen`: Function to toggle the open state.
 * - `elementRef`: A ref object to attach to the element you want to detect clicks outside of.
 * test
 *
 * @example
 * const [isOpen, toggleOpen, ref] = useClickOutside(() => {
 *   console.log('Clicked outside!');
 * });
 */
function useClickOutside<T extends HTMLElement = HTMLElement>(
  callback?: () => void
) {
  const [isOpen, setIsOpen] = useState(false);
  const elementRef = useRef<T>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        buttonRef.current.contains(event.target as Node)
      ) {
        return;
      }
      if (
        elementRef.current &&
        !elementRef.current.contains(event.target as Node)
      ) {
        if (callback) callback();
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [callback]);

  const toggleOpen = () => {
    setIsOpen((prevState) => !prevState);
  };

  return [isOpen, toggleOpen, elementRef, buttonRef] as const;
}

export default useClickOutside;
