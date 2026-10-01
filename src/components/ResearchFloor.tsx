'use client';

import React from 'react';
import {
  Compass,
  Search,
  BookOpen,
  ShieldCheck,
  PenTool,
  ArrowRight,
  Repeat,
  CornerUpLeft,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { ResearchWorkflowState, AgentType } from '../lib/types';

interface ResearchFloorProps {
  state: ResearchWorkflowState;
  selectedAgentTab?: AgentType | 'logs' | 'report';
  onSelectAgentTab: (tab: AgentType | 'logs' | 'report') => void;
}

const AGENT_ORDER: AgentType[] = ['planner', 'searcher', 'reader', 'critic', 'writer'];

const AGENT_META: Record<
  AgentType,
  {
    name: string;
    stageNum: string;
    role: string;
    icon: React.ReactNode;
    color: string;
    bgTint: string;
    tooltip: string;
  }
> = {
  planner: {
    name: 'Strategic Planner',
    stageNum: '01',
    role: 'Deconstructs taxonomy, hypotheses & search vectors',
    icon: <Compass className="w-5 h-5 text-[#6366F1]" />,
    color: '#6366F1',
    bgTint: '#EEF2FF',
    tooltip: 'Deconstructs research query into taxonomy, sub-questions, and targeted search vectors.',
  },
  searcher: {
    name: 'Literature Scout',
    stageNum: '02',
    role: 'Multi-perspective web & repository retrieval',
    icon: <Search className="w-5 h-5 text-[#06B6D4]" />,
    color: '#06B6D4',
    bgTint: '#ECFEFF',
    tooltip: 'Dispatches targeted web search probes, discovers primary sources, and ranks authority.',
  },
  reader: {
    name: 'Deep Reader',
    stageNum: '03',
    role: 'Mines quantitative metrics, quotes & facts',
    icon: <BookOpen className="w-5 h-5 text-[#F59E0B]" />,
    color: '#F59E0B',
    bgTint: '#FFFBEB',
    tooltip: 'Parses document bodies to extract quantitative metrics, findings, quotes, and data tables.',
  },
  critic: {
    name: 'Epistemic Critic',
    stageNum: '04',
    role: 'Fact audits, bias rating & replanning loops',
    icon: <ShieldCheck className="w-5 h-5 text-[#EF4444]" />,
    color: '#EF4444',
    bgTint: '#FEF2F2',
    tooltip: 'Evaluates domain authority, calculates credibility, stress-tests claims, and triggers replan loops.',
  },
  writer: {
    name: 'Executive Synthesizer',
    stageNum: '05',
    role: 'Drafts cited whitepaper & presentation deck',
    icon: <PenTool className="w-5 h-5 text-[#A855F7]" />,
    color: '#A855F7',
    bgTint: '#FAF5FF',
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
  const isRunning = state.status === 'running';

  return (
    <div className="w-full bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-8 lg:p-10 shadow-[0_4px_20px_rgba(16,24,40,0.06)] relative overflow-hidden">
      {/* Floor Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 border-b border-[#F1F2F4] pb-4">
        <div>
          <h3 className="text-xl font-bold text-[#14181F] flex items-center gap-2.5">
            Autonomous Agent Pipeline
            <span className="text-xs font-mono font-medium px-3 py-1 rounded-full bg-[#EAD5FF] text-[#581C87] border border-[#D8B4FE]">
              5 Specialized Stations
            </span>
          </h3>
          <p className="text-xs sm:text-sm text-[#6B7280] pt-1">
            Continuous inter-agent coordination over typed message bus with adaptive evaluator-optimizer feedback
          </p>
        </div>

        {hasReplanActive && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold">
            <Repeat className="w-3.5 h-3.5 text-amber-600 animate-spin" />
            <span>Critic Feedback Active (Loop #{replanHistory.length})</span>
          </div>
        )}
      </div>

      {/* 5 Agent Cards Pipeline Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-5 relative">
        {AGENT_ORDER.map((agentId, index) => {
          const meta = AGENT_META[agentId];
          const agent = state.agents[agentId];
          const isActive = state.activeAgent === agentId;
          const isCompleted = agent.status === 'completed';
          const isReplanning =
            (agentId === 'critic' || agentId === 'searcher' || agentId === 'reader') &&
            hasReplanActive &&
            isActive;

          // Status Badge
          let statusLabel = 'Idle';
          let statusStyle = 'bg-[#F1F2F4] text-[#6B7280] border-[#E5E7EB]';

          if (isReplanning) {
            statusLabel = 'Replanning';
            statusStyle = 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse';
          } else if (isActive) {
            statusLabel = 'Running';
            statusStyle = 'bg-blue-50 text-blue-700 border-blue-200 animate-pulse';
          } else if (isCompleted) {
            statusLabel = 'Done';
            statusStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';
          } else if (agent.status === 'error') {
            statusLabel = 'Error';
            statusStyle = 'bg-rose-50 text-rose-700 border-rose-200';
          }

          return (
            <div key={agentId} className="relative flex flex-col">
              {/* Desktop Connecting Arrow */}
              {index < AGENT_ORDER.length - 1 && (
                <div className="hidden lg:flex absolute -right-3.5 top-20 z-10 items-center justify-center pointer-events-none">
                  <ArrowRight
                    className={`w-4 h-4 transition-colors duration-200 ${
                      isCompleted ? 'text-[#14181F]' : 'text-[#D1D5DB]'
                    } ${isRunning && isActive ? 'animate-pulse text-[#2563EB]' : ''}`}
                  />
                </div>
              )}

              {/* White Agent Card */}
              <button
                type="button"
                onClick={() => onSelectAgentTab(agentId)}
                title={meta.tooltip}
                className={`w-full text-left p-5 rounded-2xl border bg-white transition-all duration-150 relative group cursor-pointer flex flex-col justify-between h-[195px] shadow-[0_2px_10px_rgba(16,24,40,0.04)] hover:shadow-lg hover:border-[#D1D5DB] ${
                  isActive
                    ? 'ring-2 ring-[#14181F] border-[#14181F]'
                    : 'border-[#E5E7EB]'
                }`}
                style={{
                  borderTopWidth: '4px',
                  borderTopColor: meta.color,
                }}
              >
                {/* Active agent subtle indicator */}
                {isActive && (
                  <span className="absolute top-2 right-2 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
                  </span>
                )}

                {/* Card Top: Icon chip, stage number, name, status pill */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-[#E5E7EB]"
                        style={{ backgroundColor: meta.bgTint }}
                      >
                        {meta.icon}
                      </div>
                      <span className="text-[11px] font-mono font-bold text-[#9CA3AF]">
                        {meta.stageNum}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wider ${statusStyle}`}
                    >
                      {statusLabel}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-[#14181F] group-hover:text-[#2563EB] transition-colors truncate">
                    {meta.name}
                  </h4>
                  <p className="text-[11px] text-[#6B7280] line-clamp-1 mt-0.5">
                    {agent.role}
                  </p>
                </div>

                {/* Card Bottom: Progress Bar & Current Task/Metric */}
                <div className="space-y-1.5 pt-2 border-t border-[#F1F2F4]">
                  <div className="w-full bg-[#F1F2F4] rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full transition-all duration-300 rounded-full"
                      style={{
                        width: `${agent.progress}%`,
                        backgroundColor: isCompleted ? '#16A34A' : meta.color,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-[#6B7280]">
                    <span className="truncate max-w-[120px] text-[#14181F] font-medium">
                      {agent.currentTask || (isCompleted ? 'Finished' : 'Waiting')}
                    </span>
                    {agent.durationMs ? (
                      <span className="shrink-0 text-[#9CA3AF]">
                        {(agent.durationMs / 1000).toFixed(1)}s
                      </span>
                    ) : null}
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Curved Replan Loop Arrow: Critic back to Scout/Planner */}
      {hasReplanActive && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-300 rounded-xl flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center shrink-0">
              <CornerUpLeft className="w-3.5 h-3.5 text-amber-900 animate-pulse" />
            </div>
            <div>
              <span className="font-bold mr-1">
                Adaptive Feedback Loop #{replanHistory.length}:
              </span>
              <span className="text-[#4B5563]">
                {replanHistory[replanHistory.length - 1].reason} (Redirected from Critic to Scout)
              </span>
            </div>
          </div>
          <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-white border border-amber-200 text-amber-800 shrink-0">
            Evaluator-Optimizer Active
          </span>
        </div>
      )}
    </div>
  );
};
