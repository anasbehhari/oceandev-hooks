import { RefObject, useEffect } from 'react';

/**
 * Custom hook to manage event listening on one or multiple DOM elements.
 *
 * @param {RefObject<T> | RefObject<T>[]} refOrRefs - A single ref or an array of refs to track.
 * @param {keyof HTMLElementEventMap} event - The event type to listen for (e.g., 'click', 'scroll').
 * @param {(ev: HTMLElementEventMap[keyof HTMLElementEventMap]) => void} callback - The callback function to execute when the event occurs.
 *
 * @example
 * // Single ref usage
 * useListenToEvent<HTMLDivElement>(
 *   divRef,
 *   'click',
 *   (e) => {
 *     console.log(e);
 *   }
 * );
 *
 * @example
 * // Multiple refs usage
 * useListenToEvent<HTMLDivElement | HTMLAnchorElement>(
 *   [div1Ref, div2Ref],
 *   'click',
 *   (e) => {
 *     console.log(e);
 *   }
 * );
 */
function useListenToEvent<T extends HTMLElement = HTMLElement>(
  refOrRefs: RefObject<T> | RefObject<T>[],
  event: keyof HTMLElementEventMap,
  callback: (ev: HTMLElementEventMap[keyof HTMLElementEventMap]) => void
) {
  useEffect(() => {
    const refArray = Array.isArray(refOrRefs) ? refOrRefs : [refOrRefs];

    refArray.forEach((ref) => {
      if (ref.current) {
        ref.current.addEventListener(event, callback);
      }
    });

    return () => {
      refArray.forEach((ref) => {
        if (ref.current) {
          ref.current.removeEventListener(event, callback);
        }
      });
    };
  }, [refOrRefs, event, callback]);
}

export default useListenToEvent;
