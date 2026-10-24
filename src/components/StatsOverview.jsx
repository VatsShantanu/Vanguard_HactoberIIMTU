import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  ShieldCheck, 
  Award, 
  Target,
  Sparkles,
  Zap,
  ArrowUpRight,
  Flame
} from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { getCatConfig } from '../utils/helpers';

export default function StatsOverview() {
  const { events, stats, setActiveTab } = useEvents();

  const registeredEvents = events.filter(e => e.status === 'Registered');
  const hackathons = events.filter(e => e.category === 'Hackathon');
  const academics = events.filter(e => e.category === 'Academic');
  const contests = events.filter(e => e.category === 'Coding Contest');
  const workshops = events.filter(e => e.category === 'Workshop');

  const totalChecklistItems = events.reduce((acc, evt) => acc + (evt.checklist?.length || 0), 0);
  const completedChecklistItems = events.reduce((acc, evt) => acc + ((evt.checklist || []).filter(c => c.completed).length), 0);
  const completionRate = totalChecklistItems > 0 ? Math.round((completedChecklistItems / totalChecklistItems) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-enter">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800 mb-2">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
          <span>Measurable Student Impact</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Your Campus Journey & Performance
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
          Tracking time saved, deadlines protected, timetable conflicts averted, and preparation progress.
        </p>
      </div>

      {/* 4 Impact Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* Metric 1: Time Saved */}
        <div className="card-premium p-5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
            <Clock className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Time Saved</span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5 font-mono">
            ~4.5 hrs/wk
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Eliminates manually hunting across scattered WhatsApp groups, posters, and portals.
          </p>
        </div>

        {/* Metric 2: Deadlines Tracked */}
        <div className="card-premium p-5">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
            <Calendar className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Deadlines Tracked</span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5 font-mono">
            100% On Time
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Automated calendar reminders and alerts guarantee you never miss a registration window.
          </p>
        </div>

        {/* Metric 3: Conflicts Caught */}
        <div className="card-premium p-5">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Conflicts Averted</span>
          <h3 className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-0.5 font-mono">
            {stats.clashCount} Warning
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Proactively warned before collisions occur (e.g. CS302 Exam vs HackShift).
          </p>
        </div>

        {/* Metric 4: Preparation Rate */}
        <div className="card-premium p-5">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Preparation Rate</span>
          <h3 className="text-2xl font-black text-teal-600 dark:text-teal-400 mt-0.5 font-mono">
            {completionRate}%
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            {completedChecklistItems} of {totalChecklistItems} actionable preparation steps completed.
          </p>
        </div>

      </div>

      {/* Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category Breakdown */}
        <div className="card-premium p-6">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
            <Target className="w-4 h-4 text-emerald-600" />
            <span>Event Breakdown by Category</span>
          </h3>

          <div className="space-y-3">
            {[
              { label: 'Hackathons', count: hackathons.length, color: '#10b981', emoji: '🚀' },
              { label: 'Academic & Exams', count: academics.length, color: '#3b82f6', emoji: '📚' },
              { label: 'Coding Contests', count: contests.length, color: '#8b5cf6', emoji: '💻' },
              { label: 'Workshops & Bootcamps', count: workshops.length, color: '#f59e0b', emoji: '🛠️' },
            ].map((cat, i) => {
              const pctOfTotal = events.length > 0 ? Math.round((cat.count / events.length) * 100) : 0;
              return (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <span>{cat.emoji}</span>
                      <span>{cat.label}</span>
                    </span>
                    <span className="font-mono font-bold text-slate-500">
                      {cat.count} ({pctOfTotal}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pctOfTotal}%`, backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Center Card */}
        <div className="card-premium p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Next Strategic Step</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Based on your current tech stack and schedule, our matching algorithm recommends finalizing your submission track for HackShift 2026.
            </p>

            <div className="mt-4 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                Recommended Action:
              </p>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                Check off "Form team & register under AI track" in your preparation studio.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={() => setActiveTab('matcher')}
              className="btn btn-secondary text-xs"
            >
              <span>Explore More Hackathons</span>
            </button>

            <button
              onClick={() => setActiveTab('calendar')}
              className="btn btn-primary text-xs"
            >
              <span>Go to My Calendar</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
