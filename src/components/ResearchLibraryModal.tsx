'use client';

import React, { useState, useEffect } from 'react';
import { Bookmark, X, Search, Trash2, ArrowRight, Clock, FileText, Download } from 'lucide-react';
import { SavedResearchItem, FinalReport } from '../lib/types';

interface ResearchLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadReport: (item: SavedResearchItem) => void;
  currentReport?: FinalReport;
}

export const ResearchLibraryModal: React.FC<ResearchLibraryModalProps> = ({
  isOpen,
  onClose,
  onLoadReport,
  currentReport,
}) => {
  const [savedItems, setSavedItems] = useState<SavedResearchItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Load from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('research_factory_library');
        if (raw) {
          setSavedItems(JSON.parse(raw));
        }
      } catch {
        // ignore
      }
    }
  }, [isOpen]);

  // Save current report if provided and not already saved
  const handleSaveCurrent = () => {
    if (!currentReport) return;
    const newItem: SavedResearchItem = {
      id: `lib-${Date.now()}`,
      topic: currentReport.topic,
      depth: currentReport.plan.depth,
      persona: currentReport.plan.persona || 'executive',
      savedAt: new Date().toISOString(),
      report: currentReport,
      sourcesCount: currentReport.citations.length,
      factsCount: currentReport.criticReview.verifiedFactsCount,
      credibilityScore: currentReport.criticReview.overallCredibilityScore,
    };

    const updated = [newItem, ...savedItems.filter((i) => i.topic !== currentReport.topic)];
    setSavedItems(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('research_factory_library', JSON.stringify(updated));
    }
  };

  const handleDelete = (id: string) => {
    const updated = savedItems.filter((i) => i.id !== id);
    setSavedItems(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('research_factory_library', JSON.stringify(updated));
    }
  };

  if (!isOpen) return null;

  const filtered = savedItems.filter((i) =>
    i.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl space-y-4 text-gray-200">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">
              Research Archive &amp; Library
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar & Search */}
        <div className="flex items-center justify-between gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search saved whitepapers..."
              className="w-full bg-gray-950 px-3 py-2 rounded-xl border border-gray-800 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {currentReport && (
            <button
              onClick={handleSaveCurrent}
              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all shrink-0"
            >
              + Bookmark Current Report
            </button>
          )}
        </div>

        {/* Items List */}
        <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-xs">
              No saved research reports yet. Launch a topic and bookmark the report here.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="p-3.5 bg-gray-950/80 hover:bg-gray-800/60 rounded-xl border border-gray-800 hover:border-indigo-500/40 transition-all flex items-center justify-between gap-3 group"
              >
                <div className="space-y-1 overflow-hidden">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800/40 uppercase">
                      {item.persona}
                    </span>
                    <h4 className="text-xs font-bold text-gray-100 group-hover:text-indigo-300 truncate">
                      {item.topic}
                    </h4>
                  </div>
                  <p className="text-[11px] text-gray-500 font-mono">
                    {item.report.wordCount} words · Score: {item.credibilityScore}% · {new Date(item.savedAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      onLoadReport(item);
                      onClose();
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded-lg text-xs font-medium border border-indigo-500/40 transition-all"
                  >
                    <span>Load</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-gray-500 hover:text-rose-400 hover:bg-gray-800 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
