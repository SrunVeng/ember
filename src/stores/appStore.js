import { create } from "zustand";
import { authenticateDemoUser } from "../app/roles";
import {
  COLLECTIONS,
  getInitialCollection,
  loadCollection,
  saveCollection,
} from "../services/persistenceService";

export const DEFAULT_COMPANY_PROFILE = {
  companyName: "EMBER & CO.",
  phone: "",
  email: "",
  address: "",
  invoiceNote:
    "Generated from the EMBER Pricing System. Please review payment and delivery details with the customer before fulfillment.",
};

const DEFAULT_PREFERENCES = {
  sidebarCollapsed: false,
  companyProfile: DEFAULT_COMPANY_PROFILE,
};

function toSession(user) {
  return {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

function normalizeCompanyProfile(companyProfile = {}) {
  return {
    companyName: String(companyProfile.companyName || DEFAULT_COMPANY_PROFILE.companyName).trim(),
    phone: String(companyProfile.phone || "").trim(),
    email: String(companyProfile.email || "").trim(),
    address: String(companyProfile.address || "").trim(),
    invoiceNote: String(companyProfile.invoiceNote || DEFAULT_COMPANY_PROFILE.invoiceNote).trim(),
  };
}

function normalizePreferences(preferences = {}) {
  return {
    ...DEFAULT_PREFERENCES,
    ...preferences,
    companyProfile: normalizeCompanyProfile(preferences.companyProfile),
  };
}

export const useAppStore = create((set, get) => ({
  preferences: getInitialCollection(COLLECTIONS.appPreferences, DEFAULT_PREFERENCES),
  session: null,
  hydratePreferences: async () => {
    const preferences = normalizePreferences(await loadCollection(COLLECTIONS.appPreferences, DEFAULT_PREFERENCES, {
      persistFallback: true,
    }));
    set({ preferences });
  },
  setSidebarCollapsed: async (sidebarCollapsed) => {
    const preferences = normalizePreferences({ ...get().preferences, sidebarCollapsed });
    await saveCollection(COLLECTIONS.appPreferences, preferences);
    set({ preferences });
  },
  updateCompanyProfile: async (companyProfile) => {
    const normalizedProfile = normalizeCompanyProfile(companyProfile);

    if (!normalizedProfile.companyName) {
      throw new Error("Company name is required.");
    }

    const preferences = normalizePreferences({
      ...get().preferences,
      companyProfile: normalizedProfile,
    });
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
