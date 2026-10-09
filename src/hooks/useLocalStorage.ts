import { useState, useEffect } from 'react';

/**
 * A custom React hook that synchronizes state with the browser's localStorage.
 *
 * Why use this?
 * - Standard `useState` resets when you refresh the page.
 * - This hook keeps data persisted in the browser so your snippets and theme
 *   settings are remembered when you return!
 *
 * How it works:
 * 1. Checks localStorage for existing data under `key`.
 * 2. If found, parses and loads it. If not found or broken, uses `initialValue`.
 * 3. Whenever `value` changes, `useEffect` saves the updated data back into localStorage.
 *
 * @param key - The localStorage storage key name (e.g., 'codepocket-snippets')
 * @param initialValue - Default value if no saved data exists yet
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  // Step 1: Initialize state with saved data (or fallback to initialValue)
  const [value, setValue] = useState<T>(() => {
    try {
      const storedItem = localStorage.getItem(key);
      // If data was previously saved, parse JSON string into a JavaScript object
      if (storedItem !== null) {
        return JSON.parse(storedItem);
      }
      return initialValue;
    } catch (error) {
      console.warn(`Could not read "${key}" from localStorage:`, error);
      return initialValue;
    }
  });

  // Step 2: Automatically save to localStorage whenever `value` or `key` changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // Storage might be full or disabled in private browsing mode
      console.warn(`Could not save "${key}" to localStorage:`, error);
    }
  }, [key, value]);

  // Return exactly like React's useState: [currentValue, updateFunction]
  return [value, setValue];
}

