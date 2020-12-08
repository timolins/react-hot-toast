import { useRef } from 'react';

export const usePreserve = <T>(value?: T) => {
  const ref = useRef<T>();
  const preservedValue = value || ref.current;

  if (value) {
    ref.current = value;
  }

  return preservedValue;
};
