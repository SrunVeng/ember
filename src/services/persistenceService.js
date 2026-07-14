const COLLECTIONS = {
  quotations: "quotations",
  pricingRules: "pricingRules",
  categories: "categories",
  shippingMethods: "shippingMethods",
  appPreferences: "appPreferences",
};

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
  return fallbackValue;
}

export async function loadCollection(collection, fallbackValue, options = {}) {
  const payload = await requestRemoteCollection(collection);
  if (payload.data === null || payload.data === undefined) {
    if (options.persistFallback) {
      await saveCollection(collection, fallbackValue);
    }

    return fallbackValue;
  }

  return payload.data;
}

export function saveCollection(collection, value) {
  requestRemoteCollection(collection, {
    method: "PUT",
    body: JSON.stringify({ data: value }),
  }).catch((error) => {
    console.error(`API save failed for ${collection}.`, error);
  });
  return value;
}

export function removeCollection(collection) {
  requestRemoteCollection(collection, { method: "DELETE" }).catch((error) => {
    console.error(`API delete failed for ${collection}.`, error);
  });
}

export { COLLECTIONS };
