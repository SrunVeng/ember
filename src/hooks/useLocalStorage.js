import { useEffect, useState } from "react";
import { getItem, setItem } from "../lib/storage/safeStorage";

export function useLocalStorage(key, fallbackValue) {
  const [value, setValue] = useState(() => getItem(key, fallbackValue));

  useEffect(() => {
    setItem(key, value);
  }, [key, value]);

  return [value, setValue];
}
