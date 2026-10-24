import React, { useState } from 'react';
import { Sun, Moon, Bell, Plus, Menu, X, CheckCircle2 } from 'lucide-react';
import { useEvents } from '../context/EventContext';

const TABS = [
  { id: 'today', label: 'Today' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'matcher', label: 'Hackathons' },
  { id: 'analytics', label: 'Insights' },
];

export default function Navbar() {
  const { activeTab, setActiveTab, darkMode, toggleDarkMode, notifications, markNotificationRead, clearAllNotifications, events } = useEvents();
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const unread = notifications.filter(n => !n.read).length;
  const clashes = events.filter(e => e.hasClash).length;

  return (
    <header className="sticky top-2 z-40 px-3 sm:px-6 transition-all duration-300">
      <div className="max-w-6xl mx-auto h-16 rounded-[26px] bg-white/70 dark:bg-slate-900/65 backdrop-blur-2xl border border-white/80 dark:border-white/15 px-4 sm:px-6 flex items-center justify-between gap-4 shadow-lg shadow-blue-900/5 dark:shadow-black/40">
        {/* Logo */}
        <button onClick={() => setActiveTab('today')} className="flex items-center gap-2.5 shrink-0 group cursor-pointer" aria-label="MyCampus home">
          <span className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 grid place-items-center shadow-md shadow-blue-500/25 group-hover:scale-105 active:scale-95 transition-transform">
            <span className="w-3.5 h-3.5 rounded-full bg-white shadow-xs" />
          </span>
          <span className="font-display font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">MyCampus</span>
        </button>

        {/* Tabs */}
        <nav className="hidden md:flex items-center gap-1 p-1 rounded-full bg-black/5 dark:bg-white/10 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-inner" aria-label="Main">
          {TABS.map(t => {
            const active = activeTab === t.id || (t.id === 'calendar' && activeTab === 'timeline');
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                aria-current={active ? 'page' : undefined}
                className={`relative px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${active
                  ? 'bg-white text-slate-950 dark:bg-white dark:text-slate-950 shadow-sm border border-black/5 dark:border-white/30'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10'}`}
              >
                {t.label}
                {t.id === 'today' && clashes > 0 && <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-rose-500 animate-pulse" aria-label="Schedule clash" />}
              </button>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button onClick={() => setActiveTab('capture')} className="btn btn-accent !py-2 hidden sm:inline-flex shadow-md">
            <Plus className="w-4 h-4 stroke-[2.5]" /> Add event
          </button>

          <div className="relative">
            <button
              onClick={() => setNotifOpen(o => !o)}
              className="relative w-9 h-9 rounded-full bg-white/60 dark:bg-white/10 backdrop-blur-xl border border-white/70 dark:border-white/15 grid place-items-center text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-white/20 active:scale-95 transition-all cursor-pointer"
              aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
              aria-expanded={notifOpen}
            >
              <Bell className="w-[17px] h-[17px]" />
              {unread > 0 && <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />}
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-full mt-3 w-80 sm:w-96 rounded-3xl bg-white/85 dark:bg-slate-900/80 backdrop-blur-3xl border border-white/80 dark:border-white/15 animate-pop z-50 overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-display font-bold text-slate-900 dark:text-white">Notifications</span>
                  {notifications.length > 0 && <button onClick={clearAllNotifications} className="text-xs font-semibold text-slate-400 hover:text-slate-700 cursor-pointer">Clear all</button>}
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  {notifications.length === 0 ? (
                    <div className="py-10 text-center">
                      <CheckCircle2 className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">You're all caught up</p>
                    </div>
                  ) : notifications.map(n => (
                    <button key={n.id} onClick={() => markNotificationRead(n.id)} className={`w-full text-left px-5 py-3.5 flex gap-3 hover:bg-white/50 dark:hover:bg-white/5 ${!n.read ? 'bg-blue-50/60 dark:bg-blue-950/20' : ''}`}>
                      <span className="text-lg shrink-0">{n.type === 'clash' ? '⚠️' : n.type === 'deadline' ? '⏰' : n.type === 'success' ? '🎉' : 'ℹ️'}</span>
                      <span className="min-w-0">
                        <span className="block text-sm font-bold text-slate-900 dark:text-slate-100">{n.title}</span>
                        <span className="block text-xs text-slate-500 mt-0.5 line-clamp-2">{n.message}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={toggleDarkMode} 
            className="w-9 h-9 rounded-full bg-white/60 dark:bg-white/10 backdrop-blur-xl border border-white/70 dark:border-white/15 grid place-items-center text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-white/20 active:scale-95 transition-all cursor-pointer" 
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun className="w-[17px] h-[17px]" /> : <Moon className="w-[17px] h-[17px]" />}
          </button>

          <button 
            onClick={() => setMenuOpen(o => !o)} 
            className="md:hidden w-9 h-9 rounded-full bg-white/60 dark:bg-white/10 backdrop-blur-xl border border-white/70 dark:border-white/15 grid place-items-center text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-white/20 active:scale-95 transition-all cursor-pointer" 
            aria-label="Menu" 
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden mt-2 p-3 rounded-3xl bg-white/85 dark:bg-slate-900/80 backdrop-blur-3xl border border-white/80 dark:border-white/15 shadow-2xl animate-pop">
          <div className="grid grid-cols-2 gap-2">
            {[...TABS, { id: 'capture', label: '+ Add event' }].map(t => (
              <button key={t.id} onClick={() => { setActiveTab(t.id); setMenuOpen(false); }}
                className={`py-3 rounded-2xl text-sm font-bold transition cursor-pointer ${activeTab === t.id ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'bg-slate-100/70 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
