'use client';

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Compass,
  Search,
  BookOpen,
  ShieldCheck,
  PenTool,
  Terminal,
  Sliders,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Activity,
  CheckCircle2,
  Bookmark,
  UploadCloud,
  FileText,
  AlertCircle,
  Repeat,
} from 'lucide-react';
import { ResearchWorkflowState, AgentType } from '../lib/types';

export type NavView = 'floor' | 'planner' | 'searcher' | 'reader' | 'critic' | 'report' | 'logs';

interface SidebarProps {
  currentView: NavView;
  setCurrentView: (view: NavView) => void;
  state: ResearchWorkflowState;
  onOpenSettings: () => void;
  onOpenPresets: () => void;
  onOpenLibrary: () => void;
  onOpenUploader: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setCurrentView,
  state,
  onOpenSettings,
  onOpenPresets,
  onOpenLibrary,
  onOpenUploader,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isRunning = state.status === 'running';

  const navItems = [
    {
      id: 'floor' as NavView,
      label: 'Research Floor',
      sublabel: 'Overview & Pipeline',
      icon: <LayoutDashboard className="w-4 h-4 text-indigo-400" />,
      badge: isRunning ? 'Active' : state.status === 'completed' ? 'Done' : undefined,
      badgeColor: isRunning ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    },
    {
      id: 'planner' as NavView,
      agentId: 'planner' as AgentType,
      label: '1. Strategic Planner',
      sublabel: 'Scope & Hypotheses',
      icon: <Compass className="w-4 h-4 text-blue-400" />,
      count: state.plan?.subQuestions?.length,
      unit: 'questions',
    },
    {
      id: 'searcher' as NavView,
      agentId: 'searcher' as AgentType,
      label: '2. Literature Scout',
      sublabel: 'Web & Primary Sources',
      icon: <Search className="w-4 h-4 text-emerald-400" />,
      count: state.sources?.length,
      unit: 'sources',
    },
    {
      id: 'reader' as NavView,
      agentId: 'reader' as AgentType,
      label: '3. Deep Reader',
      sublabel: 'Evidence & Metrics',
      icon: <BookOpen className="w-4 h-4 text-amber-400" />,
      count: state.facts?.length,
      unit: 'facts',
    },
    {
      id: 'critic' as NavView,
      agentId: 'critic' as AgentType,
      label: '4. Epistemic Critic',
      sublabel: 'Scorecard & Audits',
      icon: <ShieldCheck className="w-4 h-4 text-rose-400" />,
      count: state.criticReview ? `${state.criticReview.overallCredibilityScore}%` : undefined,
      unit: '',
    },
    {
      id: 'report' as NavView,
      agentId: 'writer' as AgentType,
      label: '5. Synthesized Report',
      sublabel: 'Cited Whitepaper',
      icon: <PenTool className="w-4 h-4 text-purple-400" />,
      count: state.report ? `${state.report.wordCount}w` : undefined,
      unit: '',
    },
    {
      id: 'logs' as NavView,
      label: 'Message Bus Logs',
      sublabel: 'Inter-Agent Telemetry',
      icon: <Terminal className="w-4 h-4 text-cyan-400" />,
      badge: isRunning ? 'Streaming' : undefined,
      badgeColor: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    },
  ];

