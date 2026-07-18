"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api, Complaint } from "@/lib/api";
import { 
  FileText, 
  User, 
  Calendar, 
  HelpCircle, 
  Loader2, 
  AlertCircle, 
  Copy, 
  Download, 
  Check, 
  History,
  Languages,
  Plus
} from "lucide-react";

export default function ComplaintsPage() {
  const { preferredLanguage } = useAuth();
  const isHi = preferredLanguage === "hi";

  const [employerName, setEmployerName] = useState("");
  const [issue, setIssue] = useState("Unpaid Wages");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedComplaint, setGeneratedComplaint] = useState<Complaint | null>(null);
  
  const [history, setHistory] = useState<Complaint[]>([]);
  const [activeTab, setActiveTab] = useState<"en" | "hi">("en");
  
  const [copiedEn, setCopiedEn] = useState(false);
  const [copiedHi, setCopiedHi] = useState(false);

  // Load history from backend
  const loadHistory = async () => {
    try {
      const data = await api.getComplaintHistory();
      setHistory(data);
    } catch (e) {
      console.error("Failed to load complaint history:", e);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employerName || !date || !description) {
      setError("Please fill in all fields.");
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const data = await api.generateComplaint({
        employer_name: employerName,
        issue,
        date,
        description
      });
      setGeneratedComplaint(data);
      // Reload history list
      await loadHistory();
    } catch (e: any) {
      setError(e.message || "Failed to generate complaint. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, type: "en" | "hi") => {
    navigator.clipboard.writeText(text);
    if (type === "en") {
      setCopiedEn(true);
      setTimeout(() => setCopiedEn(false), 2000);
    } else {
      setCopiedHi(true);
      setTimeout(() => setCopiedHi(false), 2000);
    }
  };

  const handleDownloadPdf = (complaintId: number) => {
    // Navigate or call endpoint to trigger file download
    const url = api.getComplaintPdfUrl(complaintId);
    window.open(url, "_blank");
  };

  const issuesList = [
    "Unpaid Wages (बिना भुगतान की मजदूरी)",
    "Payment Below Minimum Wage (न्यूनतम वेतन से कम भुगतान)",
    "Excessive Working Hours (अत्यधिक काम के घंटे)",
    "No Overtime Compensation (ओवरटाइम का भुगतान न करना)",
    "Lack of Safety Equipment (सुरक्षा उपकरणों की कमी)",
    "Unlawful Termination (अवैध रूप से नौकरी से निकालना)",
    "Domestic Abuse / Harassment (उत्पीड़न या शोषण)"
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold">{isHi ? "औपचारिक श्रम शिकायत निर्माता" : "Labour Complaint Letter Generator"}</h2>
        <p className="text-xs text-slate-500">
          {isHi 
            ? "विवरण भरें और आधिकारिक श्रम विभाग में जमा करने के लिए कानूनी संदर्भों के साथ अंग्रेजी और हिंदी में औपचारिक पत्र तैयार करें।" 
            : "Describe your employment issue to automatically compile a formal complaint letter in English and Hindi referencing Delhi statutory labor codes."
          }
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Complaint Form */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6">
          <h3 className="text-sm font-bold border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-1.5">
            <Plus className="h-4.5 w-4.5 text-primary" />
            <span>{isHi ? "शिकायत का विवरण भरें" : "Provide Dispute Details"}</span>
          </h3>

          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-destructive/10 p-3 text-xs text-destructive border border-destructive/20">
              <AlertCircle className="h-4.5 w-4.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Employer Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <User className="h-3.5 w-3.5" /> {isHi ? "नियोक्ता / ठेकेदार का नाम" : "Employer / Contractor Name"}
              </label>
              <input
                type="text"
                required
                placeholder="e.g. ABC Construction Ltd"
                value={employerName}
                onChange={(e) => setEmployerName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 text-xs font-semibold focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Issue Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <HelpCircle className="h-3.5 w-3.5" /> {isHi ? "विवाद श्रेणी" : "Dispute Category"}
              </label>
              <select
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 text-xs font-semibold focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {issuesList.map((issueStr, idx) => (
                  <option key={idx} value={issueStr.split(" (")[0]}>
                    {issueStr}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> {isHi ? "घटना / विवाद की तारीख" : "Start Date of Incident"}
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 text-xs font-semibold focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">
                {isHi ? "घटना का विस्तृत विवरण" : "Description of Violation"}
              </label>
              <textarea
                required
                rows={4}
                placeholder={isHi ? "लिखें कि क्या हुआ (उदा: मुझे 3 महीने से काम के पैसे नहीं मिले, रोज 12 घंटे काम कराया जाता है...)" : "Provide details (e.g., worked 15 days in June but wages withheld, supervisor ignored overtime requests...)"}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-xs font-semibold focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-hover text-white px-4 py-3 text-xs font-semibold transition-colors disabled:opacity-50 shadow-lg shadow-primary/10"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Drafting Letters...</span>
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  <span>{isHi ? "औपचारिक शिकायत उत्पन्न करें" : "Generate Legal Complaint"}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Side: Generated Letters & History */}
        <div className="lg:col-span-7 space-y-6">
          {isLoading ? (
            /* Skeleton Loading State */
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 animate-pulse space-y-4">
              <div className="h-5 w-1/3 rounded bg-slate-100 dark:bg-slate-800" />
              <div className="h-4 w-full rounded bg-slate-100 dark:bg-slate-800" />
              <div className="h-40 w-full rounded bg-slate-100 dark:bg-slate-800" />
            </div>
          ) : !generatedComplaint ? (
            /* Blank state showing instructions */
            <div className="text-center py-24 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900">
              <FileText className="mx-auto h-14 w-14 text-slate-300 dark:text-slate-700 mb-3 animate-pulse-slow" />
              <h4 className="font-bold text-slate-700 dark:text-slate-300">
                {isHi ? "शिकायत पत्र यहाँ दिखाई देगा" : "Dispute Letter Preview"}
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
                {isHi 
                  ? "बाएं फॉर्म को भरें। हमारा एआई दिल्ली श्रम आयुक्त के लिए एक औपचारिक पत्र तैयार करेगा।"
                  : "Submit the details on the left. The AI lawyer will compose formatted drafts with correct references."
                }
              </p>
            </div>
          ) : (
            /* Generated complaint letters display */
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
              {/* Tab Selector & Actions bar */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 px-6 py-3 bg-slate-50 dark:bg-slate-900/50">
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab("en")}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                      activeTab === "en"
                        ? "bg-primary text-white"
                        : "text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800"
                    }`}
                  >
                    English Letter
                  </button>
                  <button
                    onClick={() => setActiveTab("hi")}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                      activeTab === "hi"
                        ? "bg-primary text-white"
                        : "text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800"
                    }`}
                  >
                    हिंदी पत्र (Hindi)
                  </button>
                </div>

                <div className="flex gap-2">
                  {/* Copy Button */}
                  <button
                    onClick={() => handleCopy(
                      activeTab === "en" ? generatedComplaint.content_en : generatedComplaint.content_hi,
                      activeTab
                    )}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    {activeTab === "en" ? (
                      copiedEn ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5 text-slate-500" />
                    ) : (
                      copiedHi ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5 text-slate-500" />
                    )}
                    <span>{activeTab === "en" ? (copiedEn ? "Copied" : "Copy") : (copiedHi ? "कॉपी किया" : "कॉपी करें")}</span>
                  </button>

                  {/* Download PDF Button */}
                  <button
                    onClick={() => handleDownloadPdf(generatedComplaint.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-secondary text-white px-3 py-1.5 text-xs font-semibold hover:bg-secondary-hover"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>

              {/* Letter Content Display */}
              <div className="p-6">
                <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-5 border border-slate-100 dark:border-slate-850 font-mono text-[11px] leading-relaxed text-slate-800 dark:text-slate-200 overflow-x-auto whitespace-pre-wrap max-h-[400px] overflow-y-auto">
                  {activeTab === "en" ? generatedComplaint.content_en : generatedComplaint.content_hi}
                </div>
              </div>
            </div>
          )}

          {/* History Panel */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <History className="h-4.5 w-4.5 text-slate-400" />
              <span>{isHi ? "पूर्व शिकायतें (इतिहास)" : "Previous Complaints History"}</span>
            </h3>

            <div className="space-y-3">
              {history.length === 0 ? (
                <p className="text-center py-4 text-xs text-slate-400">
                  {isHi ? "कोई इतिहास नहीं मिला। अपनी पहली शिकायत बनाएं!" : "No complaint history found. Generate one above!"}
                </p>
              ) : (
                history.map((comp) => (
                  <div 
                    key={comp.id}
                    className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 rounded-2xl bg-slate-50 dark:bg-slate-950 p-4 border border-slate-100 dark:border-slate-900"
                  >
                    <div className="space-y-1">
                      <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300">
                        {comp.employer_name}
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        Category: {comp.issue} • Generated on {new Date(comp.timestamp).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setGeneratedComplaint(comp);
                          setActiveTab("en");
                        }}
                        className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-[10px] font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        Preview Draft
                      </button>
                      <button
                        onClick={() => handleDownloadPdf(comp.id)}
                        className="rounded-lg bg-secondary/10 text-secondary hover:bg-secondary/20 px-3 py-1.5 text-[10px] font-bold transition-colors flex items-center gap-1"
                      >
                        <Download className="h-3 w-3" />
                        <span>PDF</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
