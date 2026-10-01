'use client';

import React, { useState } from 'react';
import {
  PenTool,
  Copy,
  Download,
  Printer,
  FileJson,
  Check,
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
import { ReportViewer } from '../ReportViewer';

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
  const [isSlideDeckOpen, setIsSlideDeckOpen] = useState(false);

  return (
    <div className="space-y-6 pb-20 w-full">
      {/* Top Banner (White Card) */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E5E7EB] shadow-[0_2px_12px_rgba(16,24,40,0.06)] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FAF5FF] border border-[#E9D5FF] flex items-center justify-center text-[#A855F7] shrink-0">
            <PenTool className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#14181F]">
                Stage 05: Executive Synthesizer
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-purple-50 text-purple-700 font-bold border border-purple-200">
                {agent.status}
              </span>
              {state.activeAgent === 'writer' && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-purple-100 text-purple-800 animate-pulse font-bold border border-purple-300">
                  Live Streaming Draft...
                </span>
              )}
            </div>
            <p className="text-xs text-[#6B7280]">
              Synthesizes verified facts, comparative matrices, and critic directives into an executive whitepaper.
            </p>
          </div>
        </div>

        {report?.slides && report.slides.length > 0 && (
          <button
            onClick={() => setIsSlideDeckOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#151A17] hover:bg-[#262E29] text-xs font-semibold text-white transition-all shadow-xs shrink-0"
          >
            <Presentation className="w-4 h-4" />
            <span>Open Presentation Slides</span>
          </button>
        )}
      </div>

      {/* 2-Speaker AI Podcast Player */}
      {report?.podcastDialogue && (
        <AudioBriefingPlayer
          dialogue={report.podcastDialogue}
          topic={report.topic}
        />
      )}

      {/* Interactive Report Co-Pilot */}
      {report && onRewriteReport && (
        <ReportCopilot
          onRewriteRequest={onRewriteReport}
          isRewriting={isRewriting}
        />
      )}

      {/* Interactive Quantitative Data Visualizer */}
      {state.facts.length > 0 && (
        <DataVisualizer
          facts={state.facts}
          criticReview={state.criticReview}
        />
      )}

      {/* Main Whitepaper Viewer (Centered 760px column) */}
      <ReportViewer
        state={state}
        report={report}
        streamingChunk={streamingChunk}
      />

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
