"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { 
  FileSearch, 
  UploadCloud, 
  FileText, 
  Loader2, 
  AlertTriangle, 
  CheckCircle2, 
  DollarSign, 
  Clock, 
  ShieldAlert, 
  Info,
  X
} from "lucide-react";

export default function DocumentAnalyzerPage() {
  const { preferredLanguage } = useAuth();
  const isHi = preferredLanguage === "hi";

  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<any | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const allowed = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
      if (!allowed.includes(selectedFile.type)) {
        setError("Only PDF, PNG, JPG, or JPEG files are allowed.");
        setFile(null);
        return;
      }
      
      // Limit to 5MB
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File size exceeds 5MB.");
        setFile(null);
        return;
      }

      setError(null);
      setFile(selectedFile);
      setAnalysis(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setError(null);
    setIsLoading(true);

    try {
      const data = await api.uploadDocument(file);
      setAnalysis(data);
    } catch (e: any) {
      setError(e.message || "Failed to analyze document. Please check connection.");
      setAnalysis(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setAnalysis(null);
    setError(null);
  };

  const getAlertStyle = (level: string) => {
    const lvl = level?.toLowerCase();
    if (lvl === "high") {
      return {
        bg: "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400",
        iconColor: "text-rose-500",
        label: isHi ? "उच्च जोखिम (शोषण का खतरा)" : "HIGH RISK OF EXPLOITATION"
      };
    } else if (lvl === "medium") {
      return {
        bg: "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400",
        iconColor: "text-amber-500",
        label: isHi ? "मध्यम जोखिम (विसंगतियां पाई गईं)" : "MEDIUM RISK / VERIFICATION NEEDED"
      };
    }
    return {
      bg: "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400",
      iconColor: "text-green-500",
      label: isHi ? "कम जोखिम (सुरक्षित अनुबंध)" : "LOW RISK / COMPLIANT"
    };
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold">{isHi ? "एआई दस्तावेज़ विश्लेषक" : "AI Document Compliance Analyzer"}</h2>
        <p className="text-xs text-slate-500">
          {isHi 
            ? "अपना अनुबंध पत्र या वेतन पर्ची अपलोड करें। हमारा एआई वेतन, काम के घंटे और विसंगतियों का विश्लेषण करेगा।" 
            : "Upload an employment offer letter, contract, or payslip. ShramikMitra will extract and check legal compliance with Delhi labor laws."
          }
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Upload Zone */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6">
          <h3 className="text-sm font-bold border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-1.5">
            <UploadCloud className="h-4.5 w-4.5 text-primary" />
            <span>{isHi ? "दस्तावेज़ अपलोड करें" : "Upload File"}</span>
          </h3>

          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-destructive/10 p-3 text-xs text-destructive border border-destructive/20">
              <AlertCircle className="h-4.5 w-4.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Upload Drag & Drop Area */}
          {!file ? (
            <label className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-primary/40 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-950">
              <UploadCloud className="h-10 w-10 text-slate-400 mb-3" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {isHi ? "फ़ाइल चुनने के लिए क्लिक करें" : "Click to browse files"}
              </p>
              <p className="text-[10px] text-slate-400 mt-1">
                Supports PDF, PNG, JPG, or JPEG (Max 5MB)
              </p>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          ) : (
            /* Selected File Display */
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold truncate text-slate-700 dark:text-slate-300">
                    {file.name}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              
              <button 
                onClick={handleClear} 
                disabled={isLoading}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-600"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
          )}

          {file && (
            <button
              onClick={handleAnalyze}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-hover text-white px-4 py-3 text-xs font-semibold transition-colors disabled:opacity-50 shadow-lg shadow-primary/10"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>AI is Reading File...</span>
                </>
              ) : (
                <>
                  <FileSearch className="h-4 w-4" />
                  <span>{isHi ? "दस्तावेज़ का विश्लेषण करें" : "Analyze Document"}</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Right Side: Analysis Display */}
        <div className="lg:col-span-7 space-y-6">
          {isLoading ? (
            /* Loading State */
            <div className="space-y-6">
              <div className="h-28 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 animate-pulse space-y-2" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-32 rounded-3xl bg-white dark:bg-slate-900 border animate-pulse" />
                <div className="h-32 rounded-3xl bg-white dark:bg-slate-900 border animate-pulse" />
              </div>
            </div>
          ) : !analysis ? (
            /* Blank state */
            <div className="text-center py-24 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900">
              <FileSearch className="mx-auto h-14 w-14 text-slate-300 dark:text-slate-700 mb-3 animate-pulse-slow" />
              <h4 className="font-bold text-slate-700 dark:text-slate-300">
                {isHi ? "विश्लेषण परिणाम यहाँ होगा" : "Audit Report Preview"}
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
                {isHi 
                  ? "वेतन विसंगतियों, अनपेक्षित धाराओं या कानूनी कमियों की जांच के लिए वेतन पर्ची या अनुबंध की प्रति अपलोड करें।" 
                  : "Upload a payslip to test against minimum wage guidelines, or upload a contract to search for unfair clauses."
                }
              </p>
            </div>
          ) : (
            /* Analysis Results */
            <div className="space-y-6">
              {/* Alert Level Banner */}
              {(() => {
                const style = getAlertStyle(analysis.alert_level);
                return (
                  <div className={`rounded-3xl border p-5 shadow-sm flex items-start gap-4 ${style.bg}`}>
                    <AlertTriangle className={`h-6 w-6 shrink-0 ${style.iconColor}`} />
                    <div className="space-y-1">
                      <h4 className="text-xs font-extrabold tracking-wider">{style.label}</h4>
                      <p className="text-[11px] leading-relaxed opacity-90">
                        {analysis.alert_reason || (isHi ? "विवरण नीचे दिए गए हैं।" : "Details extracted below.")}
                      </p>
                    </div>
                  </div>
                );
              })()}

              {/* Summary Block */}
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Document Summary</h4>
                <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                  {analysis.summary}
                </p>
              </div>

              {/* Core Features extracted Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Extracted Salary */}
                <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-3">
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <DollarSign className="h-5 w-5 shrink-0" />
                    <h4 className="text-xs font-bold uppercase tracking-wider">{isHi ? "वेतन विवरण" : "Extracted Salary"}</h4>
                  </div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100 pl-7">
                    {analysis.salary}
                  </p>
                </div>

                {/* Extracted Working Hours */}
                <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-3">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <Clock className="h-5 w-5 shrink-0" />
                    <h4 className="text-xs font-bold uppercase tracking-wider">{isHi ? "काम के घंटे" : "Working Hours"}</h4>
                  </div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100 pl-7">
                    {analysis.working_hours}
                  </p>
                </div>
              </div>

              {/* Crucial / Unfair Clauses */}
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <ShieldAlert className="h-4.5 w-4.5 text-rose-500" />
                  <span>Important Clauses / Obligations</span>
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {analysis.key_clauses}
                </p>
              </div>

              {/* Missing Details / Red Flags */}
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Info className="h-4.5 w-4.5 text-amber-500" />
                  <span>Missing Crucial Information</span>
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {analysis.missing_information}
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
