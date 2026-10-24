import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { INITIAL_EVENTS, SAMPLE_POSTERS } from '../data/mockData';
import { checkDuplicateEvent, checkScheduleClash, validateEventFields } from '../utils/validation';

const EventContext = createContext();

export function EventProvider({ children }) {
  // 1. Core State
  const [events, setEvents] = useState(() => {
    try {
      const saved = localStorage.getItem('mycampus_events_v1');
      return saved ? JSON.parse(saved) : INITIAL_EVENTS;
    } catch (e) {
      return INITIAL_EVENTS;
    }
  });

  const [activeTab, setActiveTab] = useState('today'); // 'today', 'calendar', 'capture', 'matcher', 'analytics'
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals & Flows
  const [ocrModalOpen, setOcrModalOpen] = useState(false);
  const [ocrProcessing, setOcrProcessing] = useState(false);
  const [ocrStep, setOcrStep] = useState(0); // 0: idle, 1: scanning, 2: OCR text, 3: LLM Schema, 4: Clash check, 5: done
  const [pendingEvent, setPendingEvent] = useState(null);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [manualEntryOpen, setManualEntryOpen] = useState(false);
  const [calendarSyncOpen, setCalendarSyncOpen] = useState(false);
  const [architectureModalOpen, setArchitectureModalOpen] = useState(false);
  const [extensionMockOpen, setExtensionMockOpen] = useState(false);

  // Dark Mode State
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('mycampus_theme');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('mycampus_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('mycampus_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // Save events to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mycampus_events_v1', JSON.stringify(events));
    } catch (e) {
      console.error('Failed to save events to localStorage', e);
    }
  }, [events]);

  // Notifications State
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'Schedule Clash Alert!',
      message: 'HackShift 2026 presentation overlaps with CS302 Mid-Term Exam on Oct 25.',
      time: '10 mins ago',
      type: 'clash',
      read: false
    },
    {
      id: 'notif-2',
      title: 'Registration Deadline Warning',
      message: 'ACM ICPC Regional Prelims registrations close in 48 hours!',
      time: '1 hour ago',
      type: 'deadline',
      read: false
    },
    {
      id: 'notif-3',
      title: 'AI Verification Succeeded',
      message: 'Poster OCR successfully extracted dates and venue for HackShift 2026.',
      time: 'Yesterday',
      type: 'system',
      read: true
    }
  ]);

  const addNotification = (notif) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      time: 'Just now',
      read: false,
      ...notif
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Trigger celebration confetti
  const triggerConfetti = (big = false) => {
    try {
      if (big) {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 }, colors: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899'] });
        setTimeout(() => {
          confetti({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0 } });
          confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1 } });
        }, 200);
      } else {
        confetti({
          particleCount: 50,
          spread: 50,
          origin: { y: 0.6 }
        });
      }
    } catch (e) {}
  };

  // Add Event with automated validation & clash recalculation
  const addEvent = (eventData) => {
    // 1. Validation check
    const validation = validateEventFields(eventData);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    // 2. Duplicate check
    const dupCheck = checkDuplicateEvent(eventData, events);
    if (dupCheck) {
      return { success: false, duplicate: dupCheck };
    }

    // 3. Clash check
    const clash = checkScheduleClash(eventData, events);

    const newEvent = {
      ...eventData,
      id: `evt-${Date.now()}`,
      status: eventData.status || 'Registered',
      hasClash: !!clash,
      clashDetails: clash || null,
      checklist: eventData.checklist || [
        { id: `c-${Date.now()}-1`, text: 'Form team / Confirm registration credentials', completed: true },
        { id: `c-${Date.now()}-2`, text: 'Review rules, guidelines and problem statements', completed: false },
        { id: `c-${Date.now()}-3`, text: 'Prepare presentation & technical demo setup', completed: false }
      ],
      reminders: eventData.reminders || [
        { time: '24 hours before deadline', active: true }
      ]
    };

    setEvents(prev => [newEvent, ...prev]);

    // Add alert notification
    if (clash) {
      addNotification({
        title: '⚠️ Schedule Clash Detected',
        message: `${newEvent.name} overlaps with "${clash.conflictingWith}" on ${clash.conflictDate}!`,
        type: 'clash'
      });
    } else {
      addNotification({
        title: '✅ Event Added to Timeline',
        message: `"${newEvent.name}" is now scheduled in your personal event journey.`,
        type: 'success'
      });
      triggerConfetti();
    }

    return { success: true, event: newEvent, clash };
  };

  // Update existing event
  const updateEvent = (id, updatedFields) => {
    setEvents(prev => prev.map(evt => {
      if (evt.id !== id) return evt;
      const merged = { ...evt, ...updatedFields };
      // re-check clash
      const clash = checkScheduleClash(merged, prev, id);
      return {
        ...merged,
        hasClash: !!clash,
        clashDetails: clash || null
      };
    }));
  };

  // Delete event
  const deleteEvent = (id) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    if (selectedEvent && selectedEvent.id === id) {
      setSelectedEvent(null);
    }
    addNotification({
      title: 'Event Removed',
      message: 'The event was removed from your journey timeline.',
      type: 'info'
    });
  };

  // Toggle preparation checklist item
  const toggleChecklistItem = (eventId, checklistId) => {
    setEvents(prev => prev.map(evt => {
      if (evt.id !== eventId) return evt;
      const updatedChecklist = (evt.checklist || []).map(item => {
        if (item.id === checklistId) {
          const newState = !item.completed;
          return { ...item, completed: newState };
        }
        return item;
      });

      const isAllDone = updatedChecklist.length > 0 && updatedChecklist.every(c => c.completed);
      const clickedItem = (evt.checklist || []).find(c => c.id === checklistId);
      const becomingComplete = clickedItem && !clickedItem.completed;

      if (isAllDone) {
        triggerConfetti(true);
        addNotification({
          title: '🎉 100% Prepared!',
          message: `You've completed all checklist tasks for "${evt.name}". You're ready to win!`,
          type: 'success'
        });
      } else if (becomingComplete) {
        triggerConfetti(false);
      }

      return { ...evt, checklist: updatedChecklist };
    }));

    if (selectedEvent && selectedEvent.id === eventId) {
      setSelectedEvent(prev => {
        const updated = prev.checklist.map(item =>
          item.id === checklistId ? { ...item, completed: !item.completed } : item
        );
        return { ...prev, checklist: updated };
      });
    }
  };

  // Add custom checklist item to an event
  const addChecklistItem = (eventId, text) => {
    if (!text || !text.trim()) return;
    const newItem = {
      id: `c-custom-${Date.now()}`,
      text: text.trim(),
      completed: false
    };

    setEvents(prev => prev.map(evt => {
      if (evt.id !== eventId) return evt;
      return {
        ...evt,
        checklist: [...(evt.checklist || []), newItem]
      };
    }));

    if (selectedEvent && selectedEvent.id === eventId) {
      setSelectedEvent(prev => ({
        ...prev,
        checklist: [...(prev.checklist || []), newItem]
      }));
    }
  };

  // Delete checklist item
  const deleteChecklistItem = (eventId, checklistId) => {
    setEvents(prev => prev.map(evt => {
      if (evt.id !== eventId) return evt;
      return {
        ...evt,
        checklist: (evt.checklist || []).filter(item => item.id !== checklistId)
      };
    }));

    if (selectedEvent && selectedEvent.id === eventId) {
      setSelectedEvent(prev => ({
        ...prev,
        checklist: prev.checklist.filter(item => item.id !== checklistId)
      }));
    }
  };

  // Resolve clash
  const resolveClash = (eventId) => {
    setEvents(prev => prev.map(evt => {
      if (evt.id === eventId) {
        return {
          ...evt,
          hasClash: false,
          clashDetails: null
        };
      }
      return evt;
    }));

    if (selectedEvent && selectedEvent.id === eventId) {
      setSelectedEvent(prev => ({ ...prev, hasClash: false, clashDetails: null }));
    }

    addNotification({
      title: 'Clash Resolved',
      message: 'Schedule conflict marked as acknowledged and managed.',
      type: 'success'
    });
  };

  // Simulated AI OCR Extraction Pipeline
  const runSimulatedOcr = (posterData) => {
    setOcrProcessing(true);
    setOcrStep(1); // scanning poster

    setTimeout(() => {
      setOcrStep(2); // OCR text recognition
      setTimeout(() => {
        setOcrStep(3); // LLM schema parsing
        setTimeout(() => {
          setOcrStep(4); // Duplicate & Clash rule-engine
          setTimeout(() => {
            setOcrProcessing(false);
            setOcrModalOpen(false);

            // Construct prefilled pending event
            const prefilled = {
              name: posterData.eventName || 'Extracted Campus Event',
              organizer: posterData.organizer || 'Campus Student Association',
              category: posterData.category || 'Hackathon',
              date: posterData.date || '2026-10-24',
              endDate: posterData.date || '2026-10-24',
              time: posterData.time || '10:00 AM - 05:00 PM',
              venue: posterData.venue || 'Campus Auditorium Hall',
              locationType: 'In-Person',
              fee: posterData.fees || 'Free',
              eligibility: posterData.eligibility || 'College Students',
              registrationDeadline: '2026-10-22T23:59',
              sourceUrl: 'https://campus-events.edu/flyer-scan',
              sourceType: 'Poster OCR',
              status: 'Registered',
              description: `Extracted automatically from ${posterData.source || 'uploaded flyer'} with 98.2% AI confidence score.`,
              tags: ['AI Extracted', posterData.category || 'Event', 'Verified'],
              prizePool: posterData.prizePool || 'Certificates & Swags',
              teamSize: '1 - 4 Members',
              checklist: [
                { id: `c-ocr-1`, text: 'Confirm registration link from extracted QR/URL', completed: true },
                { id: `c-ocr-2`, text: 'Form team members & check eligibility requirements', completed: false },
                { id: `c-ocr-3`, text: 'Review rulebook and submission guidelines', completed: false }
              ],
              reminders: [
                { time: '24 hours before', active: true }
              ],
              ocrConfidence: posterData.extractedConfidence || 97.8,
              extractedRawText: `EVENT: ${posterData.eventName}\nDATE: ${posterData.date} (${posterData.time})\nVENUE: ${posterData.venue}\nFEES: ${posterData.fees}\nELIGIBILITY: ${posterData.eligibility}`
            };

            setPendingEvent(prefilled);
            setConfirmationModalOpen(true);
          }, 600);
        }, 700);
      }, 700);
    }, 600);
  };

  // Simulated URL Quick Capture
  const runSimulatedUrlCapture = (url) => {
    setOcrProcessing(true);
    setOcrStep(1);

    setTimeout(() => {
      setOcrStep(2);
      setTimeout(() => {
        setOcrStep(3);
        setTimeout(() => {
          setOcrProcessing(false);
          const domain = url.includes('devfolio') ? 'Devfolio' : url.includes('unstop') ? 'Unstop' : 'Campus Portal';
          const prefilled = {
            name: 'Web3 & AI Buildathon 2026',
            organizer: 'National Tech Guild',
            category: 'Hackathon',
            date: '2026-11-20',
            endDate: '2026-11-21',
            time: '09:00 AM - 08:00 PM',
            venue: 'Online / Devfolio Virtual Hub',
            locationType: 'Virtual',
            fee: 'Free',
            eligibility: 'All college undergraduate & graduate developers',
            registrationDeadline: '2026-11-15T23:59',
            sourceUrl: url,
            sourceType: `Web URL (${domain})`,
            status: 'Registered',
            description: `Parsed automatically from ${url}. Smart contract bounties, AI agent tooling tracks, and global mentorship sessions.`,
            tags: ['Web3', 'AI', 'Buildathon', 'Global'],
            prizePool: '$10,000 USD',
            teamSize: '2 - 4 Members',
            checklist: [
              { id: `c-url-1`, text: 'Complete registration on Devfolio / Unstop platform', completed: true },
              { id: `c-url-2`, text: 'Join discord/telegram coordination channel', completed: false },
              { id: `c-url-3`, text: 'Submit project idea before deadline', completed: false }
            ],
            reminders: [
              { time: '24 hours before deadline', active: true }
            ],
            ocrConfidence: 99.1,
            extractedRawText: `SOURCE: ${url}\nSCRAPED TITLE: Web3 & AI Buildathon 2026\nORGANIZER: National Tech Guild\nREGISTRATION DEADLINE: Nov 15, 2026`
          };

          setPendingEvent(prefilled);
          setConfirmationModalOpen(true);
        }, 700);
      }, 700);
    }, 600);
  };

  // Simulated Google Calendar & Gmail Sync
  const syncGmailAndCalendar = () => {
    setCalendarSyncOpen(true);
  };

  // Reset demo to default state
  const resetToDefaultData = () => {
    setEvents(INITIAL_EVENTS);
    localStorage.removeItem('mycampus_events_v1');
    addNotification({
      title: 'Demo State Reset',
      message: 'Events and timelines have been restored to initial hackathon state.',
      type: 'info'
    });
  };

  // Quick Demo Trigger Scenarios for Judges
  const triggerDemoScenario = (scenarioKey) => {
    if (scenarioKey === 'ocr_hackshift') {
      runSimulatedOcr(SAMPLE_POSTERS[0]);
    } else if (scenarioKey === 'clash_test') {
      runSimulatedOcr(SAMPLE_POSTERS[1]); // Has clash with Oct 25 exam!
    } else if (scenarioKey === 'project_matcher') {
      setActiveTab('matcher');
    } else if (scenarioKey === 'calendar_sync') {
      setCalendarSyncOpen(true);
    }
  };

  // Computed statistics for dashboard
  const stats = {
    totalEvents: events.length,
    registeredCount: events.filter(e => e.status === 'Registered').length,
    clashCount: events.filter(e => e.hasClash).length,
    deadlinesCount: events.filter(e => e.status === 'Deadline Approaching').length,
    totalTasks: events.reduce((acc, evt) => acc + (evt.checklist?.length || 0), 0),
    completedTasks: events.reduce((acc, evt) => acc + ((evt.checklist || []).filter(c => c.completed).length), 0)
  };

  return (
    <EventContext.Provider value={{
      events,
      activeTab,
      setActiveTab,
      selectedEvent,
      setSelectedEvent,
      filterCategory,
      setFilterCategory,
      searchQuery,
      setSearchQuery,
      darkMode,
      toggleDarkMode,
      notifications,
      addNotification,
      markNotificationRead,
      clearAllNotifications,
      addEvent,
      updateEvent,
      deleteEvent,
      toggleChecklistItem,
      addChecklistItem,
      deleteChecklistItem,
      resolveClash,
      // Modals
      ocrModalOpen,
      setOcrModalOpen,
      ocrProcessing,
      ocrStep,
      pendingEvent,
      setPendingEvent,
      confirmationModalOpen,
      setConfirmationModalOpen,
      manualEntryOpen,
      setManualEntryOpen,
      calendarSyncOpen,
      setCalendarSyncOpen,
      architectureModalOpen,
      setArchitectureModalOpen,
      extensionMockOpen,
      setExtensionMockOpen,
      // Actions
      runSimulatedOcr,
      runSimulatedUrlCapture,
      syncGmailAndCalendar,
      resetToDefaultData,
      triggerDemoScenario,
      triggerConfetti,
      stats
    }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
}
