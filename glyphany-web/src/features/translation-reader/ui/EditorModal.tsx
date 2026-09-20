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
  onRetranslate?: (text: string) => Promise<string>;
}

export function EditorModal({ isOpen, onClose, sourceNode, targetNode, onSave, onRetranslate }: EditorModalProps) {
  const [content, setContent] = useState("");
  const [isRetranslating, setIsRetranslating] = useState(false);

  useEffect(() => {
    if (targetNode) {
      setContent(targetNode.content);
    }
  }, [targetNode]);

  if (!isOpen || !sourceNode || !targetNode) return null;

  const handleKeepOriginal = () => {
    setContent(sourceNode.content);
  };

  const handleRetranslate = async () => {
    if (!onRetranslate) return;
    setIsRetranslating(true);
    try {
      const newTranslation = await onRetranslate(sourceNode.content);
      setContent(newTranslation);
    } catch {
      // Error handled by parent
    } finally {
      setIsRetranslating(false);
    }
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
          <h3 className="font-label-lg font-bold text-on-surface">Çeviri Bloğunu Düzenle</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors">
            <Icon name="close" size={20} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6">
          {/* Source Text */}
          <div>
            <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider font-bold mb-2 block">
              Orijinal Metin
            </span>
            <div className="p-4 bg-surface-container-low rounded-xl text-on-surface-variant font-serif text-[15px] leading-relaxed select-all">
              {sourceNode.content}
            </div>
          </div>

          {/* Target Text (Editable) */}
          <div>
            <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider font-bold mb-2 block">
              Çevrilmiş Metin
            </span>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-32 p-4 bg-surface-container-lowest border border-outline rounded-xl text-on-surface font-serif text-[15px] leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Çevrilmiş metni buraya yazın..."
            />
          </div>

          {/* Action Buttons Row */}
          <div className="flex items-center gap-3">
            <button 
              onClick={handleKeepOriginal}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-surface-container-low border border-outline hover:bg-surface-container transition-colors cursor-pointer"
            >
              <Icon name="history" size={18} className="text-tertiary" />
              <span className="font-label-md font-bold text-on-surface">Orijinalini Koru</span>
            </button>

            <button 
              onClick={handleRetranslate}
              disabled={isRetranslating || !onRetranslate}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-tertiary-container text-on-tertiary-container border border-tertiary/20 hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-wait"
            >
              <Icon name="translate" size={18} className={isRetranslating ? "animate-spin" : ""} />
              <span className="font-label-md font-bold">
                {isRetranslating ? "Çevriliyor..." : "Tekrar Çevir"}
              </span>
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-surface-container-low flex justify-end gap-3 border-t border-surface-container-high">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-on-surface-variant font-label-md font-bold hover:bg-surface-container transition-colors"
          >
            İptal
          </button>
          <button 
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-primary text-on-primary font-label-md font-bold hover:opacity-90 shadow-sm transition-opacity"
          >
            Değişiklikleri Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}
