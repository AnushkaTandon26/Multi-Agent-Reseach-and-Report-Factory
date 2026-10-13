'use client';

import React from 'react';
import {
  Sparkles,
  Sliders,
  Play,
  StopCircle,
  Flame,
  Search,
  ChevronDown,
  UploadCloud,
  Bookmark,
  Compass,
  BookOpen,
  ShieldCheck,
  PenTool,
  Terminal,
  LayoutDashboard,
  FileText,
  Repeat,
  Sun,
  Moon,
  Globe,
} from 'lucide-react';
import { ResearchWorkflowState, ResearchDepth, ReportPersona, SearchScope } from '../lib/types';
import { NavView } from './Sidebar';
import { usePreferences } from '../context/PreferencesContext';

interface HeaderProps {
  state: ResearchWorkflowState;
  topicInput: string;
  setTopicInput: (val: string) => void;
  depth: ResearchDepth;
  setDepth: (depth: ResearchDepth) => void;
  persona: ReportPersona;
  setPersona: (persona: ReportPersona) => void;
  searchScope: SearchScope;
  setSearchScope: (scope: SearchScope) => void;
  redTeamMode: boolean;
  setRedTeamMode: (mode: boolean) => void;
  onStart: () => void;
  onStop: () => void;
  onOpenSettings: () => void;
  onOpenPresets: () => void;
  onOpenLibrary: () => void;
  onOpenUploader: () => void;
  currentView: NavView;
  setCurrentView: (view: NavView) => void;
}

