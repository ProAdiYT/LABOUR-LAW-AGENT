"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Shield, Lock, User, Sparkles, Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, guestLogin, user } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  // Check if landing page clicked Get Started with Guest mode
  useEffect(() => {
    const isGuestParam = searchParams.get("guest");
    if (isGuestParam === "true") {
      handleGuestLogin();
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      await login(username, password);
    } catch (err: any) {
      setError(err.message || "Failed to log in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await guestLogin();
    } catch (err: any) {
      setError(err.message || "Failed to enter guest mode.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12 transition-colors duration-300">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.primary.DEFAULT/5),transparent)]" />
      
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-xl">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
            <Shield className="h-6 w-6" />
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight">Welcome Back</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Access ShramikMitra labor tools
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-destructive/10 p-4 text-sm text-destructive border border-destructive/20 animate-shake">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Username */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <User className="h-4 w-4" /> Username
            </label>
            <input
              type="text"
              required
              disabled={isLoading}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. ramesh123"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Lock className="h-4 w-4" /> Password
              </label>
              <button 
                type="button"
                onClick={() => alert("Prototype Feature: Forgot password can be reset by database administrator or registering a new user.")}
                className="text-xs text-primary hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <input
              type="password"
              required
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
            />
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary-hover shadow-lg shadow-primary/10 transition-colors disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
            </button>
            
            <button
              type="button"
              disabled={isLoading}
              onClick={handleGuestLogin}
              className="w-full flex justify-center items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4 text-accent animate-pulse" />
              Enter with Guest Mode
            </button>
          </div>
        </form>

        {/* Footer Link */}
        <p className="text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link href="/register" className="font-semibold text-primary hover:underline">
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
}
