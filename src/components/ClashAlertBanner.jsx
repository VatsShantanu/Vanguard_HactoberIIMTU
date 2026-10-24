import React from 'react';
import { AlertTriangle, Clock, MapPin, CheckCircle, ChevronRight } from 'lucide-react';
import { useEvents } from '../context/EventContext';

export default function ClashAlertBanner() {
  const { events, setSelectedEvent, resolveClash } = useEvents();

  const clashingEvents = events.filter(e => e.hasClash && e.clashDetails);

  if (clashingEvents.length === 0) return null;

  return (
    <div className="mb-6 space-y-3">
      {clashingEvents.map(event => (
        <div 
          key={event.id}
          className="relative overflow-hidden rounded-2xl border border-rose-300 dark:border-rose-900/80 bg-rose-50/70 dark:bg-rose-950/30 p-4 sm:p-5 shadow-xs transition-all"
        >
          {/* Accent vertical line */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            
            {/* Alert Header & Details */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5 border border-rose-200 dark:border-rose-800">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
              </div>
              
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-600 text-white shadow-xs">
                    Schedule Conflict
                  </span>
                  <span className="text-xs font-semibold text-rose-700 dark:text-rose-300">
                    Timetable Guard Warning
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                  "{event.name}" clashes with "{event.clashDetails.conflictingWith}"
                </h4>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                  {event.clashDetails.notes || event.clashDetails.message || `Overlapping schedule on ${event.clashDetails.conflictDate} (${event.clashDetails.conflictTime}).`}
                </p>

                <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-rose-500" />
                    Conflict Date: {event.clashDetails.conflictDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    Venue: {event.venue}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                onClick={() => setSelectedEvent(event)}
                className="btn btn-secondary text-xs py-1.5 px-3"
              >
                Inspect Details
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => resolveClash(event.id)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors shadow-xs flex items-center gap-1"
                title="Acknowledge conflict and clear warning banner"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Resolve
              </button>
            </div>

          </div>
        </div>
      ))}
    </div>
  );
}
