'use client';

import React from 'react';
import {
  Compass,
  Search,
  BookOpen,
  ShieldCheck,
  PenTool,
  Terminal,
  ExternalLink,
  Check,
  AlertTriangle,
  FileText,
  Clock,
  Sparkles,
  Quote,
  Layers,
} from 'lucide-react';
import { ResearchWorkflowState, AgentType } from '../lib/types';

interface AgentInspectorProps {
  state: ResearchWorkflowState;
  activeTab: AgentType | 'logs' | 'report';
  setActiveTab: (tab: AgentType | 'logs' | 'report') => void;
}

export const AgentInspector: React.FC<AgentInspectorProps> = ({
  state,
  activeTab,
  setActiveTab,
}) => {
  const plan = state.plan;
  const sources = state.sources;
  const facts = state.facts;
  const critic = state.criticReview;

  return (
    <div className="flex flex-col h-full bg-gray-900/90 rounded-2xl border border-gray-800 shadow-xl overflow-hidden backdrop-blur-md">
      {/* Inspector Tabs */}
      <div className="flex items-center justify-between border-b border-gray-800 bg-[#0C1222] px-3 py-2 overflow-x-auto">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('planner')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'planner'
                ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-sm'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-blue-400" />
            <span>1. Strategy</span>
            {plan && <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
          </button>

          <button
            onClick={() => setActiveTab('searcher')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'searcher'
                ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-emerald-400" />
            <span>2. Sources</span>
            {sources.length > 0 && (
              <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded text-[10px] font-mono">
                {sources.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('reader')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'reader'
                ? 'bg-amber-600/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>3. Fact Bank</span>
            {facts.length > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded text-[10px] font-mono">
                {facts.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('critic')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'critic'
                ? 'bg-rose-600/20 text-rose-300 border border-rose-500/40 shadow-sm'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
            <span>4. Critic Audit</span>
            {critic && (
              <span className="px-1.5 py-0.2 bg-rose-500/20 text-rose-300 rounded text-[10px] font-mono">
                {critic.overallCredibilityScore}%
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'logs'
                ? 'bg-gray-700/60 text-gray-200 border border-gray-600 shadow-sm'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
            <span>Agent Thoughts</span>
          </button>
        </div>
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* TAB 1: PLANNER STRATEGY */}
        {activeTab === 'planner' && (
          <div className="space-y-4">
            {!plan ? (
              <div className="text-center py-12 text-gray-500 text-sm">
                <Compass className="w-8 h-8 mx-auto mb-2 text-blue-500/40 animate-spin" />
                <p>Strategic plan awaiting Planner Agent initialization...</p>
              </div>
            ) : (
              <>
                <div className="bg-gray-950/60 p-3.5 rounded-xl border border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-blue-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Target Audience Profile
                    </span>
                    <span className="text-[10px] font-mono bg-blue-900/30 text-blue-300 px-2 py-0.5 rounded border border-blue-800/40 uppercase">
                      {plan.depth} Analysis
                    </span>
                  </div>
                  <p className="text-xs text-gray-300">{plan.targetAudience}</p>
                </div>

                <div className="bg-gray-950/60 p-3.5 rounded-xl border border-gray-800">
                  <span className="text-xs font-semibold text-gray-300 block mb-2">
                    Core Lines of Inquiry & Questions:
                  </span>
                  <ul className="space-y-1.5">
                    {plan.subQuestions.map((q, i) => (
                      <li key={i} className="text-xs text-gray-400 flex items-start gap-2">
                        <span className="text-blue-400 font-mono">Q{i + 1}.</span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gray-950/60 p-3.5 rounded-xl border border-gray-800">
                  <span className="text-xs font-semibold text-gray-300 block mb-2">
                    Working Hypotheses:
                  </span>
                  <div className="space-y-2">
                    {plan.hypotheses.map((h, i) => (
                      <div key={i} className="text-xs text-indigo-300/90 bg-indigo-950/30 p-2.5 rounded-lg border border-indigo-900/40">
                        {h}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-950/60 p-3.5 rounded-xl border border-gray-800">
                  <span className="text-xs font-semibold text-gray-300 block mb-2">
                    Dispatched Search Query Vectors:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {plan.searchQueries.map((sq, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-mono bg-gray-900 text-gray-300 px-2.5 py-1 rounded-md border border-gray-800"
                      >
                        🔍 {sq}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-950/60 p-3.5 rounded-xl border border-gray-800">
                  <span className="text-xs font-semibold text-gray-300 block mb-2">
                    Proposed Section Architecture:
                  </span>
                  <div className="space-y-1.5">
                    {plan.proposedSections.map((sec, i) => (
                      <div key={i} className="flex items-start justify-between text-xs py-1 border-b border-gray-900 last:border-0">
                        <span className="font-medium text-gray-200">{sec.title}</span>
                        <span className="text-gray-500 text-[11px] max-w-xs text-right truncate">{sec.focus}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB 2: SEARCHER SOURCES */}
        {activeTab === 'searcher' && (
          <div className="space-y-3">
            {sources.length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-sm">
                <Search className="w-8 h-8 mx-auto mb-2 text-emerald-500/40 animate-pulse" />
                <p>Searcher Agent searching live web and academic sources...</p>
              </div>
            ) : (
              sources.map((src, i) => (
                <div
                  key={src.id || i}
                  className="bg-gray-950/70 p-3.5 rounded-xl border border-gray-800/80 hover:border-emerald-500/40 transition-all space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="text-[10px] font-mono bg-emerald-950/60 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800/40 shrink-0">
                        [{src.domain}]
                      </span>
                      <h4 className="text-xs font-bold text-gray-200 truncate">
                        {src.title}
                      </h4>
                    </div>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-emerald-400 shrink-0 transition-colors"
                      title="Open source link"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <p className="text-xs text-gray-400 line-clamp-3">
                    {src.snippet}
                  </p>

                  <div className="flex items-center justify-between text-[10px] font-mono text-gray-500 pt-1 border-t border-gray-900">
                    <span>Query: &quot;{src.query}&quot;</span>
                    {src.authorOrOrg && <span>Source: {src.authorOrOrg}</span>}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: READER FACT BANK */}
        {activeTab === 'reader' && (
          <div className="space-y-3">
            {facts.length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-sm">
                <BookOpen className="w-8 h-8 mx-auto mb-2 text-amber-500/40 animate-pulse" />
                <p>Reader Agent currently analyzing and extracting facts...</p>
              </div>
            ) : (
              facts.map((fact, i) => {
                const categoryColors: Record<string, string> = {
                  statistic: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40',
                  finding: 'bg-blue-950/60 text-blue-300 border-blue-800/40',
                  expert_opinion: 'bg-purple-950/60 text-purple-300 border-purple-800/40',
                  counter_argument: 'bg-rose-950/60 text-rose-300 border-rose-800/40',
                  projection: 'bg-amber-950/60 text-amber-300 border-amber-800/40',
                };

                return (
                  <div
                    key={fact.id || i}
                    className="bg-gray-950/70 p-3.5 rounded-xl border border-gray-800/80 hover:border-amber-500/40 transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                          categoryColors[fact.category] || 'bg-gray-800 text-gray-300'
                        }`}
                      >
                        {fact.category}
                      </span>
                      <span className="text-[10px] font-mono text-amber-400">
                        Confidence: {Math.round(fact.confidence * 100)}%
                      </span>
                    </div>

                    <p className="text-xs text-gray-200 font-medium leading-relaxed">
                      {fact.fact}
                    </p>

                    {fact.quote && (
                      <div className="flex items-start gap-1.5 text-xs text-gray-400 italic bg-gray-900/60 p-2 rounded-lg border-l-2 border-amber-500/60">
                        <Quote className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{fact.quote}</span>
                      </div>
                    )}

                    <div className="text-[10px] font-mono text-gray-500 flex items-center justify-between pt-1">
                      <span className="truncate max-w-[240px]">Ref: {fact.sourceTitle}</span>
                      <span>{fact.timeframe || '2024-2025'}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 4: CRITIC AUDIT SCORECARD */}
        {activeTab === 'critic' && (
          <div className="space-y-4">
            {!critic ? (
              <div className="text-center py-12 text-gray-500 text-sm">
                <ShieldCheck className="w-8 h-8 mx-auto mb-2 text-rose-500/40 animate-pulse" />
                <p>Critic Agent auditing evidence reliability and bias matrix...</p>
              </div>
            ) : (
              <>
                {/* Overall Score Banner */}
                <div className="bg-gradient-to-r from-rose-950/40 to-indigo-950/40 p-4 rounded-xl border border-rose-800/40 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-gray-200">
                      Overall Evidence Reliability Index
                    </h4>
                    <p className="text-xs text-gray-400">
                      Evaluated across {critic.totalSourcesEvaluated} domains and {critic.verifiedFactsCount} factual claims
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-extrabold font-mono text-rose-400">
                      {critic.overallCredibilityScore}/100
                    </span>
                    <span className="block text-[10px] text-gray-400 font-mono">
                      {critic.overallCredibilityScore >= 85 ? 'High Credibility' : 'Moderate Caveats'}
                    </span>
                  </div>
                </div>

                {/* Source Scorecard Table */}
                <div className="bg-gray-950/60 p-3.5 rounded-xl border border-gray-800 space-y-2">
                  <span className="text-xs font-semibold text-gray-300 block">
                    Domain Credibility Scorecard:
                  </span>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-gray-800 text-gray-400">
                          <th className="pb-1.5 font-medium">Domain</th>
                          <th className="pb-1.5 font-medium">Authority</th>
                          <th className="pb-1.5 font-medium">Bias Rating</th>
                          <th className="pb-1.5 font-medium text-right">Score</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-900 text-gray-300">
                        {critic.sourceScorecards.map((sc, i) => (
                          <tr key={i} className="hover:bg-gray-900/40">
                            <td className="py-1.5 font-mono text-[11px] text-indigo-300">{sc.domain}</td>
                            <td className="py-1.5 text-[11px]">{sc.authorityLevel}</td>
                            <td className="py-1.5 text-[11px] text-gray-400">{sc.biasRating}</td>
                            <td className="py-1.5 text-right font-mono font-bold text-rose-400">{sc.credibilityScore}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Questionable / Flagged Nuances */}
                {critic.questionableClaims.length > 0 && (
                  <div className="bg-gray-950/60 p-3.5 rounded-xl border border-gray-800 space-y-2">
                    <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" /> Flagged Claims & Caveats:
                    </span>
                    <div className="space-y-2">
                      {critic.questionableClaims.map((qc, i) => (
                        <div key={i} className="bg-amber-950/20 p-2.5 rounded-lg border border-amber-900/30 text-xs space-y-1">
                          <p className="font-semibold text-gray-200">Claim: &quot;{qc.claim}&quot;</p>
                          <p className="text-amber-300/80">Issue: {qc.issue}</p>
                          <p className="text-gray-400 text-[11px]">Recommendation: {qc.recommendation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Synthesis Guidance for Writer */}
                <div className="bg-gray-950/60 p-3.5 rounded-xl border border-gray-800 space-y-1.5">
                  <span className="text-xs font-semibold text-gray-300 block">
                    Directives for Writer Agent:
                  </span>
                  <ul className="space-y-1">
                    {critic.synthesisGuidanceForWriter.map((g, i) => (
                      <li key={i} className="text-xs text-gray-400 flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB 5: AGENT THOUGHT STREAM & TERMINAL LOGS */}
        {activeTab === 'logs' && (
          <div className="space-y-3 font-mono text-xs">
            <div className="bg-black/80 rounded-xl p-3 border border-gray-800 max-h-[500px] overflow-y-auto space-y-2.5">
              <div className="flex items-center gap-2 text-indigo-400 pb-2 border-b border-gray-800 text-[11px]">
                <Terminal className="w-3.5 h-3.5" />
                <span>Multi-Agent Thought Stream & Inter-Agent Bus</span>
              </div>

              {(['planner', 'searcher', 'reader', 'critic', 'writer'] as AgentType[]).map((agentId) => {
                const agent = state.agents[agentId];
                if (agent.thoughtStream.length === 0 && agent.logs.length === 0) return null;

                return (
                  <div key={agentId} className="space-y-1.5 pt-1">
                    <div className="flex items-center gap-2 text-[11px] font-bold" style={{ color: agent.color }}>
                      <span>[{agent.name.toUpperCase()}]</span>
                      <span className="text-gray-600 font-normal">status: {agent.status}</span>
                    </div>

                    {agent.thoughtStream.map((t, idx) => (
                      <div key={`thought-${idx}`} className="text-gray-300 pl-3 border-l-2 text-[11px]" style={{ borderColor: agent.color }}>
                        💭 {t}
                      </div>
                    ))}

                    {agent.logs.map((log, idx) => (
                      <div key={`log-${idx}`} className="text-gray-500 pl-3 text-[10px]">
                        ⚙️ {log}
                      </div>
                    ))}
                  </div>
                );
              })}

              {state.status === 'idle' && (
                <div className="text-gray-600 italic py-4 text-center">
                  Launch a research task to observe real-time agent thoughts and communication logs.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
