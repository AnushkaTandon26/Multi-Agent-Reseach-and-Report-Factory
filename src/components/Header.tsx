'use client';

import React from 'react';
import {
  Sparkles,
  Sliders,
  Play,
  StopCircle,
  Flame,
  ShieldAlert,
  Compass,
  Search,
  BookOpen,
  ShieldCheck,
  PenTool,
  Zap,
  HelpCircle,
} from 'lucide-react';
import { ResearchWorkflowState, ResearchDepth, ReportPersona, SearchScope } from '../lib/types';
import { NavView } from './Sidebar';

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
  currentView: NavView;
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
  currentView,
}) => {
  const isRunning = state.status === 'running';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isRunning && topicInput.trim()) {
      onStart();
    }
  };

  const viewTitles: Record<NavView, string> = {
    floor: 'Autonomous Research Floor',
    planner: 'Stage 1 · Strategic Planner',
    searcher: 'Stage 2 · Literature Scout',
    reader: 'Stage 3 · Deep Reader',
    critic: 'Stage 4 · Epistemic Critic',
    report: 'Stage 5 · Executive Synthesizer',
    logs: 'Telemetry & Message Bus Logs',
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-800/80 bg-[#090D16]/95 backdrop-blur-md px-4 sm:px-6 py-2.5 shadow-md">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Left Section: Logo, Product Name & View Breadcrumb */}
        <div className="flex items-center justify-between sm:justify-start gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            {/* Logo Mark: Hexagonal Multi-Agent Glyph */}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-md shadow-indigo-500/25 border border-indigo-400/30">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm tracking-tight text-slate-100">
                  Research Factory
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                  v2.0
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-normal hidden sm:block">
                Autonomous Multi-Agent Intelligence Engine
              </p>
            </div>
          </div>

          <div className="h-5 w-px bg-slate-800 hidden sm:block" />

          {/* Current View Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-mono hidden md:inline">View:</span>
            <span className="font-semibold text-slate-200 truncate max-w-[200px]">
              {viewTitles[currentView]}
            </span>
            {isRunning && state.activeAgent && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/15 text-amber-300 border border-amber-500/30 animate-pulse shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                {state.activeAgent.toUpperCase()} ACTIVE
              </span>
            )}
          </div>
        </div>

        {/* Center/Right Section: Search Bar & Research Controls */}
        <form onSubmit={handleSubmit} className="flex-1 max-w-4xl flex flex-wrap sm:flex-nowrap items-center gap-2">
          <div className="relative flex-1 min-w-[240px]">
            <input
              type="text"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              placeholder="Enter complex research topic, thesis, or technological domain..."
              disabled={isRunning}
              aria-label="Research topic input"
              className="w-full bg-slate-900/90 text-xs sm:text-sm text-slate-100 placeholder-slate-500 pl-3.5 pr-20 py-2 rounded-lg border border-slate-700/70 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all disabled:opacity-60 shadow-inner"
            />
            <button
              type="button"
              onClick={onOpenPresets}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2 py-1 text-[11px] font-medium text-slate-400 hover:text-indigo-300 hover:bg-indigo-950/40 rounded-md transition-colors border border-transparent hover:border-indigo-800/40"
              title="Open curated research topic presets"
            >
              ⚡ Presets
            </button>
          </div>

          {/* Persona / Tone Selector */}
          <select
            value={persona}
            onChange={(e) => setPersona(e.target.value as ReportPersona)}
            disabled={isRunning}
            aria-label="Target persona and tone"
            className="bg-slate-900 text-xs text-slate-200 px-2.5 py-2 rounded-lg border border-slate-700/70 focus:outline-none focus:border-blue-500 shrink-0 font-medium"
            title="Select target report tone and persona"
          >
            <option value="executive">👔 Executive Brief</option>
            <option value="academic">🎓 Academic Survey</option>
            <option value="investment">💼 VC / Investment Memo</option>
            <option value="technical">🛠️ Technical Architecture</option>
          </select>

          {/* Red Team Adversarial Mode Toggle */}
          <button
            type="button"
            onClick={() => setRedTeamMode(!redTeamMode)}
            disabled={isRunning}
            aria-label="Toggle Red Team adversarial mode"
            className={`flex items-center gap-1 px-2.5 py-2 rounded-lg text-xs font-semibold border transition-all shrink-0 ${
              redTeamMode
                ? 'bg-rose-950/80 text-rose-300 border-rose-600/60 shadow-sm shadow-rose-950/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
            title="Toggle Adversarial Red Team stress-testing mode"
          >
            <Flame className={`w-3.5 h-3.5 ${redTeamMode ? 'text-rose-400 animate-pulse' : 'text-slate-500'}`} />
            <span className="hidden sm:inline">Red Team</span>
          </button>

          {/* Depth Selector Chips */}
          <div className="hidden sm:flex bg-slate-900/90 rounded-lg p-0.5 border border-slate-700/70 text-xs font-medium shrink-0">
            {(['quick', 'standard', 'deep'] as ResearchDepth[]).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDepth(d)}
                disabled={isRunning}
                className={`px-2 py-1 rounded capitalize transition-all text-xs ${
                  depth === d
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Run / Stop Button */}
          {isRunning ? (
            <button
              type="button"
              onClick={onStop}
              className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg transition-all shadow-md shadow-rose-600/20 animate-pulse border border-rose-400/30 shrink-0"
              title="Abort current multi-agent workflow"
            >
              <StopCircle className="w-3.5 h-3.5" />
              <span>Abort</span>
            </button>
          ) : (
            <button
              type="submit"
              disabled={!topicInput.trim()}
              className="flex items-center gap-1.5 px-4.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-lg transition-all shadow-md shadow-blue-600/25 disabled:opacity-50 disabled:cursor-not-allowed border border-blue-400/30 active:scale-95 shrink-0"
              title="Launch 5-agent research pipeline"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Launch</span>
            </button>
          )}

          {/* Config Modal Trigger */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="flex items-center gap-1 px-2.5 py-2 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-xs font-medium text-slate-300 hover:text-white border border-slate-700/70 transition-all shrink-0"
            title="Configure AI Models, API Keys & System Prompts"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden xl:inline">Config</span>
          </button>
        </form>
      </div>
    </header>
  );
};
