import { create } from "zustand";
import { authenticateDemoUser } from "../app/roles";
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
  session: null,
  hydratePreferences: async () => {
    const preferences = await loadCollection(COLLECTIONS.appPreferences, DEFAULT_PREFERENCES, {
      persistFallback: true,
    });
    set({ preferences });
  },
  setSidebarCollapsed: async (sidebarCollapsed) => {
    const preferences = { ...get().preferences, sidebarCollapsed };
    await saveCollection(COLLECTIONS.appPreferences, preferences);
    set({ preferences });
  },
  login: ({ email, password }) => {
    const user = authenticateDemoUser(email, password);
    if (!user) {
      return { ok: false, message: "Email or password is incorrect." };
    }

    const session = toSession(user);
    set({ session });
    return { ok: true, session };
  },
  logout: () => {
    set({ session: null });
  },
}));
