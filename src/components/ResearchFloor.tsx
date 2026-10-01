'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Compass,
  Search,
  BookOpen,
  ShieldCheck,
  PenTool,
  CheckCircle2,
  Clock,
  Zap,
  ArrowRight,
  RefreshCw,
  Repeat,
  AlertTriangle,
  FileText,
  CornerUpLeft,
} from 'lucide-react';
import { ResearchWorkflowState, AgentType } from '../lib/types';

interface ResearchFloorProps {
  state: ResearchWorkflowState;
  selectedAgentTab: AgentType | 'logs' | 'report';
  onSelectAgentTab: (tab: AgentType | 'logs' | 'report') => void;
}

const AGENT_ORDER: AgentType[] = ['planner', 'searcher', 'reader', 'critic', 'writer'];

const AGENT_META: Record<AgentType, {
  name: string;
  stageNum: string;
  role: string;
  icon: React.ReactNode;
  accentColor: string;
  tooltip: string;
}> = {
  planner: {
    name: 'Strategic Planner',
    stageNum: '01',
    role: 'Deconstructs taxonomy, hypotheses & search vectors',
    icon: <Compass className="w-4 h-4" />,
    accentColor: '#3B82F6',
    tooltip: 'Deconstructs research query into taxonomy, sub-questions, and targeted search vectors.',
  },
  searcher: {
    name: 'Literature Scout',
    stageNum: '02',
    role: 'Multi-perspective web & repository retrieval',
    icon: <Search className="w-4 h-4" />,
    accentColor: '#10B981',
    tooltip: 'Dispatches targeted web search probes, discovers primary sources, and ranks authority.',
  },
  reader: {
    name: 'Deep Reader',
    stageNum: '03',
    role: 'Mines quantitative metrics, quotes & facts',
    icon: <BookOpen className="w-4 h-4" />,
    accentColor: '#F59E0B',
    tooltip: 'Parses document bodies to extract quantitative metrics, findings, quotes, and data tables.',
  },
  critic: {
    name: 'Epistemic Critic',
    stageNum: '04',
    role: 'Fact audits, bias rating & replanning loops',
    icon: <ShieldCheck className="w-4 h-4" />,
    accentColor: '#EF4444',
    tooltip: 'Evaluates domain authority, calculates credibility, stress-tests claims, and triggers replan loops.',
  },
  writer: {
    name: 'Executive Synthesizer',
    stageNum: '05',
    role: 'Drafts cited whitepaper & presentation deck',
    icon: <PenTool className="w-4 h-4" />,
    accentColor: '#8B5CF6',
    tooltip: 'Synthesizes verified evidence into an exhaustive whitepaper with standard footnote citations.',
  },
};