export const Header: React.FC<HeaderProps> = ({
  state,
  topicInput,
  setTopicInput,
  depth,
  setDepth,
  persona,
  setPersona,
  searchScope,
  setSearchScope,
  redTeamMode,
  setRedTeamMode,
  onStart,
  onStop,
  onOpenSettings,
  onOpenPresets,
  onOpenLibrary,
  onOpenUploader,
  currentView,
  setCurrentView,
}) => {
  const { theme, setTheme, t } = usePreferences();
  const isRunning = state.status === 'running';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isRunning && topicInput.trim()) {
      onStart();
    }
  };

  const viewOptions: { id: NavView; label: string; icon: React.ReactNode }[] = [
    { id: 'floor', label: 'Overview', icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
    { id: 'planner', label: 'Planner', icon: <Compass className="w-3.5 h-3.5 text-[#6366F1]" /> },
    { id: 'searcher', label: 'Scout', icon: <Search className="w-3.5 h-3.5 text-[#06B6D4]" /> },
    { id: 'reader', label: 'Reader', icon: <BookOpen className="w-3.5 h-3.5 text-[#F59E0B]" /> },
    { id: 'critic', label: 'Critic', icon: <ShieldCheck className="w-3.5 h-3.5 text-[#EF4444]" /> },
    { id: 'report', label: 'Whitepaper', icon: <FileText className="w-3.5 h-3.5 text-[#A855F7]" /> },
    { id: 'logs', label: 'Message Bus Logs', icon: <Terminal className="w-3.5 h-3.5 text-gray-700" /> },
  ];

  return (
    <div className="w-full bg-white border-b border-[#E5E7EB] sticky top-0 z-20 shadow-xs no-print">
      {/* 1. Main Top Navbar (White, 72px) */}
      <header className="h-[72px] px-4 sm:px-6 flex items-center justify-between gap-4 border-b border-[#E5E7EB]">
        {/* Logo left */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-[#151A17] flex items-center justify-center shadow-xs">
            <svg
              className="w-5 h-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-[#14181F] tracking-tight">
                Research Factory
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#EAD5FF] text-[#581C87] font-semibold border border-[#D8B4FE]">
                PRO SAAS
              </span>
            </div>
            <p className="text-xs text-[#6B7280] hidden sm:block">
              Autonomous 5-Agent Intelligence Platform
            </p>
          </div>
        </div>

        {/* Center: System Status Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F1F2F4] border border-[#E5E7EB] text-xs font-medium">
          <span
            className={`w-2 h-2 rounded-full ${
              isRunning ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
            }`}
          />
          <span className="text-[#14181F]">
            {isRunning ? (
              <>
                Running:{' '}
                <strong className="capitalize text-[#2563EB]">
                  {state.activeAgent || 'Agents'} Active
                </strong>
              </>
            ) : (
              'System Ready • 5 Agents Idle'
            )}
          </span>
          {state.replanHistory && state.replanHistory.length > 0 && (
            <span className="ml-1 text-[10px] font-mono bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-300 flex items-center gap-1 font-semibold">
              <Repeat className="w-2.5 h-2.5" /> {state.replanHistory.length} Replan Loops
            </span>
          )}
        </div>

        {/* Right Section: Outline Pill Actions & Dark Launch Pill */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* BYOD Files Vault Pill */}
          <button
            type="button"
            onClick={onOpenUploader}
            className="hidden sm:flex items-center gap-1.5 h-[42px] px-3.5 rounded-full bg-white border border-[#D1D5DB] hover:border-[#14181F] text-xs font-semibold text-[#14181F] transition-all hover:bg-[#F8FAFC]"
            title="Upload Custom Data Files (PDF, CSV, TXT)"
          >
            <UploadCloud className="w-4 h-4 text-[#16A34A]" />
            <span>BYOD</span>
            {state.customDocuments.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono flex items-center justify-center font-bold">
                {state.customDocuments.length}
              </span>
            )}
          </button>

          {/* Report Archive Pill */}
          <button
            type="button"
            onClick={onOpenLibrary}
            className="hidden sm:flex items-center gap-1.5 h-[42px] px-3.5 rounded-full bg-white border border-[#D1D5DB] hover:border-[#14181F] text-xs font-semibold text-[#14181F] transition-all hover:bg-[#F8FAFC]"
            title="Saved Intelligence Library"
          >
            <Bookmark className="w-4 h-4 text-[#2563EB]" />
            <span>Archive</span>
          </button>

          {/* Quick Theme Toggle Pill */}
          <button
            type="button"
            onClick={() => setTheme(theme === 'dark' || theme === 'midnight' ? 'light' : 'dark')}
            className="flex items-center gap-1.5 h-[42px] px-3.5 rounded-full bg-white dark:bg-[#1E293B] border border-[#D1D5DB] dark:border-[#334155] hover:border-[#14181F] text-xs font-semibold text-[#14181F] dark:text-white transition-all hover:bg-[#F8FAFC]"
            title={`Toggle Theme (Current: ${theme})`}
          >
            {theme === 'dark' || theme === 'midnight' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
            <span className="hidden lg:inline capitalize">{theme}</span>
          </button>

          {/* Config / Settings Pill */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 h-[42px] px-3.5 rounded-full bg-white dark:bg-[#1E293B] border border-[#D1D5DB] dark:border-[#334155] hover:border-[#14181F] text-xs font-semibold text-[#14181F] dark:text-white transition-all hover:bg-[#F8FAFC]"
            title="Model Config, Themes, Fonts & Languages"
          >
            <Sliders className="w-4 h-4 text-[#6B7280] dark:text-gray-300" />
            <span className="hidden md:inline">{t('config')}</span>
          </button>

          {/* Launch / Abort Action Pill */}
          {isRunning ? (
            <button
              type="button"
              onClick={onStop}
              className="flex items-center gap-2 h-[42px] px-5 rounded-full bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold transition-all shadow-sm active:scale-95"
            >
              <StopCircle className="w-4 h-4 animate-spin" />
              <span>Abort</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onStart}
              disabled={!topicInput.trim()}
              className="flex items-center gap-2 h-[42px] px-5 rounded-full bg-[#151A17] hover:bg-[#262E29] text-white text-xs font-bold transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Launch</span>
            </button>
          )}
        </div>
      </header>

      {/* 2. Light-Gray (#F1F2F4) Sub-Bar with Breadcrumbs / View Switcher */}
      <div className="h-[46px] bg-[#F1F2F4] px-4 sm:px-6 flex items-center justify-between border-b border-[#E5E7EB] overflow-x-auto text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-[#6B7280] font-semibold text-[11px] uppercase tracking-wider mr-1 hidden sm:inline">
            Views:
          </span>
          {viewOptions.map((v) => {
            const isSelected = currentView === v.id;
            return (
              <button
                key={v.id}
                onClick={() => setCurrentView(v.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all shrink-0 ${
                  isSelected
                    ? 'bg-white text-[#14181F] font-bold shadow-xs border border-[#E5E7EB]'
                    : 'text-[#4B5563] hover:text-[#14181F] hover:bg-white/60 font-medium'
                }`}
              >
                {v.icon}
                <span>{v.label}</span>
              </button>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-3 text-xs text-[#6B7280]">
          {state.topic && (
            <span className="truncate max-w-xs font-medium text-[#14181F]">
              Topic: <em>&ldquo;{state.topic}&rdquo;</em>
            </span>
          )}
          {state.report && (
            <button
              onClick={() => setCurrentView('report')}
              className="text-[#2563EB] hover:underline font-semibold flex items-center gap-1"
            >
              Read Whitepaper &rarr;
            </button>
          )}
        </div>
      </div>

      {/* 3. Controls Row (Filter Row under the Sub-Bar) */}
      <div className="px-4 sm:px-6 py-3 bg-white border-b border-[#E5E7EB]">
        <form onSubmit={handleSubmit} className="flex flex-wrap lg:flex-nowrap items-center gap-2.5 w-full">
          {/* Wide Pill Topic Input */}
          <div className="relative flex-1 min-w-[280px]">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              placeholder="Enter complex research topic, thesis, or technical domain..."
              disabled={isRunning}
              className="w-full h-[44px] pl-10 pr-24 rounded-full border border-[#D1D5DB] focus:border-[#14181F] focus:ring-1 focus:ring-[#14181F] text-xs sm:text-sm text-[#14181F] placeholder-[#9CA3AF] transition-all bg-white disabled:bg-[#F9FAFB]"
            />
            <button
              type="button"
              onClick={onOpenPresets}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 text-[11px] font-semibold text-[#581C87] bg-[#EAD5FF] hover:bg-[#D8B4FE] rounded-full transition-colors border border-[#D8B4FE]"
              title="Browse Curated Topic Presets"
            >
              ⚡ Presets
            </button>
          </div>

          {/* Pill Dropdown: Report Persona */}
          <div className="relative">
            <select
              value={persona}
              onChange={(e) => setPersona(e.target.value as ReportPersona)}
              disabled={isRunning}
              className="h-[44px] appearance-none pl-4 pr-9 rounded-full border border-[#D1D5DB] focus:border-[#14181F] bg-white text-xs font-semibold text-[#14181F] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
            >
              <option value="executive">👔 Executive Brief</option>
              <option value="academic">🎓 Academic Survey</option>
              <option value="investment">💼 Investment Memo</option>
              <option value="technical">🛠️ Technical Specs</option>
            </select>
            <ChevronDown className="w-4 h-4 text-[#6B7280] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Pill Dropdown: Depth */}
          <div className="relative">
            <select
              value={depth}
              onChange={(e) => setDepth(e.target.value as ResearchDepth)}
              disabled={isRunning}
              className="h-[44px] appearance-none pl-4 pr-9 rounded-full border border-[#D1D5DB] focus:border-[#14181F] bg-white text-xs font-semibold text-[#14181F] hover:bg-[#F8FAFC] transition-colors cursor-pointer capitalize"
            >
              <option value="quick">⚡ Quick (4 Sources)</option>
              <option value="standard">🔍 Standard (10 Sources)</option>
              <option value="deep">🔬 Deep (18 Sources)</option>
            </select>
            <ChevronDown className="w-4 h-4 text-[#6B7280] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Red Team Toggle Pill */}
          <button
            type="button"
            onClick={() => setRedTeamMode(!redTeamMode)}
            disabled={isRunning}
            className={`flex items-center gap-1.5 h-[44px] px-4 rounded-full border text-xs font-semibold transition-all shrink-0 ${
              redTeamMode
                ? 'bg-rose-50 border-rose-400 text-rose-700 shadow-xs'
                : 'bg-white border-[#D1D5DB] text-[#6B7280] hover:text-[#14181F] hover:bg-[#F8FAFC]'
            }`}
            title="Enable Adversarial Stress-Testing Mode"
          >
            <Flame className={`w-3.5 h-3.5 ${redTeamMode ? 'text-rose-600 animate-pulse' : 'text-gray-400'}`} />
            <span>Red Team</span>
          </button>

          {/* Run button in filter row */}
          <button
            type="submit"
            disabled={isRunning || !topicInput.trim()}
            className="flex items-center gap-1.5 h-[44px] px-6 rounded-full bg-[#151A17] hover:bg-[#262E29] text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 shrink-0"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Launch Research</span>
          </button>
        </form>
      </div>
    </div>
  );
};
