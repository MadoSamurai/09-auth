// lib/store/authStore.ts
import { create } from "zustand";
import { User } from "@/types/user";
import {
  checkSession,
  login as apiLogin,
  logout as apiLogout,
  register as apiRegister,
  updateMe,
  getMe,
} from "@/lib/api/clientApi";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateUser: (userData: { username: string }) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),

  login: async (credentials) => {
    const user = await apiLogin(credentials);
    set({ user, isAuthenticated: true, isLoading: false });
    await get().checkAuth();
  },

  register: async (credentials) => {
    const user = await apiRegister(credentials);
    set({ user, isAuthenticated: true, isLoading: false });
  },

  logout: async () => {
    await apiLogout();
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  checkAuth: async () => {
    try {
      set({ isLoading: true });
      const session = await checkSession(); // Проверяем валидность сессии ({ success: true })

      if (session) {
        // Если сессия ок, забираем реальные данные пользователя (email, username, avatar) через getMe()
        const user = await getMe();
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  updateUser: async (userData) => {
    const updatedUser = await updateMe(userData);
    set({ user: updatedUser });
  },
}));
