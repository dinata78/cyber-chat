import { useEffect, useState } from "react";

export function useDebouncedValue(value, delay = 500) {
  const [ debouncedValue, setDebouncedValue ] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}