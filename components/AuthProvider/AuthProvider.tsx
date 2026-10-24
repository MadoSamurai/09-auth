"use client";

import { useEffect, ReactNode } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { checkSession, getMe } from "@/lib/api/clientApi";

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const sessionData = await checkSession();
        if (sessionData) {
          const userData = await getMe();
          if (userData) {
            setUser(userData);
            return;
          }
        }
        setUser(null);
      } catch (error) {
        console.error("Auth initialization failed:", error);
        setUser(null);
      }
    };

    initAuth();
  }, [setUser]);

  return <>{children}</>;
}
