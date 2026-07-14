import { create } from "zustand";
import { authenticateDemoUser } from "../app/roles";
import { getItem, removeItem, setItem } from "../lib/storage/safeStorage";
import { STORAGE_KEYS } from "../lib/storage/storageKeys";
import {
  COLLECTIONS,
  getInitialCollection,
  loadCollection,
  saveCollection,
} from "../services/persistenceService";

const DEFAULT_PREFERENCES = {
  sidebarCollapsed: false,
};

function toSession(user) {
  return {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export const useAppStore = create((set, get) => ({
  preferences: getInitialCollection(COLLECTIONS.appPreferences, DEFAULT_PREFERENCES),
  session: getItem(STORAGE_KEYS.authSession, null),
  hydratePreferences: async () => {
    const preferences = await loadCollection(COLLECTIONS.appPreferences, DEFAULT_PREFERENCES);
    set({ preferences });
  },
  setSidebarCollapsed: (sidebarCollapsed) => {
    const preferences = { ...get().preferences, sidebarCollapsed };
    saveCollection(COLLECTIONS.appPreferences, preferences);
    set({ preferences });
  },
  login: ({ email, password }) => {
    const user = authenticateDemoUser(email, password);
    if (!user) {
      return { ok: false, message: "Email or password is incorrect." };
    }

    const session = toSession(user);
    setItem(STORAGE_KEYS.authSession, session);
    set({ session });
    return { ok: true, session };
  },
  logout: () => {
    removeItem(STORAGE_KEYS.authSession);
    set({ session: null });
  },
}));
