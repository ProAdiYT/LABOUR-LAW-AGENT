"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { 
  Search, 
  DollarSign, 
  Clock, 
  TrendingUp, 
  Hammer, 
  UserCheck, 
  ShieldAlert, 
  Calendar,
  X,
  ChevronRight,
  BookOpen
} from "lucide-react";

// Icon mapper helper
const iconMap: Record<string, any> = {
  DollarSign: DollarSign,
  Clock: Clock,
  TrendingUp: TrendingUp,
  Hammer: Hammer,
  UserCheck: UserCheck,
  ShieldAlert: ShieldAlert,
  Calendar: Calendar,
};

export default function RightsLibraryPage() {
  const { preferredLanguage } = useAuth();
  const isHi = preferredLanguage === "hi";

  const [rights, setRights] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRight, setSelectedRight] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load rights library from backend
  useEffect(() => {
    async function loadRights() {
      try {
        const data = await api.getAllRights();
        setRights(data);
      } catch (e) {
        console.error("Failed to load rights library:", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadRights();
  }, []);

  const categories = ["All", "Wages", "Hours & Leaves", "Construction", "Equality", "Safety"];

  // Filter logic
  const filteredRights = rights.filter((right) => {
    const matchesCategory = selectedCategory === "All" || right.category === selectedCategory;
    
    const searchString = searchTerm.toLowerCase();
    const matchesSearch = 
      right.title_en.toLowerCase().includes(searchString) ||
      right.title_hi.includes(searchString) ||
      right.summary_en.toLowerCase().includes(searchString) ||
      right.summary_hi.includes(searchString);
      
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold">{isHi ? "दिल्ली श्रम अधिकार नियमावली" : "Delhi Labour Rights Library"}</h2>
          <p className="text-xs text-slate-500">
            {isHi 
              ? "न्यूनतम वेतन, ओवरटाइम, सुरक्षा और काम के घंटों के नियमों की आधिकारिक जानकारी खोजें।" 
              : "Search official statutory provisions for minimum wage, overtime, leave, and safety in NCT of Delhi."
            }
          </p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={isHi ? "अधिकार खोजें (उदा: वेतन, ओवरटाइम)..." : "Search rights (e.g., wage, hours)..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-10 pr-4 py-2.5 text-xs font-semibold focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm("")} 
              className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Categories scrollable in mobile */}
        <div className="flex gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar shrink-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-4 py-2.5 text-xs font-semibold border transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-primary text-white border-primary shadow-md shadow-primary/10"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Loading & Empty states */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-40 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 animate-pulse space-y-3">
              <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800" />
              <div className="h-5 w-3/4 rounded bg-slate-100 dark:bg-slate-800" />
              <div className="h-4 w-full rounded bg-slate-100 dark:bg-slate-800" />
            </div>
          ))}
        </div>
      ) : filteredRights.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900">
          <BookOpen className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700 mb-3" />
          <h4 className="font-bold text-slate-700 dark:text-slate-300">
            {isHi ? "कोई अधिकार नहीं मिला" : "No Rights Match Search"}
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search terms or selecting a different category.
          </p>
        </div>
      ) : (
        /* Rights Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRights.map((right) => {
            const Icon = iconMap[right.icon] || BookOpen;
            return (
              <div
                key={right.id}
                onClick={() => setSelectedRight(right)}
                className="group cursor-pointer rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-all hover:border-primary/40 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary dark:text-primary-light">
                    <Icon className="h-5 w-5" />
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 group-hover:text-primary transition-colors flex justify-between">
                      <span>{isHi ? right.title_hi : right.title_en}</span>
                    </h3>
                    <p className="text-xs text-slate-500 leading-normal line-clamp-3">
                      {isHi ? right.summary_hi : right.summary_en}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-850 mt-4 flex items-center justify-between text-xs font-semibold text-primary">
                  <span>{right.category}</span>
                  <div className="flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    <span>{isHi ? "विवरण देखें" : "View Details"}</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Details Modal */}
      {selectedRight && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto animate-scale-in">
            {/* Modal Header */}
            <div className="flex justify-between items-start gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                  {React.createElement(iconMap[selectedRight.icon] || BookOpen, { className: "h-6 w-6" })}
                </div>
                <div>
                  <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary mb-1">
                    {selectedRight.category}
                  </span>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                    {isHi ? selectedRight.title_hi : selectedRight.title_en}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedRight(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Bilingual Display: showing both sides helps workers understand legal terms in English as well */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* English Section */}
              <div className="space-y-4 border-r border-slate-100 dark:border-slate-850 md:pr-6">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">English Guidelines</h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  {selectedRight.summary_en}
                </p>
                
                {/* Specific details */}
                <div className="space-y-3">
                  {selectedRight.details_en.rates && (
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-500">Statutory Rates (Delhi):</p>
                      <div className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden text-[11px]">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="bg-slate-50 dark:bg-slate-950 font-bold border-b border-slate-100 dark:border-slate-800">
                              <th className="p-2">Skill Level</th>
                              <th className="p-2">Daily</th>
                              <th className="p-2">Monthly</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedRight.details_en.rates.map((r: any, i: number) => (
                              <tr key={i} className="border-b border-slate-100 dark:border-slate-800/50">
                                <td className="p-2 font-medium">{r.skill}</td>
                                <td className="p-2 text-primary">{r.daily}</td>
                                <td className="p-2 font-bold">{r.monthly}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {selectedRight.details_en.rules && (
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-500">Rules & Duties:</p>
                      <ul className="list-disc pl-4 text-xs text-slate-600 dark:text-slate-400 space-y-1.5 leading-relaxed">
                        {selectedRight.details_en.rules.map((rule: string, i: number) => (
                          <li key={i}>{rule}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Hindi Section */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">हिंदी दिशानिर्देश (Hindi)</h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  {selectedRight.summary_hi}
                </p>

                {/* Specific details Hindi */}
                <div className="space-y-3">
                  {selectedRight.details_hi.rates && (
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-500">कानूनी दरें (दिल्ली):</p>
                      <div className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden text-[11px]">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="bg-slate-50 dark:bg-slate-950 font-bold border-b border-slate-100 dark:border-slate-800">
                              <th className="p-2">कौशल स्तर</th>
                              <th className="p-2">दैनिक</th>
                              <th className="p-2">मासिक</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedRight.details_hi.rates.map((r: any, i: number) => (
                              <tr key={i} className="border-b border-slate-100 dark:border-slate-800/50">
                                <td className="p-2 font-medium">{r.skill}</td>
                                <td className="p-2 text-primary">{r.daily}</td>
                                <td className="p-2 font-bold">{r.monthly}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {selectedRight.details_hi.rules && (
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-500">नियम और कर्तव्य:</p>
                      <ul className="list-disc pl-4 text-xs text-slate-600 dark:text-slate-400 space-y-1.5 leading-relaxed">
                        {selectedRight.details_hi.rules.map((rule: string, i: number) => (
                          <li key={i}>{rule}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal actions */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-850 flex justify-end gap-3 shrink-0">
              <button
                onClick={() => {
                  setSelectedRight(null);
                  router.push("/dashboard/chat");
                }}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              >
                {isHi ? "एआई से और पूछें" : "Ask AI details"}
              </button>
              
              <button
                onClick={() => setSelectedRight(null)}
                className="rounded-xl bg-primary text-white px-5 py-2.5 text-xs font-semibold hover:bg-primary-hover shadow-lg shadow-primary/10 transition-colors"
              >
                {isHi ? "समझ गया" : "Got it"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
