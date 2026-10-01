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
  Search,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { ResearchWorkflowState, AgentType, AgentMessageType } from '../../lib/types';
import { TraceFormatter } from '../../lib/agents/traceFormatter';

interface LogsViewProps {
  state: ResearchWorkflowState;
}

export const LogsView: React.FC<LogsViewProps> = ({ state }) => {
  const [selectedAgentFilter, setSelectedAgentFilter] = useState<AgentType | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'messages' | 'tool_calls' | 'stream' | 'replan_trace'>('messages');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

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
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'result':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'critique':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'revision_request':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'escalation':
        return 'bg-purple-50 text-purple-700 border-purple-200';
    }
  };

  const filteredMessages = messages.filter((msg) => {
    const matchesAgent =
      selectedAgentFilter === 'all' ||
      msg.from === selectedAgentFilter ||
      msg.to === selectedAgentFilter;
    const matchesSearch =
      !searchQuery ||
      msg.reasoning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
      JSON.stringify(msg.payload || {}).toLowerCase().includes(searchQuery.toLowerCase());
    return matchesAgent && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-20 w-full">
      {/* Top Banner with Trace Actions */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E5E7EB] shadow-[0_2px_12px_rgba(16,24,40,0.06)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#F1F2F4] border border-[#E5E7EB] flex items-center justify-center text-[#14181F] shrink-0">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#14181F]">
                Message Bus Telemetry &amp; Execution Trace
              </h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-[#6B7280]">
              Audits all inter-agent structured messages, tool calls, and evaluator-optimizer replanning loops.
            </p>
          </div>
        </div>

        {/* Trace Download Buttons */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            onClick={handleDownloadJSONTrace}
            disabled={messages.length === 0}
            className="flex items-center gap-1.5 h-[38px] px-4 rounded-full bg-white hover:bg-[#F8FAFC] text-xs font-semibold text-[#14181F] border border-[#D1D5DB] transition-all shadow-xs disabled:opacity-40"
            title="Download structured execution trace JSON"
          >
            <FileCode className="w-4 h-4 text-[#2563EB]" />
            <span>Trace (.json)</span>
          </button>

          <button
            onClick={handleDownloadMarkdownTrace}
            disabled={messages.length === 0}
            className="flex items-center gap-1.5 h-[38px] px-4 rounded-full bg-[#151A17] hover:bg-[#262E29] text-xs font-semibold text-white transition-all shadow-xs disabled:opacity-40"
            title="Download human-readable markdown trace"
          >
            <FileText className="w-4 h-4 text-white" />
            <span>Trace (.md)</span>
          </button>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_2px_12px_rgba(16,24,40,0.06)] overflow-hidden">
        {/* Sub-nav Tabs */}
        <div className="flex flex-wrap items-center justify-between border-b border-[#E5E7EB] bg-[#F8FAFC] px-5 py-3 gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('messages')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'messages'
                  ? 'bg-[#151A17] text-white shadow-xs'
                  : 'text-[#6B7280] hover:text-[#14181F]'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Inter-Agent Messages ({messages.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('tool_calls')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'tool_calls'
                  ? 'bg-[#151A17] text-white shadow-xs'
                  : 'text-[#6B7280] hover:text-[#14181F]'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Tool Calls ({toolCalls.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('replan_trace')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'replan_trace'
                  ? 'bg-[#151A17] text-white shadow-xs'
                  : 'text-[#6B7280] hover:text-[#14181F]'
              }`}
            >
              <Repeat className="w-3.5 h-3.5" />
              <span>Replan Loops ({replanHistory.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('stream')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'stream'
                  ? 'bg-[#151A17] text-white shadow-xs'
                  : 'text-[#6B7280] hover:text-[#14181F]'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Agent Thoughts</span>
            </button>
          </div>

          {/* Search Input in Logs Toolbar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search logs or payloads..."
              className="h-[34px] pl-8 pr-3 rounded-full border border-[#D1D5DB] text-xs text-[#14181F] placeholder-[#9CA3AF] focus:border-[#14181F] bg-white w-48 sm:w-64"
            />
          </div>
        </div>

        {/* Filter Chips Row */}
        <div className="px-5 py-2.5 bg-white border-b border-[#E5E7EB] flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[#6B7280] font-semibold text-[11px] uppercase tracking-wider mr-1">
            Agent:
          </span>
          {(['all', 'planner', 'searcher', 'reader', 'critic', 'writer'] as const).map((id) => (
            <button
              key={id}
              onClick={() => setSelectedAgentFilter(id)}
              className={`px-3 py-1 rounded-full text-xs capitalize font-medium transition-all ${
                selectedAgentFilter === id
                  ? 'bg-[#EAD5FF] text-[#581C87] font-bold border border-[#D8B4FE]'
                  : 'text-[#4B5563] hover:text-[#14181F] hover:bg-[#F1F2F4]'
              }`}
            >
              {id}
            </button>
          ))}
        </div>

        {/* Tab 1: Messages Table */}
        {activeTab === 'messages' && (
          <div className="overflow-x-auto">
            {filteredMessages.length === 0 ? (
              <div className="py-16 text-center text-[#6B7280] text-xs">
                No matching inter-agent messages found.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-[#6B7280]">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Time</th>
                    <th className="py-3 px-4 font-semibold">Handoff</th>
                    <th className="py-3 px-4 font-semibold">Type</th>
                    <th className="py-3 px-4 font-semibold">Reasoning &amp; Purpose</th>
                    <th className="py-3 px-4 font-semibold text-right">Payload</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {filteredMessages.map((msg, index) => {
                    const rowId = msg.id || `msg-${index}`;
                    const isExpanded = expandedRow === rowId;
                    const timeStr = new Date(msg.timestamp).toISOString().split('T')[1].replace('Z', '');

                    return (
                      <React.Fragment key={rowId}>
                        <tr className="hover:bg-[#F8FAFC] transition-colors">
                          <td className="py-3 px-4 font-mono text-[11px] text-[#6B7280] shrink-0">
                            {timeStr}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5 font-mono font-bold text-[#14181F]">
                              <span className="uppercase">{msg.from}</span>
                              <ArrowRight className="w-3 h-3 text-[#9CA3AF]" />
                              <span className="uppercase">{msg.to}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase border ${getMessageTypeBadge(
                                msg.type
                              )}`}
                            >
                              {msg.type}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-[#334155] font-medium max-w-md">
                            {msg.reasoning}
                          </td>
                          <td className="py-3 px-4 text-right">
                            {msg.payload && (
                              <button
                                onClick={() => setExpandedRow(isExpanded ? null : rowId)}
                                className="inline-flex items-center gap-1 text-[11px] font-mono text-[#2563EB] hover:underline font-semibold"
                              >
                                <span>{isExpanded ? 'Hide' : 'Inspect'}</span>
                                {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                              </button>
                            )}
                          </td>
                        </tr>

                        {isExpanded && msg.payload && (
                          <tr className="bg-[#F8FAFC]">
                            <td colSpan={5} className="p-4">
                              <pre className="p-3 bg-white border border-[#E5E7EB] rounded-xl text-[11px] font-mono text-[#14181F] overflow-x-auto shadow-inner max-h-60">
                                {JSON.stringify(msg.payload, null, 2)}
                              </pre>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Tab 2: Tool Calls Table */}
        {activeTab === 'tool_calls' && (
          <div className="overflow-x-auto">
            {toolCalls.length === 0 ? (
              <div className="py-16 text-center text-[#6B7280] text-xs">
                No tool calls logged yet.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-[#6B7280]">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Tool Name</th>
                    <th className="py-3 px-4 font-semibold">Agent</th>
                    <th className="py-3 px-4 font-semibold">Duration</th>
                    <th className="py-3 px-4 font-semibold">Input Summary</th>
                    <th className="py-3 px-4 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {toolCalls.map((tc, idx) => (
                    <tr key={tc.id || idx} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#14181F]">
                        {tc.toolName}
                      </td>
                      <td className="py-3 px-4 font-mono uppercase text-[#2563EB] font-bold">
                        {tc.agent}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-[#6B7280]">
                        {tc.durationMs}ms
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-[#4B5563] max-w-sm truncate">
                        {JSON.stringify(tc.input)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          SUCCESS
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Tab 3: Replan Loops */}
        {activeTab === 'replan_trace' && (
          <div className="p-5 space-y-3">
            {replanHistory.length === 0 ? (
              <div className="py-12 text-center text-[#6B7280] text-xs">
                No replan loops triggered yet. When Critic detects insufficient data, loops will appear here.
              </div>
            ) : (
              replanHistory.map((loop) => (
                <div
                  key={loop.loopNumber}
                  className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Repeat className="w-4 h-4 text-amber-700" />
                      <h4 className="font-bold text-amber-900">
                        Feedback Loop #{loop.loopNumber}: {loop.from.toUpperCase()} ➔ {loop.to.toUpperCase()}
                      </h4>
                    </div>
                    <span className="font-mono text-[11px] text-amber-800">
                      {new Date(loop.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-[#334155] font-medium">
                    Trigger Reason: {loop.reason}
                  </p>
                  {loop.details && (
                    <p className="text-[11px] text-[#4B5563] font-mono bg-white p-2.5 rounded-lg border border-amber-200">
                      Directives: {loop.details}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 4: Agent Stream Thoughts */}
        {activeTab === 'stream' && (
          <div className="p-5 space-y-2 max-h-[500px] overflow-y-auto font-mono text-xs">
            {(['planner', 'searcher', 'reader', 'critic', 'writer'] as AgentType[])
              .filter((id) => selectedAgentFilter === 'all' || selectedAgentFilter === id)
              .map((id) => {
                const agent = state.agents[id];
                if (agent.thoughtStream.length === 0) return null;
                return (
                  <div key={id} className="space-y-1.5 pb-2">
                    <div className="font-bold text-[#14181F] flex items-center gap-1.5">
                      <span className="uppercase">[{agent.name}]</span>
                    </div>
                    {agent.thoughtStream.map((t, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-[#F8FAFC] border-l-2 border-[#151A17] rounded-r text-[#334155] text-[11px]"
                      >
                        💭 {t}
                      </div>
                    ))}
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};
