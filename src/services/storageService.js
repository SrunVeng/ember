import { COLLECTIONS, removeCollection } from "./persistenceService";

export function clearApplicationStorage() {
  return Promise.all(Object.values(COLLECTIONS).map((collection) => removeCollection(collection)));
}
