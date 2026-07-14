import { COLLECTIONS, removeCollection } from "./persistenceService";

export function clearApplicationStorage() {
  Object.values(COLLECTIONS).forEach((collection) => removeCollection(collection));
}
