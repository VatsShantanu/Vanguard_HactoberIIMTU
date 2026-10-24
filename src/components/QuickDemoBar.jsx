import React, { useState } from 'react';
import { Sparkles, AlertTriangle, Mail, Camera, RotateCcw, FlaskConical, X, FileText } from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { SAMPLE_POSTERS } from '../data/mockData';

/** Judge-only demo shortcuts, tucked into a small floating button so the app reads as a real product. */
export default function QuickDemoBar() {
  const { runSimulatedOcr, setActiveTab, syncGmailAndCalendar, resetToDefaultData, setArchitectureModalOpen } = useEvents();
  const [open, setOpen] = useState(false);

  const run = (fn) => () => { setOpen(false); fn(); };
  const items = [
    { icon: Camera, label: 'Scan a flyer', fn: () => runSimulatedOcr(SAMPLE_POSTERS[0]) },
    { icon: AlertTriangle, label: 'Trigger a clash', fn: () => runSimulatedOcr(SAMPLE_POSTERS[1]) },
    { icon: Sparkles, label: 'Match my project', fn: () => setActiveTab('matcher') },
    { icon: Mail, label: 'Sync email & calendar', fn: syncGmailAndCalendar },
    { icon: FileText, label: 'Pitch deck', fn: () => setArchitectureModalOpen(true) },
    { icon: RotateCcw, label: 'Reset demo data', fn: resetToDefaultData },
  ];

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      {open && (
        <div className="w-64 p-2.5 rounded-3xl bg-white/85 dark:bg-slate-900/80 backdrop-blur-3xl border border-white/85 dark:border-white/15 animate-pop shadow-2xl" role="menu" aria-label="Demo shortcuts">
          <p className="px-3 pt-2 pb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Demo shortcuts</p>
          {items.map(({ icon: Icon, label, fn }) => (
            <button key={label} role="menuitem" onClick={run(fn)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-white/60 dark:hover:bg-white/10 text-left transition cursor-pointer">
              <Icon className="w-4 h-4 text-blue-600 dark:text-sky-400" /> {label}
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-label="Demo shortcuts"
        className="w-12 h-12 rounded-full bg-white/75 dark:bg-slate-900/75 backdrop-blur-2xl border border-white/90 dark:border-white/20 text-slate-900 dark:text-white grid place-items-center shadow-xl shadow-blue-900/10 dark:shadow-black/50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
      >
        {open ? <X className="w-5 h-5 stroke-[2.5]" /> : <FlaskConical className="w-5 h-5 stroke-[2.5] text-blue-600 dark:text-sky-400" />}
      </button>
    </div>
  );
}
