"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, User } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  guestLogin: () => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  preferredLanguage: "en" | "hi";
  setLanguage: (lang: "en" | "hi") => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem("shramik_token");
      if (token) {
        const userData = await api.getMe();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (e) {
      console.error("Failed to load user info:", e);
      localStorage.removeItem("shramik_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const tokenRes = await api.login(username, password);
      localStorage.setItem("shramik_token", tokenRes.access_token);
      await refreshUser();
      router.push("/dashboard");
    } catch (e) {
      setLoading(false);
      throw e;
    }
  };

  const register = async (username: string, password: string) => {
    setLoading(true);
    try {
      await api.register(username, password);
      // Automatically login after register
      const tokenRes = await api.login(username, password);
      localStorage.setItem("shramik_token", tokenRes.access_token);
      await refreshUser();
      router.push("/dashboard");
    } catch (e) {
      setLoading(false);
      throw e;
    }
  };

  const guestLogin = async () => {
    setLoading(true);
    try {
      const tokenRes = await api.guestLogin();
      localStorage.setItem("shramik_token", tokenRes.access_token);
      await refreshUser();
      router.push("/dashboard");
    } catch (e) {
      setLoading(false);
      throw e;
    }
  };

  const logout = () => {
    localStorage.removeItem("shramik_token");
    setUser(null);
    router.push("/login");
  };

  const setLanguage = async (lang: "en" | "hi") => {
    if (user) {
      const updatedUser = await api.updateProfile({ preferred_language: lang });
      setUser(updatedUser);
    }
  };

  const preferredLanguage = user?.preferred_language || "en";

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        guestLogin,
        logout,
        refreshUser,
        preferredLanguage,
        setLanguage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
