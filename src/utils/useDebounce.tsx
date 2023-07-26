import { useEffect, useState } from "react";

/**
 *
 * @param value input value
 * @param delay delay time
 * @returns value after delay
 */
const useDebounce = (value: string, delay: number = 200) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  //useEffect hook
  useEffect(() => {
    //set timeout
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    //clear timeout
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

export default useDebounce;
