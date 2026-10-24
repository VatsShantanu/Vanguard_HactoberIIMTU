import React from 'react';
import { EventProvider, useEvents } from './context/EventContext';
import Navbar from './components/Navbar';
import QuickDemoBar from './components/QuickDemoBar';
import TodayView from './components/TodayView';
import CalendarView from './components/CalendarView';
import CaptureHub from './components/CaptureHub';
import ProjectMatcher from './components/ProjectMatcher';
import StatsOverview from './components/StatsOverview';
import OcrScannerModal from './components/OcrScannerModal';
import ConfirmationModal from './components/ConfirmationModal';
import ManualEntryModal from './components/ManualEntryModal';
import EventDetailModal from './components/EventDetailModal';
import CalendarSyncModal from './components/CalendarSyncModal';
import ExtensionCaptureMock from './components/ExtensionCaptureMock';
import ArchitectureInfoModal from './components/ArchitectureInfoModal';
import { exportAllEventsToICS } from './utils/calendarExport';

function AppContent() {
  const { activeTab, events } = useEvents();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 bg-ambient text-slate-900 dark:text-slate-100 transition-colors duration-200 relative overflow-x-hidden selection:bg-volt-400 selection:text-slate-950">
      {/* ─── iPhone Dynamic Liquid Wallpaper Mesh ─── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
        {/* Blob 1: Apple Electric Azure */}
        <div 
          className="absolute -top-40 -left-40 w-[620px] h-[620px] rounded-full bg-gradient-to-br from-blue-500/20 via-sky-400/18 to-indigo-500/15 dark:from-blue-600/25 dark:via-sky-500/20 dark:to-indigo-600/20 blur-[130px] liquid-anim-1" 
        />
        {/* Blob 2: Apple Liquid Ultraviolet / Magenta */}
        <div 
          className="absolute top-1/6 -right-40 w-[650px] h-[650px] rounded-full bg-gradient-to-bl from-purple-500/18 via-fuchsia-500/16 to-pink-500/14 dark:from-purple-600/25 dark:via-fuchsia-600/22 dark:to-pink-600/18 blur-[140px] liquid-anim-2" 
        />
        {/* Blob 3: Apple Radiant Coral / Sunset */}
        <div 
          className="absolute -bottom-40 right-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-rose-500/16 via-orange-400/14 to-amber-300/12 dark:from-rose-600/20 dark:via-orange-500/18 dark:to-amber-400/15 blur-[130px] liquid-anim-3" 
        />
        {/* Blob 4: Apple Spring Mint / Emerald */}
        <div 
          className="absolute bottom-1/5 -left-32 w-[580px] h-[580px] rounded-full bg-gradient-to-tr from-emerald-400/18 via-teal-400/16 to-cyan-400/14 dark:from-emerald-500/22 dark:via-teal-500/20 dark:to-cyan-500/16 blur-[130px] liquid-anim-4" 
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 btn btn-accent">Skip to content</a>
        <Navbar />

      <main id="main" className="flex-1">
        {activeTab === 'today' && <TodayView />}
        {(activeTab === 'calendar' || activeTab === 'timeline') && <CalendarView />}
        {activeTab === 'capture' && <CaptureHub />}
        {activeTab === 'matcher' && <ProjectMatcher />}
        {activeTab === 'analytics' && <StatsOverview />}
      </main>

      <OcrScannerModal />
      <ConfirmationModal />
      <ManualEntryModal />
      <EventDetailModal />
      <CalendarSyncModal />
      <ExtensionCaptureMock />
      <ArchitectureInfoModal />
      <QuickDemoBar />

      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p><span className="font-display font-bold text-slate-900 dark:text-white">MyCampus</span> · Team VANGUARD · HackShift 2026, PS 4</p>
          <button onClick={() => exportAllEventsToICS(events)} className="font-semibold hover:text-emerald-600 dark:hover:text-volt-400">Export all to calendar (.ics)</button>
        </div>
      </footer>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <EventProvider>
      <AppContent />
    </EventProvider>
  );
}
