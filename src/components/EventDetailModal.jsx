import React, { useState } from 'react';
import { X, Plus, Trash2, Download, ExternalLink, AlertTriangle, Check, GripVertical, Calendar } from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { getCatConfig, formatDate, getDaysUntil, getCountdownLabel } from '../utils/helpers';
import { exportEventToICS, openInGoogleCalendar } from '../utils/calendarExport';

export default function EventDetailModal() {
  const {
    selectedEvent, setSelectedEvent,
    toggleChecklistItem, addChecklistItem, deleteChecklistItem,
    resolveClash, deleteEvent
  } = useEvents();

  const [newTask, setNewTask] = useState('');
  const [dragIdx, setDragIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);
  const [localChecklist, setLocalChecklist] = useState(null);

  if (!selectedEvent) return null;

  const cfg = getCatConfig(selectedEvent.category);
  const checklist = localChecklist || selectedEvent.checklist || [];
  const doneCount = checklist.filter(c => c.completed).length;
  const totalCount = checklist.length;
  const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
  const countdown = getCountdownLabel(getDaysUntil(selectedEvent.date));

  const handleDragEnd = () => {
    if (dragIdx === null || dragOverIdx === null || dragIdx === dragOverIdx) {
      setDragIdx(null); setDragOverIdx(null); return;
    }
    const reordered = [...checklist];
    const [moved] = reordered.splice(dragIdx, 1);
    reordered.splice(dragOverIdx, 0, moved);
    setLocalChecklist(reordered);
    setDragIdx(null); setDragOverIdx(null);
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    addChecklistItem(selectedEvent.id, newTask.trim());
    setLocalChecklist(null);
    setNewTask('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in" onClick={() => setSelectedEvent(null)}>
      <div
        className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-[32px] bg-white/85 dark:bg-slate-900/80 backdrop-blur-3xl border border-white/80 dark:border-white/18 shadow-2xl overflow-hidden animate-pop"
        onClick={e => e.stopPropagation()}
      >
        {/* Editorial Hero Header */}
        <div className="hero-ink p-6 sm:p-8 relative shrink-0">
          <button
            onClick={() => setSelectedEvent(null)}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-volt-400">
            <span>{selectedEvent.category}</span>
            {countdown && <><span>·</span><span>{countdown.label}</span></>}
          </div>

          <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white leading-tight mt-2 pr-8">
            {selectedEvent.name}
          </h2>
          <p className="text-xs sm:text-sm text-white/70 mt-2">
            {formatDate(selectedEvent.date)} · {selectedEvent.venue} · {selectedEvent.fee || 'Free'}
          </p>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-7 space-y-6">
          {selectedEvent.hasClash && selectedEvent.clashDetails && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-rose-900 dark:text-rose-100">
                    Overlaps with {selectedEvent.clashDetails.conflictingWith}
                  </p>
                  <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">
                    {selectedEvent.clashDetails.notes}
                  </p>
                </div>
              </div>
              <button onClick={() => resolveClash(selectedEvent.id)} className="btn btn-primary !py-1.5 !px-3.5 text-xs shrink-0">
                Got it
              </button>
            </div>
          )}

          {/* Checklist */}
          <div>
            <div className="flex items-end justify-between mb-3">
              <div>
                <h3 className="font-display font-extrabold text-xl text-slate-900 dark:text-white">
                  Preparation checklist
                </h3>
                <p className="text-xs text-slate-400">Drag to reorder · tick as you go</p>
              </div>
              <span className="font-display font-extrabold text-2xl text-slate-900 dark:text-white tabular-nums">
                {doneCount}/{totalCount}
              </span>
            </div>

            <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mb-4">
              <div className="h-full rounded-full bg-emerald-600 dark:bg-volt-400 transition-all duration-300" style={{ width: `${pct}%` }} />
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {checklist.map((item, idx) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={() => setDragIdx(idx)}
                  onDragEnter={() => setDragOverIdx(idx)}
                  onDragEnd={handleDragEnd}
                  onDragOver={e => e.preventDefault()}
                  className="flex items-center gap-3 py-3 group"
                >
                  <GripVertical className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0 cursor-grab" />
                  <button
                    type="button"
                    className="check"
                    data-done={item.completed}
                    onClick={() => { toggleChecklistItem(selectedEvent.id, item.id); setLocalChecklist(null); }}
                  >
                    {item.completed && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>
                  <span className={`flex-1 text-sm font-semibold ${item.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                    {item.text}
                  </span>
                  <button
                    onClick={() => { deleteChecklistItem(selectedEvent.id, item.id); setLocalChecklist(null); }}
                    className="p-1 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition"
                    aria-label="Delete task"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddTask} className="flex gap-2 mt-4">
              <input
                type="text"
                value={newTask}
                onChange={e => setNewTask(e.target.value)}
                placeholder="Add a prep task…"
                className="flex-1 px-4 py-2.5 text-sm rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button type="submit" className="btn btn-primary"><Plus className="w-4 h-4" /> Add</button>
            </form>
          </div>

          {selectedEvent.description && (
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-2 border-t border-slate-100 dark:border-slate-800">
              {selectedEvent.description}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => { if (confirm(`Remove "${selectedEvent.name}"?`)) deleteEvent(selectedEvent.id); }}
            className="text-xs font-bold text-slate-400 hover:text-rose-500 inline-flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" /> Remove
          </button>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <button 
              onClick={() => openInGoogleCalendar(selectedEvent)} 
              className="btn btn-secondary text-xs inline-flex items-center gap-1.5"
              title="Add event directly to your Google Calendar"
            >
              <Calendar className="w-3.5 h-3.5 text-blue-500" />
              <span>Google Calendar</span>
            </button>
            <button onClick={() => exportEventToICS(selectedEvent)} className="btn btn-secondary text-xs">
              <Download className="w-3.5 h-3.5" /> Save .ics
            </button>
            {selectedEvent.sourceUrl && (
              <a href={selectedEvent.sourceUrl} target="_blank" rel="noreferrer" className="btn btn-primary text-xs">
                Event page <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
