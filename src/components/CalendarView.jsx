import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, Search, X, AlertTriangle, Calendar } from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { TODAY, getCatConfig, formatShortDate } from '../utils/helpers';
import { openInGoogleCalendar } from '../utils/calendarExport';
import EventCard from './EventCard';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const FILTERS = ['All', 'Hackathon', 'Academic', 'Coding Contest', 'Workshop'];

export default function CalendarView() {
  const { events, setManualEntryOpen, setCalendarSyncOpen, setSelectedEvent, searchQuery, setSearchQuery, filterCategory, setFilterCategory } = useEvents();
  const [year, setYear] = useState(TODAY.getFullYear());
  const [month, setMonth] = useState(TODAY.getMonth());
  const [day, setDay] = useState(TODAY.getDate());

  const first = new Date(year, month, 1).getDay();
  const dim = new Date(year, month + 1, 0).getDate();
  const cells = useMemo(() => [...Array(first).fill(null), ...Array.from({ length: dim }, (_, i) => i + 1)], [year, month]);

  const iso = (d) => `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const onDay = (d) => events.filter(e => e.date === iso(d) || (e.endDate && e.date <= iso(d) && e.endDate >= iso(d)));
  const dayEvents = onDay(day);
  const isToday = (d) => year === TODAY.getFullYear() && month === TODAY.getMonth() && d === TODAY.getDate();

  const list = useMemo(() => {
    let l = events;
    if (filterCategory !== 'All') l = l.filter(e => e.category === filterCategory);
    const q = searchQuery.trim().toLowerCase();
    if (q) l = l.filter(e => [e.name, e.venue, ...(e.tags || [])].some(v => v?.toLowerCase().includes(q)));
    return [...l].sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [events, filterCategory, searchQuery]);

  const shift = (n) => { const d = new Date(year, month + n, 1); setYear(d.getFullYear()); setMonth(d.getMonth()); setDay(1); };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-enter">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-blue-600 dark:text-blue-400">
              Campus Timeline & Google Calendar
            </span>
          </div>
          <h1 className="font-display font-extrabold text-5xl sm:text-6xl text-slate-900 dark:text-white leading-none">
            {new Date(year, month).toLocaleDateString('en-IN', { month: 'long' })}
            <span className="text-slate-300 dark:text-slate-700"> {year}</span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCalendarSyncOpen(true)}
            className="btn btn-secondary text-xs flex items-center gap-1.5 border-blue-200 dark:border-blue-900/50 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 shrink-0"
            title="Google Calendar Integration & Sync"
          >
            <Calendar className="w-4 h-4 text-blue-500" />
            <span>Google Calendar Sync</span>
          </button>
          <button onClick={() => setManualEntryOpen(true)} className="btn btn-primary shrink-0 text-xs">
            <Plus className="w-4 h-4" /> New
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Month grid */}
        <section className="lg:col-span-5 card p-5" aria-label="Month calendar">
          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-1">
              <button onClick={() => shift(-1)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Previous month"><ChevronLeft className="w-4 h-4" /></button>
              <button onClick={() => shift(1)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Next month"><ChevronRight className="w-4 h-4" /></button>
            </div>
            <button onClick={() => { setYear(TODAY.getFullYear()); setMonth(TODAY.getMonth()); setDay(TODAY.getDate()); }} className="text-xs font-bold px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700">Today</button>
          </div>

          <div className="grid grid-cols-7 text-center mb-1">
            {WEEKDAYS.map((w, i) => <span key={i} className="text-[11px] font-bold text-slate-400 py-1">{w}</span>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((d, i) => {
              if (!d) return <span key={`e${i}`} />;
              const ev = onDay(d);
              const sel = d === day;
              return (
                <button
                  key={d}
                  onClick={() => setDay(d)}
                  aria-label={`${d} ${ev.length ? `, ${ev.length} events` : ''}`}
                  aria-pressed={sel}
                  className={`aspect-square rounded-2xl flex flex-col items-center justify-center gap-0.5 text-sm font-bold transition ${sel ? 'bg-slate-900 text-white dark:bg-volt-400 dark:text-slate-950' : isToday(d) ? 'ring-2 ring-emerald-600 text-emerald-700 dark:text-volt-400' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                >
                  {d}
                  <span className="flex gap-0.5 h-1.5">
                    {ev.slice(0, 3).map(e => <span key={e.id} className="w-1.5 h-1.5 rounded-full" style={{ background: sel ? 'currentColor' : e.hasClash ? '#F04438' : getCatConfig(e.category).color }} />)}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400 mb-2">{formatShortDate(iso(day))}</p>
            {dayEvents.length === 0 ? (
              <p className="text-sm text-slate-500">Nothing planned. <button className="font-bold text-emerald-600 dark:text-volt-400 hover:underline" onClick={() => setManualEntryOpen(true)}>Add something</button></p>
            ) : dayEvents.map(e => (
              <div key={e.id} className="w-full flex items-center justify-between gap-2 py-1.5 px-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 group transition">
                <button onClick={() => setSelectedEvent(e)} className="flex items-center gap-3 text-left flex-1 min-w-0">
                  <span className="w-1 h-8 rounded-full shrink-0" style={{ background: e.hasClash ? '#F04438' : getCatConfig(e.category).color }} />
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-bold text-slate-900 dark:text-white truncate">{e.name}</span>
                    <span className="block text-xs text-slate-500">{e.time}</span>
                  </span>
                  {e.hasClash && <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />}
                </button>
                <button
                  type="button"
                  onClick={() => openInGoogleCalendar(e)}
                  className="p-1.5 rounded-lg text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/60 opacity-0 group-hover:opacity-100 transition shrink-0"
                  title="Add to Google Calendar"
                  aria-label="Add to Google Calendar"
                >
                  <Calendar className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* List */}
        <section className="lg:col-span-7 space-y-4" aria-label="Events">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <label htmlFor="evt-search" className="sr-only">Search events</label>
            <input id="evt-search" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search events, venues, topics"
              className="w-full pl-11 pr-10 py-3 rounded-full text-sm bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-white/80 dark:border-white/15 focus:border-blue-500 outline-none text-slate-900 dark:text-white placeholder-slate-400 shadow-xs" />
            {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 cursor-pointer" aria-label="Clear search"><X className="w-4 h-4" /></button>}
          </div>

          <div className="flex gap-2 overflow-x-auto scrollbar-none py-1" role="tablist" aria-label="Filter by type">
            {FILTERS.map(f => (
              <button key={f} role="tab" aria-selected={filterCategory === f} onClick={() => setFilterCategory(f)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-150 cursor-pointer ${filterCategory === f ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm border border-black/10 dark:border-white/30' : 'bg-white/60 dark:bg-white/10 backdrop-blur-xl border border-white/70 dark:border-white/15 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/20'}`}>
                {f}
              </button>
            ))}
          </div>

          {list.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-4xl mb-2">🔎</p>
              <p className="font-display font-bold text-lg">No matches</p>
              <button onClick={() => { setSearchQuery(''); setFilterCategory('All'); }} className="btn btn-ghost mt-4">Clear filters</button>
            </div>
          ) : list.map(e => <EventCard key={e.id} event={e} />)}
        </section>
      </div>
    </div>
  );
}
