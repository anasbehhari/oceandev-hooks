import { useEffect, useState } from 'react';

/**
 * A custom React hook that detects the user's online/offline status and provides the current status, the last time the connection was lost (if applicable), and a flag indicating if the user has come back online after being offline.
 *
 * This hook is particularly useful for applications that need to adapt their behavior based on the internet connection availability and trigger actions when the user comes back online. For example, you can:
 *  - Display a notification welcoming the user back online.
 *  - Re-fetch data or perform actions that require internet access.
 *
 * @returns A tuple containing three values:
 *  - `isOnline`: A boolean indicating whether the user is currently online (`true`) or offline (`false`).
 *  - `isLoading`: A boolean indicating whether the online status is being determined or re-established to avoid any incorrect information.
 *  - `lastTimeDisconnect`: A `Date` object representing the last time the user's connection was lost, or `undefined` if the user is currently online or there hasn't been a disconnection yet.
 *  - `isBackFromOffline`: A boolean indicating if the user has come back online after being offline (`true`) or not (`false`). This value is only `true` for one render cycle after the user transitions from offline to online.
 */
function useOnlineStatus(): [
  boolean | undefined,
  boolean,
  Date | undefined,
  boolean
] {
  const [isOnline, setIsOnline] = useState<boolean | undefined>(undefined);
  const [lastTimeDisconnect, setLastTimeDisconnect] = useState<
    Date | undefined
  >(undefined);
  const [isBackFromOffline, setIsBackFromOffline] = useState<boolean>(false);

  useEffect(() => {
    const isClient =
      typeof window !== 'undefined' && typeof navigator !== 'undefined';
    if (!isClient) return;

    const handleOnlineEvent = () => {
      setIsOnline(true);
      setIsBackFromOffline(true);
    };

    const handleOfflineEvent = () => {
      setIsOnline(false);
      setLastTimeDisconnect(new Date());
    };

    setIsOnline(navigator.onLine);

    window.addEventListener('online', handleOnlineEvent);
    window.addEventListener('offline', handleOfflineEvent);

    return () => {
      window.removeEventListener('online', handleOnlineEvent);
      window.removeEventListener('offline', handleOfflineEvent);
    };
  }, []);

  useEffect(() => {
    if (isBackFromOffline) {
      const timer = setTimeout(() => setIsBackFromOffline(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [isBackFromOffline]);

  return [
    isOnline,
    typeof isOnline === 'undefined',
    lastTimeDisconnect,
    isBackFromOffline,
  ];
}

export default useOnlineStatus;
