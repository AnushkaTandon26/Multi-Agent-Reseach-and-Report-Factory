'use client';

import React, { useState } from 'react';
import { Upload, X, FileText, Check, Trash2, Shield, Info } from 'lucide-react';
import { CustomDocument } from '../lib/types';

interface DocumentUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  customDocuments: CustomDocument[];
  setCustomDocuments: React.Dispatch<React.SetStateAction<CustomDocument[]>>;
}

export const DocumentUploaderModal: React.FC<DocumentUploaderModalProps> = ({
  isOpen,
  onClose,
  customDocuments,
  setCustomDocuments,
}) => {
  const [dragOver, setDragOver] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = (e) => {
        const text = (e.target?.result as string) || '';
        const newDoc: CustomDocument = {
          id: `doc-${Math.random().toString(36).substring(2, 9)}`,
          name: file.name,
          size: file.size,
          content: text,
          uploadedAt: new Date().toISOString(),
        };

        setCustomDocuments((prev) => [...prev, newDoc]);
      };

      reader.readAsText(file);
    }
  };

  const removeDoc = (id: string) => {
    setCustomDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-xl bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl space-y-5 text-gray-200">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">
              Bring Your Own Data (Document Ingestion)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-gray-400">
          Upload internal research papers, CSV benchmark tables, or meeting notes (.txt, .md, .csv, .json). The Scout and Reader agents will cross-examine these documents alongside live web sources.
        </p>

        {/* Drop Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFileUpload(e.dataTransfer.files);
          }}
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
            dragOver
              ? 'border-indigo-500 bg-indigo-950/30'
              : 'border-gray-700/80 bg-gray-950/60 hover:border-gray-600'
          }`}
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.multiple = true;
            input.accept = '.txt,.md,.csv,.json,.pdf';
            input.onchange = (e: any) => handleFileUpload(e.target.files);
            input.click();
          }}
        >
          <Upload className="w-10 h-10 mx-auto text-indigo-400 mb-2" />
          <p className="text-xs font-semibold text-gray-200">
            Click to browse or drop proprietary files here
          </p>
          <p className="text-[11px] text-gray-500 mt-1 font-mono">
            Supports .txt, .md, .csv, .json files
          </p>
        </div>

        {/* Uploaded Documents List */}
        {customDocuments.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-semibold text-gray-300 block">
              Active Ingested Files ({customDocuments.length}):
            </span>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {customDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-2.5 bg-gray-950 rounded-xl border border-gray-800 text-xs"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="font-semibold text-gray-200 truncate max-w-xs">
                      {doc.name}
                    </span>
                    <span className="text-[10px] font-mono text-gray-500">
                      ({Math.round(doc.size / 1024)} KB)
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeDoc(doc.id);
                    }}
                    className="p-1 text-gray-500 hover:text-rose-400 hover:bg-gray-800 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-800">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
          >
            Apply ({customDocuments.length} Documents)
          </button>
        </div>
      </div>
    </div>
  );
};
