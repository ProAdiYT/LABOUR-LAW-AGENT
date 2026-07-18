"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Shield, Lock, User, Loader2, AlertCircle, UserPlus } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register, user } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    if (password.length < 4) {
      setError("Password must be at least 4 characters long.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await register(username, password);
    } catch (err: any) {
      setError(err.message || "Failed to register. Username might be taken.");
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
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-white shadow-lg shadow-secondary/20">
            <UserPlus className="h-6 w-6" />
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight">Create Account</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Join ShramikMitra for full data tracking
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
              <User className="h-4 w-4" /> Choose Username
            </label>
            <input
              type="text"
              required
              disabled={isLoading}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. rajesh_kumar"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Lock className="h-4 w-4" /> Password
            </label>
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

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Lock className="h-4 w-4" /> Confirm Password
            </label>
            <input
              type="password"
              required
              disabled={isLoading}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
            />
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 rounded-xl bg-secondary px-4 py-3 text-sm font-semibold text-white hover:bg-secondary-hover shadow-lg shadow-secondary/10 transition-colors disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Register & Start"}
            </button>
          </div>
        </form>

        {/* Footer Link */}
        <p className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
}
