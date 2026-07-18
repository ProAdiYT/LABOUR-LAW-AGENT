"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api, DiaryEntry } from "@/lib/api";
import { 
  Calendar, 
  Plus, 
  Trash2, 
  Edit3, 
  User, 
  Clock, 
  DollarSign, 
  FileText, 
  Loader2, 
  AlertCircle,
  X,
  BookOpen
} from "lucide-react";

export default function WorkerDiaryPage() {
  const { preferredLanguage } = useAuth();
  const isHi = preferredLanguage === "hi";

  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [date, setDate] = useState("");
  const [employer, setEmployer] = useState("");
  const [hoursWorked, setHoursWorked] = useState<number>(8);
  const [salaryEarned, setSalaryEarned] = useState<number>(650);
  const [notes, setNotes] = useState("");
  
  const [formSubmitting, setFormSubmitting] = useState(false);

  const loadEntries = async () => {
    try {
      const data = await api.getDiaryEntries();
      setEntries(data);
    } catch (e) {
      console.error("Failed to load diary entries:", e);
      setError("Could not load your diary entries.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const handleOpenAddModal = () => {
    setEditingId(null);
    // Set default values (today's date, standard 8 hours, unskilled min wage daily ₹673)
    const today = new Date().toISOString().split("T")[0];
    setDate(today);
    setEmployer("");
    setHoursWorked(8);
    setSalaryEarned(673);
    setNotes("");
    setModalOpen(true);
  };

  const handleOpenEditModal = (entry: DiaryEntry) => {
    setEditingId(entry.id);
    setDate(entry.date);
    setEmployer(entry.employer);
    setHoursWorked(entry.hours_worked);
    setSalaryEarned(entry.salary_earned);
    setNotes(entry.notes || "");
    setModalOpen(true);
  };

  const handleDeleteEntry = async (id: number) => {
    if (!confirm(isHi ? "क्या आप इस प्रविष्टि को हटाना चाहते हैं?" : "Are you sure you want to delete this log?")) return;
    try {
      await api.deleteDiaryEntry(id);
      // Optimistic delete
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch (e) {
      console.error("Failed to delete log entry:", e);
      alert("Failed to delete. Please try again.");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !employer || hoursWorked === undefined || salaryEarned === undefined) {
      alert("Please fill in all required fields.");
      return;
    }

    setFormSubmitting(true);
    const logPayload = {
      date,
      employer,
      hours_worked: Number(hoursWorked),
      salary_earned: Number(salaryEarned),
      notes: notes || undefined
    };

    try {
      if (editingId) {
        // Update
        const updated = await api.updateDiaryEntry(editingId, logPayload);
        setEntries((prev) => prev.map((e) => (e.id === editingId ? updated : e)));
      } else {
        // Create
        const created = await api.createDiaryEntry(logPayload);
        setEntries((prev) => [created, ...prev]);
      }
      setModalOpen(false);
    } catch (e: any) {
      alert(e.message || "Failed to save entry.");
    } finally {
      setFormSubmitting(false);
    }
  };

  // Calculate totals
  const totalWages = entries.reduce((acc, curr) => acc + curr.salary_earned, 0);
  const totalHours = entries.reduce((acc, curr) => acc + curr.hours_worked, 0);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold">{isHi ? "कामगार दैनिक डायरी" : "Worker Daily Wage Diary"}</h2>
          <p className="text-xs text-slate-500">
            {isHi 
              ? "अपने काम के घंटे, नियोक्ता और अर्जित वेतन को ट्रैक करें। यह डेटा विवादों में सबूत का काम करेगा।" 
              : "Track your working hours, employer logs, and daily earnings. Keep structured proof to resolve future unpaid wages."
            }
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary text-white px-4 py-2.5 text-xs font-semibold hover:bg-primary-hover shadow-lg shadow-primary/10 transition-transform hover:scale-105 shrink-0"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>{isHi ? "नया लॉग जोड़ें" : "Add Work Log"}</span>
        </button>
      </div>

      {/* Summary statistics boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500">{isHi ? "कुल अर्जित वेतन (डायरी)" : "Total Logged Earnings"}</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              ₹{totalWages.toLocaleString()}
            </h3>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-green-500/10 text-green-600 dark:text-green-400 flex items-center justify-center">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500">{isHi ? "कुल काम के घंटे (डायरी)" : "Total Logged Hours"}</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {totalHours} Hrs
            </h3>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Clock className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Diary logs list */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 rounded-2xl bg-white dark:bg-slate-900 border animate-pulse" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900">
          <BookOpen className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-750 mb-3" />
          <h4 className="font-bold text-slate-700 dark:text-slate-300">
            {isHi ? "डायरी खाली है" : "Your Diary is Empty"}
          </h4>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            Click the button above to add your first daily work logs.
          </p>
          <button
            onClick={handleOpenAddModal}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          >
            Create Entry
          </button>
        </div>
      ) : (
        /* Diary Logs list container */
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 font-bold border-b border-slate-150 dark:border-slate-850 text-slate-500">
                  <th className="p-4">{isHi ? "तारीख" : "Date"}</th>
                  <th className="p-4">{isHi ? "नियोक्ता" : "Employer"}</th>
                  <th className="p-4 text-center">{isHi ? "काम के घंटे" : "Hours Worked"}</th>
                  <th className="p-4 text-right">{isHi ? "अर्जित वेतन" : "Wages Received"}</th>
                  <th className="p-4 max-w-[200px]">{isHi ? "टिप्पणी" : "Notes"}</th>
                  <th className="p-4 text-center">{isHi ? "कार्रवाई" : "Actions"}</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id} className="border-b border-slate-100 dark:border-slate-850/50 hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                    <td className="p-4 font-bold text-slate-700 dark:text-slate-350">{entry.date}</td>
                    <td className="p-4 font-semibold">{entry.employer}</td>
                    <td className="p-4 text-center font-semibold text-primary">{entry.hours_worked} Hrs</td>
                    <td className="p-4 text-right font-bold text-green-600 dark:text-green-400">₹{entry.salary_earned}</td>
                    <td className="p-4 text-slate-500 truncate max-w-[200px]">{entry.notes || "-"}</td>
                    <td className="p-4 text-center">
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => handleOpenEditModal(entry)}
                          className="rounded-lg p-1.5 text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-850 transition-colors"
                          title="Edit Log"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="rounded-lg p-1.5 text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-850 transition-colors"
                          title="Delete Log"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CRUD Modal Form */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-5 animate-scale-in">
            <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-md font-bold text-slate-800 dark:text-slate-100">
                {editingId ? (isHi ? "लॉग संपादित करें" : "Edit Work Log") : (isHi ? "नया कार्य लॉग जोड़ें" : "Add Daily Work Log")}
              </h3>
              <button 
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Date */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" /> {isHi ? "तारीख (अनिवार्य)" : "Date (Required)"}
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 text-xs font-semibold focus:border-primary focus:outline-none"
                />
              </div>

              {/* Employer */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  <User className="h-3.5 w-3.5" /> {isHi ? "नियोक्ता / ठेकेदार का नाम" : "Employer Name (Required)"}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Contractor"
                  value={employer}
                  onChange={(e) => setEmployer(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 text-xs font-semibold focus:border-primary focus:outline-none"
                />
              </div>

              {/* Hours & Salary columns */}
              <div className="grid grid-cols-2 gap-4">
                {/* Hours Worked */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {isHi ? "काम के घंटे" : "Hours Worked"}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="24"
                    step="0.5"
                    required
                    value={hoursWorked}
                    onChange={(e) => setHoursWorked(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 text-xs font-semibold focus:border-primary focus:outline-none"
                  />
                </div>

                {/* Salary Earned */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 flex items-center gap-1">
                    <DollarSign className="h-3.5 w-3.5" /> {isHi ? "अर्जित वेतन (₹)" : "Salary Earned (₹)"}
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={salaryEarned}
                    onChange={(e) => setSalaryEarned(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 text-xs font-semibold focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  <FileText className="h-3.5 w-3.5" /> {isHi ? "अतिरिक्त विवरण / टिप्पणी" : "Additional Notes"}
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Overtime worked for 2 hours, paid in cash."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-2 text-xs font-semibold focus:border-primary focus:outline-none"
                />
              </div>

              {/* Form buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  disabled={formSubmitting}
                  className="rounded-xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 px-4 py-2.5 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="rounded-xl bg-primary hover:bg-primary-hover text-white px-5 py-2.5 text-xs font-semibold shadow-lg shadow-primary/10 transition-colors flex items-center gap-1"
                >
                  {formSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>{editingId ? "Update" : "Save Log"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
