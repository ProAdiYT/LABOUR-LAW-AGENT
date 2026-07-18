"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api, Scheme, SchemeRecommendation } from "@/lib/api";
import { 
  Search, 
  User, 
  Briefcase, 
  MapPin, 
  Loader2, 
  AlertCircle, 
  FileText, 
  Award,
  Sparkles,
  Info
} from "lucide-react";

export default function SchemesPage() {
  const { preferredLanguage } = useAuth();
  const isHi = preferredLanguage === "hi";

  const [age, setAge] = useState<number>(25);
  const [gender, setGender] = useState("Male");
  const [occupation, setOccupation] = useState("Construction");
  const [state, setState] = useState("Delhi");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<SchemeRecommendation | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!age || age < 1 || age > 120) {
      setError("Please enter a valid age.");
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const data = await api.getRecommendedSchemes(age, gender, occupation, state);
      setRecommendation(data);
    } catch (e: any) {
      setError(e.message || "Failed to find schemes. Please try again.");
      setRecommendation(null);
    } finally {
      setIsLoading(false);
    }
  };

  const occupations = [
    { value: "Construction", label: "Construction Worker (निर्माण)", label_hi: "निर्माण मजदूर" },
    { value: "Domestic", label: "Domestic Worker (घरेलू कामगार)", label_hi: "घरेलू कामगार" },
    { value: "Factory", label: "Factory Worker (कारखाना मजदूर)", label_hi: "कारखाना मजदूर" },
    { value: "Sanitation", label: "Sanitation Worker (सफाई कर्मचारी)", label_hi: "सफाई कर्मचारी" },
    { value: "Agriculture", label: "Agriculture Worker (कृषि)", label_hi: "कृषि" },
    { value: "Other", label: "Other / Unorganized (अन्य)", label_hi: "अन्य" }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold">{isHi ? "सरकारी कल्याणकारी योजना खोजक" : "Government Schemes Finder"}</h2>
        <p className="text-xs text-slate-500">
          {isHi 
            ? "अपनी आयु, पेशा और लिंग दर्ज करें और दिल्ली और केंद्र सरकार की योजनाओं से मेल खाएं।" 
            : "Match your demographic profile against official Delhi & Central welfare schemes to find eligible aid, scholarships, and pensions."
          }
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Matching Form */}
        <div className="lg:col-span-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6">
          <h3 className="text-sm font-bold border-b border-slate-100 dark:border-slate-800 pb-3">
            {isHi ? "अपनी जानकारी दर्ज करें" : "Enter Demographic Details"}
          </h3>

          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-destructive/10 p-3 text-xs text-destructive border border-destructive/20">
              <AlertCircle className="h-4.5 w-4.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Age */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <User className="h-3.5 w-3.5" /> {isHi ? "आयु (वर्षों में)" : "Age (in Years)"}
              </label>
              <input
                type="number"
                min="18"
                max="100"
                required
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 text-xs font-semibold focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Gender */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <User className="h-3.5 w-3.5" /> {isHi ? "लिंग" : "Gender"}
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 text-xs font-semibold focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Male">Male (पुरुष)</option>
                <option value="Female">Female (महिला)</option>
                <option value="Other">Other (अन्य)</option>
              </select>
            </div>

            {/* Occupation */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <Briefcase className="h-3.5 w-3.5" /> {isHi ? "पेशा" : "Occupation"}
              </label>
              <select
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 text-xs font-semibold focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {occupations.map((o) => (
                  <option key={o.value} value={o.value}>
                    {isHi ? o.label_hi : o.label}
                  </option>
                ))}
              </select>
            </div>

            {/* State */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {isHi ? "वर्तमान राज्य" : "Current State"}
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 text-xs font-semibold focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Delhi">Delhi (दिल्ली)</option>
                <option value="Other">Other State (अन्य राज्य)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-hover text-white px-4 py-3 text-xs font-semibold transition-colors disabled:opacity-50 shadow-lg shadow-primary/10"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Matching...</span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  <span>{isHi ? "पात्र योजनाएं खोजें" : "Find Eligible Schemes"}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Side: Results Display */}
        <div className="lg:col-span-8 space-y-6">
          {isLoading ? (
            /* Skeleton Loading State */
            <div className="space-y-6">
              <div className="h-40 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 animate-pulse space-y-3">
                <div className="h-5 w-1/4 rounded bg-slate-100 dark:bg-slate-800" />
                <div className="h-4 w-3/4 rounded bg-slate-100 dark:bg-slate-800" />
                <div className="h-4 w-full rounded bg-slate-100 dark:bg-slate-800" />
              </div>
              <div className="h-48 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 animate-pulse space-y-3">
                <div className="h-5 w-1/3 rounded bg-slate-100 dark:bg-slate-800" />
                <div className="h-4 w-full rounded bg-slate-100 dark:bg-slate-800" />
                <div className="h-4 w-5/6 rounded bg-slate-100 dark:bg-slate-800" />
              </div>
            </div>
          ) : !recommendation ? (
            /* Initial Instruction State */
            <div className="text-center py-20 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900">
              <Award className="mx-auto h-14 w-14 text-slate-300 dark:text-slate-700 mb-3 animate-pulse-slow" />
              <h4 className="font-bold text-slate-700 dark:text-slate-300">
                {isHi ? "खोजने के लिए तैयार" : "Ready to Discover"}
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
                {isHi 
                  ? "अपनी जानकारी दर्ज करें और दिल्ली श्रम कल्याण बोर्ड की पेंशन, मातृत्व लाभ और शिक्षा छात्रवृत्ति योजनाओं को तुरंत खोजें।" 
                  : "Submit your details on the left to see eligible pensions, maternity relief, and child scholarship schemes from NCT Delhi BOCW Board."
                }
              </p>
            </div>
          ) : (
            /* Matching Result Display */
            <div className="space-y-6">
              
              {/* AI Recommendation Summary */}
              {recommendation.ai_recommendation && (
                <div className="rounded-3xl border border-primary/20 bg-primary/5 p-6 shadow-inner space-y-4">
                  <h4 className="text-xs font-bold text-primary flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 animate-pulse" />
                    <span>{isHi ? "एआई सलाहकार विश्लेषण" : "AI Advisor Analysis"}</span>
                  </h4>
                  
                  <div className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 space-y-2">
                    {recommendation.ai_recommendation.split("\n\n").map((para, idx) => {
                      if (para.startsWith("###")) {
                        return <h5 key={idx} className="font-bold text-sm text-slate-900 dark:text-slate-100 pt-1">{para.replace("###", "").trim()}</h5>;
                      }
                      
                      if (para.includes("\n-") || para.includes("\n*")) {
                        const listItems = para.split("\n").filter(li => li.trim());
                        return (
                          <ul key={idx} className="list-disc pl-4 space-y-1.5">
                            {listItems.map((li, lIdx) => (
                              <li key={lIdx}>{li.replace(/^-\s*/, "").replace(/^\*\s*/, "").trim()}</li>
                            ))}
                          </ul>
                        );
                      }
                      
                      return <p key={idx}>{para}</p>;
                    })}
                  </div>
                </div>
              )}

              {/* Matched Scheme Cards */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold">{isHi ? "योग्य योजनाओं की सूची" : "Matched Eligible Schemes"} ({recommendation.schemes.length})</h4>
                
                {recommendation.schemes.length === 0 ? (
                  <div className="rounded-2xl bg-white dark:bg-slate-900 border p-6 text-center text-xs text-slate-500">
                    No matching schemes found for your current state/occupation criteria.
                  </div>
                ) : (
                  recommendation.schemes.map((scheme) => (
                    <div 
                      key={scheme.id}
                      className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4 hover:border-slate-300 dark:hover:border-slate-750 transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                            {isHi ? scheme.name_hi : scheme.name_en}
                          </h4>
                          <p className="text-xs text-slate-500 leading-normal">
                            {isHi ? scheme.description_hi : scheme.description_en}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 px-3 py-1 text-[10px] font-bold">
                          Matched
                        </span>
                      </div>

                      {/* Benefits & Documents grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100 dark:border-slate-850 text-xs">
                        {/* Benefits */}
                        <div className="space-y-1.5">
                          <p className="font-bold text-slate-500 flex items-center gap-1">
                            <Award className="h-4 w-4 text-secondary" /> {isHi ? "योजना के लाभ:" : "Benefits:"}
                          </p>
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-5">
                            {isHi ? scheme.benefits_hi : scheme.benefits_en}
                          </p>
                        </div>

                        {/* Documents */}
                        <div className="space-y-1.5">
                          <p className="font-bold text-slate-500 flex items-center gap-1">
                            <FileText className="h-4 w-4 text-amber-500" /> {isHi ? "आवश्यक दस्तावेज़:" : "Required Documents:"}
                          </p>
                          <ul className="list-disc pl-9 space-y-1 leading-normal text-slate-700 dark:text-slate-300">
                            {(isHi ? scheme.required_documents_hi : scheme.required_documents_en).map((doc, dIdx) => (
                              <li key={dIdx}>{doc}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      {/* Application instructions notice */}
                      <div className="rounded-xl bg-slate-50 dark:bg-slate-950 p-3 border border-slate-100 dark:border-slate-900 flex gap-2 items-start text-[10px] text-slate-500">
                        <Info className="h-4 w-4 text-primary shrink-0" />
                        <div>
                          <p className="font-bold text-slate-600 dark:text-slate-400">How to apply:</p>
                          <p className="leading-relaxed">
                            {isHi 
                              ? "इस योजना का दावा करने के लिए आवश्यक दस्तावेजों के साथ नजदीकी दिल्ली जिला श्रम कार्यालय या e-District पोर्टल पर जाएँ।" 
                              : "To claim these benefits, compile the documents listed above and register at the nearest Delhi Civic Center / Labor Office."
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
