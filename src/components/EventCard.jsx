import React from 'react';
import { MapPin, Clock, AlertTriangle, Trash2, Download, Calendar } from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { getCatConfig, getDaysUntil, getCountdownLabel, getDateParts } from '../utils/helpers';
import { exportEventToICS, openInGoogleCalendar } from '../utils/calendarExport';

/** Lean card: date · title · where/when · one status. Everything else lives in the detail view. */
export default function EventCard({ event }) {
  const { setSelectedEvent, deleteEvent } = useEvents();
  const cfg = getCatConfig(event.category);
  const p = getDateParts(event.date);
  const list = event.checklist || [];
  const done = list.filter(c => c.completed).length;
  const pct = list.length ? Math.round((done / list.length) * 100) : 0;
  const cd = getCountdownLabel(getDaysUntil(event.date));

  return (
    <article className="card group relative p-4 sm:p-5 flex items-center gap-4 sm:gap-5">
      {/* Date */}
      <div className="w-16 shrink-0 text-center rounded-2xl py-2.5 backdrop-blur-md shadow-2xs border border-white/50 dark:border-white/10" style={{ background: cfg.light, color: cfg.color }}>
        <div className="text-[10px] font-extrabold tracking-widest uppercase">{p.month}</div>
        <div className="font-display font-extrabold text-3xl leading-none tabular-nums mt-0.5">{p.day}</div>
      </div>

      {/* Main */}
      <button type="button" onClick={() => setSelectedEvent(event)} className="flex-1 min-w-0 text-left cursor-pointer" aria-label={`Open ${event.name}`}>
        <div className="flex items-center gap-2 text-xs font-bold" style={{ color: cfg.color }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.color }} />
          {event.category}
          {event.hasClash && (
            <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-bold"><AlertTriangle className="w-3 h-3" /> Clash</span>
          )}
        </div>
        <h3 className="font-display font-bold text-lg leading-snug text-slate-900 dark:text-white mt-0.5 truncate">{event.name}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-3 flex-wrap">
          <span className="inline-flex items-center gap-1 min-w-0"><MapPin className="w-3.5 h-3.5 shrink-0" /><span className="truncate">{event.venue?.split(',')[0]}</span></span>
          {event.time && <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{event.time.split('-')[0].trim()}</span>}
        </p>
        {list.length > 0 && (
          <div className="mt-3 flex items-center gap-3">
            <div className="flex-1 h-1.5 rounded-full bg-black/5 dark:bg-white/10 backdrop-blur-xs overflow-hidden max-w-[180px]">
              <div className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-[11px] font-semibold text-slate-500 tabular-nums">{done}/{list.length} ready</span>
          </div>
        )}
      </button>

      {/* Right */}
      <div className="flex flex-col items-end gap-2 shrink-0">
        {cd && (
          <span className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap backdrop-blur-md ${cd.past ? 'bg-black/5 text-slate-400 dark:bg-white/5' : cd.urgent ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-xs' : 'bg-black/5 text-slate-700 dark:bg-white/10 dark:text-slate-200 border border-white/50 dark:border-white/10'}`}>
            {cd.label}
          </span>
        )}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); openInGoogleCalendar(event); }}
            className="p-1.5 rounded-full text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50"
            title="Add to Google Calendar"
            aria-label={`Add ${event.name} to Google Calendar`}
          >
            <Calendar className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); exportEventToICS(event); }}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Download .ics file"
            aria-label="Add to calendar app"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); if (confirm(`Remove "${event.name}"?`)) deleteEvent(event.id); }}
            className="p-1.5 rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
            title="Remove event"
            aria-label="Remove event"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
