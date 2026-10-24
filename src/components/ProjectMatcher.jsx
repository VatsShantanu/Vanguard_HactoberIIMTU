import React, { useState, useEffect, useMemo } from 'react';
import { 
  GitBranch, 
  CheckCircle2, 
  Trophy, 
  Calendar, 
  ArrowRight, 
  Plus, 
  X, 
  Sparkles, 
  ExternalLink, 
  Edit3, 
  Cpu, 
  RefreshCw, 
  Check, 
  Code2, 
  ChevronDown,
  ChevronUp,
  Flame,
  FolderPlus,
  Trash2,
  Zap,
  Target,
  Search,
  Copy,
  Layers
} from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { SAMPLE_PROJECTS } from '../data/mockData';
import { matchProjectToHackathons } from '../utils/matchingAlgorithm';
import { openInGoogleCalendar } from '../utils/calendarExport';

// Skill color mapping for developer tags
const SKILL_COLORS = {
  'react': { dot: '#06b6d4', bg: 'rgba(6, 182, 212, 0.10)', text: '#0891b2' },
  'next.js': { dot: '#0f172a', bg: 'rgba(15, 23, 42, 0.08)', text: '#0f172a' },
  'typescript': { dot: '#3178c6', bg: 'rgba(49, 120, 198, 0.10)', text: '#2563eb' },
  'tailwind css': { dot: '#38bdf8', bg: 'rgba(56, 189, 248, 0.10)', text: '#0284c7' },
  'node.js': { dot: '#22c55e', bg: 'rgba(34, 197, 94, 0.10)', text: '#16a34a' },
  'python': { dot: '#eab308', bg: 'rgba(234, 179, 8, 0.10)', text: '#ca8a04' },
  'fastapi': { dot: '#14b8a6', bg: 'rgba(20, 184, 166, 0.10)', text: '#0d9488' },
  'postgresql': { dot: '#3b82f6', bg: 'rgba(59, 130, 246, 0.10)', text: '#2563eb' },
  'mongodb': { dot: '#10b981', bg: 'rgba(16, 185, 129, 0.10)', text: '#059669' },
  'solidity': { dot: '#6366f1', bg: 'rgba(99, 102, 241, 0.10)', text: '#4f46e5' },
  'ethereum': { dot: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.10)', text: '#7c3aed' },
  'pytorch': { dot: '#f97316', bg: 'rgba(249, 115, 22, 0.10)', text: '#ea580c' },
  'docker': { dot: '#0284c7', bg: 'rgba(2, 132, 199, 0.10)', text: '#0369a1' },
  'llms': { dot: '#a855f7', bg: 'rgba(168, 85, 247, 0.10)', text: '#9333ea' },
  'iot': { dot: '#10b981', bg: 'rgba(16, 185, 129, 0.10)', text: '#059669' },
  'flutter': { dot: '#02569b', bg: 'rgba(2, 86, 155, 0.10)', text: '#0284c7' },
  'firebase': { dot: '#ffca28', bg: 'rgba(255, 202, 40, 0.12)', text: '#d97706' },
  'graphql': { dot: '#e10098', bg: 'rgba(225, 0, 152, 0.10)', text: '#db2777' },
};

const POPULAR_SKILLS = [
  'React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'FastAPI', 
  'PyTorch', 'Tailwind CSS', 'PostgreSQL', 'MongoDB', 'Solidity', 
  'Docker', 'LLMs', 'Flutter', 'Firebase', 'GraphQL'
];

const AVAILABLE_TRACKS = [
  'GenAI & Agents',
  'Web3 & DeFi',
  'Campus Life & EdTech',
  'Healthcare & BioTech',
  'FinTech & Payments',
  'Developer Tools',
  'Open Innovation',
  'Cybersecurity',
  'Climate & CleanTech',
  'IoT & Robotics'
];

function getSkillStyle(skill) {
  const key = skill.toLowerCase().trim();
  return SKILL_COLORS[key] || { dot: '#64748b', bg: 'rgba(100, 116, 139, 0.08)', text: '#475569' };
}

