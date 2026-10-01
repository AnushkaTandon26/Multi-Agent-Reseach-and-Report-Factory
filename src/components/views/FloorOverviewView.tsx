'use client';

import React from 'react';
import { ResearchFloor } from '../ResearchFloor';
import { ResearchWorkflowState, AgentType } from '../../lib/types';
import { NavView } from '../Sidebar';
import {
  Compass,
  Search,
  BookOpen,
  ShieldCheck,
  PenTool,
  ArrowRight,
  Sparkles,
  Zap,
  Clock,
  Terminal,
  FileText,
  AlertTriangle,
  Repeat,
} from 'lucide-react';

interface FloorOverviewViewProps {
  state: ResearchWorkflowState;
  onNavigate: (view: NavView) => void;
}

export const FloorOverviewView: React.FC<FloorOverviewViewProps> = ({
  state,
  onNavigate,
}) => {
  const isRunning = state.status === 'running';
  const hasReplan = (state.replanHistory?.length || 0) > 0;

  const agentCards = [
    {
      id: 'planner' as NavView,
      agentId: 'planner' as AgentType,
      name: '1. Strategic Planner',
      role: 'Research Architect & Scope Deconstructor',
      icon: <Compass className="w-4 h-4 text-blue-400" />,
      color: '#3B82F6',
      status: state.agents.planner.status,
      task: state.agents.planner.currentTask || 'Deconstructs topic taxonomy, hypotheses & search vectors',
      metric: state.plan ? `${state.plan.subQuestions.length} Questions Outlined` : 'Standby',
      agent: state.agents.planner,
    },
    {
      id: 'searcher' as NavView,
      agentId: 'searcher' as AgentType,
      name: '2. Literature Scout',
      role: 'Primary Source & Web Probe Retriever',
      icon: <Search className="w-4 h-4 text-emerald-400" />,
      color: '#10B981',
      status: state.agents.searcher.status,
      task: state.agents.searcher.currentTask || 'Executes multi-perspective search queries & ranks authority',
      metric: `${state.sources.length} Sources Discovered`,
      agent: state.agents.searcher,
    },
    {
      id: 'reader' as NavView,
      agentId: 'reader' as AgentType,
      name: '3. Deep Reader',
      role: 'Evidence & Metric Extractor',
      icon: <BookOpen className="w-4 h-4 text-amber-400" />,
      color: '#F59E0B',
      status: state.agents.reader.status,
      task: state.agents.reader.currentTask || 'Extracts quantitative statistics, expert quotes & findings',
      metric: `${state.facts.length} Verified Facts`,
      agent: state.agents.reader,
    },
    {
      id: 'critic' as NavView,
      agentId: 'critic' as AgentType,
      name: '4. Epistemic Critic',
      role: 'Bias Auditor & Replanning Governor',
      icon: <ShieldCheck className="w-4 h-4 text-rose-400" />,
      color: '#EF4444',
      status: state.agents.critic.status,
      task: state.agents.critic.currentTask || 'Audits source authority, checks gaps & dispatches replan loops',
      metric: state.criticReview ? `Score: ${state.criticReview.overallCredibilityScore}/100` : 'Scorecard Pending',
      agent: state.agents.critic,
    },
    {
      id: 'report' as NavView,
      agentId: 'writer' as AgentType,
      name: '5. Executive Synthesizer',
      role: 'Lead Whitepaper & Citation Author',
      icon: <PenTool className="w-4 h-4 text-purple-400" />,
      color: '#8B5CF6',
      status: state.agents.writer.status,
      task: state.agents.writer.currentTask || 'Drafts comprehensive cited whitepaper, slides & briefing',
      metric: state.report ? `${state.report.wordCount} Words Drafted` : 'Awaiting Synthesis',
      agent: state.agents.writer,
    },
  ];

  return (
    <div className="space-y-5 pb-10">
      {/* Top Banner with Active Topic Info */}
      {state.topic && (
        <div className="bg-[#0F172A] p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-md">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-blue-500/10 text-blue-300 border border-blue-500/30">
                Active Research Topic
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Depth: <strong className="text-slate-200 capitalize">{state.depth}</strong>
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Persona: <strong className="text-slate-200 capitalize">{state.persona}</strong>
              </span>
              {state.redTeamMode && (
                <span className="text-[10px] font-mono text-rose-300 bg-rose-500/15 px-1.5 py-0.2 rounded border border-rose-500/30">
                  Red Team Active
                </span>
              )}
            </div>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
              {state.topic}
            </h2>
          </div>

          {state.report && (
            <button
              onClick={() => onNavigate('report')}
              className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-lg shadow-md transition-all shrink-0"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Read Final Whitepaper →</span>
            </button>
          )}
        </div>
      )}

      {/* Visual Pipeline Station (Floor Component) */}
      <ResearchFloor
        state={state}
        selectedAgentTab="planner"
        onSelectAgentTab={(tab) => {
          if (tab === 'logs') onNavigate('logs');
          else if (tab === 'report') onNavigate('report');
          else onNavigate(tab as NavView);
        }}
      />

      {/* Grid of 5 Detailed Agent Station Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            Specialized Agent Stations
          </h3>
          <span className="text-[11px] text-slate-500">Click any station card to inspect raw telemetry &amp; extracted artifacts</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {agentCards.map((card) => {
            const isAgentActive = card.agent.status === 'running';
            const isAgentDone = card.agent.status === 'completed';
            const isReplanning =
              (card.agentId === 'critic' || card.agentId === 'searcher' || card.agentId === 'reader') &&
              hasReplan &&
              isAgentActive;

            let statusBadge = { label: 'Idle', color: 'bg-slate-800 text-slate-400 border-slate-700' };
            if (isReplanning) {
              statusBadge = { label: 'Replanning', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
            } else if (isAgentActive) {
              statusBadge = { label: 'Running', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' };
            } else if (isAgentDone) {
              statusBadge = { label: 'Done', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' };
            } else if (card.agent.status === 'error') {
              statusBadge = { label: 'Error', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' };
            }

            return (
              <div
                key={card.id}
                onClick={() => onNavigate(card.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer group hover:scale-[1.008] relative flex flex-col justify-between space-y-3 ${
                  isAgentActive
                    ? 'bg-[#0F172A] border-blue-500 shadow-lg shadow-blue-950/40 ring-1 ring-blue-500/40'
                    : isAgentDone
                    ? 'bg-[#0E1628] border-slate-800 hover:border-slate-700'
                    : 'bg-[#0A101D] border-slate-800/60 opacity-80 hover:opacity-100 hover:border-slate-700'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center border shrink-0"
                        style={{
                          backgroundColor: `${card.color}20`,
                          borderColor: `${card.color}40`,
                        }}
                      >
                        {card.icon}
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="text-xs font-bold text-slate-100 group-hover:text-white truncate">
                          {card.name}
                        </h4>
                        <span className="text-[10px] text-slate-500 block truncate max-w-[150px]">
                          {card.role}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase tracking-wider ${statusBadge.color}`}
                    >
                      {statusBadge.label}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {card.task}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-300 text-[11px] font-semibold">
                    {card.metric}
                  </span>
                  <span className="text-blue-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-medium text-[11px]">
                    Inspect Station <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
