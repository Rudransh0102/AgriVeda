import React from "react";

import { Toast } from "@/components/ui/Toast";
import { getAuthToken, setAuthToken } from "@/lib/api/client";
import type { LoginPayload, RegisterPayload, User } from "@/lib/api/types";
import { authLocal } from "@/lib/services/authLocal";

type AuthState = {
  token: string | null;
  user: User | null;
  isLoading: boolean;
};

type AuthContextValue = AuthState & {
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = React.useState<string | null>(null);
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const refreshUser = React.useCallback(async () => {
    const t = await getAuthToken();
    if (!t) {
      setUser(null);
      setTokenState(null);
      return;
    }

    try {
      const me = await authLocal.me();
      setUser(me as any);
      setTokenState(t);
    } catch {
      await setAuthToken(null);
      setUser(null);
      setTokenState(null);
    }
  }, []);

  React.useEffect(() => {
    (async () => {
      try {
        const t = await getAuthToken();
        setTokenState(t);
        if (t) await refreshUser();
      } finally {
        setIsLoading(false);
      }
    })();
  }, [refreshUser]);

  const login = React.useCallback(
    async (payload: LoginPayload) => {
      const { token } = await authLocal.login(payload);
      await setAuthToken(token);
      setTokenState(token);
      await refreshUser();
      Toast.success("Logged in");
    },
    [refreshUser],
  );

  const register = React.useCallback(async (payload: RegisterPayload) => {
    // Create local user account; keep user logged out until explicit login
    try {
      await authLocal.register(payload);
      await authLocal.logout();
      Toast.success("Account created. Please login.");
    } catch (e: any) {
      Toast.error(e?.message || "Registration failed");
    }
  }, []);

  const logout = React.useCallback(async () => {
    await setAuthToken(null);
    setTokenState(null);
    setUser(null);
    Toast.info("Logged out");
  }, []);

  const value: AuthContextValue = {
    token,
    user,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