export default function ProjectMatcher() {
  const { addEvent, setActiveTab, triggerConfetti } = useEvents();

  // Projects State loaded from LocalStorage
  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem('mycampus_projects_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse saved projects', e);
    }
    return SAMPLE_PROJECTS;
  });

  const [activeProjectIndex, setActiveProjectIndex] = useState(0);

  // Active Project Details State
  const initialProj = projects[0] || SAMPLE_PROJECTS[0];
  const [projectTitle, setProjectTitle] = useState(initialProj.title);
  const [repoUrl, setRepoUrl] = useState(initialProj.repoUrl);
  const [projectDescription, setProjectDescription] = useState(initialProj.description);
  const [techStack, setTechStack] = useState(initialProj.techStack || []);
  const [tracks, setTracks] = useState(initialProj.tracks || ['Campus Life & EdTech', 'GenAI & Agents']);

  // UI States
  const [newSkill, setNewSkill] = useState('');
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'top', 'virtual', 'in-person'
  const [searchQuery, setSearchQuery] = useState('');
  const [matchResults, setMatchResults] = useState([]);
  const [expandedMatchId, setExpandedMatchId] = useState(null); // Progressive disclosure
  const [copiedRepo, setCopiedRepo] = useState(false);

  // New Project Form State
  const [createTitle, setCreateTitle] = useState('');
  const [createRepo, setCreateRepo] = useState('');
  const [createDesc, setCreateDesc] = useState('');
  const [createTechStack, setCreateTechStack] = useState(['React', 'Node.js', 'Python']);
  const [createTracks, setCreateTracks] = useState(['GenAI & Agents', 'Campus Life & EdTech']);
  const [customTechInput, setCustomTechInput] = useState('');

  // Persist projects
  const saveProjectsToStorage = (updated) => {
    setProjects(updated);
    try {
      localStorage.setItem('mycampus_projects_v1', JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed to save projects to localStorage', err);
    }
  };

  // Match runner
  const executeMatch = (currentTitle, currentDesc, currentStack, currentTracks) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const results = matchProjectToHackathons({
        title: currentTitle,
        description: currentDesc,
        techStack: currentStack,
        tracks: currentTracks
      });
      setMatchResults(results);
      if (results.length > 0) {
        setExpandedMatchId(results[0].hackathon.id); // Expand #1 match by default
      }
      setIsAnalyzing(false);
    }, 280);
  };

  useEffect(() => {
    executeMatch(projectTitle, projectDescription, techStack, tracks);
  }, []);

  const handleSelectProject = (proj, idx) => {
    setActiveProjectIndex(idx);
    setProjectTitle(proj.title);
    setRepoUrl(proj.repoUrl || 'https://github.com/myteam/project');
    setProjectDescription(proj.description);
    setTechStack(proj.techStack || []);
    setTracks(proj.tracks || ['Open Innovation', 'Full Stack']);
    executeMatch(proj.title, proj.description, proj.techStack || [], proj.tracks || []);
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkill.trim() || techStack.includes(newSkill.trim())) return;
    const updated = [...techStack, newSkill.trim()];
    setTechStack(updated);
    setNewSkill('');
    setIsAddingSkill(false);

    const updatedProjects = projects.map((p, idx) => 
      idx === activeProjectIndex ? { ...p, techStack: updated } : p
    );
    saveProjectsToStorage(updatedProjects);
    executeMatch(projectTitle, projectDescription, updated, tracks);
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updated = techStack.filter(s => s !== skillToRemove);
    setTechStack(updated);

    const updatedProjects = projects.map((p, idx) => 
      idx === activeProjectIndex ? { ...p, techStack: updated } : p
    );
    saveProjectsToStorage(updatedProjects);
    executeMatch(projectTitle, projectDescription, updated, tracks);
  };

  const handleCreateProjectSubmit = (e) => {
    e.preventDefault();
    if (!createTitle.trim()) return;

    const newProject = {
      id: `proj_${Date.now()}`,
      title: createTitle.trim(),
      repoUrl: createRepo.trim() || 'https://github.com/myteam/new-project',
      description: createDesc.trim() || 'Custom student innovation project created for hackathons.',
      techStack: createTechStack.length > 0 ? createTechStack : ['React', 'JavaScript'],
      tracks: createTracks.length > 0 ? createTracks : ['Open Innovation'],
      isCustom: true,
      createdAt: new Date().toISOString()
    };

    const updatedProjects = [newProject, ...projects];
    saveProjectsToStorage(updatedProjects);

    // Activate newly created project
    setActiveProjectIndex(0);
    setProjectTitle(newProject.title);
    setRepoUrl(newProject.repoUrl);
    setProjectDescription(newProject.description);
    setTechStack(newProject.techStack);
    setTracks(newProject.tracks);
    executeMatch(newProject.title, newProject.description, newProject.techStack, newProject.tracks);

    // Reset & close
    setCreateTitle('');
    setCreateRepo('');
    setCreateDesc('');
    setIsCreateModalOpen(false);
    triggerConfetti(true);
  };

  const handleDeleteProject = (idxToDelete) => {
    if (projects.length <= 1) return;
    const projToDelete = projects[idxToDelete];
    if (!confirm(`Delete project "${projToDelete.title}"?`)) return;

    const updated = projects.filter((_, idx) => idx !== idxToDelete);
    saveProjectsToStorage(updated);
    const nextIdx = Math.max(0, idxToDelete - 1);
    handleSelectProject(updated[nextIdx], nextIdx);
  };

  const handleSaveEditProject = () => {
    const updatedProjects = projects.map((p, idx) => {
      if (idx === activeProjectIndex) {
        return {
          ...p,
          title: projectTitle,
          repoUrl,
          description: projectDescription,
          techStack,
          tracks
        };
      }
      return p;
    });
    saveProjectsToStorage(updatedProjects);
    setIsEditModalOpen(false);
    executeMatch(projectTitle, projectDescription, techStack, tracks);
  };

  const handleCopyRepo = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(repoUrl);
      setCopiedRepo(true);
      setTimeout(() => setCopiedRepo(false), 2000);
    }
  };

  const handleAddToSchedule = (matchedItem) => {
    const hack = matchedItem.hackathon;
    addEvent({
      name: hack.name,
      organizer: hack.organizer,
      category: 'Hackathon',
      date: hack.dates.includes('Oct') ? '2026-10-24' : hack.dates.includes('Nov') ? '2026-11-14' : '2026-12-04',
      endDate: hack.dates.includes('Oct') ? '2026-10-25' : hack.dates.includes('Nov') ? '2026-11-16' : '2026-12-06',
      time: '09:00 AM - 06:00 PM',
      venue: hack.mode,
      locationType: hack.mode.includes('Virtual') ? 'Virtual' : 'In-Person',
      fee: 'Free',
      eligibility: hack.eligibility,
      registrationDeadline: `${hack.deadline}T23:59`,
      sourceUrl: 'https://devfolio.co/hackathons',
      sourceType: 'Hackathon Matcher',
      status: 'Registered',
      description: `Matched to project "${projectTitle}" (${matchedItem.matchScore}% fit). Recommended Track: ${matchedItem.recommendedTrack}.`,
      prizePool: hack.prize,
      tags: hack.tracks,
      checklist: [
        { id: `c-match-1`, text: `Register team under track: "${matchedItem.recommendedTrack}"`, completed: true },
        { id: `c-match-2`, text: 'Adapt README architecture & pitch deck for track criteria', completed: false },
        { id: `c-match-3`, text: `Brush up on suggested stack: ${matchedItem.missingSkills.join(', ') || 'Core Stack'}`, completed: false }
      ]
    });
    triggerConfetti(true);
    setActiveTab('today');
  };

  // Filtered Hackathons with Search
  const displayedMatches = useMemo(() => {
    let list = matchResults;
    if (filterMode === 'top') list = list.filter(m => m.matchScore >= 85);
    if (filterMode === 'virtual') list = list.filter(m => m.hackathon.mode.toLowerCase().includes('virtual') || m.hackathon.mode.toLowerCase().includes('online'));
    if (filterMode === 'in-person') list = list.filter(m => m.hackathon.mode.toLowerCase().includes('in-person'));

    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(m => 
        m.hackathon.name.toLowerCase().includes(q) ||
        m.hackathon.organizer.toLowerCase().includes(q) ||
        m.recommendedTrack.toLowerCase().includes(q) ||
        (m.hackathon.tracks || []).some(t => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [matchResults, filterMode, searchQuery]);

  const topMatch = matchResults[0];
  const activeProjObj = projects[activeProjectIndex] || initialProj;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-enter">
      
      {/* ── 1. REFINED HEADER WITH HERO "ADD YOUR PROJECT" ACTION ── */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-600 dark:text-volt-400">
            Hackathon Synergy Engine · Problem Statement 4
          </span>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-slate-900 dark:text-white leading-[1.05]">
              Match your codebase to top prize tracks.
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 max-w-xl">
              Connect your team's project to analyze framework compatibility and target the highest-probability hackathons.
            </p>
          </div>

          {/* HIGHLIGHTED HERO ACTION BUTTON: ADD YOUR PROJECT */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="group relative inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-display font-extrabold text-sm shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-200 transform hover:-translate-y-0.5 shrink-0 self-start lg:self-auto cursor-pointer"
          >
            <span className="w-6 h-6 rounded-xl bg-slate-950/15 flex items-center justify-center text-slate-950">
              <FolderPlus className="w-4 h-4 stroke-[2.5]" />
            </span>
            <span className="tracking-tight text-slate-950">Add Your Project</span>
            <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-md bg-slate-950 text-emerald-400 shadow-2xs">
              New
            </span>
          </button>
        </div>
      </div>

      {/* ── 2. TWO-COLUMN WORKSPACE: ACTIVE PROJECT + LIVE SYNERGY OVERVIEW ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-8 items-start">
        
        {/* Left Column (8 cols): Clean Active Project Dossier */}
        <div className="lg:col-span-8 card-premium p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
          
          {/* Project Switcher Bar */}
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3 flex-wrap">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1 shrink-0">
                Active Project:
              </span>
              {projects.map((proj, idx) => {
                const isSelected = activeProjectIndex === idx;
                return (
                  <div key={proj.id || idx} className="relative group shrink-0">
                    <button
                      onClick={() => handleSelectProject(proj, idx)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-slate-900 text-white dark:bg-volt-400 dark:text-slate-950 shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Code2 className="w-3 h-3" />
                      <span className="truncate max-w-[130px]">{proj.title.split(':')[0]}</span>
                      {proj.isCustom && (
                        <span className="text-[9px] uppercase font-mono px-1 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-300">
                          Custom
                        </span>
                      )}
                    </button>

                    {proj.isCustom && projects.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProject(idx);
                        }}
                        className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-500 text-white hidden group-hover:flex items-center justify-center text-[9px] shadow"
                        title="Delete project"
                      >
                        ×
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setIsEditModalOpen(true)}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-emerald-600 dark:hover:text-volt-400 transition"
              title="Edit title and details"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit Details</span>
            </button>
          </div>

          {/* Project Header & Repository */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {activeProjObj.isCustom ? 'Custom Repository' : 'Anchor Project'}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Team VANGUARD</span>
                </div>
                <h2 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white leading-snug">
                  {projectTitle}
                </h2>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <a
                  href={repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700"
                  title="Open GitHub repository"
                >
                  <GitBranch className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate max-w-[180px]">{repoUrl.replace('https://github.com/', '')}</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>

                <button
                  type="button"
                  onClick={handleCopyRepo}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition border border-slate-200 dark:border-slate-700"
                  title={copiedRepo ? 'Copied!' : 'Copy repo link'}
                >
                  {copiedRepo ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              {projectDescription}
            </p>
          </div>

          {/* Tech Stack Chips (Compact, Sleek, Interactive) */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-emerald-600 dark:text-volt-400" />
                Detected Stack ({techStack.length})
              </span>
              <span className="text-[10px] text-slate-400">Click × to remove</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {techStack.map(skill => {
                const style = getSkillStyle(skill);
                return (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold border transition"
                    style={{
                      backgroundColor: style.bg,
                      borderColor: `${style.dot}30`,
                      color: style.text
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: style.dot }} />
                    <span>{skill}</span>
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:opacity-75 p-0.5 ml-0.5"
                      title={`Remove ${skill}`}
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                );
              })}

              {!isAddingSkill ? (
                <button
                  onClick={() => setIsAddingSkill(true)}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 hover:border-slate-400 hover:text-slate-800 dark:hover:text-white"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add skill</span>
                </button>
              ) : (
                <form onSubmit={handleAddSkill} className="inline-flex items-center gap-1">
                  <input
                    type="text"
                    autoFocus
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="e.g. PyTorch"
                    className="w-24 px-2 py-0.5 text-xs rounded-md bg-white dark:bg-slate-900 border border-emerald-500 text-slate-900 dark:text-white outline-none"
                  />
                  <button type="submit" className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-700">
                    <Check className="w-2.5 h-2.5" />
                  </button>
                  <button type="button" onClick={() => setIsAddingSkill(false)} className="p-1 text-slate-400">
                    <X className="w-2.5 h-2.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Target Domains */}
          <div className="pt-2 flex items-center gap-2 flex-wrap text-xs text-slate-500 dark:text-slate-400">
            <span className="font-bold text-[11px] uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Target className="w-3 h-3 text-emerald-500" />
              Tracks:
            </span>
            {tracks.map((trk, i) => (
              <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-medium text-slate-700 dark:text-slate-300 text-[11px]">
                {trk}
              </span>
            ))}
          </div>

        </div>

        {/* Right Column (4 cols): LIVE SYNERGY & PRIZE OVERVIEW */}
        <div className="lg:col-span-4 rounded-3xl p-5 sm:p-6 bg-slate-900 text-white dark:bg-slate-900/90 border border-slate-800 shadow-xl shadow-slate-950/20 flex flex-col justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Synergy Matrix
              </span>
              <span className="text-[10px] text-slate-400 font-mono">PS 4 Engine</span>
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-display font-black text-white tabular-nums">
                  {topMatch ? `${topMatch.matchScore}%` : '92%'}
                </span>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Peak Fit
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-volt-400 rounded-full transition-all duration-500" 
                  style={{ width: `${topMatch ? topMatch.matchScore : 92}%` }}
                />
              </div>

              <p className="text-xs text-slate-400 mt-2 truncate">
                {topMatch ? `Top track: ${topMatch.recommendedTrack}` : 'Evaluating hackathon tracks…'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Prize Pool</span>
                <span className="text-xs font-bold text-amber-400 mt-0.5 block">₹3,50,000+</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Hackathons</span>
                <span className="text-xs font-bold text-white mt-0.5 block">{matchResults.length} Open</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => executeMatch(projectTitle, projectDescription, techStack, tracks)}
            disabled={isAnalyzing}
            className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Re-scoring…' : 'Re-calculate Fit'}</span>
          </button>
        </div>

      </div>

      {/* ── 3. CURATED HACKATHON MATCHES STREAM WITH SEARCH & FILTERS ── */}
      <section aria-label="Curated Hackathon Matches">
        
        {/* Controls Bar: Title & Search + Filter Pills */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <h2 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white">
              Matched Hackathons
            </h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {displayedMatches.length}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:flex-initial">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search hackathons, tracks…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8 pr-7 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:border-emerald-500 outline-none w-full sm:w-56 shadow-2xs"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs shrink-0">
              {[
                { id: 'all', label: 'All' },
                { id: 'top', label: 'Top Fit' },
                { id: 'in-person', label: 'In-Person' },
                { id: 'virtual', label: 'Virtual' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilterMode(tab.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    filterMode === tab.id
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading Spinner */}
        {isAnalyzing && (
          <div className="card-premium p-8 text-center space-y-2 animate-pulse">
            <RefreshCw className="w-6 h-6 text-emerald-600 dark:text-volt-400 mx-auto animate-spin" />
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
              Recalculating hackathon compatibility…
            </p>
          </div>
        )}

        {/* Empty Search Result */}
        {!isAnalyzing && displayedMatches.length === 0 && (
          <div className="card p-10 text-center space-y-2">
            <p className="text-3xl">🔎</p>
            <h3 className="font-display font-bold text-base text-slate-800 dark:text-slate-200">
              No hackathons match "{searchQuery}"
            </h3>
            <p className="text-xs text-slate-400">
              Try searching for different keywords, frameworks, or clearing filters.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setFilterMode('all'); }}
              className="btn btn-secondary text-xs mt-2"
            >
              Reset filters
            </button>
          </div>
        )}

        {/* Stream of Streamlined Hackathon Cards */}
        {!isAnalyzing && displayedMatches.length > 0 && (
          <div className="space-y-3">
            {displayedMatches.map((result, idx) => {
              const hack = result.hackathon;
              const isFirst = idx === 0 && filterMode === 'all' && !searchQuery;
              const isExpanded = expandedMatchId === hack.id;

              return (
                <article
                  key={hack.id}
                  className={`card-premium p-4 sm:p-5 transition-all duration-200 border ${
                    isFirst 
                      ? 'border-emerald-500/50 dark:border-volt-400/50 shadow-md ring-1 ring-emerald-500/20' 
                      : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  
                  {/* Clean Main Row: Everything Scannable in 1 glance */}
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    
                    {/* Left: Score Badge + Title + Meta */}
                    <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                      
                      {/* Match Score Dial */}
                      <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white dark:bg-slate-800 flex flex-col items-center justify-center shrink-0 shadow-xs border border-slate-800">
                        <span className="font-display font-black text-xl leading-none text-emerald-400 dark:text-volt-400 tabular-nums">
                          {result.matchScore}<span className="text-xs font-normal">%</span>
                        </span>
                        <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                          Match
                        </span>
                      </div>

                      {/* Hackathon Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {hack.mode}
                          </span>
                          <span className="text-xs text-slate-400 truncate">
                            by {hack.organizer}
                          </span>
                          {isFirst && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-volt-400 border border-emerald-500/30">
                              <Flame className="w-3 h-3" /> #1 Match
                            </span>
                          )}
                        </div>

                        <h3 className="font-display font-extrabold text-lg text-slate-900 dark:text-white leading-snug truncate">
                          {hack.name}
                        </h3>

                        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{hack.dates}</span>
                          </span>
                          <span className="inline-flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">
                            <Trophy className="w-3 h-3 text-amber-500" />
                            <span>{hack.prize}</span>
                          </span>
                          <span className="text-emerald-700 dark:text-volt-400 font-semibold text-xs">
                            🎯 {result.recommendedTrack}
                          </span>
                        </div>
                      </div>

                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                      
                      {/* Direct 1-Click Google Calendar */}
                      <button
                        type="button"
                        onClick={() => openInGoogleCalendar({
                          name: hack.name,
                          date: hack.dates.includes('Oct') ? '2026-10-24' : hack.dates.includes('Nov') ? '2026-11-14' : '2026-12-04',
                          endDate: hack.dates.includes('Oct') ? '2026-10-25' : hack.dates.includes('Nov') ? '2026-11-16' : '2026-12-06',
                          venue: hack.mode,
                          description: `Target Track: ${result.recommendedTrack}\nPrize: ${hack.prize}\nOrganized by: ${hack.organizer}`,
                          category: 'Hackathon',
                          sourceUrl: 'https://devfolio.co/hackathons'
                        })}
                        className="btn btn-secondary text-xs !py-2 !px-2.5 inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 border-blue-200/60 dark:border-blue-900/40 cursor-pointer"
                        title="Add to Google Calendar"
                        aria-label="Add to Google Calendar"
                      >
                        <Calendar className="w-3.5 h-3.5 text-blue-500" />
                        <span className="hidden sm:inline">Google Cal</span>
                      </button>

                      <button
                        onClick={() => setExpandedMatchId(isExpanded ? null : hack.id)}
                        className="btn btn-secondary text-xs !py-2 !px-3 inline-flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                        aria-expanded={isExpanded}
                      >
                        <span>{isExpanded ? 'Less' : 'Why fit?'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => handleAddToSchedule(result)}
                        className="btn btn-primary text-xs !py-2 !px-4 shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Add to Journey</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>

                  {/* Progressive Disclosure: Accordion Fit Breakdown */}
                  {isExpanded && (
                    <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-3.5 animate-enter text-xs">
                      
                      <div className="md:col-span-8 space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                          Fit Analysis for {projectTitle.split(':')[0]}:
                        </span>
                        {result.fitReasons.map((reason, rIdx) => (
                          <div key={rIdx} className="flex items-start gap-1.5 text-slate-700 dark:text-slate-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-volt-400 shrink-0 mt-0.5" />
                            <span>{reason}</span>
                          </div>
                        ))}
                      </div>

                      <div className="md:col-span-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                            Target Track
                          </span>
                          <span className="text-xs font-bold text-emerald-700 dark:text-volt-400">
                            {result.recommendedTrack}
                          </span>
                        </div>

                        {result.missingSkills && result.missingSkills.length > 0 && (
                          <div className="pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                              Stack Edge:
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {result.missingSkills.map((gap, gIdx) => (
                                <span key={gIdx} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                  {gap}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                </article>
              );
            })}
          </div>
        )}

      </section>

      {/* ── 4. REGISTER NEW PROJECT MODAL ────────────────────── */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in" onClick={() => setIsCreateModalOpen(false)}>
          <div
            className="w-full max-w-xl rounded-[32px] bg-white/85 dark:bg-slate-900/80 backdrop-blur-3xl border border-white/80 dark:border-white/18 shadow-2xl overflow-hidden p-6 sm:p-7 space-y-4 animate-pop max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-volt-400 flex items-center justify-center">
                  <FolderPlus className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-xl text-slate-900 dark:text-white">
                    Register New Project
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Add your codebase to calculate live hackathon track compatibility
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(false)} 
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProjectSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aura: AI Campus Assistant for Blind Students"
                  value={createTitle}
                  onChange={e => setCreateTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  GitHub Repository / Pitch Deck Link
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/myteam/aura-campus"
                  value={createRepo}
                  onChange={e => setCreateRepo(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Project Description & Core Value
                </label>
                <textarea
                  rows={2}
                  placeholder="What does your project do and which problem does it solve?..."
                  value={createDesc}
                  onChange={e => setCreateDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                />
              </div>

              {/* Tech Stack Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Tech Stack & Frameworks ({createTechStack.length} selected)
                </label>
                
                <div className="flex flex-wrap gap-1 mb-2">
                  {POPULAR_SKILLS.map(skill => {
                    const isSelected = createTechStack.includes(skill);
                    return (
                      <button
                        type="button"
                        key={skill}
                        onClick={() => {
                          if (isSelected) {
                            setCreateTechStack(createTechStack.filter(s => s !== skill));
                          } else {
                            setCreateTechStack([...createTechStack, skill]);
                          }
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                          isSelected
                            ? 'bg-slate-900 text-white dark:bg-volt-400 dark:text-slate-950'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        <span>{skill}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customTechInput}
                    onChange={e => setCustomTechInput(e.target.value)}
                    placeholder="Add custom library or framework…"
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (customTechInput.trim() && !createTechStack.includes(customTechInput.trim())) {
                          setCreateTechStack([...createTechStack, customTechInput.trim()]);
                          setCustomTechInput('');
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customTechInput.trim() && !createTechStack.includes(customTechInput.trim())) {
                        setCreateTechStack([...createTechStack, customTechInput.trim()]);
                        setCustomTechInput('');
                      }
                    }}
                    className="btn btn-secondary text-xs !py-1.5 !px-3 cursor-pointer"
                  >
                    + Add
                  </button>
                </div>
              </div>

              {/* Target Tracks */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Target Tracks & Domains
                </label>
                <div className="flex flex-wrap gap-1">
                  {AVAILABLE_TRACKS.map(trk => {
                    const isSelected = createTracks.includes(trk);
                    return (
                      <button
                        type="button"
                        key={trk}
                        onClick={() => {
                          if (isSelected) {
                            setCreateTracks(createTracks.filter(t => t !== trk));
                          } else {
                            setCreateTracks([...createTracks, trk]);
                          }
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-600 text-white dark:bg-emerald-500 font-bold'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        {trk}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="btn btn-secondary text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary text-xs !py-2.5 !px-5 shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Create & Run Matcher</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 5. EDIT PROJECT DETAILS MODAL ────────────────────── */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in" onClick={() => setIsEditModalOpen(false)}>
          <div
            className="w-full max-w-lg rounded-[32px] bg-white/85 dark:bg-slate-900/80 backdrop-blur-3xl border border-white/80 dark:border-white/18 shadow-2xl overflow-hidden p-6 sm:p-7 space-y-4 animate-pop"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-emerald-600 dark:text-volt-400" />
                <h3 className="font-display font-extrabold text-xl text-slate-900 dark:text-white">
                  Customize Project Profile
                </h3>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Project Name</label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={e => setProjectTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">GitHub URL</label>
                <input
                  type="url"
                  value={repoUrl}
                  onChange={e => setRepoUrl(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs font-mono rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Short Description</label>
                <textarea
                  rows={3}
                  value={projectDescription}
                  onChange={e => setProjectDescription(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="btn btn-secondary text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEditProject}
                className="btn btn-primary text-xs cursor-pointer"
              >
                Save & Re-Score
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