  return (
    <aside
      className={`bg-[#090D16] border-r border-slate-800/80 flex flex-col h-screen sticky top-0 shrink-0 select-none z-30 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="p-3.5 border-b border-slate-800/80 bg-[#0C1222]/80 flex items-center justify-between">
        {!isCollapsed ? (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-md shadow-indigo-500/20 border border-indigo-400/30 shrink-0">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </div>
            <div className="overflow-hidden">
              <span className="font-extrabold text-xs tracking-tight text-slate-100 block truncate">
                RESEARCH FACTORY
              </span>
              <p className="text-[10px] text-slate-400 font-mono truncate">
                5-Agent Autonomous Floor
              </p>
            </div>
          </div>
        ) : (
          <div className="mx-auto w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md border border-indigo-400/30">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
        )}

        {/* Collapse / Expand Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        {!isCollapsed && (
          <div className="px-2 pb-1.5 text-[10px] font-bold font-mono uppercase tracking-wider text-slate-500">
            Agents &amp; Floor
          </div>
        )}

        {navItems.map((item) => {
          const isSelected = currentView === item.id;
          const agent = item.agentId ? state.agents[item.agentId] : undefined;
          const isAgentRunning = agent?.status === 'running';
          const isAgentCompleted = agent?.status === 'completed';

          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              title={isCollapsed ? `${item.label} - ${item.sublabel}` : undefined}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center p-2' : 'justify-between px-2.5 py-2'} rounded-lg text-left transition-all duration-150 group relative ${
                isSelected
                  ? 'bg-indigo-950/70 text-white border border-indigo-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
              }`}
            >
              {isSelected && (
                <div className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-blue-500 rounded-r" />
              )}

              <div className="flex items-center gap-2.5 overflow-hidden">
                <div
                  className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-blue-600/25 text-white'
                      : 'bg-slate-900 text-slate-400 group-hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {item.icon}
                </div>

                {!isCollapsed && (
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold truncate text-slate-200">
                        {item.label}
                      </span>
                      {isAgentRunning && (
                        <span className="flex h-1.5 w-1.5 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500" />
                        </span>
                      )}
                      {isAgentCompleted && (
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 truncate">
                      {item.sublabel}
                    </p>
                  </div>
                )}
              </div>

              {!isCollapsed && (
                <div className="shrink-0 ml-1">
                  {item.badge ? (
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  ) : item.count !== undefined && item.count !== 0 ? (
                    <span className="text-[10px] font-mono bg-slate-900 text-indigo-300 px-1.5 py-0.2 rounded border border-slate-800">
                      {item.count}
                    </span>
                  ) : null}
                </div>
              )}
            </button>
          );
        })}

        {/* Secondary Tools Section */}
        {!isCollapsed && (
          <div className="pt-3 px-2 pb-1 text-[10px] font-bold font-mono uppercase tracking-wider text-slate-500">
            Workspace Tools
          </div>
        )}

        {/* Custom Docs Vault Button */}
        <button
          onClick={onOpenUploader}
          title={isCollapsed ? 'Upload Custom Documents (BYOD)' : undefined}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center p-2' : 'gap-2.5 px-2.5 py-2'} rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-colors`}
        >
          <div className="w-7 h-7 rounded-md bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 shrink-0">
            <UploadCloud className="w-3.5 h-3.5" />
          </div>
          {!isCollapsed && (
            <div className="text-left overflow-hidden">
              <span className="text-xs font-semibold text-slate-200 block truncate">
                BYOD File Vault
              </span>
              <span className="text-[10px] text-slate-500 block truncate">
                {state.customDocuments.length > 0 ? `${state.customDocuments.length} files attached` : 'Upload PDF / TXT / MD'}
              </span>
            </div>
          )}
        </button>

        {/* Research Library Button */}
        <button
          onClick={onOpenLibrary}
          title={isCollapsed ? 'Research Archive & Library' : undefined}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center p-2' : 'gap-2.5 px-2.5 py-2'} rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-colors`}
        >
          <div className="w-7 h-7 rounded-md bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 shrink-0">
            <Bookmark className="w-3.5 h-3.5" />
          </div>
          {!isCollapsed && (
            <div className="text-left overflow-hidden">
              <span className="text-xs font-semibold text-slate-200 block truncate">
                Report Archive
              </span>
              <span className="text-[10px] text-slate-500 block truncate">
                Saved Intelligence
              </span>
            </div>
          )}
        </button>

        {/* Curated Presets */}
        <button
          onClick={onOpenPresets}
          title={isCollapsed ? 'Topic Presets' : undefined}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center p-2' : 'gap-2.5 px-2.5 py-2'} rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-colors`}
        >
          <div className="w-7 h-7 rounded-md bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          {!isCollapsed && (
            <div className="text-left overflow-hidden">
              <span className="text-xs font-semibold text-slate-200 block truncate">
                Topic Presets
              </span>
              <span className="text-[10px] text-slate-500 block truncate">
                Curated Scenarios
              </span>
            </div>
          )}
        </button>

        {/* System Settings */}
        <button
          onClick={onOpenSettings}
          title={isCollapsed ? 'Settings & API Config' : undefined}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center p-2' : 'gap-2.5 px-2.5 py-2'} rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-colors`}
        >
          <div className="w-7 h-7 rounded-md bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 shrink-0">
            <Sliders className="w-3.5 h-3.5" />
          </div>
          {!isCollapsed && (
            <div className="text-left overflow-hidden">
              <span className="text-xs font-semibold text-slate-200 block truncate">
                Configuration
              </span>
              <span className="text-[10px] text-slate-500 block truncate">
                Models &amp; Prompts
              </span>
            </div>
          )}
        </button>
      </div>

      {/* Footer: Status Indicator */}
      <div className="p-3 border-t border-slate-800/80 bg-[#0C1222]/80 text-[10px] font-mono text-slate-500">
        {!isCollapsed ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
              <span className="text-slate-400 font-sans">{isRunning ? 'Running Floor' : 'System Ready'}</span>
            </div>
            <span>v2.0</span>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
          </div>
        )}
      </div>
    </aside>
  );
};
