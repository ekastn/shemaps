import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook for debouncing a value change
 * @param value The value to debounce
 * @param delay The delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set a timeout to update the debounced value after the delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clear the timeout if the value changes or the component unmounts
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Custom hook for handling debounced search input
 * @param initialQuery The initial search query
 * @param delay The debounce delay in milliseconds
 * @returns Object containing the current query, debounced query, and setter function
 */
export function useDebouncedSearch(initialQuery: string = "", delay: number = 300) {
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, delay);

  const handleQueryChange = useCallback((newQuery: string) => {
    setQuery(newQuery);
  }, []);

  return {
    query,
    debouncedQuery,
    setQuery: handleQueryChange,
  };
}
