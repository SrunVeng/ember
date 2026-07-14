import { clearFeatureData } from "../lib/storage/safeStorage";
import { COLLECTIONS, removeCollection } from "./persistenceService";

export function clearApplicationStorage() {
  clearFeatureData();
  Object.values(COLLECTIONS).forEach((collection) => removeCollection(collection));
}
