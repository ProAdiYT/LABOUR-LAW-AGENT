"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Shield, 
  MessageSquare, 
  BookOpen, 
  FileText, 
  Search, 
  MapPin, 
  Calendar, 
  Sparkles, 
  ArrowRight, 
  HelpCircle,
  Menu,
  X,
  Languages,
  CheckCircle2
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export default function LandingPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const features = [
    {
      icon: MessageSquare,
      title: "AI Labour Assistant",
      title_hi: "एआई श्रम सहायक",
      desc: "Chat in simple Hindi, Hinglish, or English about unpaid wages, contract disputes, and working conditions.",
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400"
    },
    {
      icon: BookOpen,
      title: "Rights Library",
      title_hi: "अधिकार पुस्तकालय",
      desc: "Browse laws on minimum wages, weekly holidays, rest intervals, safety, and leaves in Delhi.",
      color: "bg-green-500/10 text-green-600 dark:text-green-400"
    },
    {
      icon: FileText,
      title: "Complaint Generator",
      title_hi: "शिकायत निर्माता",
      desc: "Instantly draft professional labor disputes in formal English and Hindi with full legal references.",
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400"
    },
    {
      icon: Search,
      title: "Scheme Discovery",
      title_hi: "कल्याणकारी योजनाएं",
      desc: "Enter your age, gender, and job to immediately match with eligible government relief and pensions.",
      color: "bg-purple-500/10 text-purple-600 dark:text-purple-400"
    },
    {
      icon: MapPin,
      title: "Nearby Help",
      title_hi: "नजदीकी सहायता",
      desc: "Locate verified local NGOs, legal aid centers, government offices, and hospitals in the capital region.",
      color: "bg-rose-500/10 text-rose-600 dark:text-rose-400"
    },
    {
      icon: Calendar,
      title: "Worker Diary",
      title_hi: "कामगार डायरी",
      desc: "Log daily hours worked, employer name, and wages received to maintain proof of overtime or unpaid labor.",
      color: "bg-teal-500/10 text-teal-600 dark:text-teal-400"
    }
  ];

  const steps = [
    { number: "01", title: "Select Mode", desc: "Log in securely or enter instantly via Guest Mode." },
    { number: "02", title: "Describe Issue", desc: "Chat with the AI or upload documents like contract slips." },
    { number: "03", title: "Get Solution", desc: "Receive immediate rights explanation, match schemes, or file complaints." }
  ];

  const faqs = [
    {
      q: "What is the minimum wage for unskilled work in Delhi?",
      a: "As of 2026, the minimum wage in Delhi for unskilled workers is ₹17,494 per month (or approx. ₹673 per day). It is updated twice a year by the government."
    },
    {
      q: "Can I use the app offline or in Hindi?",
      a: "Yes! The AI assistant has deep multilingual capabilities and understands queries sent in Hindi, English, or Hinglish. We also provide local information database lookup."
    },
    {
      q: "How does the Worker Diary help me?",
      a: "Many migrant workers are denied overtime wages because they lack logs. The Worker Diary lets you record your hours, payments, and employers, giving you structured proof when filing disputes."
    },
    {
      q: "Is my personal data safe?",
      a: "We prioritize worker privacy. Guest Mode allows you to use all tools without entering any real identifying details, and all chat history remains stored on your local device / SQLite instance."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Header / Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
                <Shield className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                ShramikMitra AI
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary-light transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary-light transition-colors">How it Works</a>
              <a href="#faq" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary-light transition-colors">FAQs</a>
              
              <button 
                onClick={toggleTheme}
                className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors text-slate-500"
                aria-label="Toggle Theme"
              >
                {theme === "dark" ? "☀️" : "🌙"}
              </button>
              
              <Link href="/login" className="text-sm font-semibold hover:text-primary transition-colors">
                Sign In
              </Link>
              
              <Link 
                href="/login?guest=true" 
                className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover shadow-lg shadow-primary/10 transition-all hover:scale-105"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center gap-4">
              <button onClick={toggleTheme} className="text-xl">
                {theme === "dark" ? "☀️" : "🌙"}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 space-y-3">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium p-2">Features</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium p-2">How it Works</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium p-2">FAQs</a>
            <hr className="border-slate-100 dark:border-slate-800" />
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium p-2">
              Sign In
            </Link>
            <Link 
              href="/login?guest=true" 
              onClick={() => setMobileMenuOpen(false)} 
              className="block rounded-xl bg-primary px-4 py-2 text-center text-sm font-semibold text-white"
            >
              Get Started (Guest Mode)
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Ambient background glow */}
        <div className="absolute top-1/4 left-1/2 -z-10 h-96 w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute top-1/3 left-1/4 -z-10 h-72 w-[400px] rounded-full bg-secondary/10 blur-[100px]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            
            {/* Left Column: Text */}
            <motion.div 
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary dark:text-primary-light">
                <Sparkles className="h-3.5 w-3.5" />
                Delhi NCR's Dedicated Labor Help Desk
              </div>
              
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                Know Your Rights.<br />
                <span className="bg-gradient-to-r from-primary via-blue-500 to-secondary bg-clip-text text-transparent">
                  Protect Your Future.
                </span>
              </h1>
              
              <p className="mx-auto lg:mx-0 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
                Delhi's first AI-powered companion designed for migrant construction and domestic workers.
                Translate agreements, generate formal complaints, match government welfare benefits, and secure your hard-earned wages instantly.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button 
                  onClick={() => router.push("/login?guest=true")}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-semibold text-white hover:bg-primary-hover shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-105"
                >
                  Get Started (Free)
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => router.push("/login")}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-3.5 text-base font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                >
                  Try AI Assistant
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
                <div>
                  <div className="text-2xl font-bold text-primary">100%</div>
                  <div className="text-xs text-slate-500">Free to Use</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-secondary">Bilingual</div>
                  <div className="text-xs text-slate-500">Hindi / English</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent">No Signup</div>
                  <div className="text-xs text-slate-500">Guest Mode Available</div>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Visual illustration mockup */}
            <motion.div 
              className="lg:col-span-5 flex justify-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative w-full max-w-[420px] rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 p-6 shadow-2xl backdrop-blur-xl">
                
                {/* Floating chat mockup item 1 */}
                <div className="mb-4 flex items-start gap-3 rounded-2xl bg-white dark:bg-slate-900 p-4 shadow-md border border-slate-100 dark:border-slate-800">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-orange-600 font-bold text-xs shrink-0">W</div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-500">Worker Query</p>
                    <p className="text-sm font-medium">मेरा मालिक 2 महीने से पैसे नहीं दे रहा। मैं क्या करूँ?</p>
                  </div>
                </div>

                {/* Floating chat mockup item 2 (AI response) */}
                <div className="mb-4 flex items-start gap-3 rounded-2xl bg-primary/5 p-4 shadow-inner border border-primary/10">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white shrink-0">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-primary">ShramikMitra AI</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      यह दिल्ली श्रम अधिनियम के तहत गैरकानूनी है। आप:
                    </p>
                    <ul className="text-xs text-slate-600 dark:text-slate-400 list-disc pl-4 space-y-1">
                      <li>मजदूरी पर्ची की प्रति लें।</li>
                      <li>हमारे <strong>शिकायत निर्माता</strong> से शिकायत ड्राफ्ट करें।</li>
                      <li>नजदीकी <strong>दिल्ली श्रम कार्यालय</strong> में जमा करें।</li>
                    </ul>
                  </div>
                </div>

                {/* Quick utility widgets */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 text-center">
                    <p className="text-xs text-slate-400">Delhi Min Wage</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1">₹17,494/Mo</p>
                  </div>
                  <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 text-center">
                    <p className="text-xs text-slate-400">Help Status</p>
                    <p className="text-sm font-bold text-secondary mt-1 flex items-center justify-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" /> Active
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-24 border-t border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything You Need To Secure Your Rights</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Explore easy-to-use digital legal tools built with Delhi's local policies in mind, accessible entirely for free.
            </p>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {features.map((feat, idx) => (
              <motion.div 
                key={idx}
                variants={itemVariants}
                className="group relative rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all hover:-translate-y-1"
              >
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${feat.color}`}>
                  <feat.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold flex items-center justify-between">
                  <span>{feat.title}</span>
                  <span className="text-xs font-normal text-slate-400">{feat.title_hi}</span>
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feat.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How ShramikMitra Works</h2>
            <p className="text-slate-600 dark:text-slate-400">Get your legal help in just 3 quick steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {steps.map((step, idx) => (
              <div key={idx} className="relative flex flex-col items-center text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-2xl dark:bg-primary/20">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xs">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight">Voices of Delhi Workers</h2>
            <p className="text-slate-600 dark:text-slate-400 mt-2">Dummy case logs showing prototype value.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-6 bg-slate-50 dark:bg-slate-900/50">
              <p className="text-sm italic text-slate-700 dark:text-slate-300">
                "I worked 12 hours a day on a construction project in Dwarka but the contractor refused overtime. 
                Using the Worker Diary, I showed him my logs and used the Complaint Generator. 
                When he saw the formal Hindi document referencing Delhi rules, he cleared my dues immediately."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">R</div>
                <div>
                  <h4 className="text-sm font-bold">Ramesh K.</h4>
                  <p className="text-xs text-slate-400">Construction Worker, Delhi</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-6 bg-slate-50 dark:bg-slate-900/50">
              <p className="text-sm italic text-slate-700 dark:text-slate-300">
                "The scheme recommender is brilliant. I entered my profile and it matched me with the BOCW Board scholarship. 
                It explained all required documents clearly. My daughter's admission fees are now supported by the government."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">M</div>
                <div>
                  <h4 className="text-sm font-bold">Manju Devi</h4>
                  <p className="text-xs text-slate-400">Domestic Worker, Okhla</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
            <p className="text-slate-600 dark:text-slate-400 mt-2">Quick answers to common questions.</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-semibold text-slate-800 dark:text-slate-200"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="h-4.5 w-4.5 text-primary shrink-0" />
                    {faq.q}
                  </span>
                  <span className="text-slate-400">{activeFaq === idx ? "▲" : "▼"}</span>
                </button>
                {activeFaq === idx && (
                  <div className="px-5 pb-5 pt-1 border-t border-slate-100 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="flex items-center justify-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary text-white flex items-center justify-center">
              <Shield className="h-4 w-4" />
            </div>
            <span className="font-bold">ShramikMitra AI</span>
          </div>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Disclaimer: ShramikMitra AI is an educational technology prototype built for hackathon demonstration. It does not constitute formal legal counsel. For formal legal matters, please contact registered advocates or state labor department authorities.
          </p>
          <div className="text-xs text-slate-400">
            © {new Date().getFullYear()} ShramikMitra AI. Built for the Delhi Migrant Worker Welfare Hackathon.
          </div>
        </div>
      </footer>
    </div>
  );
}
