import { useEffect, useMemo, useRef } from 'react';

/**
 * PUBLIC_INTERFACE
 * useDebouncedCallback creates a stable debounced function that delays invoking
 * the provided fn until after wait milliseconds have elapsed since the last call.
 */
export function useDebouncedCallback(fn, wait = 300) {
  const fnRef = useRef(fn);
  const tRef = useRef(null);

  useEffect(() => { fnRef.current = fn; }, [fn]);

  return useMemo(() => {
    const debounced = (...args) => {
      if (tRef.current) clearTimeout(tRef.current);
      tRef.current = setTimeout(() => {
        fnRef.current?.(...args);
      }, wait);
    };
    debounced.flush = (...args) => {
      if (tRef.current) clearTimeout(tRef.current);
      fnRef.current?.(...args);
    };
    return debounced;
  }, [wait]);
}
