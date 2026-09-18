"use client";

import React, { useRef, useState } from "react";
import { cn } from "@/shared/lib/cn";
import { Icon } from "@/shared/ui/Icon";

export interface UploadDropzoneProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
}

/**
 * PDF Drag & Drop Upload component.
 * Drag enter/leave/over events, file selection, and visual preview feedback.
 */
export function UploadDropzone({ onFileSelect, selectedFile }: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    // Basic validation (can be expanded)
    const validTypes = ["application/pdf", "application/epub+zip", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.presentationml.presentation"];
    if (validTypes.includes(file.type) || file.name.match(/\.(pdf|epub|docx|pptx)$/i)) {
      if (file.size <= 100 * 1024 * 1024) { // 100MB
        onFileSelect(file);
      } else {
        alert("File size exceeds 100MB limit.");
      }
    } else {
      alert("Invalid file format. Please upload PDF, EPUB, DOCX, or PPTX.");
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col w-full">
      {/* Drop Zone */}
      <div
        onClick={triggerFileInput}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={cn(
          "relative group cursor-pointer rounded-xl transition-all duration-300 p-space-xl flex flex-col items-center text-center",
          isDragging 
            ? "bg-primary-fixed/30 scale-[1.01]" 
            : "bg-surface-container-low/60 hover:bg-surface-container"
        )}
      >
        <div className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm",
          isDragging 
            ? "bg-primary-container text-on-primary scale-110" 
            : "bg-primary-container/10 text-primary-container group-hover:scale-110 group-hover:bg-primary-container group-hover:text-on-primary"
        )}>
          <Icon name="upload_file" size={28} />
        </div>
        
        <h3 className="mt-space-md font-headline-sm text-headline-sm text-on-surface">
          Drop your PDF here or click to browse
        </h3>
        <p className="mt-space-xs font-body-sm text-body-sm text-on-surface-variant max-w-md">
          Supports PDF, EPUB, DOCX, and PPTX up to 100MB • OCR enabled
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.epub,.docx,.pptx"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Quick format tags */}
        <div className="mt-space-lg flex flex-wrap items-center justify-center gap-space-xs">
          <FormatBadge icon="article" label="Research Papers" />
          <FormatBadge icon="integration_instructions" label="Technical Manuals" />
          <FormatBadge icon="auto_stories" label="E-Books" />
          <FormatBadge icon="schema" label="Schematics" />
        </div>
      </div>

      {/* File Selected Status */}
      {selectedFile && (
        <div className="mt-space-md p-space-sm rounded-xl bg-surface-container-low flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-space-sm min-w-0">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Icon name="check_circle" size={18} className="text-primary" />
            </div>
            <div className="truncate">
              <p className="font-label-lg text-label-lg text-on-surface truncate">
                {selectedFile.name}
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Ready for layout-preserving neural parsing
              </p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFileSelect(null);
            }}
            className="text-on-surface-variant hover:text-error p-1 rounded transition-colors cursor-pointer"
            title="Remove file"
          >
            <Icon name="close" size={20} />
          </button>
        </div>
      )}
    </div>
  );
}

function FormatBadge({ icon, label }: { icon: string; label: string }) {
  return (
    <span className="font-label-md text-label-md text-on-surface-variant bg-surface-container-highest/60 px-space-sm py-1 rounded-full flex items-center gap-1">
      <Icon name={icon} size={14} />
      {label}
    </span>
  );
}
