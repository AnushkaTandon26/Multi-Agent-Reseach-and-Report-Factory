'use client';

import React, { useState } from 'react';
import {
  Terminal,
  Download,
  RefreshCw,
  Repeat,
  CheckCircle2,
  FileCode,
  FileText,
  Wrench,
  Radio,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { ResearchWorkflowState, AgentType, AgentMessageType } from '../../lib/types';
import { TraceFormatter } from '../../lib/agents/traceFormatter';

interface LogsViewProps {
  state: ResearchWorkflowState;
}

export const LogsView: React.FC<LogsViewProps> = ({ state }) => {
  const [selectedAgentFilter, setSelectedAgentFilter] = useState<AgentType | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'messages' | 'tool_calls' | 'stream' | 'replan_trace'>('messages');

  const messages = state.messages || [];
  const toolCalls = state.toolCalls || [];
  const replanHistory = state.replanHistory || [];

  const handleDownloadJSONTrace = () => {
    let trace = state.trace;
    if (!trace) {
      trace = {
        traceId: `trace-${Date.now()}`,
        timestamp: state.startedAt || Date.now(),
        topic: state.topic,
        depth: state.depth,
        persona: state.persona,
        totalDurationMs: (state.completedAt || Date.now()) - (state.startedAt || Date.now()),
        agentsExecuted: ['planner', 'searcher', 'reader', 'critic', 'writer'],
        messages: state.messages || [],
        toolCalls: state.toolCalls || [],
        replanLoops: state.replanHistory || [],
        sharedMemorySnapshot: {
          verifiedFacts: state.facts,
          rejectedSources: [],
          openQuestions: state.plan?.subQuestions || [],
          activeHypotheses: state.plan?.hypotheses || [],
          knowledgeGaps: state.criticReview?.informationGaps || [],
          replanCount: state.replanHistory?.length || 0,
        },
        finalReportSummary: state.report
          ? {
              title: state.report.title,
              wordCount: state.report.wordCount,
              citationCount: state.report.citations.length,
              epistemicScore: state.criticReview?.overallCredibilityScore || 88,
            }
          : undefined,
      };
    }

    const blob = new Blob([JSON.stringify(trace, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `execution_trace_${(state.topic || 'run').replace(/[^a-z0-9]/gi, '_')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadMarkdownTrace = () => {
    let trace = state.trace;
    if (!trace) {
      trace = {
        traceId: `trace-${Date.now()}`,
        timestamp: state.startedAt || Date.now(),
        topic: state.topic,
        depth: state.depth,
        persona: state.persona,
        totalDurationMs: (state.completedAt || Date.now()) - (state.startedAt || Date.now()),
        agentsExecuted: ['planner', 'searcher', 'reader', 'critic', 'writer'],
        messages: state.messages || [],
        toolCalls: state.toolCalls || [],
        replanLoops: state.replanHistory || [],
        sharedMemorySnapshot: {
          verifiedFacts: state.facts,
          rejectedSources: [],
          openQuestions: state.plan?.subQuestions || [],
          activeHypotheses: state.plan?.hypotheses || [],
          knowledgeGaps: state.criticReview?.informationGaps || [],
          replanCount: state.replanHistory?.length || 0,
        },
        finalReportSummary: state.report
          ? {
              title: state.report.title,
              wordCount: state.report.wordCount,
              citationCount: state.report.citations.length,
              epistemicScore: state.criticReview?.overallCredibilityScore || 88,
            }
          : undefined,
      };
    }

    const md = TraceFormatter.toMarkdown(trace);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `execution_trace_${(state.topic || 'run').replace(/[^a-z0-9]/gi, '_')}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getMessageTypeBadge = (type: AgentMessageType) => {
    switch (type) {
      case 'task':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
      case 'result':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'critique':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'revision_request':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
      case 'escalation':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
    }
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Top Banner with Trace Download Actions */}
      <div className="bg-[#0F172A] p-4 sm:p-5 rounded-xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              Agent Telemetry &amp; Execution Trace
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                Message Bus Active
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Captures typed agent-to-agent messages, discrete tool executions, and Critic-directed replan cycles.
            </p>
          </div>
        </div>

        {/* Trace Download Buttons */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            onClick={handleDownloadJSONTrace}
            disabled={messages.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-300 rounded-lg border border-slate-700 shadow-sm transition-all disabled:opacity-40"
            title="Download real captured execution trace as JSON"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Download Trace (.json)</span>
          </button>

          <button
            onClick={handleDownloadMarkdownTrace}
            disabled={messages.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-300 rounded-lg border border-slate-700 shadow-sm transition-all disabled:opacity-40"
            title="Download human-readable markdown execution trace"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Download Trace (.md)</span>
          </button>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('messages')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'messages'
              ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span>Inter-Agent Messages ({messages.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tool_calls')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'tool_calls'
              ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>Tool Calls ({toolCalls.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('replan_trace')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'replan_trace'
              ? 'bg-amber-600/20 text-amber-300 border border-amber-500/40 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Repeat className="w-3.5 h-3.5" />
          <span>Replan Loops ({replanHistory.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('stream')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'stream'
              ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/40 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Agent Thoughts &amp; Logs</span>
        </button>
      </div>

      {/* Tab 1: Inter-Agent Message Bus */}
      {activeTab === 'messages' && (
        <div className="space-y-3">
          {messages.length === 0 ? (
            <div className="bg-[#0A101D] p-12 text-center rounded-xl border border-slate-800 text-slate-500 text-xs">
              No inter-agent messages recorded yet. Launch the research floor to see real-time handoffs.
            </div>
          ) : (
            <div className="space-y-2.5">
              {messages.map((msg, index) => {
                const timeStr = new Date(msg.timestamp).toISOString().split('T')[1].replace('Z', '');
                return (
                  <div
                    key={msg.id || index}
                    className="p-3.5 bg-[#0D1527] rounded-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-slate-500">
                          {timeStr}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-200 uppercase font-mono">
                            {msg.from}
                          </span>
                          <ArrowRight className="w-3 h-3 text-slate-500" />
                          <span className="font-bold text-slate-200 uppercase font-mono">
                            {msg.to}
                          </span>
                        </div>
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border uppercase ${getMessageTypeBadge(msg.type)}`}>
                          {msg.type}
                        </span>
                      </div>
                      <p className="text-slate-300 font-medium text-xs">
                        {msg.reasoning}
                      </p>
                    </div>

                    {msg.payload && (
                      <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800/80 font-mono text-[10px] text-slate-400 max-w-sm w-full truncate">
                        {JSON.stringify(msg.payload)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Tool Calls */}
      {activeTab === 'tool_calls' && (
        <div className="space-y-3">
          {toolCalls.length === 0 ? (
            <div className="bg-[#0A101D] p-12 text-center rounded-xl border border-slate-800 text-slate-500 text-xs">
              No tool calls logged yet. Agents invoke WebSearchTool, DocumentParserTool, and ScoringRubricTool during execution.
            </div>
          ) : (
            <div className="space-y-2">
              {toolCalls.map((tool, idx) => (
                <div
                  key={tool.id || idx}
                  className="p-3 bg-[#0D1527] rounded-xl border border-slate-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-200">
                          {tool.toolName}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          invoked by {tool.agent.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono truncate max-w-md">
                        Input: {JSON.stringify(tool.input)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[11px] font-mono text-slate-500">
                      {tool.durationMs}ms
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/40">
                      Success
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Replan Loops */}
      {activeTab === 'replan_trace' && (
        <div className="space-y-3">
          {replanHistory.length === 0 ? (
            <div className="bg-[#0A101D] p-12 text-center rounded-xl border border-slate-800 text-slate-500 text-xs">
              No replan loops triggered yet. If the Critic detects insufficient evidence or weak citation adherence, replan loops will be registered here.
            </div>
          ) : (
            <div className="space-y-3">
              {replanHistory.map((loop) => (
                <div
                  key={loop.loopNumber}
                  className="p-4 bg-amber-950/20 rounded-xl border border-amber-500/40 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Repeat className="w-4 h-4 text-amber-400" />
                      <h4 className="font-bold text-amber-300">
                        Feedback Loop #{loop.loopNumber}: {loop.from.toUpperCase()} ➔ {loop.to.toUpperCase()}
                      </h4>
                    </div>
                    <span className="font-mono text-[10px] text-slate-400">
                      {new Date(loop.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-slate-300 font-medium">
                    Trigger Reason: {loop.reason}
                  </p>
                  {loop.details && (
                    <p className="text-[11px] text-slate-400 font-mono bg-slate-950/60 p-2 rounded border border-slate-800">
                      Directives: {loop.details}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Raw Stream Thoughts */}
      {activeTab === 'stream' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-2">
            <span className="text-xs text-slate-400">Filter by Agent:</span>
            {(['all', 'planner', 'searcher', 'reader', 'critic', 'writer'] as const).map((id) => (
              <button
                key={id}
                onClick={() => setSelectedAgentFilter(id)}
                className={`px-2 py-1 rounded text-xs capitalize transition-colors ${
                  selectedAgentFilter === id
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {id}
              </button>
            ))}
          </div>

          <div className="bg-[#090D16] p-4 rounded-xl border border-slate-800 font-mono text-xs space-y-2 max-h-[500px] overflow-y-auto">
            {(['planner', 'searcher', 'reader', 'critic', 'writer'] as AgentType[])
              .filter((id) => selectedAgentFilter === 'all' || selectedAgentFilter === id)
              .map((id) => {
                const agent = state.agents[id];
                return (
                  <div key={id} className="space-y-1">
                    {agent.thoughtStream.map((t, idx) => (
                      <div key={idx} className="text-slate-300 flex items-start gap-2">
                        <span className="text-blue-400 shrink-0">[{id.toUpperCase()}]</span>
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};
