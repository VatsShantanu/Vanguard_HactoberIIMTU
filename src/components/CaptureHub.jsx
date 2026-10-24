import React, { useState } from 'react';
import { 
  Camera, 
  Upload, 
  Link as LinkIcon, 
  Mail, 
  Globe, 
  Sparkles, 
  ArrowRight, 
  Calendar,
  PlusCircle,
  FileText
} from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { SAMPLE_POSTERS } from '../data/mockData';

export default function CaptureHub() {
  const { 
    runSimulatedOcr, 
    runSimulatedUrlCapture, 
    setManualEntryOpen, 
    syncGmailAndCalendar,
    setExtensionMockOpen
  } = useEvents();

  const [activeTab, setActiveTab] = useState('poster'); // 'poster' | 'url'
  const [inputUrl, setInputUrl] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    runSimulatedUrlCapture(inputUrl.trim());
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-display font-extrabold text-5xl sm:text-7xl leading-[0.95] text-slate-900 dark:text-white">
          Add an event.<br />
          <span className="text-emerald-600 dark:text-volt-400">We'll do the typing.</span>
        </h1>
        <p className="text-base text-slate-500 dark:text-slate-400 mt-4 max-w-xl">
          Drop a flyer, paste a link, or connect your inbox. Dates, deadlines and prep steps land on your calendar automatically.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex p-1 rounded-full bg-black/5 dark:bg-white/10 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-inner">
          <button
            onClick={() => setActiveTab('poster')}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeTab === 'poster'
                ? 'bg-white text-slate-900 dark:bg-white dark:text-slate-950 shadow-sm border border-black/5 dark:border-white/30'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Camera className="w-4 h-4 text-blue-500" />
            Upload Flyer or Poster
          </button>

          <button
            onClick={() => setActiveTab('url')}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeTab === 'url'
                ? 'bg-white text-slate-900 dark:bg-white dark:text-slate-950 shadow-sm border border-black/5 dark:border-white/30'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LinkIcon className="w-4 h-4 text-indigo-500" />
            Paste Event Link
          </button>

          <button
            onClick={() => setManualEntryOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-all"
          >
            <PlusCircle className="w-4 h-4 text-amber-500" />
            Manual Entry
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Main Column */}
        <div className="lg:col-span-8">
          
          {/* TAB 1: Poster Upload */}
          {activeTab === 'poster' && (
            <div className="card p-6 sm:p-7">
              <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Drop Your Event Flyer Here
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  We'll read the event name, dates, location, and fees automatically.
                </p>
              </div>

              {/* Drag and Drop Zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  runSimulatedOcr(SAMPLE_POSTERS[0]);
                }}
                onClick={() => runSimulatedOcr(SAMPLE_POSTERS[0])}
                className={`mt-5 border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all duration-200 ${
                  dragOver 
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20' 
                    : 'border-slate-200 dark:border-slate-700 hover:border-emerald-400 hover:bg-slate-50/50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Drop any poster image (PNG, JPG, PDF) here
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  or <span className="text-emerald-600 dark:text-emerald-400 font-semibold underline">tap to test a sample flyer</span>
                </p>
              </div>

              {/* Preset Flyers for instant live click */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Try these sample campus flyers:
                  </span>
                  <span className="text-[10px] text-slate-400">Tap any card to test</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {SAMPLE_POSTERS.map((poster, index) => (
                    <div
                      key={poster.id}
                      onClick={() => runSimulatedOcr(poster)}
                      className="group p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 cursor-pointer transition-all shadow-xs flex flex-col justify-between"
                    >
                      <div>
                        {/* Visual Mock Badge */}
                        <div className={`h-16 rounded-xl bg-gradient-to-tr ${poster.thumbnailColor} p-2.5 text-white flex flex-col justify-between mb-2 shadow-xs`}>
                          <span className="text-[9px] font-bold uppercase tracking-wider bg-black/30 px-1.5 py-0.5 rounded self-start">
                            {poster.category}
                          </span>
                          <span className="text-[10px] font-bold truncate">
                            {poster.title}
                          </span>
                        </div>

                        <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 transition-colors">
                          {poster.eventName}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {poster.date} · {poster.fees}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                          Scan Flyer →
                        </span>
                        {index === 1 && (
                          <span className="text-[10px] font-bold text-rose-500">
                            Tests Clash ⚠️
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: URL Quick Capture */}
          {activeTab === 'url' && (
            <div className="card p-6 sm:p-7">
              <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Paste an Event Link
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Paste a registration link from Devfolio, Unstop, MLH, or your college portal.
                </p>
              </div>

              <form onSubmit={handleUrlSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Registration URL
                  </label>
                  <div className="relative">
                    <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="url"
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                      placeholder="https://devfolio.co/hackathons/web3-buildathon-2026"
                      className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary text-xs"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Extract Event Info</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputUrl('https://hackshift2026.devfolio.co/overview')}
                    className="btn btn-ghost text-xs"
                  >
                    Paste Sample Link
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>

        {/* Right Column: Other Import Options */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Gmail & Calendar Sync Card */}
          <div className="card p-5 bg-gradient-to-br from-blue-50/60 to-indigo-50/40 dark:from-slate-900 dark:to-blue-950/20 border-blue-200/70 dark:border-blue-900/40">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-3 shadow-md shadow-blue-600/20">
              <Mail className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Connect Google Account
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Find event invites and ticket confirmations sitting in your student inbox automatically.
            </p>
            <button
              onClick={syncGmailAndCalendar}
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all"
            >
              <span>Scan Student Inbox</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Browser Extension Simulation */}
          <div className="card p-5 bg-gradient-to-br from-teal-50/60 to-emerald-50/40 dark:from-slate-900 dark:to-teal-950/20 border-teal-200/70 dark:border-teal-900/40">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center mb-3 shadow-md shadow-teal-600/20">
              <Globe className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Browser Quick Extension
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Add hackathons directly from Devfolio or Unstop while browsing with one click.
            </p>
            <button
              onClick={() => setExtensionMockOpen(true)}
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-sm transition-all"
            >
              <span>Try Extension Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
