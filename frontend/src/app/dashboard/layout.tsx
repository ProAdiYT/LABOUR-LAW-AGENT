"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { 
  Shield, 
  MessageSquare, 
  BookOpen, 
  FileText, 
  Search, 
  MapPin, 
  Calendar, 
  FileSearch,
  User, 
  LogOut, 
  Menu, 
  X, 
  Home, 
  Languages, 
  Sun, 
  Moon 
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout, preferredLanguage, setLanguage } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirection guard if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-slate-500">Verifying session...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: "Overview", name_hi: "अवलोकन", href: "/dashboard", icon: Home },
    { name: "AI Assistant", name_hi: "एआई सहायक", href: "/dashboard/chat", icon: MessageSquare },
    { name: "Rights Library", name_hi: "अधिकार पुस्तकालय", href: "/dashboard/rights", icon: BookOpen },
    { name: "Complaint Maker", name_hi: "शिकायत निर्माता", href: "/dashboard/complaints", icon: FileText },
    { name: "Welfare Schemes", name_hi: "कल्याणकारी योजनाएं", href: "/dashboard/schemes", icon: Search },
    { name: "Document Analyzer", name_hi: "दस्तावेज़ विश्लेषक", href: "/dashboard/documents", icon: FileSearch },
    { name: "Nearby Help Map", name_hi: "नजदीकी सहायता", href: "/dashboard/map", icon: MapPin },
    { name: "Worker Diary", name_hi: "कामगार डायरी", href: "/dashboard/diary", icon: Calendar },
    { name: "Profile Settings", name_hi: "प्रोफ़ाइल सेटिंग", href: "/dashboard/profile", icon: User },
  ];

  const handleLanguageToggle = () => {
    const nextLang = preferredLanguage === "en" ? "hi" : "en";
    setLanguage(nextLang);
  };

  const isHi = preferredLanguage === "hi";

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
        <div className="flex h-16 items-center gap-2 px-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/20">
            <Shield className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            ShramikMitra AI
          </span>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 space-y-1 px-4 py-6 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/10"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{isHi ? item.name_hi : item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-950 p-3 mb-2">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 uppercase">
                {user.username.slice(0, 2)}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold truncate">{user.username}</p>
                <p className="text-[10px] text-slate-400 capitalize">{user.role}</p>
              </div>
            </div>
          </div>
          
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>{isHi ? "लॉग आउट" : "Log Out"}</span>
          </button>
        </div>
      </aside>

      {/* Sidebar - Mobile drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden bg-slate-900/50 backdrop-blur-sm">
          <div className="relative flex flex-col w-64 bg-white dark:bg-slate-900 h-full max-w-xs animate-slide-in">
            {/* Close Button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex h-16 items-center gap-2 px-6 border-b border-slate-200 dark:border-slate-800 shrink-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
                <Shield className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold">ShramikMitra</span>
            </div>

            <nav className="flex-1 space-y-1 px-4 py-6 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-primary text-white"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 shrink-0" />
                      <span>{isHi ? item.name_hi : item.name}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 shrink-0">
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>{isHi ? "लॉग आउट" : "Log Out"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-md sm:text-lg font-semibold capitalize hidden sm:block">
              {pathname === "/dashboard" 
                ? (isHi ? "स्वागत हे!" : "Dashboard Overview") 
                : isHi 
                  ? (navItems.find(n => n.href === pathname)?.name_hi || "अवलोकन") 
                  : (navItems.find(n => n.href === pathname)?.name || "Overview")}
            </h1>
          </div>

          {/* Quick Settings: Language, Theme, Mobile User Icon */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={handleLanguageToggle}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 px-3 py-1.5 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <Languages className="h-3.5 w-3.5" />
              <span>{isHi ? "English" : "हिंदी"}</span>
            </button>

            {/* Dark Mode Switcher */}
            <button
              onClick={toggleTheme}
              className="rounded-xl border border-slate-200 dark:border-slate-800 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Quick Profile display (Mobile view) */}
            <div className="lg:hidden h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs uppercase border border-slate-200 dark:border-slate-800">
              {user.username.slice(0, 2)}
            </div>
          </div>
        </header>

        {/* Dashboard Subview Body */}
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-6 relative">
          {children}
        </main>
      </div>
      
    </div>
  );
}
