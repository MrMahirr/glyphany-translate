"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@/shared/ui/Icon";
import type { DocumentNode } from "@/domain/translation-reader/readerDomains";

interface EditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceNode: DocumentNode | undefined;
  targetNode: DocumentNode | undefined;
  onSave: (nodeId: string, newContent: string) => void;
}

export function EditorModal({ isOpen, onClose, sourceNode, targetNode, onSave }: EditorModalProps) {
  const [content, setContent] = useState("");

  useEffect(() => {
    if (targetNode) {
      setContent(targetNode.content);
    }
  }, [targetNode]);

  if (!isOpen || !sourceNode || !targetNode) return null;

  const handleKeepOriginal = () => {
    setContent(sourceNode.content);
  };

  const handleSave = () => {
    onSave(targetNode.id, content);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-surface-container-lowest w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-surface-container-low border-b border-surface-container-high">
          <h3 className="font-label-lg font-bold text-on-surface">Edit Translation Block</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors">
            <Icon name="close" size={20} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6">
          {/* Source Text */}
          <div>
            <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider font-bold mb-2 block">
              Original Text
            </span>
            <div className="p-4 bg-surface-container-low rounded-xl text-on-surface-variant font-serif text-[15px] leading-relaxed">
              {sourceNode.content}
            </div>
          </div>

          {/* Target Text (Editable) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider font-bold block">
                Translated Text
              </span>
              <button 
                onClick={handleKeepOriginal}
                className="text-xs font-label-caps uppercase text-primary hover:text-primary-fixed transition-colors flex items-center gap-1 bg-primary-container px-2 py-1 rounded"
              >
                <Icon name="undo" size={14} /> Keep Original
              </button>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-32 p-4 bg-surface-container-lowest border border-outline rounded-xl text-on-surface font-serif text-[15px] leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Enter translated text here..."
            />
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-surface-container-low flex justify-end gap-3 border-t border-surface-container-high">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-on-surface-variant font-label-md font-bold hover:bg-surface-container transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-primary text-on-primary font-label-md font-bold hover:opacity-90 shadow-sm transition-opacity"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
