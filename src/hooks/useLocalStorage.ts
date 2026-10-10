import { useState, useEffect } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const storedItem = localStorage.getItem(key);
      if (storedItem !== null) {
        return JSON.parse(storedItem);
      }
      return initialValue;
    } catch (error) {
      console.warn(`Could not read "${key}" from localStorage:`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Could not save "${key}" to localStorage:`, error);
    }
  }, [key, value]);

  return [value, setValue];
}
