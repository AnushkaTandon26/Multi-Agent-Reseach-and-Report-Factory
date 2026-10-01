'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  PenTool,
  Copy,
  Download,
  Printer,
  FileJson,
  Check,
  ShieldCheck,
  ExternalLink,
  Presentation,
  Volume2,
  BarChart3,
  Wand2,
} from 'lucide-react';
import { FinalReport, ResearchWorkflowState, AgentInfo } from '../../lib/types';
import { AudioBriefingPlayer } from '../AudioBriefingPlayer';
import { PresentationSlideDeck } from '../PresentationSlideDeck';
import { DataVisualizer } from '../DataVisualizer';
import { ReportCopilot } from '../ReportCopilot';

interface ReportViewProps {
  state: ResearchWorkflowState;
  report?: FinalReport;
  streamingChunk?: string;
  agent: AgentInfo;
  onRewriteReport?: (instruction: string) => void;
  isRewriting?: boolean;
}

export const ReportView: React.FC<ReportViewProps> = ({
  state,
  report,
  streamingChunk,
  agent,
  onRewriteReport,
  isRewriting = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [isSlideDeckOpen, setIsSlideDeckOpen] = useState(false);
  const [highlightedFactId, setHighlightedFactId] = useState<string | null>(null);

  const markdownToRender = report?.markdownContent || streamingChunk || '';
  const isWriterActive = state.activeAgent === 'writer';

  const handleCopy = () => {
    if (!markdownToRender) return;
    navigator.clipboard.writeText(markdownToRender);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    if (!markdownToRender) return;
    const blob = new Blob([markdownToRender], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(report?.topic || 'Research_Report').replace(/[^a-z0-9]/gi, '_')}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJSON = () => {
    const bundle = {
      workflow: {
        topic: state.topic,
        depth: state.depth,
        persona: state.persona,
        startedAt: state.startedAt,
        completedAt: state.completedAt,
      },
      plan: state.plan,
      sources: state.sources,
      facts: state.facts,
      criticReview: state.criticReview,
      report,
    };

    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(state.topic || 'Research_Bundle').replace(/[^a-z0-9]/gi, '_')}_bundle.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950/60 to-gray-900/60 p-5 rounded-2xl border border-purple-500/30 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <PenTool className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Stage 05: Executive Synthesizer</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-purple-500/20 text-purple-300 border border-purple-500/40">
                {agent.status.toUpperCase()}
              </span>
              {isWriterActive && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/30 text-purple-200 animate-pulse border border-purple-400/40">
                  Live Streaming Draft...
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400">
              Synthesizes verified facts, comparative matrices, and critic directives into an executive whitepaper.
            </p>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          {report?.slides && report.slides.length > 0 && (
            <button
              onClick={() => setIsSlideDeckOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-semibold text-white shadow-lg shadow-purple-600/30 transition-all"
            >
              <Presentation className="w-4 h-4" />
              <span>Slide Deck Mode</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            disabled={!markdownToRender}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-xs font-medium text-gray-200 border border-gray-800 transition-all disabled:opacity-40"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownloadMarkdown}
            disabled={!markdownToRender}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-xs font-medium text-gray-200 border border-gray-800 transition-all disabled:opacity-40"
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span>.md</span>
          </button>

          <button
            onClick={handlePrint}
            disabled={!markdownToRender}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-xs font-medium text-gray-200 border border-gray-800 transition-all disabled:opacity-40"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>PDF</span>
          </button>

          <button
            onClick={handleDownloadJSON}
            disabled={!report}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-900/40 hover:bg-purple-900/60 text-xs font-medium text-purple-300 border border-purple-700/50 transition-all disabled:opacity-40 shadow-sm"
          >
            <FileJson className="w-4 h-4 text-purple-400" />
            <span>JSON</span>
          </button>
        </div>
      </div>

      {/* 2-Speaker AI Podcast Player (Feature 3) */}
      {report?.podcastDialogue && (
        <AudioBriefingPlayer
          dialogue={report.podcastDialogue}
          topic={report.topic}
        />
      )}

      {/* Interactive Report Co-Pilot (Feature 1) */}
      {report && onRewriteReport && (
        <ReportCopilot
          onRewriteRequest={onRewriteReport}
          isRewriting={isRewriting}
        />
      )}

      {/* Main Report Body & Visualizer Grid */}
      {!markdownToRender ? (
        <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-16 text-center text-gray-400 space-y-3">
          <PenTool className="w-12 h-12 mx-auto text-purple-500/40 animate-pulse" />
          <h3 className="text-base font-bold text-gray-200">Synthesis Canvas Ready</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            The Writer Agent will draft the complete cited report once the Planner, Scout, Reader, and Critic complete their stages.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Interactive Data Visualizer (Feature 2) */}
          {state.facts.length > 0 && (
            <DataVisualizer
              facts={state.facts}
              criticReview={state.criticReview}
            />
          )}

          {/* Main Whitepaper Container */}
          <div className="bg-gray-900/80 rounded-2xl border border-gray-800 p-6 sm:p-10 shadow-2xl backdrop-blur-md">
            {/* Metadata Header if complete */}
            {report && (
              <div className="flex flex-wrap items-center justify-between gap-3 pb-6 mb-6 border-b border-gray-800 text-xs font-mono text-gray-400">
                <div className="flex items-center gap-3">
                  <span className="bg-gray-950 px-2.5 py-1 rounded-lg border border-gray-800 text-gray-300">
                    {report.wordCount} words
                  </span>
                  <span className="bg-gray-950 px-2.5 py-1 rounded-lg border border-gray-800 text-gray-300">
                    ~{report.readingTimeMinutes} min read
                  </span>
                  <span className="bg-indigo-950 px-2.5 py-1 rounded-lg border border-indigo-800/40 text-indigo-300">
                    {report.citations.length} primary citations
                  </span>
                  <span className="bg-purple-950 px-2.5 py-1 rounded-lg border border-purple-800/40 text-purple-300 uppercase">
                    Persona: {state.persona}
                  </span>
                </div>
                <div>
                  Published: {new Date(report.generatedAt).toLocaleDateString()}
                </div>
              </div>
            )}

            {/* Rendered Markdown */}
            <article className="prose-report max-w-4xl mx-auto">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {markdownToRender}
              </ReactMarkdown>

              {isWriterActive && (
                <span className="inline-block w-2.5 h-5 bg-purple-400 animate-pulse ml-1 align-middle" />
              )}
            </article>

            {/* Interactive Citations & Fact Trace Provenance (Feature 7) */}
            {report && report.citations.length > 0 && (
              <div className="mt-16 pt-8 border-t border-gray-800 max-w-4xl mx-auto space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Interactive Provenance Registry &amp; Citations ({report.citations.length})
                  </h3>
                  <span className="text-[11px] font-mono text-indigo-400">
                    Hover citations in text to trace provenance
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {report.citations.map((c) => (
                    <a
                      key={c.id}
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3.5 bg-gray-950/70 hover:bg-gray-950 rounded-xl border border-gray-800 hover:border-indigo-500/50 transition-all flex items-start justify-between gap-3 group"
                    >
                      <div className="space-y-1 overflow-hidden">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono bg-indigo-950 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-800/50">
                            [^{c.index}]
                          </span>
                          <h4 className="text-xs font-bold text-gray-200 group-hover:text-indigo-300 truncate">
                            {c.title}
                          </h4>
                        </div>
                        <p className="text-[11px] text-gray-500 truncate">
                          {c.authorOrOrg} · {c.domain}
                        </p>
                      </div>
                      <div className="flex flex-col items-end shrink-0">
                        <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-indigo-400 transition-colors" />
                        <span className="text-[10px] font-mono text-emerald-400 mt-1 font-semibold">
                          {c.credibilityScore}%
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Slide Deck Modal */}
      {report?.slides && (
        <PresentationSlideDeck
          isOpen={isSlideDeckOpen}
          onClose={() => setIsSlideDeckOpen(false)}
          slides={report.slides}
          topic={report.topic}
        />
      )}
    </div>
  );
};
