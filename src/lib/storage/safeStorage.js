import { FEATURE_STORAGE_KEYS } from "./storageKeys";

function hasStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

export function getItem(key, fallbackValue) {
  if (!hasStorage()) {
    return fallbackValue;
  }

  try {
    const rawValue = window.localStorage.getItem(key);
    return rawValue ? JSON.parse(rawValue) : fallbackValue;
  } catch (error) {
    console.error(`Unable to read ${key} from localStorage.`, error);
    return fallbackValue;
  }
}

export function setItem(key, value) {
  if (!hasStorage()) {
    return false;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Unable to save ${key} to localStorage.`, error);
    return false;
  }
}

export function removeItem(key) {
  if (!hasStorage()) {
    return false;
  }

  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Unable to remove ${key} from localStorage.`, error);
    return false;
  }
}

export function clearFeatureData() {
  FEATURE_STORAGE_KEYS.forEach((key) => removeItem(key));
}
