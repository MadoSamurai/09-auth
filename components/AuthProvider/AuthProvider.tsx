"use client";

import { useEffect, ReactNode } from "react";
import { useAuthStore } from "@/lib/store/authStore";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return <>{children}</>;
}
