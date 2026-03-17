"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthResponse } from "@/types/auth";

interface AuthState {
  token: string | null;
  user: Omit<AuthResponse, "token"> | null;
  isAuthenticated: boolean;
  login: (response: AuthResponse) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      login: (response) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("token", response.token);
        }
        set({
          token: response.token,
          user: { email: response.email, firstName: response.firstName, lastName: response.lastName, role: response.role },
          isAuthenticated: true,
        });
      },
      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
        }
        set({ token: null, user: null, isAuthenticated: false });
      },
    }),
    { name: "carbontrack-auth" }
  )
);
