import React from 'react';
import { Sparkles, CheckCircle2, Loader2, Camera } from 'lucide-react';
import { useEvents } from '../context/EventContext';

export default function OcrScannerModal() {
  const { ocrProcessing, ocrStep } = useEvents();

  if (!ocrProcessing) return null;

  const steps = [
    { num: 1, label: 'Reading your flyer...', desc: 'Scanning image artwork, headings, and dates' },
    { num: 2, label: 'Finding event details...', desc: 'Extracting title, venue location, and timings' },
    { num: 3, label: 'Organizing your schedule...', desc: 'Grabbing registration deadlines and fees' },
    { num: 4, label: 'Checking your timetable...', desc: 'Making sure you have no exam or class clashes' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-3xl bg-white/90 dark:bg-slate-900/85 backdrop-blur-2xl border border-white/70 dark:border-white/15 p-6 sm:p-7 shadow-2xl relative overflow-hidden animate-pop">
        
        {/* Animated Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 animate-shimmer" />

        <div className="text-center mb-6">
          <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-lg shadow-emerald-500/25 mb-3">
            <Camera className="w-7 h-7" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 animate-ping"></span>
          </div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
            Reading Your Flyer ✨
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Pulling event dates, venue, and deadline straight into your calendar
          </p>
        </div>

        {/* Step-by-Step Pipeline */}
        <div className="space-y-3 my-5">
          {steps.map((step) => {
            const isCompleted = ocrStep > step.num;
            const isCurrent = ocrStep === step.num;

            return (
              <div
                key={step.num}
                className={`flex items-start gap-3 p-3 rounded-2xl border transition-all duration-300 ${
                  isCurrent
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 shadow-xs'
                    : isCompleted
                    ? 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/60 text-slate-400'
                    : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800/40 opacity-40'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isCompleted ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center text-[10px] font-bold">
                      {step.num}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-xs font-bold ${isCurrent ? 'text-emerald-700 dark:text-emerald-300' : isCompleted ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400'}`}>
                      {step.label}
                    </p>
                    {isCurrent && (
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 animate-pulse">
                        Working...
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-center text-[11px] text-slate-400 pt-1">
          Almost ready! You'll get to review everything in a second.
        </p>

      </div>
    </div>
  );
}
