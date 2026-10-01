'use client';

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Compass,
  Search,
  BookOpen,
  ShieldCheck,
  PenTool,
  Terminal,
  Sliders,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Bookmark,
  UploadCloud,
  FileText,
} from 'lucide-react';
import { ResearchWorkflowState, AgentType } from '../lib/types';

export type NavView = 'floor' | 'planner' | 'searcher' | 'reader' | 'critic' | 'report' | 'logs';

interface SidebarProps {
  currentView: NavView;
  setCurrentView: (view: NavView) => void;
  state: ResearchWorkflowState;
  onOpenSettings: () => void;
  onOpenPresets: () => void;
  onOpenLibrary: () => void;
  onOpenUploader: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setCurrentView,
  state,
  onOpenSettings,
  onOpenPresets,
  onOpenLibrary,
  onOpenUploader,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true); // default collapsed to prioritize top & bottom nav
  const isRunning = state.status === 'running';

  const navItems = [
    {
      id: 'floor' as NavView,
      label: 'Overview',
      icon: <LayoutDashboard className="w-4 h-4 text-[#14181F]" />,
    },
    {
      id: 'planner' as NavView,
      agentId: 'planner' as AgentType,
      label: '1. Planner',
      icon: <Compass className="w-4 h-4 text-[#6366F1]" />,
    },
    {
      id: 'searcher' as NavView,
      agentId: 'searcher' as AgentType,
      label: '2. Scout',
      icon: <Search className="w-4 h-4 text-[#06B6D4]" />,
    },
    {
      id: 'reader' as NavView,
      agentId: 'reader' as AgentType,
      label: '3. Reader',
      icon: <BookOpen className="w-4 h-4 text-[#F59E0B]" />,
    },
    {
      id: 'critic' as NavView,
      agentId: 'critic' as AgentType,
      label: '4. Critic',
      icon: <ShieldCheck className="w-4 h-4 text-[#EF4444]" />,
    },
    {
      id: 'report' as NavView,
      agentId: 'writer' as AgentType,
      label: '5. Synthesizer',
      icon: <PenTool className="w-4 h-4 text-[#A855F7]" />,
    },
    {
      id: 'logs' as NavView,
      label: 'Message Bus Logs',
      icon: <Terminal className="w-4 h-4 text-[#4B5563]" />,
    },
  ];

  return (
    <aside
      className={`bg-white border-r border-[#E5E7EB] flex flex-col h-screen sticky top-0 shrink-0 select-none z-20 transition-all duration-200 no-print ${
        isCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Brand Header */}
      <div className="p-3.5 border-b border-[#E5E7EB] flex items-center justify-between">
        {!isCollapsed ? (
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-[#151A17] flex items-center justify-center shrink-0 shadow-xs">
              <svg
                className="w-4 h-4 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </div>
            <span className="font-bold text-xs text-[#14181F] block truncate tracking-tight">
              WORKSPACE
            </span>
          </div>
        ) : (
          <div className="mx-auto w-8 h-8 rounded-xl bg-[#151A17] flex items-center justify-center shadow-xs">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-full text-[#6B7280] hover:text-[#14181F] hover:bg-[#F1F2F4] transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        {navItems.map((item) => {
          const isSelected = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center ${
                isCollapsed ? 'justify-center p-2' : 'gap-2.5 px-3 py-2'
              } rounded-xl text-left transition-all ${
                isSelected
                  ? 'bg-[#151A17] text-white shadow-xs font-semibold'
                  : 'text-[#4B5563] hover:text-[#14181F] hover:bg-[#F1F2F4]'
              }`}
            >
              <div className="shrink-0">{item.icon}</div>
              {!isCollapsed && (
                <span className="text-xs truncate">{item.label}</span>
              )}
            </button>
          );
        })}

        {/* Divider */}
        <div className="my-2 border-t border-[#E5E7EB]" />

        {/* Workspace Tools */}
        <button
          onClick={onOpenUploader}
          title={isCollapsed ? 'BYOD File Vault' : undefined}
          className={`w-full flex items-center ${
            isCollapsed ? 'justify-center p-2' : 'gap-2.5 px-3 py-2'
          } rounded-xl text-[#4B5563] hover:text-[#14181F] hover:bg-[#F1F2F4] transition-colors`}
        >
          <UploadCloud className="w-4 h-4 text-[#16A34A] shrink-0" />
          {!isCollapsed && <span className="text-xs font-medium truncate">BYOD Vault</span>}
        </button>

        <button
          onClick={onOpenLibrary}
          title={isCollapsed ? 'Report Archive' : undefined}
          className={`w-full flex items-center ${
            isCollapsed ? 'justify-center p-2' : 'gap-2.5 px-3 py-2'
          } rounded-xl text-[#4B5563] hover:text-[#14181F] hover:bg-[#F1F2F4] transition-colors`}
        >
          <Bookmark className="w-4 h-4 text-[#2563EB] shrink-0" />
          {!isCollapsed && <span className="text-xs font-medium truncate">Archive</span>}
        </button>

        <button
          onClick={onOpenPresets}
          title={isCollapsed ? 'Topic Presets' : undefined}
          className={`w-full flex items-center ${
            isCollapsed ? 'justify-center p-2' : 'gap-2.5 px-3 py-2'
          } rounded-xl text-[#4B5563] hover:text-[#14181F] hover:bg-[#F1F2F4] transition-colors`}
        >
          <Sparkles className="w-4 h-4 text-[#F59E0B] shrink-0" />
          {!isCollapsed && <span className="text-xs font-medium truncate">Presets</span>}
        </button>

        <button
          onClick={onOpenSettings}
          title={isCollapsed ? 'Settings & Config' : undefined}
          className={`w-full flex items-center ${
            isCollapsed ? 'justify-center p-2' : 'gap-2.5 px-3 py-2'
          } rounded-xl text-[#4B5563] hover:text-[#14181F] hover:bg-[#F1F2F4] transition-colors`}
        >
          <Sliders className="w-4 h-4 text-[#6B7280] shrink-0" />
          {!isCollapsed && <span className="text-xs font-medium truncate">Config</span>}
        </button>
      </div>
    </aside>
  );
};
