import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  AlertTriangle, 
  PlusCircle, 
  CheckCircle2,
  Tag,
  Link as LinkIcon
} from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { checkDuplicateEvent, checkScheduleClash, validateEventFields } from '../utils/validation';

export default function ManualEntryModal() {
  const { manualEntryOpen, setManualEntryOpen, addEvent, events, setActiveTab } = useEvents();

  const [formData, setFormData] = useState({
    name: '',
    organizer: '',
    category: 'Hackathon',
    date: '2026-11-15',
    endDate: '2026-11-16',
    time: '09:00 AM - 05:00 PM',
    venue: '',
    locationType: 'In-Person',
    fee: 'Free',
    eligibility: 'All College Students',
    registrationDeadline: '2026-11-10T23:59',
    sourceUrl: '',
    description: '',
    tags: 'Innovation, Hackathon'
  });

  const [errors, setErrors] = useState({});

  if (!manualEntryOpen) return null;

  // Real-time clash & duplicate checks
  const clash = checkScheduleClash(formData, events);
  const duplicate = checkDuplicateEvent(formData, events);

  const categories = ['Hackathon', 'Academic', 'Coding Contest', 'Workshop', 'Robotics'];

  const handleSubmit = (e) => {
    e.preventDefault();

    const validation = validateEventFields(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    const payload = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      sourceType: 'Manual Entry',
      checklist: [
        { id: `c-${Date.now()}-1`, text: 'Confirm team members & roles', completed: false },
        { id: `c-${Date.now()}-2`, text: 'Review submission guidelines & deadlines', completed: false },
        { id: `c-${Date.now()}-3`, text: 'Prepare presentation deck & demo links', completed: false }
      ]
    };

    const res = addEvent(payload);
    if (res.success) {
      setManualEntryOpen(false);
      setActiveTab('calendar');
    } else if (res.errors) {
      setErrors(res.errors);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto animate-enter">
      <div className="w-full max-w-xl rounded-[32px] bg-white/85 dark:bg-slate-900/80 backdrop-blur-3xl border border-white/80 dark:border-white/18 shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-sm">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white tracking-tight">
                Add Event Manually
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Add any competition, exam, or workshop directly to your calendar
              </p>
            </div>
          </div>
          <button
            onClick={() => setManualEntryOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Clash Alert Preview */}
          {clash && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-900 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <p className="text-xs text-rose-700 dark:text-rose-300 font-medium">
                <strong>Schedule Warning:</strong> Dates overlap with "{clash.conflictingWith}" on {clash.conflictDate}.
              </p>
            </div>
          )}

          {/* Event Category Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Event Category
            </label>
            <div className="flex items-center gap-1.5 flex-wrap">
              {categories.map(cat => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setFormData({ ...formData, category: cat })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    formData.category === cat
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Event Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Event Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. National Cyber Olympiad 2026"
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>

          {/* Organizer */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Organizer / Club
            </label>
            <input
              type="text"
              value={formData.organizer}
              onChange={e => setFormData({ ...formData, organizer: e.target.value })}
              placeholder="e.g. ACM Student Chapter"
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Event Date *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value, endDate: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Event Time
              </label>
              <input
                type="text"
                value={formData.time}
                onChange={e => setFormData({ ...formData, time: e.target.value })}
                placeholder="10:00 AM - 05:00 PM"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Venue & Location Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Venue Location *
              </label>
              <input
                type="text"
                required
                value={formData.venue}
                onChange={e => setFormData({ ...formData, venue: e.target.value })}
                placeholder="Main Auditorium / Online"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Registration Fee
              </label>
              <input
                type="text"
                value={formData.fee}
                onChange={e => setFormData({ ...formData, fee: e.target.value })}
                placeholder="Free / ₹200 per team"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Short Description & Notes
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief details about rounds, tracks, or requirements..."
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Submit buttons */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setManualEntryOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary text-xs py-2 px-5 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Add to My Journey</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
