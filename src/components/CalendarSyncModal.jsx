import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Calendar, 
  CheckCircle2, 
  Loader2, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink, 
  Download, 
  Check, 
  Clock, 
  MapPin,
  Share2
} from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { MOCK_GMAIL_IMPORTS } from '../data/mockData';
import { openInGoogleCalendar, exportAllEventsToICS, getGoogleCalendarUrl } from '../utils/calendarExport';
import { getCatConfig } from '../utils/helpers';

export default function CalendarSyncModal() {
  const { calendarSyncOpen, setCalendarSyncOpen, events, addEvent, setActiveTab, triggerConfetti } = useEvents();

  const [activeTab, setActiveTabMode] = useState('google-calendar'); // 'google-calendar' | 'gmail-import'
  const [syncStatus, setSyncStatus] = useState('idle'); // 'idle' | 'scanning' | 'discovered'
  const [selectedItems, setSelectedItems] = useState([true, true]);
  const [pushedEventIds, setPushedEventIds] = useState([]);

  if (!calendarSyncOpen) return null;

  const handleStartScan = () => {
    setSyncStatus('scanning');
    setTimeout(() => {
      setSyncStatus('discovered');
    }, 1100);
  };

  const handleImportSelected = () => {
    MOCK_GMAIL_IMPORTS.forEach((item, index) => {
      if (selectedItems[index]) {
        addEvent({
          name: item.eventTitle,
          organizer: item.from,
          category: item.eventTitle.includes('DevFest') ? 'Workshop' : 'Bootcamp',
          date: item.eventDate,
          endDate: item.eventDate,
          time: '10:00 AM - 04:30 PM',
          venue: item.eventVenue,
          locationType: item.eventVenue.includes('Virtual') ? 'Virtual' : 'In-Person',
          fee: 'Free (RSVP Confirmed)',
          eligibility: 'Open to enrolled students',
          registrationDeadline: `${item.eventDate}T09:00`,
          sourceUrl: 'https://mail.google.com/student',
          sourceType: 'Gmail Sync',
          status: 'Registered',
          description: `Imported from email: "${item.subject}"`,
          checklist: [
            { id: `c-gmail-${Date.now()}-1`, text: 'Check prerequisite environment and tools', completed: false },
            { id: `c-gmail-${Date.now()}-2`, text: 'Add venue location to campus map bookmarks', completed: true }
          ]
        });
      }
    });

    triggerConfetti(true);
    setCalendarSyncOpen(false);
    setActiveTab('calendar');
    setSyncStatus('idle');
  };

  const handlePushToGoogle = (event) => {
    openInGoogleCalendar(event);
    if (!pushedEventIds.includes(event.id)) {
      setPushedEventIds(prev => [...prev, event.id]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xl animate-fade-in" onClick={() => setCalendarSyncOpen(false)}>
      <div 
        className="w-full max-w-xl rounded-[32px] bg-white/85 dark:bg-slate-900/80 backdrop-blur-3xl border border-white/80 dark:border-white/18 shadow-2xl overflow-hidden animate-pop"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white backdrop-blur-xs">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white tracking-tight">
                  Google Calendar & Student Sync
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
                  Live Integration
                </span>
              </div>
              <p className="text-xs text-blue-100 mt-0.5">
                Export events to Google Calendar or import RSVPs from your student email
              </p>
            </div>
          </div>
          <button
            onClick={() => setCalendarSyncOpen(false)}
            className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-2 gap-2">
          <button
            onClick={() => setActiveTabMode('google-calendar')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              activeTab === 'google-calendar'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Sync to Google Calendar</span>
          </button>
          <button
            onClick={() => setActiveTabMode('gmail-import')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              activeTab === 'gmail-import'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Import from Student Gmail</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          
          {/* TAB 1: GOOGLE CALENDAR EXPORT & 1-CLICK SYNC */}
          {activeTab === 'google-calendar' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Scheduled Campus Events ({events.length})
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Click any event to open directly in Google Calendar with prepopulated details and reminders.
                  </p>
                </div>
                <button
                  onClick={() => exportAllEventsToICS(events)}
                  className="btn btn-secondary text-xs !py-1.5 !px-3 shrink-0 flex items-center gap-1.5"
                  title="Download all events as .ics iCalendar file"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .ICS</span>
                </button>
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2 pr-1 scrollbar-none">
                {events.map((event) => {
                  const cfg = getCatConfig(event.category);
                  const isPushed = pushedEventIds.includes(event.id);

                  return (
                    <div
                      key={event.id}
                      className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 hover:border-blue-400 dark:hover:border-blue-600 transition flex items-center justify-between gap-3 group"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span 
                            className="w-2 h-2 rounded-full shrink-0" 
                            style={{ background: cfg.color }} 
                          />
                          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                            {event.date} {event.time && `· ${event.time.split('-')[0].trim()}`}
                          </span>
                        </div>
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {event.name}
                        </h5>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{event.venue || 'Campus'}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isPushed ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                            <Check className="w-3.5 h-3.5" />
                            <span>Added</span>
                          </span>
                        ) : null}

                        <button
                          onClick={() => handlePushToGoogle(event)}
                          className="btn btn-primary text-xs !py-1.5 !px-3 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-xs"
                          title="Open prefilled template in Google Calendar"
                        >
                          <Calendar className="w-3.5 h-3.5 text-blue-200" />
                          <span>Add to Google Cal</span>
                          <ExternalLink className="w-3 h-3 text-blue-200" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 flex items-start gap-2.5 text-xs text-blue-800 dark:text-blue-300">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">Instant Google Calendar Integration</p>
                  <p className="text-[11px] text-blue-700 dark:text-blue-400 leading-relaxed">
                    Events launch via Google Calendar's official Web Intent API with correct date boundaries, category notes, preparation checklists, and venue locations.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: IMPORT FROM STUDENT GMAIL */}
          {activeTab === 'gmail-import' && (
            <div className="space-y-4">
              {syncStatus === 'idle' && (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto shadow-sm">
                    <Mail className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      Find Hidden Event Confirmations
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                      We'll search your student email for event RSVPs, hackathon tickets, and seminar invitations.
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Simulated campus Google Workspace demo • Privacy preserved</span>
                  </div>

                  <button
                    onClick={handleStartScan}
                    className="btn btn-primary bg-blue-600 hover:bg-blue-700 text-xs px-6 py-2.5 mx-auto shadow-md"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Scan Student Inbox Now</span>
                  </button>
                </div>
              )}

              {syncStatus === 'scanning' && (
                <div className="py-12 text-center space-y-3">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Scanning your student mailbox...
                  </h4>
                  <p className="text-xs text-slate-400">
                    Parsing registration confirmations and dates
                  </p>
                </div>
              )}

              {syncStatus === 'discovered' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Found 2 new event invitations:
                    </span>
                    <span className="text-[11px] text-emerald-600 font-bold">
                      Ready to import
                    </span>
                  </div>

                  <div className="space-y-2">
                    {MOCK_GMAIL_IMPORTS.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          const updated = [...selectedItems];
                          updated[idx] = !updated[idx];
                          setSelectedItems(updated);
                        }}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                          selectedItems[idx]
                            ? 'border-blue-400 bg-blue-50/50 dark:bg-blue-950/30'
                            : 'border-slate-200 dark:border-slate-800 opacity-60'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedItems[idx]}
                          onChange={() => {}}
                          className="mt-1 rounded text-blue-600 focus:ring-blue-500"
                        />

                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {item.eventTitle}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {item.eventDate} · {item.eventVenue}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                            From: {item.from} ({item.subject})
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      onClick={() => setSyncStatus('idle')}
                      className="text-xs text-slate-400 hover:text-slate-600"
                    >
                      Back
                    </button>

                    <button
                      onClick={handleImportSelected}
                      className="btn btn-primary bg-blue-600 hover:bg-blue-700 text-xs px-5 py-2 shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Import into My Journey</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
