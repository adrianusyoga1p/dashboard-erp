import type { User } from "@/types/user";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user: User) => {
        set({ user });
      },
      setToken: (token) => {
        set({ token });
      },
      logout: () => {
        set({ user: null, token: null });
      },
    }),
    {
      name: "user",
    }
  )
);

export const getCurrentToken = () => useAuthStore.getState().token;
