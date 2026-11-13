import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

interface Remote<T> {
  data: T | undefined;
  error: boolean;
  loading: boolean;
  reload: () => void;
}

/**
 * Load shared data each time the screen comes into focus. Keeps the last good value
 * while it refreshes, so screens never flash empty.
 */
export function useRemote<T>(key: string, load: () => Promise<T>): Remote<T> {
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [nonce, setNonce] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      setLoading(true);
      load()
        .then((value) => {
          if (!alive) return;
          setData(value);
          setError(false);
        })
        .catch(() => {
          if (alive) setError(true);
        })
        .finally(() => {
          if (alive) setLoading(false);
        });
      return () => {
        alive = false;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key, nonce]),
  );

  return { data, error, loading, reload: () => setNonce((n) => n + 1) };
}
