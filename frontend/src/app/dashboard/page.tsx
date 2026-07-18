"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { api, DiaryEntry, Complaint } from "@/lib/api";
import { 
  MessageSquare, 
  BookOpen, 
  FileText, 
  Search, 
  MapPin, 
  Calendar, 
  FileSearch,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Clock,
  PhoneCall,
  X,
  FileCheck2,
  CheckCircle2,
  Clock3
} from "lucide-react";

export default function DashboardOverviewPage() {
  const router = useRouter();
  const { preferredLanguage, user } = useAuth();
  const isHi = preferredLanguage === "hi";

  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [loadingStats, setLoadingStats] = useState(true);

  // Statistics summaries
  const [totalHours, setTotalHours] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);

  useEffect(() => {
    async function loadStats() {
      try {
        const diaryData = await api.getDiaryEntries();
        setDiaryEntries(diaryData);
        
        const complaintData = await api.getComplaintHistory();
        setComplaints(complaintData);

        // Sum hours and earnings for the worker
        let hours = 0;
        let earnings = 0;
        diaryData.forEach(entry => {
          hours += entry.hours_worked;
          earnings += entry.salary_earned;
        });
        setTotalHours(hours);
        setTotalEarnings(earnings);
      } catch (e) {
        console.error("Failed to load dashboard statistics:", e);
      } finally {
        setLoadingStats(false);
      }
    }
    loadStats();
  }, []);

  const toolCards = [
    {
      title: "AI Chat Assistant",
      title_hi: "एआई चैट सहायक",
      desc: "Ask questions about labor disputes, wages, or hours.",
      desc_hi: "श्रम विवाद, वेतन, या काम के घंटों के बारे में प्रश्न पूछें।",
      href: "/dashboard/chat",
      icon: MessageSquare,
      color: "from-blue-500 to-indigo-600 bg-blue-500/10 text-blue-600 dark:text-blue-400"
    },
    {
      title: "Labour Rights Library",
      title_hi: "अधिकार पुस्तकालय",
      desc: "Explore legal rules about wages, hours, and leaves.",
      desc_hi: "वेतन, काम के घंटे और छुट्टियों के बारे में कानूनी नियम खोजें।",
      href: "/dashboard/rights",
      icon: BookOpen,
      color: "from-green-500 to-emerald-600 bg-green-500/10 text-green-600 dark:text-green-400"
    },
    {
      title: "Complaint Maker",
      title_hi: "शिकायत निर्माता",
      desc: "Draft a formal legal letter in English & Hindi.",
      desc_hi: "अंग्रेजी और हिंदी में औपचारिक कानूनी पत्र का ड्राफ्ट बनाएं।",
      href: "/dashboard/complaints",
      icon: FileText,
      color: "from-amber-500 to-orange-600 bg-amber-500/10 text-amber-600 dark:text-amber-400"
    },
    {
      title: "Welfare Schemes",
      title_hi: "कल्याणकारी योजनाएं",
      desc: "Find and match eligible government financial support.",
      desc_hi: "पात्र सरकारी वित्तीय सहायता और योजनाओं को खोजें।",
      href: "/dashboard/schemes",
      icon: Search,
      color: "from-purple-500 to-violet-600 bg-purple-500/10 text-purple-600 dark:text-purple-400"
    },
    {
      title: "Document Analyzer",
      title_hi: "दस्तावेज़ विश्लेषक",
      desc: "Upload payslips/contracts to verify legal compliance.",
      desc_hi: "वेतन पर्ची/अनुबंधों को अपलोड करके कानूनी वैधता जांचें।",
      href: "/dashboard/documents",
      icon: FileSearch,
      color: "from-teal-500 to-cyan-600 bg-teal-500/10 text-teal-600 dark:text-teal-400"
    },
    {
      title: "Nearby Help Map",
      title_hi: "सहायता नक्शा",
      desc: "Find nearest labor offices, NGOs, and police stations.",
      desc_hi: "निकटतम श्रम कार्यालय, एनजीओ और पुलिस स्टेशन खोजें।",
      href: "/dashboard/map",
      icon: MapPin,
      color: "from-rose-500 to-pink-600 bg-rose-500/10 text-rose-600 dark:text-rose-400"
    },
    {
      title: "Worker Diary",
      title_hi: "कामगार डायरी",
      desc: "Log daily work hours, earnings, and employers.",
      desc_hi: "दैनिक काम के घंटे, कमाई और नियोक्ताओं का लॉग रखें।",
      href: "/dashboard/diary",
      icon: Calendar,
      color: "from-sky-500 to-cyan-600 bg-sky-500/10 text-sky-600 dark:text-sky-400"
    }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Top Banner section */}
      <div className="rounded-3xl bg-gradient-to-r from-primary to-indigo-600 p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 h-48 w-48 -translate-y-12 translate-x-12 rounded-full bg-white/10 blur-xl" />
        <div className="absolute bottom-0 right-1/4 h-32 w-32 translate-y-12 rounded-full bg-white/5 blur-lg" />
        
        <div className="max-w-2xl space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold">
            {isHi ? `नमस्ते, ${user.username}!` : `Hello, ${user.username}!`}
          </h2>
          <p className="text-sm md:text-base text-white/80 leading-relaxed">
            {isHi 
              ? "यह आपका व्यक्तिगत श्रम कल्याण डैशबोर्ड है। आप अपनी मजदूरी की निगरानी कर सकते हैं, हमारे एआई से सवाल पूछ सकते हैं, या आपातकाल के मामले में तुरंत सहायता प्राप्त कर सकते हैं।" 
              : "This is your labor welfare workspace. Track your wages, ask questions to our AI chatbot, or call immediate emergency support if your rights are violated."
            }
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link 
              href="/dashboard/chat" 
              className="rounded-xl bg-white text-primary px-4 py-2 text-sm font-semibold hover:bg-slate-100 transition-colors shadow-md shadow-black/10"
            >
              {isHi ? "एआई से बात करें" : "Talk to AI Assistant"}
            </Link>
            
            <button 
              onClick={() => setSosModalOpen(true)}
              className="rounded-xl bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 text-sm font-semibold transition-all shadow-md shadow-black/10 flex items-center gap-1.5 animate-pulse-slow"
            >
              <AlertTriangle className="h-4 w-4" />
              <span>{isHi ? "आपातकालीन एसओएस (SOS)" : "Emergency SOS"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Worker Stats summary widget */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Total Earnings */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500">{isHi ? "कुल अर्जित वेतन" : "Total Logged Earnings"}</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {loadingStats ? "..." : `₹${totalEarnings.toLocaleString()}`}
            </h3>
          </div>
          <div className="h-10 w-10 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400 flex items-center justify-center">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>

        {/* Total Hours */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500">{isHi ? "कुल काम के घंटे" : "Total Logged Hours"}</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {loadingStats ? "..." : `${totalHours} Hrs`}
            </h3>
          </div>
          <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        {/* Complaints Generated */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500">{isHi ? "दर्ज शिकायतें" : "Complaints Generated"}</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {loadingStats ? "..." : complaints.length}
            </h3>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <FileCheck2 className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Grid of Tools */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold">{isHi ? "त्वरित उपकरण" : "Available Tools"}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {toolCards.map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <Link 
                key={idx} 
                href={tool.href}
                className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 hover:border-slate-300 dark:hover:border-slate-700"
              >
                <div className="flex gap-4 items-start">
                  <div className={`rounded-xl p-3 shrink-0 ${tool.color.split(" ").slice(1).join(" ")}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold flex items-center justify-between text-slate-800 dark:text-slate-100">
                      <span>{isHi ? tool.title_hi : tool.title}</span>
                      <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
                    </h4>
                    <p className="text-xs text-slate-500 leading-normal">
                      {isHi ? tool.desc_hi : tool.desc}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom Layout: Recent Activity vs General Advisory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-sm">
          <div className="flex justify-between items-center">
            <h3 className="text-md font-bold">{isHi ? "हाल की गतिविधि" : "Recent Activity"}</h3>
            <Link href="/dashboard/diary" className="text-xs text-primary hover:underline font-semibold flex items-center gap-0.5">
              <span>View Diary</span> <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {loadingStats ? (
              <div className="space-y-2 py-4">
                <div className="h-8 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
                <div className="h-8 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
              </div>
            ) : diaryEntries.length === 0 && complaints.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                {isHi ? "कोई हाल की गतिविधि नहीं पाई गई। अपना पहला लॉग बनाएं!" : "No recent activity. Start by logging your work hours!"}
              </div>
            ) : (
              <>
                {/* Render recent complaints */}
                {complaints.slice(0, 2).map((comp) => (
                  <div key={comp.id} className="flex gap-3 items-center rounded-xl bg-slate-50 dark:bg-slate-950 p-3 text-xs border border-slate-100 dark:border-slate-900">
                    <div className="rounded-lg bg-amber-500/10 text-amber-500 p-2">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate text-slate-700 dark:text-slate-300">
                        {isHi ? `शिकायत: ${comp.employer_name}` : `Complaint drafted: ${comp.employer_name}`}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Issue: {comp.issue} • {new Date(comp.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <Link href="/dashboard/complaints" className="text-[10px] font-bold text-primary hover:underline">
                      View
                    </Link>
                  </div>
                ))}
                
                {/* Render recent diary entries */}
                {diaryEntries.slice(0, 3).map((entry) => (
                  <div key={entry.id} className="flex gap-3 items-center rounded-xl bg-slate-50 dark:bg-slate-950 p-3 text-xs border border-slate-100 dark:border-slate-900">
                    <div className="rounded-lg bg-blue-500/10 text-blue-500 p-2">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate text-slate-700 dark:text-slate-300">
                        Work Log: {entry.employer}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {entry.date} • {entry.hours_worked} Hrs • ₹{entry.salary_earned}
                      </p>
                    </div>
                    <Link href="/dashboard/diary" className="text-[10px] font-bold text-primary hover:underline">
                      Manage
                    </Link>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* General Advisory Card */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-md font-bold flex items-center gap-1.5">
              <TrendingUp className="h-4.5 w-4.5 text-primary" />
              <span>{isHi ? "दैनिक श्रम नियम" : "Delhi Labour Advisory"}</span>
            </h3>
            <div className="text-xs text-slate-600 dark:text-slate-400 space-y-2 leading-relaxed">
              <p>
                <strong>1. Overtime Wages:</strong> Any hour worked beyond 8 hours a day in Delhi warrants <strong>double pay</strong>. Do not accept flat hourly rates.
              </p>
              <p>
                <strong>2. Weekly Holiday:</strong> You are legally entitled to 1 paid rest day per week.
              </p>
              <p>
                <strong>3. Bank Account:</strong> Demand payment through bank transfers. Avoid cash if possible, as it leaves no proof of underpayment.
              </p>
            </div>
          </div>
          <Link 
            href="/dashboard/rights" 
            className="w-full text-center rounded-xl bg-slate-100 dark:bg-slate-800 py-2.5 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-750 transition-colors block text-primary"
          >
            {isHi ? "अधिकारों की पूरी सूची" : "Browse Rights Library"}
          </Link>
        </div>
      </div>

      {/* SOS Modal */}
      {sosModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-6 animate-scale-in">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2 text-rose-500">
                <AlertTriangle className="h-6 w-6" />
                <h3 className="text-lg font-bold">{isHi ? "आपातकालीन संपर्क सूची" : "Emergency Contacts"}</h3>
              </div>
              <button 
                onClick={() => setSosModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-normal">
              {isHi 
                ? "यदि आपके नियोक्ता ने आपको बंधक बना रखा है, आपको शारीरिक चोट पहुंचाई है, या उत्पीड़न कर रहा है, तो कृपया नीचे दिए गए नंबरों पर तुरंत कॉल करें।"
                : "If your employer is holding you captive, threatening violence, or has caused severe workplace injury, call the following hotlines immediately."
              }
            </p>

            <div className="space-y-3">
              {[
                { label: "General Emergency (पुलिस)", number: "112" },
                { label: "Delhi Labour Commissioner (श्रम आयुक्त)", number: "155214" },
                { label: "National Labour Helpline (राष्ट्रीय श्रम)", number: "14434" },
                { label: "Women Safety Line (महिला सुरक्षा)", number: "1091" },
                { label: "Ambulance (एम्बुलेंस)", number: "102" }
              ].map((h, i) => (
                <a 
                  key={i}
                  href={`tel:${h.number}`} 
                  className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-950 p-3 border border-slate-100 dark:border-slate-900 hover:border-rose-500/30 hover:bg-rose-500/5 transition-all group"
                >
                  <div className="text-xs">
                    <p className="font-bold text-slate-700 dark:text-slate-300">{h.label}</p>
                    <p className="text-[10px] text-slate-400">Click to call immediately</p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-rose-500/10 text-rose-500 font-bold px-3 py-1.5 text-xs group-hover:bg-rose-500 group-hover:text-white transition-colors">
                    <PhoneCall className="h-3 w-3" />
                    <span>{h.number}</span>
                  </span>
                </a>
              ))}
            </div>

            <button 
              onClick={() => setSosModalOpen(false)}
              className="w-full text-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-2.5 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            >
              {isHi ? "बंद करें" : "Close Portal"}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
