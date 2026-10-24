import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Calendar, 
  MapPin, 
  Sparkles, 
  ArrowRight,
  Edit2
} from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { checkDuplicateEvent, checkScheduleClash, validateEventFields } from '../utils/validation';
import { getCatConfig } from '../utils/helpers';

export default function ConfirmationModal() {
  const { 
    confirmationModalOpen, 
    setConfirmationModalOpen, 
    pendingEvent, 
    setPendingEvent, 
    addEvent, 
    events,
    setActiveTab
  } = useEvents();

  const [formData, setFormData] = useState(null);
  const [duplicateWarning, setDuplicateWarning] = useState(null);
  const [clashWarning, setClashWarning] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (pendingEvent) {
      setFormData({ ...pendingEvent });
      
      const dup = checkDuplicateEvent(pendingEvent, events);
      setDuplicateWarning(dup);

      const clash = checkScheduleClash(pendingEvent, events);
      setClashWarning(clash);

      setValidationErrors({});
      setEditing(false);
    }
  }, [pendingEvent, events]);

  if (!confirmationModalOpen || !formData) return null;

  const cfg = getCatConfig(formData.category);

  const handleFieldChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);

    const clash = checkScheduleClash(updated, events);
    setClashWarning(clash);

    const dup = checkDuplicateEvent(updated, events);
    setDuplicateWarning(dup);
  };

  const handleConfirm = () => {
    const validation = validateEventFields(formData);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      setEditing(true);
      return;
    }

    const res = addEvent(formData);
    if (res.success) {
      setConfirmationModalOpen(false);
      setPendingEvent(null);
      setActiveTab('calendar');
    } else if (res.errors) {
      setValidationErrors(res.errors);
      setEditing(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="w-full max-w-lg rounded-[32px] bg-white/85 dark:bg-slate-900/80 backdrop-blur-3xl border border-white/80 dark:border-white/18 shadow-2xl overflow-hidden my-8 animate-pop">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl backdrop-blur-xs">
              {cfg.emoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold tracking-tight">
                  Does this look good to you? ✨
                </h3>
              </div>
              <p className="text-xs text-white/80 mt-0.5">
                We pulled these details from your flyer
              </p>
            </div>
          </div>

          <button
            onClick={() => setConfirmationModalOpen(false)}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Clash Alert Banner */}
          {clashWarning && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 flex items-start gap-3 animate-bounce-gentle">
              <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-rose-600 text-white">
                  Schedule Conflict Detected
                </span>
                <p className="text-xs font-bold text-rose-900 dark:text-rose-200 mt-1">
                  Overlaps with "{clashWarning.conflictingWith}" on {clashWarning.conflictDate}
                </p>
                <p className="text-xs text-rose-600 dark:text-rose-300 mt-0.5">
                  You can still add it, but we'll pin a reminder on your calendar so you can prepare!
                </p>
              </div>
            </div>
          )}

          {/* Duplicate Alert */}
          {duplicateWarning && (
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 dark:text-amber-300 font-medium">
                <strong>Heads up:</strong> {duplicateWarning.message}
              </p>
            </div>
          )}

          {/* Event Preview Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  {formData.category}
                </span>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white mt-1.5">
                  {formData.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {formData.organizer || 'Campus Innovation Cell'}
                </p>
              </div>

              <button
                onClick={() => setEditing(e => !e)}
                className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>{editing ? 'Preview' : 'Edit details'}</span>
              </button>
            </div>

            {/* Quick meta grid */}
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-semibold">{formData.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{formData.venue}</span>
              </div>
              <div>
                Fee: <strong className="text-slate-900 dark:text-white">{formData.fee || 'Free'}</strong>
              </div>
              <div>
                Eligibility: <strong className="text-slate-900 dark:text-white">{formData.eligibility}</strong>
              </div>
            </div>
          </div>

          {/* Quick Edit Accordion */}
          {editing && (
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 animate-fade-in">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Event Name</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.date || ''}
                    onChange={(e) => handleFieldChange('date', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Venue</label>
                  <input
                    type="text"
                    value={formData.venue || ''}
                    onChange={(e) => handleFieldChange('venue', e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={() => setConfirmationModalOpen(false)}
            className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            className="btn btn-primary px-5 py-2.5 text-xs shadow-md"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Yes, add to my calendar! 🚀</span>
          </button>
        </div>

      </div>
    </div>
  );
}
