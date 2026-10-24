import React, { useState } from 'react';
import { 
  Calendar, 
  Search, 
  Plus, 
  Filter, 
  Layers, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles,
  Zap,
  ListFilter,
  CalendarDays,
  FileSpreadsheet
} from 'lucide-react';
import { useEvents } from '../context/EventContext';
import EventCard from './EventCard';
import ClashAlertBanner from './ClashAlertBanner';

export default function TimelineView() {
  const { 
    events, 
    filterCategory, 
    setFilterCategory, 
    searchQuery, 
    setSearchQuery, 
    setManualEntryOpen, 
    runSimulatedOcr,
    setActiveTab,
    stats
  } = useEvents();

  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'timeline'

  const categories = [
    'All',
    'Hackathon',
    'Coding Contest',
    'Academic',
    'Workshop',
    'Clashes Only'
  ];

  // Filtering events
  const filteredEvents = events.filter(evt => {
    // Category filter
    if (filterCategory === 'Clashes Only') {
      if (!evt.hasClash) return false;
    } else if (filterCategory !== 'All' && evt.category !== filterCategory) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = evt.name?.toLowerCase().includes(q);
      const matchVenue = evt.venue?.toLowerCase().includes(q);
      const matchTags = (evt.tags || []).some(t => t.toLowerCase().includes(q));
      const matchDesc = evt.description?.toLowerCase().includes(q);
      return matchName || matchVenue || matchTags || matchDesc;
    }

    return true;
  });

  // Sort chronologically by date
  const sortedEvents = [...filteredEvents].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      
      {/* Top Welcome & Impact Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-brand-700 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/50 px-2.5 py-0.5 rounded-md border border-brand-200 dark:border-brand-800">
              Personalised Event Hub
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Semester 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1 tracking-tight">
            Your Event Journey & Timeline
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Capture opportunities, prevent timetable clashes, and arrive prepared with actionable checklists.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={() => setActiveTab('capture')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-700 to-teal-600 hover:from-brand-800 hover:to-teal-700 text-white font-semibold text-xs shadow-md shadow-brand-900/20 active:scale-95 transition-all"
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>AI Quick Capture</span>
          </button>

          <button
            onClick={() => setManualEntryOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold text-xs border border-slate-200 dark:border-slate-700 shadow-sm active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Schedule Clash Banner (Rule-based detection) */}
      <ClashAlertBanner />

      {/* Quick Summary Pill Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Journey</p>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">{stats.totalEvents} Events</p>
          </div>
          <Calendar className="w-7 h-7 text-brand-500/30" />
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Confirmed</p>
            <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">{stats.registeredCount} Active</p>
          </div>
          <CheckCircle2 className="w-7 h-7 text-emerald-500/30" />
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Schedule Clashes</p>
            <p className="text-xl font-extrabold text-rose-600 dark:text-rose-400 mt-0.5">{stats.clashCount} Detected</p>
          </div>
          <AlertTriangle className="w-7 h-7 text-rose-500/30" />
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Preparation</p>
            <p className="text-xl font-extrabold text-teal-600 dark:text-teal-400 mt-0.5">
              {stats.completedTasks}/{stats.totalTasks} Tasks
            </p>
          </div>
          <Sparkles className="w-7 h-7 text-teal-500/30" />
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-6 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        
        {/* Category Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filterCategory === cat
                  ? cat === 'Clashes Only'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-brand-700 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat === 'Clashes Only' && <AlertTriangle className="w-3 h-3 inline mr-1 text-white" />}
              {cat}
            </button>
          ))}
        </div>

        {/* Search & View Mode Switcher */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events, venues, tags..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'cards'
                  ? 'bg-white dark:bg-slate-700 text-brand-700 dark:text-brand-300 shadow-xs'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title="Cards Grid"
            >
              <Layers className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'timeline'
                  ? 'bg-white dark:bg-slate-700 text-brand-700 dark:text-brand-300 shadow-xs'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title="Chronological Timeline Flow"
            >
              <CalendarDays className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Events Presentation: Cards or Chronological Flow */}
      {sortedEvents.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800">
          <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No events found matching your filter</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Try resetting your search query or capture a new event using our AI flyer scanner or manual entry form.
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <button
              onClick={() => { setFilterCategory('All'); setSearchQuery(''); }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              Reset Filters
            </button>
            <button
              onClick={() => setActiveTab('capture')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-700 text-white"
            >
              Scan Flyer via OCR
            </button>
          </div>
        </div>
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        /* Vertical Chronological Timeline Flow */
        <div className="relative pl-6 sm:pl-8 border-l-2 border-brand-200 dark:border-brand-900/60 space-y-8 ml-3 sm:ml-4 py-2">
          {sortedEvents.map((event, index) => (
            <div key={event.id} className="relative group">
              {/* Timeline Node Icon */}
              <div className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-7 h-7 rounded-full flex items-center justify-center border-2 ${
                event.hasClash
                  ? 'bg-rose-500 border-rose-200 dark:border-rose-900 text-white'
                  : 'bg-brand-600 border-brand-200 dark:border-brand-900 text-white'
              } shadow-sm`}>
                {event.hasClash ? <AlertTriangle className="w-3.5 h-3.5" /> : <Calendar className="w-3.5 h-3.5" />}
              </div>

              {/* Date Marker Header */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono font-bold text-brand-700 dark:text-brand-300 px-2 py-0.5 rounded bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800">
                  {event.date}
                </span>
                <span className="text-xs text-slate-400 font-medium">({event.time})</span>
              </div>

              <div className="max-w-3xl">
                <EventCard event={event} />
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
