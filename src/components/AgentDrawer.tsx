'use client';

import React, { useState } from 'react';
import {
  X,
  Compass,
  Search,
  BookOpen,
  ShieldCheck,
  PenTool,
  Clock,
  Wrench,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { ResearchWorkflowState, AgentType } from '../lib/types';

interface AgentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  agentId: AgentType | null;
  state: ResearchWorkflowState;
}

export const AgentDrawer: React.FC<AgentDrawerProps> = ({
  isOpen,
  onClose,
  agentId,
  state,
}) => {
  const [activeDrawerTab, setActiveDrawerTab] = useState<'artifacts' | 'reasoning' | 'tools' | 'telemetry'>('artifacts');

  if (!isOpen || !agentId) return null;

  const agent = state.agents[agentId];
  const toolCalls = (state.toolCalls || []).filter((tc) => tc.agent === agentId);
  const messages = (state.messages || []).filter(
    (m) => m.from === agentId || m.to === agentId
  );

  const agentIcons: Record<AgentType, React.ReactNode> = {
    planner: <Compass className="w-5 h-5 text-[#6366F1]" />,
    searcher: <Search className="w-5 h-5 text-[#06B6D4]" />,
    reader: <BookOpen className="w-5 h-5 text-[#F59E0B]" />,
    critic: <ShieldCheck className="w-5 h-5 text-[#EF4444]" />,
    writer: <PenTool className="w-5 h-5 text-[#A855F7]" />,
  };

  const agentBorders: Record<AgentType, string> = {
    planner: 'border-t-[#6366F1]',
    searcher: 'border-t-[#06B6D4]',
    reader: 'border-t-[#F59E0B]',
    critic: 'border-t-[#EF4444]',
    writer: 'border-t-[#A855F7]',
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/20 backdrop-blur-xs transition-opacity duration-200">
      {/* Backdrop click to close */}
      <div className="flex-1" onClick={onClose} />

      {/* 480px White Drawer Panel */}
      <div
        className={`w-full max-w-[480px] bg-white h-full shadow-2xl flex flex-col border-l border-[#E5E7EB] border-t-4 ${agentBorders[agentId]} relative transform transition-transform duration-200 ease-out`}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-[#E5E7EB] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F1F2F4] flex items-center justify-center border border-[#E5E7EB]">
              {agentIcons[agentId]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#14181F]">
                  {agent.name}
                </h3>
                <span
                  className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-semibold ${
                    agent.status === 'running'
                      ? 'bg-amber-100 text-amber-800'
                      : agent.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {agent.status}
                </span>
              </div>
              <p className="text-xs text-[#6B7280] line-clamp-1">{agent.role}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Agent Drawer"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#6B7280] hover:text-[#14181F] hover:bg-[#F1F2F4] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Sub-nav Tabs */}
        <div className="flex items-center gap-1 border-b border-[#E5E7EB] bg-[#F1F2F4]/70 px-4 py-2 text-xs">
          <button
            onClick={() => setActiveDrawerTab('artifacts')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeDrawerTab === 'artifacts'
                ? 'bg-white text-[#14181F] shadow-xs font-semibold'
                : 'text-[#6B7280] hover:text-[#14181F]'
            }`}
          >
            Outputs &amp; Artifacts
          </button>
          <button
            onClick={() => setActiveDrawerTab('reasoning')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeDrawerTab === 'reasoning'
                ? 'bg-white text-[#14181F] shadow-xs font-semibold'
                : 'text-[#6B7280] hover:text-[#14181F]'
            }`}
          >
            Thought Stream ({agent.thoughtStream.length})
          </button>
          <button
            onClick={() => setActiveDrawerTab('tools')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeDrawerTab === 'tools'
                ? 'bg-white text-[#14181F] shadow-xs font-semibold'
                : 'text-[#6B7280] hover:text-[#14181F]'
            }`}
          >
            Tool Calls ({toolCalls.length})
          </button>
          <button
            onClick={() => setActiveDrawerTab('telemetry')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeDrawerTab === 'telemetry'
                ? 'bg-white text-[#14181F] shadow-xs font-semibold'
                : 'text-[#6B7280] hover:text-[#14181F]'
            }`}
          >
            Telemetry
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs">
          {/* TAB 1: ARTIFACTS */}
          {activeDrawerTab === 'artifacts' && (
            <div className="space-y-4">
              {agentId === 'planner' && (
                <div className="space-y-3">
                  <div className="p-3.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl">
                    <h4 className="font-bold text-[#14181F] mb-1.5">
                      Sub-Questions Deconstructed
                    </h4>
                    {state.plan?.subQuestions ? (
                      <ol className="list-decimal pl-4 space-y-1 text-[#4B5563]">
                        {state.plan.subQuestions.map((q, i) => (
                          <li key={i}>{q}</li>
                        ))}
                      </ol>
                    ) : (
                      <p className="text-[#6B7280] italic">Awaiting plan output...</p>
                    )}
                  </div>

                  <div className="p-3.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl">
                    <h4 className="font-bold text-[#14181F] mb-1.5">
                      Working Hypotheses
                    </h4>
                    {state.plan?.hypotheses ? (
                      <ul className="space-y-1.5 text-[#4B5563]">
                        {state.plan.hypotheses.map((h, i) => (
                          <li key={i} className="p-2 bg-white rounded border border-[#E5E7EB]">
                            {h}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-[#6B7280] italic">Awaiting plan output...</p>
                    )}
                  </div>
                </div>
              )}

              {agentId === 'searcher' && (
                <div className="space-y-2">
                  <h4 className="font-bold text-[#14181F]">
                    Discovered Web Sources ({state.sources.length})
                  </h4>
                  {state.sources.length === 0 ? (
                    <p className="text-[#6B7280] italic">No sources gathered yet.</p>
                  ) : (
                    state.sources.map((src, i) => (
                      <div
                        key={src.id || i}
                        className="p-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-[#14181F] truncate max-w-[280px]">
                            {src.title}
                          </span>
                          <span className="font-mono text-[10px] text-[#2563EB] bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                            {src.domain}
                          </span>
                        </div>
                        <p className="text-[#4B5563] text-[11px] line-clamp-2">{src.snippet}</p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {agentId === 'reader' && (
                <div className="space-y-2">
                  <h4 className="font-bold text-[#14181F]">
                    Extracted Fact Bank ({state.facts.length})
                  </h4>
                  {state.facts.length === 0 ? (
                    <p className="text-[#6B7280] italic">No facts extracted yet.</p>
                  ) : (
                    state.facts.map((fact, i) => (
                      <div
                        key={fact.id || i}
                        className="p-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] uppercase font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                            {fact.category}
                          </span>
                          <span className="font-mono text-[10px] text-[#6B7280]">
                            {Math.round(fact.confidence * 100)}% conf
                          </span>
                        </div>
                        <p className="text-[#14181F] font-medium">{fact.fact}</p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {agentId === 'critic' && (
                <div className="space-y-3">
                  <div className="p-4 bg-[#EAD5FF]/40 border border-[#D8B4FE] rounded-xl flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-[#581C87]">
                        Overall Epistemic Audit Index
                      </h4>
                      <p className="text-[11px] text-[#6B7280]">
                        Rigorous authority, recency, and bias scoring
                      </p>
                    </div>
                    <span className="text-3xl font-extrabold text-[#7C3AED] font-mono">
                      {state.criticReview?.overallCredibilityScore || '—'}/100
                    </span>
                  </div>

                  {state.criticReview?.sourceScorecards && (
                    <div className="border border-[#E5E7EB] rounded-xl overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-[#6B7280]">
                          <tr>
                            <th className="p-2">Domain</th>
                            <th className="p-2">Authority</th>
                            <th className="p-2 text-right">Score</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E7EB]">
                          {state.criticReview.sourceScorecards.map((sc, i) => (
                            <tr key={i}>
                              <td className="p-2 font-mono text-[11px] font-semibold text-[#14181F]">{sc.domain}</td>
                              <td className="p-2 text-[11px] text-[#4B5563]">{sc.authorityLevel}</td>
                              <td className="p-2 text-right font-mono font-bold text-[#EF4444]">{sc.credibilityScore}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {agentId === 'writer' && (
                <div className="space-y-2">
                  <h4 className="font-bold text-[#14181F]">
                    Drafted Whitepaper Deliverable
                  </h4>
                  {state.report ? (
                    <div className="p-3.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl space-y-2">
                      <p className="font-bold text-[#14181F]">{state.report.title}</p>
                      <div className="flex items-center gap-3 text-[11px] text-[#6B7280] font-mono">
                        <span>{state.report.wordCount} words</span>
                        <span>•</span>
                        <span>{state.report.citations.length} verified citations</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[#6B7280] italic">Awaiting synthesis completion...</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: REASONING */}
          {activeDrawerTab === 'reasoning' && (
            <div className="space-y-2">
              {agent.thoughtStream.length === 0 ? (
                <p className="text-[#6B7280] italic text-center py-8">
                  No thoughts recorded for this agent yet.
                </p>
              ) : (
                agent.thoughtStream.map((t, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#F8FAFC] border-l-3 border-[#151A17] rounded-r-lg text-[#14181F] font-mono text-[11px] leading-relaxed"
                  >
                    💭 {t}
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: TOOL CALLS */}
          {activeDrawerTab === 'tools' && (
            <div className="space-y-2">
              {toolCalls.length === 0 ? (
                <p className="text-[#6B7280] italic text-center py-8">
                  No discrete tool calls logged for {agent.name}.
                </p>
              ) : (
                toolCalls.map((tc, idx) => (
                  <div
                    key={tc.id || idx}
                    className="p-3 bg-white border border-[#E5E7EB] rounded-xl space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[#14181F]">
                        {tc.toolName}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        {tc.durationMs}ms
                      </span>
                    </div>
                    <pre className="p-2 bg-[#F1F2F4] rounded text-[10px] font-mono text-[#334155] overflow-x-auto">
                      {JSON.stringify(tc.input, null, 2)}
                    </pre>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 4: TELEMETRY */}
          {activeDrawerTab === 'telemetry' && (
            <div className="space-y-3 font-mono text-[11px]">
              <div className="p-3.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Agent Identifier:</span>
                  <span className="font-bold text-[#14181F]">{agent.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Execution Progress:</span>
                  <span className="font-bold text-[#14181F]">{agent.progress}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Total Duration:</span>
                  <span className="font-bold text-[#14181F]">
                    {agent.durationMs ? `${(agent.durationMs / 1000).toFixed(2)}s` : '—'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Active Messages Handled:</span>
                  <span className="font-bold text-[#14181F]">{messages.length}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
