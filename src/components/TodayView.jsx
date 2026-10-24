import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Check, X, ArrowUpRight, AlertTriangle, CalendarDays } from 'lucide-react';
import { useEvents } from '../context/EventContext';
import {
  TODAY, TODAY_ISO, toISO, getDaysUntil, getCountdownLabel,
  getGreeting, getCatConfig, formatShortDate,
} from '../utils/helpers';

const STORE_KEY = 'mycampus_today_v1';
const WINDOW_DAYS = 5; // event tasks surface when the event/deadline is this close

function loadCustom() {
  try {
    const all = JSON.parse(localStorage.getItem(STORE_KEY) || '[]');
    return all.filter(t => t.date === TODAY_ISO); // "today only": older days drop off
  } catch { return []; }
}

export default function TodayView() {
  const { events, toggleChecklistItem, setSelectedEvent, setActiveTab, setManualEntryOpen, triggerConfetti, resolveClash } = useEvents();
  const [custom, setCustom] = useState(loadCustom);
  const [draft, setDraft] = useState('');

  useEffect(() => { localStorage.setItem(STORE_KEY, JSON.stringify(custom)); }, [custom]);

  // ── Build today's task list ─────────────────────────────────────────
  const eventTasks = useMemo(() => {
    const out = [];
    events.forEach(evt => {
      const dEvent = getDaysUntil(evt.date);
      const dDeadline = evt.registrationDeadline ? getDaysUntil(evt.registrationDeadline.slice(0, 10)) : null;
      const eventSoon = dEvent !== null && dEvent >= 0 && dEvent <= WINDOW_DAYS;
      const deadlineSoon = dDeadline !== null && dDeadline >= 0 && dDeadline <= WINDOW_DAYS;
      if (!eventSoon && !deadlineSoon) return;
      const why = deadlineSoon && (!eventSoon || dDeadline <= dEvent)
        ? `Registration closes ${dDeadline === 0 ? 'today' : `in ${dDeadline}d`}`
        : `Event ${dEvent === 0 ? 'is today' : `in ${dEvent}d`}`;
      const urgency = Math.min(dEvent ?? 99, dDeadline ?? 99);
      (evt.checklist || []).forEach(item => out.push({ kind: 'event', key: `${evt.id}:${item.id}`, evt, item, why, urgency }));
    });
    return out.sort((a, b) => a.item.completed - b.item.completed || a.urgency - b.urgency);
  }, [events]);

  const customTasks = custom.map(t => ({ kind: 'custom', key: t.id, t }));
  const all = [...customTasks, ...eventTasks];
  const total = all.length;
  const done = all.filter(x => (x.kind === 'event' ? x.item.completed : x.t.done)).length;
  const pending = all.filter(x => !(x.kind === 'event' ? x.item.completed : x.t.done));
  const allDone = total > 0 && done === total;
  const pct = total ? Math.round((done / total) * 100) : 0;

  const toggle = (task) => {
    const willComplete = task.kind === 'event' ? !task.item.completed : !task.t.done;
    if (task.kind === 'event') toggleChecklistItem(task.evt.id, task.item.id);
    else setCustom(prev => prev.map(c => c.id === task.t.id ? { ...c, done: !c.done } : c));
    // celebrate when this tick finishes the day
    if (willComplete && pending.length === 1) setTimeout(() => triggerConfetti(true), 150);
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!draft.trim()) return;
    setCustom(prev => [...prev, { id: `t-${Date.now()}`, text: draft.trim(), done: false, date: TODAY_ISO }]);
    setDraft('');
  };

  // ── Side content ────────────────────────────────────────────────────
  const next = useMemo(
    () => [...events].filter(e => getDaysUntil(e.date) >= 0).sort((a, b) => new Date(a.date) - new Date(b.date))[0],
    [events]
  );
  const clash = events.find(e => e.hasClash && e.clashDetails);
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(TODAY); d.setDate(d.getDate() + i);
    const iso = toISO(d);
    return { d, iso, evts: events.filter(e => e.date === iso || (e.endDate && e.date <= iso && e.endDate >= iso)) };
  });

  const longDate = TODAY.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
  const nextCfg = next ? getCatConfig(next.category) : null;
  const nextCd = next ? getCountdownLabel(getDaysUntil(next.date)) : null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-enter">
      {/* Headline */}
      <header className="mb-8">
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{getGreeting()}, Shantanu</p>
        <h1 className="font-display font-extrabold text-5xl sm:text-7xl leading-[0.95] text-slate-900 dark:text-white mt-2">
          {longDate.split(',')[0]},<br />
          <span className="text-emerald-600 dark:text-volt-400">{longDate.split(',')[1].trim()}.</span>
        </h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ── Tasks ─────────────────────────────── */}
        <section className="lg:col-span-7 card p-5 sm:p-7" aria-labelledby="today-tasks">
          <div className="flex items-end justify-between gap-4 mb-5">
            <div>
              <h2 id="today-tasks" className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
                {allDone ? 'All done. Go touch grass.' : 'Do today'}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {total === 0 ? 'Nothing due. Add a task or relax.' : `${done} of ${total} complete`}
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="font-display font-extrabold text-4xl text-slate-900 dark:text-white tabular-nums">{pct}</span>
              <span className="text-lg font-bold text-slate-400">%</span>
            </div>
          </div>

          <div className="h-2.5 rounded-full bg-black/5 dark:bg-white/10 backdrop-blur-md overflow-hidden mb-6" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Today's progress">
            <div className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>

          <form onSubmit={addTask} className="flex gap-2 mb-5">
            <label htmlFor="new-today-task" className="sr-only">Add a task for today</label>
            <input
              id="new-today-task"
              value={draft}
              onChange={e => setDraft(e.target.value)}
              placeholder="Add something for today…"
              className="flex-1 px-5 py-3 rounded-full text-sm bg-black/5 dark:bg-white/10 backdrop-blur-xl border border-white/60 dark:border-white/10 focus:border-blue-500 outline-none text-slate-900 dark:text-white placeholder-slate-400 shadow-inner"
            />
            <button type="submit" className="btn btn-primary" aria-label="Add task"><Plus className="w-4 h-4 stroke-[2.5]" /> Add</button>
          </form>

          {total === 0 ? (
            <div className="text-center py-10">
              <p className="text-5xl mb-3">🌤️</p>
              <p className="font-display font-bold text-lg text-slate-800 dark:text-slate-200">Clear day.</p>
              <p className="text-sm text-slate-500 mt-1">Tasks from events with deadlines in the next {WINDOW_DAYS} days show up here automatically.</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {all.map(task => {
                const isEvt = task.kind === 'event';
                const isDone = isEvt ? task.item.completed : task.t.done;
                const text = isEvt ? task.item.text : task.t.text;
                const cfg = isEvt ? getCatConfig(task.evt.category) : null;
                return (
                  <li key={task.key} className="flex items-center gap-4 py-3.5 group">
                    <button
                      type="button"
                      className="check"
                      data-done={isDone}
                      onClick={() => toggle(task)}
                      role="checkbox"
                      aria-checked={isDone}
                      aria-label={`${isDone ? 'Mark not done' : 'Mark done'}: ${text}`}
                    >
                      {isDone && <Check className="w-4 h-4 stroke-[3]" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[15px] font-semibold leading-snug ${isDone ? 'line-through text-slate-400 dark:text-slate-600' : 'text-slate-900 dark:text-slate-100'}`}>
                        {text}
                      </p>
                      {isEvt ? (
                        <button
                          type="button"
                          onClick={() => setSelectedEvent(task.evt)}
                          className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-emerald-600 inline-flex items-center gap-1.5"
                        >
                          <span className="w-2 h-2 rounded-full" style={{ background: cfg.color }} />
                          {task.evt.name.split(':')[0]} · {task.why}
                        </button>
                      ) : (
                        <p className="mt-0.5 text-xs text-slate-400">Personal</p>
                      )}
                    </div>
                    {!isEvt && (
                      <button
                        type="button"
                        onClick={() => setCustom(prev => prev.filter(c => c.id !== task.t.id))}
                        className="p-1.5 rounded-full text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 focus:opacity-100 transition"
                        aria-label={`Delete ${text}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* ── Side column ───────────────────────── */}
        <aside className="lg:col-span-5 space-y-6">
          {clash && (
            <div className="rounded-3xl p-5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900" role="alert">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="font-display font-bold text-rose-900 dark:text-rose-100 leading-snug">Heads up: two things on {formatShortDate(clash.clashDetails.conflictDate)}</p>
                  <p className="text-sm text-rose-700 dark:text-rose-300 mt-1">{clash.name.split(':')[0]} overlaps with {clash.clashDetails.conflictingWith.split(':')[0]}.</p>
                  <div className="flex gap-2 mt-3">
                    <button className="btn btn-primary !py-1.5 !px-3.5" onClick={() => setSelectedEvent(clash)}>Review</button>
                    <button className="btn btn-ghost !py-1.5 !px-3.5" onClick={() => resolveClash(clash.id)}>Got it</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {next && (
            <button
              type="button"
              onClick={() => setSelectedEvent(next)}
              className="hero-ink w-full text-left rounded-3xl p-6 sm:p-7 relative overflow-hidden group"
            >
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-volt-400">Up next</p>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl leading-tight mt-3">{next.name.split(':')[0]}</h2>
              <p className="text-sm text-white/70 mt-2">{formatShortDate(next.date)} · {next.venue?.split(',')[0]}</p>
              <div className="mt-6 flex items-center justify-between">
                <span className="font-display font-extrabold text-4xl text-volt-400">{nextCd?.label}</span>
                <span className="w-11 h-11 rounded-full bg-volt-400 text-slate-950 grid place-items-center group-hover:rotate-45 transition-transform">
                  <ArrowUpRight className="w-5 h-5" />
                </span>
              </div>
            </button>
          )}

          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">This week</h2>
              <button className="text-xs font-bold text-emerald-600 dark:text-volt-400 inline-flex items-center gap-1 hover:underline" onClick={() => setActiveTab('calendar')}>
                <CalendarDays className="w-3.5 h-3.5" /> Full calendar
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {week.map(({ d, iso, evts }, i) => (
                <button
                  key={iso}
                  type="button"
                  onClick={() => evts[0] ? setSelectedEvent(evts[0]) : setManualEntryOpen(true)}
                  className={`rounded-2xl py-2.5 flex flex-col items-center gap-1 transition ${i === 0 ? 'bg-slate-900 text-white dark:bg-volt-400 dark:text-slate-950' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                  aria-label={`${d.toDateString()}: ${evts.length} events`}
                >
                  <span className="text-[10px] font-bold uppercase opacity-70">{d.toLocaleDateString('en-IN', { weekday: 'short' }).slice(0, 2)}</span>
                  <span className="font-display font-bold text-lg leading-none">{d.getDate()}</span>
                  <span className="flex gap-0.5 h-1.5">
                    {evts.slice(0, 3).map(e => <span key={e.id} className="w-1.5 h-1.5 rounded-full" style={{ background: i === 0 ? 'currentColor' : e.hasClash ? '#F04438' : getCatConfig(e.category).color }} />)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
