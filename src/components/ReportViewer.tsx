'use client';

import React, { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import {
  Download,
  Copy,
  Printer,
  FileJson,
  Check,
  BookOpen,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  List,
  PenTool,
  Clock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { FinalReport, ResearchWorkflowState } from '../lib/types';

interface ReportViewerProps {
  state: ResearchWorkflowState;
  report?: FinalReport;
  streamingChunk?: string;
}

export const ReportViewer: React.FC<ReportViewerProps> = ({
  state,
  report,
  streamingChunk,
}) => {
  const [copied, setCopied] = useState(false);
  const [showToc, setShowToc] = useState(false);
  const [highlightedCitation, setHighlightedCitation] = useState<number | null>(null);

  const markdownToRender = report?.markdownContent || streamingChunk || '';
  const isWriterActive = state.activeAgent === 'writer';

  // Extract table of contents from markdown headings
  const tableOfContents = useMemo(() => {
    if (!markdownToRender) return [];
    const lines = markdownToRender.split('\n');
    const toc: { level: number; title: string; id: string }[] = [];

    lines.forEach((line) => {
      const match = line.match(/^(#{1,3})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const rawTitle = match[2].trim().replace(/\*\*/g, '').replace(/\[\^\d+\]/g, '');
        const id = rawTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        toc.push({ level, title: rawTitle, id });
      }
    });

    return toc;
  }, [markdownToRender]);

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
    link.download = `${(report?.topic || 'Research_Whitepaper').replace(/[^a-z0-9]/gi, '_')}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJSON = () => {
    const bundle = {
      metadata: {
        system: 'Multi-Agent Research and Report Factory',
        version: '2.0.0',
        timestamp: new Date().toISOString(),
        topic: state.topic,
        depth: state.depth,
        persona: state.persona,
      },
      plan: state.plan,
      sources: state.sources,
      facts: state.facts,
      criticReview: state.criticReview,
      report,
      replanHistory: state.replanHistory || [],
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

  const scrollToCitation = (citIndex: number) => {
    setHighlightedCitation(citIndex);
    const element = document.getElementById(`citation-ref-${citIndex}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.remove('citation-target-highlight');
      void element.offsetWidth; // trigger reflow
      element.classList.add('citation-target-highlight');
    }
  };

  // Custom markdown component transformations
  const customComponents = {
    a: ({ href, children, ...props }: any) => {
      // Check if it's a footnote link [^n]
      const text = String(children);
      const footnoteMatch = text.match(/\[\^?(\d+)\]/);
      if (footnoteMatch) {
        const citIdx = parseInt(footnoteMatch[1], 10);
        return (
          <button
            type="button"
            onClick={() => scrollToCitation(citIdx)}
            className="citation-sup inline-flex items-center"
            title={`Jump to Reference [${citIdx}]`}
          >
            [{citIdx}]
          </button>
        );
      }

      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 underline font-medium inline-flex items-center gap-0.5"
          {...props}
        >
          {children}
        </a>
      );
    },
    h1: ({ children, ...props }: any) => {
      const id = String(children).toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return <h1 id={id} {...props}>{children}</h1>;
    },
    h2: ({ children, ...props }: any) => {
      const id = String(children).toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return <h2 id={id} {...props}>{children}</h2>;
    },
    h3: ({ children, ...props }: any) => {
      const id = String(children).toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return <h3 id={id} {...props}>{children}</h3>;
    },
  };

  const estimatedReadingTime = report?.readingTimeMinutes || Math.max(1, Math.ceil((markdownToRender.split(/\s+/).length) / 200));

  return (
    <div className="flex flex-col h-full bg-[#0D1527] rounded-xl border border-slate-800 shadow-xl overflow-hidden backdrop-blur-md">
      {/* Report Toolbar Header */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-[#0C1222] px-4 py-2.5 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-purple-950/60 border border-purple-800/60 flex items-center justify-center text-purple-400">
            <PenTool className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100 flex items-center gap-2">
              Synthesized Research Whitepaper
              {isWriterActive && (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-500/20 text-purple-300 font-mono animate-pulse">
                  Streaming Draft...
                </span>
              )}
            </h3>
            {markdownToRender && (
              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                <span>{markdownToRender.trim().split(/\s+/).length} words</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {estimatedReadingTime} min read
                </span>
                {report && report.citations.length > 0 && (
                  <>
                    <span>·</span>
                    <span className="text-blue-400 font-semibold">{report.citations.length} cited sources</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Controls & Export Buttons */}
        <div className="flex items-center gap-1.5 no-print">
          {tableOfContents.length > 0 && (
            <button
              onClick={() => setShowToc(!showToc)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white border border-slate-700 transition-all"
              title="Toggle Table of Contents"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">TOC</span>
              {showToc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}

          <button
            onClick={handleCopy}
            disabled={!markdownToRender}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white border border-slate-700 transition-all disabled:opacity-40"
            title="Copy Markdown source"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownloadMarkdown}
            disabled={!markdownToRender}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white border border-slate-700 transition-all disabled:opacity-40"
            title="Download .md whitepaper"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">.md</span>
          </button>

          <button
            onClick={handlePrint}
            disabled={!markdownToRender}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white border border-slate-700 transition-all disabled:opacity-40"
            title="Print or Export as PDF"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">PDF</span>
          </button>

          <button
            onClick={handleDownloadJSON}
            disabled={!report}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white border border-slate-700 transition-all disabled:opacity-40"
            title="Export Multi-Agent Research Bundle (JSON)"
          >
            <FileJson className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">JSON</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout with optional Table of Contents Drawer */}
      <div className="flex-1 flex overflow-hidden">
        {/* Table of Contents Drawer (Collapsible) */}
        {showToc && tableOfContents.length > 0 && (
          <aside className="w-64 border-r border-slate-800 bg-[#0C1222]/90 p-4 overflow-y-auto shrink-0 no-print">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <List className="w-3.5 h-3.5 text-blue-400" />
              Table of Contents
            </h4>
            <nav className="space-y-1 text-xs">
              {tableOfContents.map((item, idx) => (
                <a
                  key={idx}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`block py-1 text-slate-400 hover:text-blue-300 transition-colors truncate ${
                    item.level === 1 ? 'font-bold text-slate-200' : item.level === 2 ? 'pl-3' : 'pl-6 text-[11px]'
                  }`}
                >
                  {item.title}
                </a>
              ))}
            </nav>
          </aside>
        )}

        {/* Main Document Canvas */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#090D16]">
          {!markdownToRender ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-20 text-slate-500">
              <div className="w-14 h-14 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-3">
                <PenTool className="w-6 h-6 text-purple-500/50" />
              </div>
              <h4 className="text-sm font-semibold text-slate-300 mb-1">
                Executive Synthesis Standby
              </h4>
              <p className="text-xs text-slate-500 max-w-sm">
                The Writer Agent will synthesize verified claims, comparative data tables, and inline footnote citations once the Planner, Scout, Reader, and Critic complete their stages.
              </p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-8">
              {/* Whitepaper Article Content */}
              <article className="prose-report">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={customComponents}
                >
                  {markdownToRender}
                </ReactMarkdown>

                {/* Streaming Cursor */}
                {isWriterActive && (
                  <span className="inline-block w-2 h-4 bg-purple-400 animate-pulse ml-1 align-middle" />
                )}
              </article>

              {/* Interactive Primary Sources & Citations Tray */}
              {report && report.citations.length > 0 && (
                <div className="mt-12 pt-6 border-t border-slate-800">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      Primary Reference Bibliography ({report.citations.length})
                    </h4>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Verified by Epistemic Critic
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {report.citations.map((c) => {
                      const isHighlighted = highlightedCitation === c.index;
                      return (
                        <div
                          key={c.id}
                          id={`citation-ref-${c.index}`}
                          className={`p-3 rounded-lg border transition-all flex flex-col justify-between gap-2 ${
                            isHighlighted
                              ? 'bg-blue-950/40 border-blue-500 shadow-md ring-1 ring-blue-500/50'
                              : 'bg-slate-900/80 border-slate-800/80 hover:border-slate-700'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center justify-between gap-1.5">
                              <span className="text-[10px] font-mono bg-blue-950 text-blue-300 px-1.5 py-0.2 rounded border border-blue-800/50">
                                [^{c.index}]
                              </span>
                              <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                                {c.credibilityScore}% Reliability
                              </span>
                            </div>
                            <h5 className="text-xs font-semibold text-slate-200 line-clamp-1">
                              {c.title}
                            </h5>
                            <p className="text-[11px] text-slate-400 truncate">
                              {c.authorOrOrg} · {c.domain}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                            <span className="text-slate-500 text-[10px]">
                              Accessed: {c.accessedDate}
                            </span>
                            <a
                              href={c.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1 text-[11px]"
                            >
                              <span>View Source</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
