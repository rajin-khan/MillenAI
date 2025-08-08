// /millen-ai/src/hooks/usePrevious.js

import { useRef, useEffect } from 'react';

/**
 * A custom hook that returns the previous value of a state or prop.
 * @param value The value to track.
 * @returns The value from the previous render.
 */
export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}