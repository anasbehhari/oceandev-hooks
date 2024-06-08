import { useCallback, useState } from "react";

/**
 * Custom hook to manage localStorage.
 *
 * @param {string} key - The key under which the value is stored in localStorage.
 * @returns {readonly [
 *   (value: string | Function | number) => void,
 *   () => string | Function | number,
 *   () => {key: string, value: string}[],
 *   () => void
 * ]} An array containing:
 * - `setItem`: A function to update the value in localStorage.
 * - `getItem`: A function to get the current value from localStorage.
 * - `getItems`: A function to get all key-value pairs from localStorage.
 * - `deleteItem`: A function to remove the value from localStorage.
 */
function useLocalStorage<T>(key: string) {
  const [_, setTrigger] = useState(false);

  // Function to set the value in localStorage
  const setItem = useCallback(
    (value: string) => {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
        setTrigger((prev) => !prev); // Trigger state change
      } catch (error) {
        console.warn("Error setting localStorage key “" + key + "”: ", error);
      }
    },
    [key],
  );

  // Function to get the value from localStorage
  const getItem: () => T | null = useCallback(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.warn("Error reading localStorage key “" + key + "”: ", error);
      return null;
    }
  }, [key]);

  // Function to get all key-value pairs from localStorage
  const getItems = useCallback(() => {
    try {
      const items = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const storageKey = window.localStorage.key(i);
        if (storageKey) {
          const value = window.localStorage.getItem(storageKey);
          items.push({ key: storageKey, value: value });
        }
      }
      return items;
    } catch (error) {
      console.warn("Error getting all localStorage items: ", error);
      return [];
    }
  }, [_, setTrigger]);

  // Function to remove the value from localStorage
  const deleteItem = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setTrigger((prev) => !prev); // Trigger state change
    } catch (error) {
      console.warn("Error removing localStorage key “" + key + "”: ", error);
    }
  }, [key]);

  return [setItem, getItem, getItems, deleteItem] as const;
}

export default useLocalStorage;
