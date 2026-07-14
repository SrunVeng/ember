import { getItem, removeItem, setItem } from "../lib/storage/safeStorage";
import { STORAGE_KEYS } from "../lib/storage/storageKeys";

const COLLECTIONS = {
  quotations: "quotations",
  pricingRules: "pricingRules",
  categories: "categories",
  shippingMethods: "shippingMethods",
  appPreferences: "appPreferences",
};

function getStorageKey(collection) {
  return STORAGE_KEYS[collection];
}

async function requestRemoteCollection(collection, options = {}) {
  const response = await fetch(`/api/storage?collection=${collection}`, {
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    ...options,
  });

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    throw new Error("Storage API did not return JSON.");
  }

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error ?? "Storage API request failed.");
  }

  return payload;
}

export function getInitialCollection(collection, fallbackValue) {
  return getItem(getStorageKey(collection), fallbackValue);
}

export async function loadCollection(collection, fallbackValue) {
  try {
    const payload = await requestRemoteCollection(collection);
    if (payload.data === null || payload.data === undefined) {
      return fallbackValue;
    }

    setItem(getStorageKey(collection), payload.data);
    return payload.data;
  } catch {
    return getInitialCollection(collection, fallbackValue);
  }
}

export function saveCollection(collection, value) {
  setItem(getStorageKey(collection), value);
  requestRemoteCollection(collection, {
    method: "PUT",
    body: JSON.stringify({ data: value }),
  }).catch((error) => {
    console.warn(`Remote storage save failed for ${collection}.`, error);
  });
  return value;
}

export function removeCollection(collection) {
  removeItem(getStorageKey(collection));
  requestRemoteCollection(collection, { method: "DELETE" }).catch((error) => {
    console.warn(`Remote storage delete failed for ${collection}.`, error);
  });
}

export { COLLECTIONS };
