import React, { useState } from 'react';
import { X, Globe, CheckCircle2, Sparkles, ExternalLink, ArrowRight } from 'lucide-react';
import { useEvents } from '../context/EventContext';

export default function ExtensionCaptureMock() {
  const { extensionMockOpen, setExtensionMockOpen, addEvent, setActiveTab, triggerConfetti } = useEvents();

  const [saving, setSaving] = useState(false);

  if (!extensionMockOpen) return null;

  const mockCapturedEvent = {
    name: 'HackWithIndia 2026 Virtual Finale',
    organizer: 'National Coding League',
    category: 'Hackathon',
    date: '2026-11-25',
    endDate: '2026-11-26',
    time: '10:00 AM - 06:00 PM',
    venue: 'Online / Devfolio',
    locationType: 'Virtual',
    fee: 'Free',
    eligibility: 'All Engineering & Technology Students',
    registrationDeadline: '2026-11-20T23:59',
    sourceUrl: 'https://devfolio.co/hackathons/hackwithindia-2026',
    sourceType: 'Chrome Extension V3',
    status: 'Registered',
    description: 'Captured seamlessly using MyCampus Chrome Extension while browsing Devfolio.',
    checklist: [
      { id: `c-ext-1`, text: 'Confirm team on Devfolio', completed: true },
      { id: `c-ext-2`, text: 'Join discord lounge', completed: false }
    ]
  };

  const handleSaveToTimeline = () => {
    setSaving(true);
    setTimeout(() => {
      addEvent(mockCapturedEvent);
      setSaving(false);
      setExtensionMockOpen(false);
      triggerConfetti();
      setActiveTab('timeline');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700 text-white shadow-2xl overflow-hidden">
        
        {/* Browser Mock Chrome Bar */}
        <div className="p-3 bg-slate-950 flex items-center justify-between border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono pl-2">
              devfolio.co/hackathons/hackwithindia-2026
            </span>
          </div>
          <button onClick={() => setExtensionMockOpen(false)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Extension Popup Body */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">MyCampus Extension</h4>
                <p className="text-[10px] text-teal-400 font-mono">Manifest V3 Quick Capture</p>
              </div>
            </div>
            <span className="text-[10px] bg-emerald-950/60 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-mono">
              Auto-Detected
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-2 text-xs">
            <h5 className="font-bold text-white text-sm">
              {mockCapturedEvent.name}
            </h5>
            <div className="text-slate-300 space-y-1 text-[11px]">
              <p>📅 Dates: {mockCapturedEvent.date} → {mockCapturedEvent.endDate}</p>
              <p>📍 Mode: {mockCapturedEvent.venue} ({mockCapturedEvent.locationType})</p>
              <p>🎟️ Fee: {mockCapturedEvent.fee}</p>
              <p>🎯 Eligibility: {mockCapturedEvent.eligibility}</p>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Our content script parses Microdata/OpenGraph and schema markup from active hackathon web pages and sends verified payloads to your MyCampus personal timeline.
          </p>

          <button
            onClick={handleSaveToTimeline}
            disabled={saving}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs shadow-md shadow-teal-900/30 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{saving ? 'Syncing to Journey...' : 'Save to MyCampus Timeline'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
