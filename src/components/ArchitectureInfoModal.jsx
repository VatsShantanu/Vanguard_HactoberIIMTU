import React, { useState } from 'react';
import { 
  X, 
  Layers, 
  Cpu, 
  Database, 
  ShieldCheck, 
  Sparkles, 
  Users, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle,
  FileText,
  DollarSign,
  TrendingUp,
  Workflow
} from 'lucide-react';
import { useEvents } from '../context/EventContext';

export default function ArchitectureInfoModal() {
  const { architectureModalOpen, setArchitectureModalOpen } = useEvents();
  const [activeSlide, setActiveSlide] = useState(1);

  if (!architectureModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-4xl rounded-[32px] bg-white/85 dark:bg-slate-900/80 backdrop-blur-3xl border border-white/80 dark:border-white/18 shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-brand-900 via-brand-800 to-teal-800 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20">
                HACKSHIFT PS 4
              </span>
              <span className="text-xs text-brand-200">Cmd+Shift+Create</span>
            </div>
            <h2 className="text-xl font-extrabold tracking-tight mt-1">
              MyCampus: System Architecture & Innovation Deck
            </h2>
            <p className="text-xs text-brand-100">
              Team VANGUARD: Ritesh Kumar · Shantanu Vats · Pranjal Sharma
            </p>
          </div>

          <button
            onClick={() => setArchitectureModalOpen(false)}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls for Slides */}
        <div className="flex items-center gap-1 p-2 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveSlide(1)}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeSlide === 1 ? 'bg-white dark:bg-slate-700 text-brand-700 dark:text-brand-300 shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            1. Problem & Gaps
          </button>
          <button
            onClick={() => setActiveSlide(2)}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeSlide === 2 ? 'bg-white dark:bg-slate-700 text-brand-700 dark:text-brand-300 shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            2. Proposed Solution
          </button>
          <button
            onClick={() => setActiveSlide(3)}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeSlide === 3 ? 'bg-white dark:bg-slate-700 text-brand-700 dark:text-brand-300 shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            3. Technology & System Flow
          </button>
          <button
            onClick={() => setActiveSlide(4)}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeSlide === 4 ? 'bg-white dark:bg-slate-700 text-brand-700 dark:text-brand-300 shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            4. Innovation & Business Model
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 max-h-[65vh] overflow-y-auto">
          
          {/* SLIDE 1: Problem */}
          {activeSlide === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Students find opportunities everywhere — but struggle to manage them in one place.
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Registration links, eligibility criteria, venues, deadlines and preparation tasks rarely live together.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-mono font-bold text-brand-600">01</span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                    Scattered Event Information
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Dates, venues, fees and links are spread across WhatsApp groups, notice boards, emails and PDF flyers.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-mono font-bold text-brand-600">02</span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                    Manual Tracking & Missed Deadlines
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Registration deadlines and submission portals get buried across threads; reminders are forgotten.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-mono font-bold text-rose-600">03</span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                    Clashes with Student Life
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Events overlap with mid-term exams, lab submissions or university tests — often noticed when it is too late to withdraw.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-mono font-bold text-brand-600">04</span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                    No End-to-End Guidance
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Platforms only show listings; none guide students to form teams, track abstracts, prepare decks, and arrive ready.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 2: Proposed Solution */}
          {activeSlide === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  MyCampus: One student-first workflow from capture to confident demo
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Replaces manual checking and separate notes apps with an intelligent, integrated journey.
                </p>
              </div>

              {/* Comparison Matrix from Slide 3 */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold">
                      <th className="py-2.5 px-3">Capability</th>
                      <th className="py-2.5 px-3">Existing Platforms</th>
                      <th className="py-2.5 px-3">Manual Tracking</th>
                      <th className="py-2.5 px-3 bg-brand-50/50 dark:bg-brand-950/30 text-brand-700 dark:text-brand-300 font-extrabold">MyCampus</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    <tr>
                      <td className="py-2.5 px-3 font-semibold">Event Discovery</td>
                      <td className="py-2.5 px-3 text-slate-500">Platform-specific listings</td>
                      <td className="py-2.5 px-3 text-slate-500">Search multiple sources</td>
                      <td className="py-2.5 px-3 bg-brand-50/50 dark:bg-brand-950/30 font-bold text-brand-700 dark:text-brand-300">Multi-source unified capture</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold">Event Capture</td>
                      <td className="py-2.5 px-3 text-slate-500">Varies by platform</td>
                      <td className="py-2.5 px-3 text-slate-500">Copy details manually</td>
                      <td className="py-2.5 px-3 bg-brand-50/50 dark:bg-brand-950/30 font-bold text-brand-700 dark:text-brand-300">Gmail, Calendar, Extension, Poster/PDF</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold">Detail Verification</td>
                      <td className="py-2.5 px-3 text-slate-500">Depends on source</td>
                      <td className="py-2.5 px-3 text-slate-500">Check manually</td>
                      <td className="py-2.5 px-3 bg-brand-50/50 dark:bg-brand-950/30 font-bold text-brand-700 dark:text-brand-300">AI extraction + Student confirmation</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold">Deadlines & Clashes</td>
                      <td className="py-2.5 px-3 text-slate-500">Limited / varies</td>
                      <td className="py-2.5 px-3 text-slate-500">Easy to miss</td>
                      <td className="py-2.5 px-3 bg-brand-50/50 dark:bg-brand-950/30 font-bold text-brand-700 dark:text-brand-300">Deadline & timetable clash alerts</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold">Preparation</td>
                      <td className="py-2.5 px-3 text-slate-500">Separate tools needed</td>
                      <td className="py-2.5 px-3 text-slate-500">Self-managed</td>
                      <td className="py-2.5 px-3 bg-brand-50/50 dark:bg-brand-950/30 font-bold text-brand-700 dark:text-brand-300">Personal checklists + Task studio</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SLIDE 3: System Architecture */}
          {activeSlide === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Multi-Source Pipeline & Architecture (Slide 4)
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Client apps capture events, AI extracts details, rule-engines verify them, and personalisation turns them into action.
                </p>
              </div>

              {/* 4 Architecture Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-md bg-teal-600 text-white flex items-center justify-center text-xs font-bold">01</span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Frontend & Capture
                    </h4>
                  </div>
                  <p className="text-xs font-mono text-teal-600 dark:text-teal-400">React.js · Chrome Extension (Manifest V3)</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Student dashboard, manual event entry, supported website capture and poster/PDF upload dropzone.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-md bg-brand-600 text-white flex items-center justify-center text-xs font-bold">02</span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Database & Validation
                    </h4>
                  </div>
                  <p className="text-xs font-mono text-brand-600 dark:text-brand-400">Supabase · PostgreSQL · Rule-based checks</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Store event details, source links, deadlines and registration status. Normalize fields, detect duplicates, and flag schedule clashes.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center text-xs font-bold">03</span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      APIs & Data Ingestion
                    </h4>
                  </div>
                  <p className="text-xs font-mono text-blue-600 dark:text-blue-400">Gmail API · Google Calendar API · OCR · LLM</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    OAuth retrieves relevant event information. OCR reads posters; LLM extracts structured fields (Name, Date, Venue, Fees, Eligibility).
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-md bg-purple-600 text-white flex items-center justify-center text-xs font-bold">04</span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      AI Personalisation & Delivery
                    </h4>
                  </div>
                  <p className="text-xs font-mono text-purple-600 dark:text-purple-400">LLM · Preference scoring · Scheduled reminders</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Generates event summaries and preparation checklists. Ranks hackathons by student project fit and missing skills.
                  </p>
                </div>
              </div>

              {/* Workflow Pipeline */}
              <div className="p-4 rounded-2xl bg-brand-950 text-white text-xs">
                <span className="font-bold text-teal-400 uppercase tracking-wider block mb-2">
                  System Workflow:
                </span>
                <div className="flex items-center justify-between flex-wrap gap-2 text-center font-mono">
                  <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700">Capture</span>
                  <span>→</span>
                  <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700">Extract (AI)</span>
                  <span>→</span>
                  <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700">Validate (Rules)</span>
                  <span>→</span>
                  <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700">Store (DB)</span>
                  <span>→</span>
                  <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700">Personalise</span>
                  <span>→</span>
                  <span className="px-3 py-1.5 rounded-lg bg-brand-700 border border-brand-500 font-bold">Notify</span>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 4: Business Model & Implementation */}
          {activeSlide === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Innovation, Impact & Sustainable Implementation (Slide 5)
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Built to scale from an individual campus MVP to institution-wide deployment.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
                    1
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Freemium Model
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    Essential planning tools remain 100% free for students. Advanced AI resume/project matching and team matching available in premium club tiers.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold">
                    2
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Institutional Partnerships
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    Partner with colleges and student clubs to provide organizers an event management dashboard and analytics on student participation and skill trends.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold">
                    3
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Modular MVP & Scalability
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    Starts with multi-source OCR event capture and timetable clash checks. Seamlessly scales to multi-campus federation and automated LMS grade sync.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-mono">
            HackShift Finale Presentation · Team VANGUARD
          </span>
          <button
            onClick={() => setArchitectureModalOpen(false)}
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white font-bold transition-colors"
          >
            Close Deck
          </button>
        </div>

      </div>
    </div>
  );
}
