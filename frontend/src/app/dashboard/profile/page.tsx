"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { api } from "@/lib/api";
import { 
  User, 
  Languages, 
  Moon, 
  Sun, 
  Lock, 
  LogOut, 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  Shield,
  UserCheck
} from "lucide-react";

export default function ProfilePage() {
  const { user, preferredLanguage, setLanguage, logout, refreshUser } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const isHi = preferredLanguage === "hi";

  const [username, setUsername] = useState(user?.username || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    // Basic validation
    if (password && password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    if (password && password.length < 4) {
      setErrorMsg("Password must be at least 4 characters long.");
      return;
    }

    setIsLoading(true);
    try {
      await api.updateProfile({
        username: username || undefined,
        password: password || undefined
      });
      setSuccessMsg(isHi ? "प्रोफ़ाइल सफलतापूर्वक अपडेट की गई!" : "Profile updated successfully!");
      setPassword("");
      setConfirmPassword("");
      await refreshUser();
    } catch (e: any) {
      setErrorMsg(e.message || "Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  const isGuest = user?.role === "guest";

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold">{isHi ? "प्रोफ़ाइल और सेटिंग्स" : "Profile & Preferences"}</h2>
        <p className="text-xs text-slate-500">
          {isHi 
            ? "अपनी भाषा वरीयता, थीम सेट करें और अपने क्रेडेंशियल्स प्रबंधित करें।" 
            : "Manage your preferred language, active theme, and secure your credentials."
          }
        </p>
      </div>

      {/* Profile Card Summary */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        {/* Avatar */}
        <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-primary to-indigo-500 text-white flex items-center justify-center text-xl font-extrabold uppercase shadow-lg shadow-primary/20 shrink-0">
          {user?.username.slice(0, 2)}
        </div>
        
        {/* Profile info */}
        <div className="space-y-1 text-center sm:text-left flex-1 min-w-0">
          <h3 className="font-bold text-base truncate text-slate-800 dark:text-slate-100">
            {user?.username}
          </h3>
          <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-1">
            <span className={`inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-[10px] font-semibold border ${
              isGuest 
                ? "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400" 
                : "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400"
            }`}>
              <Shield className="h-3 w-3" />
              <span className="capitalize">{user?.role} Mode</span>
            </span>
            
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-0.5 text-[10px] font-semibold text-slate-500">
              Joined {new Date(user?.created_at || "").toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-green-500/10 p-4 text-xs text-green-600 border border-green-500/20">
          <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-destructive/10 p-4 text-xs text-destructive border border-destructive/20">
          <AlertCircle className="h-4.5 w-4.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Preferences Section */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-850 pb-2">
          General Settings
        </h4>
        
        {/* Language preference selector */}
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Languages className="h-4 w-4 text-primary" /> Preferred Language
            </p>
            <p className="text-[10px] text-slate-400">Choose translation language for dashboard layout and guidelines.</p>
          </div>
          
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-950 p-1 border border-slate-200 dark:border-slate-800 shrink-0">
            <button
              onClick={() => setLanguage("en")}
              className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all ${
                preferredLanguage === "en"
                  ? "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage("hi")}
              className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all ${
                preferredLanguage === "hi"
                  ? "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              हिंदी (Hindi)
            </button>
          </div>
        </div>

        {/* Theme preference selector */}
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              {theme === "dark" ? <Moon className="h-4 w-4 text-accent" /> : <Sun className="h-4 w-4 text-accent" />}
              <span>Dashboard Theme</span>
            </p>
            <p className="text-[10px] text-slate-400">Toggle dark mode interface styling.</p>
          </div>
          
          <button
            onClick={toggleTheme}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-2 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-850 shrink-0 transition-colors"
          >
            {theme === "dark" ? (
              <>
                <Sun className="h-4 w-4 text-amber-500" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="h-4 w-4" />
                <span>Dark Mode</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Security Credentials Form */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-850 pb-2">
          Security Credentials
        </h4>

        {isGuest ? (
          <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 text-xs text-amber-600 leading-relaxed flex items-start gap-2.5">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Guest Mode Active</p>
              <p className="mt-1">
                You are currently logged in as a temporary guest. Log out and register a new account to configure custom passwords and protect your Worker Diary logs permanently.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">Update Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 text-xs font-semibold focus:border-primary focus:outline-none"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5" /> New Password (leave blank to keep current)
              </label>
              <input
                type="password"
                value={password}
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 text-xs font-semibold focus:border-primary focus:outline-none"
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                placeholder="••••••••"
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 text-xs font-semibold focus:border-primary focus:outline-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary hover:bg-primary-hover text-white px-5 py-2.5 text-xs font-semibold transition-colors disabled:opacity-50"
              >
                {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <span>Update Credentials</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Logout Card */}
      <div className="rounded-3xl border border-rose-500/20 bg-rose-500/5 p-6 shadow-sm flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-rose-500">{isHi ? "डैशबोर्ड सत्र समाप्त करें" : "Terminate Session"}</h4>
          <p className="text-[10px] text-slate-400 mt-1">Safely exit your workspace and remove local cookies/tokens.</p>
        </div>
        
        <button
          onClick={logout}
          className="inline-flex items-center gap-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white px-4 py-2.5 text-xs font-semibold transition-colors shadow-md shadow-rose-500/10"
        >
          <LogOut className="h-4 w-4" />
          <span>{isHi ? "लॉग आउट" : "Log Out"}</span>
        </button>
      </div>

    </div>
  );
}
