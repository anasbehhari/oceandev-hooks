import { useCallback, useState } from 'react';

/**
 * Custom hook to manage cookies.
 *
 * @param {T} key - The key under which the value is stored in cookies.
 * @returns {readonly [
 *   (value: any) => void,
 *   () => any,
 *   () => {key: string, value: string}[],
 *   () => void
 * ]} An array containing:
 * - `setCookie`: A function to update the value in cookies.
 * - `getCookie`: A function to get the current value from cookies.
 * - `getCookies`: A function to get all key-value pairs from cookies.
 * - `deleteCookie`: A function to remove the value from cookies.
 */
function useCookie<T>(key: string) {
  const [_, setTrigger] = useState(false);

  // Function to set the value in cookies
  const setCookie = useCallback(
    (value: T) => {
      try {
        const valueToStore = value instanceof Function ? value() : value;
        document.cookie = `${key}=${JSON.stringify(valueToStore)}`;
        setTrigger((prev) => !prev); // Trigger state change
      } catch (error) {
        console.warn('Error setting cookie “' + key + '”: ', error);
      }
    },
    [key]
  );

  // Function to get the value from cookies
  const getCookie = useCallback(() => {
    try {
      const cookies = document.cookie.split(';');
      for (let cookie of cookies) {
        const [cookieKey, cookieValue] = cookie.split('=');
        if (cookieKey.trim() === key) {
          return JSON.parse(cookieValue);
        }
      }
      return null;
    } catch (error) {
      console.warn('Error reading cookie “' + key + '”: ', error);
      return null;
    }
  }, [key]);

  // Function to get all key-value pairs from cookies
  const getCookies = useCallback(() => {
    try {
      const cookies = document.cookie.split(';');
      const cookiePairs = cookies.map((cookie) => {
        const [cookieKey, cookieValue] = cookie.split('=');
        return { key: cookieKey.trim(), value: JSON.parse(cookieValue) };
      });
      return cookiePairs;
    } catch (error) {
      console.warn('Error getting all cookies: ', error);
      return [];
    }
  }, [_, setTrigger]);

  // Function to remove the value from cookies
  const deleteCookie = useCallback(() => {
    try {
      document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      setTrigger((prev) => !prev); // Trigger state change
    } catch (error) {
      console.warn('Error removing cookie “' + key + '”: ', error);
    }
  }, [key]);

  return [setCookie, getCookie, getCookies, deleteCookie] as const;
}

export default useCookie;
