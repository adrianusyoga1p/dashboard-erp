import { apiAuthGetMe } from "@/api/endpoints/auth";
import type { Business } from "@/types/business";
import type { User } from "@/types/user";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthState {
  user: User | null;
  token: string | null;
  role: string | null;
  division: string | null;
  accesses: string[];
  businessId: string | null;
  business: Business | null;
  setBusiness: (business: Business) => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  getAuthMe: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      division: null,
      role: null,
      accesses: [],
      businessId: null,
      business: null,
      setBusiness: (business: Business) => {
        set({
          business,
          businessId: business.id
        });
      },
      setUser: (user: User) => {
        set({
          user,
          role: user.role?.name ?? null,
          division: user.division?.name ?? null,
          accesses: user.division?.accesses.map((a) => a.accessName) ?? [],
        });
      },
      setToken: (token) => {
        set({ token });
      },
      getAuthMe: async () => {
        const { data } = await apiAuthGetMe();
        if (data) {
          set({
            user: data,
            role: data.role?.name,
            division: data.division?.name,
            accesses: data.division?.accesses.map((a) => a.accessName),
            businessId: data.businessId,
            business: data.business
          });
        }
      },
      logout: () => {
        set({
          user: null,
          token: null,
          role: null,
          division: null,
          accesses: [],
        });
      },
    }),
    {
      name: "token",
      partialize: (state) => ({ token: state.token, businessId: state.businessId }),
    }
  )
);

export const getCurrentToken = () => useAuthStore.getState().token;
