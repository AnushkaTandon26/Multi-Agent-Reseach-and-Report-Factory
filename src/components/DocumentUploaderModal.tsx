'use client';

import React, { useState } from 'react';
import { Upload, X, FileText, Trash2, Shield, Info } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-2xl space-y-4 text-[#14181F]">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-[#16A34A]">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#14181F]">
                BYOD Document Vault (Ingestion)
              </h3>
              <p className="text-xs text-[#6B7280]">Bring your own data into the research pipeline</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#6B7280] hover:text-[#14181F] hover:bg-[#F1F2F4] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-[#4B5563]">
          Upload proprietary research whitepapers, CSV data tables, or internal notes (.txt, .md, .csv, .json). The Scout and Reader agents will cross-examine these documents alongside live web references.
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
              ? 'border-[#16A34A] bg-emerald-50'
              : 'border-[#D1D5DB] bg-[#F8FAFC] hover:border-[#14181F] hover:bg-[#F1F2F4]'
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
          <Upload className="w-10 h-10 mx-auto text-[#16A34A] mb-2" />
          <p className="text-xs font-semibold text-[#14181F]">
            Click to browse or drop proprietary files here
          </p>
          <p className="text-[11px] text-[#6B7280] mt-1 font-mono">
            Supports .txt, .md, .csv, .json files
          </p>
        </div>

        {/* Uploaded Documents List */}
        {customDocuments.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-semibold text-[#14181F] block">
              Active Attached Documents ({customDocuments.length}):
            </span>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {customDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-2.5 bg-[#F8FAFC] rounded-xl border border-[#E5E7EB] text-xs"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <FileText className="w-4 h-4 text-[#2563EB] shrink-0" />
                    <span className="font-semibold text-[#14181F] truncate max-w-xs">
                      {doc.name}
                    </span>
                    <span className="text-[10px] font-mono text-[#6B7280]">
                      ({Math.round(doc.size / 1024)} KB)
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeDoc(doc.id);
                    }}
                    className="p-1 text-[#9CA3AF] hover:text-[#DC2626] hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E5E7EB]">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#151A17] hover:bg-[#262E29] text-white rounded-full text-xs font-bold transition-all shadow-xs"
          >
            Confirm Ingestion ({customDocuments.length} Attached)
          </button>
        </div>
      </div>
    </div>
  );
};
