'use client';

import React, { useState } from 'react';
import { Search, ExternalLink, Globe, Filter, CheckCircle2, ToggleLeft, ToggleRight, Trash2, Plus } from 'lucide-react';
import { SearchSource, AgentInfo, SearchScope } from '../../lib/types';

interface SearcherViewProps {
  sources: SearchSource[];
  agent: AgentInfo;
  onToggleSource?: (id: string) => void;
  onAddCustomSource?: (source: Partial<SearchSource>) => void;
}

export const SearcherView: React.FC<SearcherViewProps> = ({
  sources,
  agent,
  onToggleSource,
  onAddCustomSource,
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [customTitle, setCustomTitle] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [isAddingSource, setIsAddingSource] = useState(false);

  const uniqueDomains = Array.from(new Set(sources.map((s) => s.domain)));

  const filteredSources = sources.filter((s) => {
    const matchesDomain = selectedDomain === 'all' || s.domain === selectedDomain;
    const matchesText =
      filterQuery === '' ||
      s.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
      s.snippet.toLowerCase().includes(filterQuery.toLowerCase()) ||
      s.domain.toLowerCase().includes(filterQuery.toLowerCase());
    return matchesDomain && matchesText;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim() || !onAddCustomSource) return;

    let domain = 'custom-source.org';
    try {
      if (customUrl.trim()) {
        domain = new URL(customUrl).hostname.replace(/^www\./, '');
      }
    } catch {
      // default domain
    }

    onAddCustomSource({
      id: `src-user-${Date.now()}`,
      title: customTitle.trim(),
      url: customUrl.trim() || '#',
      domain,
      snippet: `User injected custom research source for targeted analysis: "${customTitle.trim()}".`,
      publishDate: new Date().toISOString().split('T')[0],
      query: 'User Verified Addition',
      relevanceScore: 98,
      authorOrOrg: domain,
      enabled: true,
    });

    setCustomTitle('');
    setCustomUrl('');
    setIsAddingSource(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/60 to-gray-900/60 p-5 rounded-2xl border border-emerald-500/30 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Stage 02: Literature Scout</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                {agent.status.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Dispatches multi-angle web and academic probes to retrieve primary source literature, datasets, and reports.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddingSource(!isAddingSource)}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded-xl text-xs font-semibold border border-emerald-500/40 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Source</span>
          </button>
          <div className="text-right hidden md:block">
            <span className="text-[10px] font-mono text-gray-500 block uppercase">Sources Indexed</span>
            <span className="text-sm font-mono font-bold text-emerald-400">{sources.length} Documents</span>
          </div>
        </div>
      </div>

      {/* Add Custom Source Form */}
      {isAddingSource && (
        <form onSubmit={handleAddSubmit} className="bg-gray-900 p-4 rounded-2xl border border-emerald-500/40 space-y-3 animate-fadeIn">
          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            Inject Verified Reference URL / Article
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="Article / Whitepaper Title (e.g. 'Nature Solid-State Energy Density Report 2025')"
              className="bg-gray-950 px-3 py-2 rounded-xl border border-gray-800 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-emerald-500"
            />
            <input
              type="text"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="URL (e.g. 'https://nature.com/articles/s41586-2025')"
              className="bg-gray-950 px-3 py-2 rounded-xl border border-gray-800 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddingSource(false)}
              className="px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!customTitle.trim()}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold disabled:opacity-40"
            >
              Save Source
            </button>
          </div>
        </form>
      )}

      {sources.length === 0 ? (
        <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-12 text-center text-gray-400 space-y-3">
          <Search className="w-12 h-12 mx-auto text-emerald-500/40 animate-pulse" />
          <h3 className="text-base font-bold text-gray-200">Literature Scout in Standby</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Once the research pipeline starts, the Scout will query academic repositories and live web feeds to discover reference documents.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Filter & Domain Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-900/70 p-3.5 rounded-2xl border border-gray-800">
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Filter sources by title or keyword..."
                className="w-full bg-gray-950 px-3 py-1.5 rounded-xl border border-gray-800 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Domain Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              <button
                onClick={() => setSelectedDomain('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all shrink-0 ${
                  selectedDomain === 'all'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-950 text-gray-400 hover:text-white border border-gray-800'
                }`}
              >
                All Domains ({sources.length})
              </button>
              {uniqueDomains.map((domain) => (
                <button
                  key={domain}
                  onClick={() => setSelectedDomain(domain)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all shrink-0 ${
                    selectedDomain === domain
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-950 text-gray-400 hover:text-white border border-gray-800'
                  }`}
                >
                  {domain}
                </button>
              ))}
            </div>
          </div>

          {/* Sources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSources.map((src, i) => {
              const isEnabled = src.enabled !== false;

              return (
                <div
                  key={src.id || i}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 group shadow-md ${
                    isEnabled
                      ? 'bg-gray-900/80 border-gray-800 hover:border-emerald-500/50'
                      : 'bg-gray-950/40 border-gray-900 opacity-50'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono bg-emerald-950/80 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-800/40">
                          {src.domain}
                        </span>
                        {src.isCustomUpload && (
                          <span className="text-[10px] font-mono bg-purple-950 text-purple-300 px-2 py-0.5 rounded-md border border-purple-800/40">
                            Custom File
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {onToggleSource && (
                          <button
                            onClick={() => onToggleSource(src.id)}
                            className="text-xs text-gray-400 hover:text-emerald-400 p-0.5"
                            title={isEnabled ? 'Disable source from report' : 'Enable source'}
                          >
                            {isEnabled ? (
                              <ToggleRight className="w-5 h-5 text-emerald-400" />
                            ) : (
                              <ToggleLeft className="w-5 h-5 text-gray-600" />
                            )}
                          </button>
                        )}
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-emerald-400 p-1 transition-colors"
                          title="Open source URL"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-gray-100 group-hover:text-emerald-300 transition-colors leading-snug">
                      {src.title}
                    </h3>

                    <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                      {src.snippet}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-gray-800 flex items-center justify-between text-[11px] font-mono text-gray-500">
                    <span className="truncate max-w-[200px]">Query: {src.query}</span>
                    {src.publishDate && <span>Date: {src.publishDate}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
