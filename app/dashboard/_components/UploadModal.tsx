"use client";

import { useState, useRef, useEffect } from "react";
import type { DocumentCategoryHierarchical } from "@/lib/api/types";

interface UploadModalProps {
  categories: DocumentCategoryHierarchical[];
  onClose: () => void;
  onUpload: (params: {
    name: string;
    category_ids: number[];
    file: File;
  }) => Promise<void>;
}

// ─── Multi-select dropdown ────────────────────────────────────────────────────

interface MultiSelectProps {
  label: string;
  required?: boolean;
  options: { id: number; name: string }[];
  selected: number[];
  onChange: (ids: number[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

function MultiSelect({
  label,
  required,
  options,
  selected,
  onChange,
  placeholder = "Select...",
  disabled = false,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const toggle = (id: number) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  const displayText =
    selected.length === 0
      ? placeholder
      : selected.length === 1
      ? options.find((o) => o.id === selected[0])?.name ?? placeholder
      : `${selected.length} selected`;

  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: 13,
          fontWeight: 500,
          color: "#374151",
          marginBottom: 4,
          fontFamily: "'Inter', system-ui, sans-serif",
        }}
      >
        {label} {required && <span style={{ color: "#ef4444" }}>*</span>}
      </label>
      <div ref={ref} style={{ position: "relative" }}>
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setOpen((v) => !v)}
          style={{
            width: "100%",
            padding: "8px 12px",
            borderRadius: 8,
            border: `1px solid ${open ? "#2563eb" : "#e5e7eb"}`,
            fontSize: 14,
            color: selected.length > 0 ? "#111827" : "#9ca3af",
            background: disabled ? "#f9fafb" : "#ffffff",
            fontFamily: "'Inter', system-ui, sans-serif",
            outline: "none",
            cursor: disabled ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            opacity: disabled ? 0.6 : 1,
          }}
        >
          <span>{displayText}</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6b7280"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.15s" }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {open && options.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 4px)",
              left: 0,
              right: 0,
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
              zIndex: 100,
              maxHeight: 220,
              overflowY: "auto",
            }}
          >
            {options.map((opt) => {
              const checked = selected.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => toggle(opt.id)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 14,
                    color: "#111827",
                    fontFamily: "'Inter', system-ui, sans-serif",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.background = "#f9fafb")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.background = "transparent")
                  }
                >
                  <span>{opt.name}</span>
                  {checked && (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Upload Modal ─────────────────────────────────────────────────────────────

export default function UploadModal({
  categories,
  onClose,
  onUpload,
}: UploadModalProps) {
  const [name, setName] = useState("");
  const [selectedParentIds, setSelectedParentIds] = useState<number[]>([]);
  const [selectedSubIds, setSelectedSubIds] = useState<number[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parentCategories = categories.filter((c) => c.parent_id == null);

  // Union of children from all selected parents
  const availableSubCategories = parentCategories
    .filter((c) => selectedParentIds.includes(c.id))
    .flatMap((c) => c.children);

  // Reset sub-selections when parents change
  const handleParentChange = (ids: number[]) => {
    setSelectedParentIds(ids);
    // Remove sub-ids that no longer belong to selected parents
    const validSubIds = parentCategories
      .filter((c) => ids.includes(c.id))
      .flatMap((c) => c.children.map((ch) => ch.id));
    setSelectedSubIds((prev) => prev.filter((id) => validSubIds.includes(id)));
  };

  const canSubmit =
    name.trim() && selectedSubIds.length > 0 && file && !loading;

  const handleSubmit = async () => {
    if (!canSubmit || !file) return;
    setLoading(true);
    setError(null);
    try {
      await onUpload({
        name: name.trim(),
        category_ids: selectedSubIds,
        file,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid #e5e7eb",
    fontSize: 14,
    color: "#111827",
    background: "#ffffff",
    fontFamily: "'Inter', system-ui, sans-serif",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 13,
    fontWeight: 500,
    color: "#374151",
    marginBottom: 4,
    fontFamily: "'Inter', system-ui, sans-serif",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.4)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="rounded-xl shadow-xl w-full max-w-lg"
        style={{
          background: "#ffffff",
          fontFamily: "'Inter', system-ui, sans-serif",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e7eb]">
          <h2 className="text-base font-semibold" style={{ color: "#111827" }}>
            Upload Document
          </h2>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", padding: 4 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 flex flex-col gap-4">
          {/* Document Name */}
          <div>
            <label style={labelStyle}>
              Document Name <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="text"
              placeholder="Enter document name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Two-column category row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <MultiSelect
              label="Technical Category"
              required
              options={parentCategories}
              selected={selectedParentIds}
              onChange={handleParentChange}
              placeholder="Select category..."
            />
            <MultiSelect
              label="Method Category"
              required
              options={availableSubCategories}
              selected={selectedSubIds}
              onChange={setSelectedSubIds}
              placeholder="Select strategic area..."
              disabled={selectedParentIds.length === 0}
            />
          </div>

          {/* File upload */}
          <div>
            <label style={labelStyle}>File</label>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed cursor-pointer transition-colors"
              style={{
                borderColor: dragActive ? "#2563eb" : "#e5e7eb",
                background: dragActive ? "#eff6ff" : "#f9fafb",
                padding: "24px 16px",
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) setFile(e.target.files[0]);
                }}
              />
              {file ? (
                <div className="text-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <p className="text-sm font-medium" style={{ color: "#111827" }}>{file.name}</p>
                  <p className="text-xs mt-1" style={{ color: "#6b7280" }}>{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              ) : (
                <>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <p className="text-sm" style={{ color: "#6b7280" }}>
                    <span style={{ color: "#2563eb", fontWeight: 500 }}>Click to upload</span> or drag and drop
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label style={labelStyle}>Notes for Bruno</label>
            <textarea
              placeholder="Optional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>

          {error && (
            <p className="text-sm" style={{ color: "#ef4444" }}>{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#e5e7eb]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ background: "#ffffff", color: "#374151", border: "1px solid #e5e7eb", cursor: "pointer" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{
              background: canSubmit ? "#2563eb" : "#93c5fd",
              color: "#ffffff",
              border: "none",
              cursor: canSubmit ? "pointer" : "not-allowed",
            }}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" strokeDasharray="31.4 31.4" strokeLinecap="round" />
                </svg>
                Uploading...
              </span>
            ) : (
              "Upload Document"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