export const ResearchFloor: React.FC<ResearchFloorProps> = ({
  state,
  selectedAgentTab,
  onSelectAgentTab,
}) => {
  const replanHistory = state.replanHistory || [];
  const hasReplanActive = replanHistory.length > 0;
  const isCriticOrSearcherReplanning =
    state.activeAgent === 'searcher' && hasReplanActive;

  return (
    <div className="w-full bg-[#0D1527] rounded-xl border border-slate-800 p-4 sm:p-5 shadow-xl relative overflow-hidden">
      {/* Background subtle cyber grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#33415510_1px,transparent_1px),linear-gradient(to_bottom,#33415510_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-50" />

      {/* Floor Top Bar: Status & KPI Chips */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 relative z-10 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <h2 className="text-xs font-bold tracking-wider uppercase text-slate-200 flex items-center gap-2">
            Multi-Agent Autonomous Floor
            <span className="text-[10px] font-normal lowercase tracking-normal text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/25">
              Evaluator-Optimizer Architecture Active
            </span>
          </h2>
        </div>

        {/* Global Pipeline KPI Chips */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-300 flex-wrap">
          {/* Feedback Loops KPI chip */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs transition-all ${
              hasReplanActive
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 font-semibold'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
            title="Number of Critic-directed replanning and evidence enrichment cycles"
          >
            <Repeat className={`w-3.5 h-3.5 ${hasReplanActive ? 'text-amber-400 animate-spin' : 'text-slate-500'}`} />
            <span>Loops: <strong>{replanHistory.length}</strong></span>
          </div>

          <div
            className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800"
            title="Candidate and primary web references discovered"
          >
            <Search className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sources: <strong className="text-emerald-300">{state.sources.length}</strong></span>
          </div>

          <div
            className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800"
            title="Granular statistics, quotes, and findings extracted"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Facts: <strong className="text-amber-300">{state.facts.length}</strong></span>
          </div>

          <div
            className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800"
            title="Critic Epistemic Reliability Index (0-100)"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
            <span>Audit: <strong className="text-rose-300">{state.criticReview ? `${state.criticReview.overallCredibilityScore}%` : '—'}</strong></span>
          </div>

          <div
            className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800"
            title="Total words authored in the final cited whitepaper"
          >
            <PenTool className="w-3.5 h-3.5 text-purple-400" />
            <span>Words: <strong className="text-purple-300">{state.report ? state.report.wordCount : '0'}</strong></span>
          </div>
        </div>
      </div>

      {/* Dynamic Replan Alert Banner */}
      {hasReplanActive && (
        <div className="mb-4 p-3 bg-amber-950/30 border border-amber-500/40 rounded-lg flex items-center justify-between text-xs text-amber-200">
          <div className="flex items-center gap-2 overflow-hidden">
            <RefreshCw className="w-4 h-4 text-amber-400 shrink-0 animate-spin" />
            <div className="truncate">
              <span className="font-bold text-amber-300 uppercase tracking-wide mr-2">
                Critic Feedback Loop #{replanHistory.length} Active:
              </span>
              <span className="text-slate-300">
                {replanHistory[replanHistory.length - 1].reason} ({replanHistory[replanHistory.length - 1].from.toUpperCase()} ➔ {replanHistory[replanHistory.length - 1].to.toUpperCase()})
              </span>
            </div>
          </div>
          <span className="font-mono text-[10px] bg-amber-500/20 px-2 py-0.5 rounded text-amber-300 border border-amber-500/40 shrink-0 ml-2">
            Adaptive Replanning
          </span>
        </div>
      )}

      {/* 5-Agent Pipeline Row */}
      <div className="relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {AGENT_ORDER.map((agentId, index) => {
            const meta = AGENT_META[agentId];
            const agent = state.agents[agentId];
            const isActive = state.activeAgent === agentId;
            const isCompleted = agent.status === 'completed';
            const isSelected = selectedAgentTab === agentId;
            const isReplanning =
              (agentId === 'critic' || agentId === 'searcher' || agentId === 'reader') &&
              hasReplanActive &&
              isActive;

            // Compute agent status badge text & styling
            let statusBadge = { label: 'Idle', color: 'bg-slate-800 text-slate-400 border-slate-700' };
            if (isReplanning) {
              statusBadge = { label: 'Replanning', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
            } else if (isActive) {
              statusBadge = { label: 'Running', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' };
            } else if (isCompleted) {
              statusBadge = { label: 'Done', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' };
            } else if (agent.status === 'error') {
              statusBadge = { label: 'Error', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' };
            }

            return (
              <div key={agentId} className="relative flex flex-col">
                {/* Horizontal data connector arrow (desktop only) */}
                {index < AGENT_ORDER.length - 1 && (
                  <div className="hidden md:flex absolute -right-2 top-8 z-20 items-center justify-center pointer-events-none">
                    <ArrowRight
                      className={`w-3.5 h-3.5 transition-colors duration-300 ${
                        isCompleted ? 'text-blue-400' : 'text-slate-700'
                      }`}
                    />
                  </div>
                )}

                {/* Agent Card */}
                <button
                  type="button"
                  onClick={() => onSelectAgentTab(agentId)}
                  title={meta.tooltip}
                  className={`w-full text-left p-3 rounded-lg border transition-all duration-200 relative group cursor-pointer h-[155px] flex flex-col justify-between ${
                    isActive
                      ? 'bg-slate-900/95 border-blue-500/80 shadow-lg shadow-blue-950/40 ring-1 ring-blue-500/40'
                      : isSelected
                      ? 'bg-slate-900 border-slate-600 shadow-md'
                      : isCompleted
                      ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                      : 'bg-slate-950/50 border-slate-800/60 opacity-70 hover:opacity-100 hover:border-slate-700'
                  }`}
                >
                  {/* Subtle pulsing indicator ONLY on active agent */}
                  {isActive && (
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500" />
                    </span>
                  )}

                  {/* Header: Stage, Icon, Name & Status Pill */}
                  <div>
                    <div className="flex items-center justify-between gap-1.5 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-6 h-6 rounded flex items-center justify-center font-bold text-xs"
                          style={{
                            backgroundColor: `${meta.accentColor}25`,
                            color: meta.accentColor,
                            border: `1px solid ${meta.accentColor}50`,
                          }}
                        >
                          {meta.icon}
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 font-semibold">
                          {meta.stageNum}
                        </span>
                      </div>

                      {/* Clean Status Badge */}
                      <span
                        className={`text-[9px] font-mono font-medium px-1.5 py-0.5 rounded border uppercase tracking-wider ${statusBadge.color}`}
                      >
                        {statusBadge.label}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-slate-100 group-hover:text-white truncate">
                      {meta.name}
                    </h3>
                    <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                      {agent.role}
                    </p>
                  </div>

                  {/* Footer: Progress bar and live metric */}
                  <div className="space-y-1.5 pt-1 border-t border-slate-800/60">
                    <div className="w-full bg-slate-950 rounded-full h-1 overflow-hidden border border-slate-800">
                      <div
                        className="h-full transition-all duration-300 rounded-full"
                        style={{
                          width: `${agent.progress}%`,
                          backgroundColor: isCompleted ? '#10B981' : meta.accentColor,
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 truncate">
                      <span className={`truncate ${isActive ? 'text-amber-300 font-medium' : 'text-slate-500'}`}>
                        {agent.currentTask || (isCompleted ? 'Completed' : 'Standby')}
                      </span>
                      {agent.durationMs && (
                        <span className="text-slate-500 shrink-0 ml-1">
                          {(agent.durationMs / 1000).toFixed(1)}s
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        {/* Visible Feedback Arrow: Critic back to Scout/Planner when replanning */}
        {hasReplanActive && (
          <div className="mt-3 p-2 bg-amber-950/20 border border-amber-500/30 rounded-lg flex items-center justify-between text-xs text-amber-300">
            <div className="flex items-center gap-2">
              <CornerUpLeft className="w-4 h-4 text-amber-400 animate-pulse" />
              <span className="font-mono text-[11px]">
                <strong>Adaptive Replanning Loop Active:</strong> Critic (Stage 04) redirected execution to Literature Scout (Stage 02) to resolve missing evidence.
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              Evaluator-Optimizer Cycle
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
