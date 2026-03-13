"use client";

import { useState, useRef, useEffect } from "react";
import UploadSvg from "@/icons/upload.svg";
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
  options: { id: number; name: string }[];
  selected: number[];
  onChange: (ids: number[]) => void;
  placeholder?: string;
}

function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select...",
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const toggle = (id: number) =>
    onChange(
      selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]
    );

  const displayText =
    selected.length === 0
      ? placeholder
      : selected.length === 1
      ? options.find((o) => o.id === selected[0])?.name ?? placeholder
      : `${selected.length} selected`;

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%",
          padding: "11px 14px",
          borderRadius: 8,
          border: `1px solid ${open ? "#2563eb" : "#e5e7eb"}`,
          fontSize: 14,
          color: selected.length > 0 ? "#111827" : "#9ca3af",
          background: "#ffffff",
          fontFamily: "'Inter', system-ui, sans-serif",
          outline: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxSizing: "border-box",
        }}
      >
        <span>{displayText}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#6b7280"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.15s",
            flexShrink: 0,
          }}
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
            maxHeight: 200,
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
                  background: checked ? "#eff6ff" : "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 14,
                  color: "#111827",
                  fontFamily: "'Inter', system-ui, sans-serif",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => {
                  if (!checked)
                    (e.currentTarget as HTMLButtonElement).style.background = "#f9fafb";
                }}
                onMouseLeave={(e) => {
                  if (!checked)
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                }}
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
  // Show all subcategories; if parents selected — filter to their children
  const allSubCategories = parentCategories.flatMap((c) => c.children);
  const subCategories =
    selectedParentIds.length > 0
      ? parentCategories
          .filter((c) => selectedParentIds.includes(c.id))
          .flatMap((c) => c.children)
      : allSubCategories;

  const handleParentChange = (ids: number[]) => {
    setSelectedParentIds(ids);
    // drop subs that no longer belong to selected parents
    if (ids.length > 0) {
      const validIds = new Set(
        parentCategories
          .filter((c) => ids.includes(c.id))
          .flatMap((c) => c.children.map((ch) => ch.id))
      );
      setSelectedSubIds((prev) => prev.filter((id) => validIds.has(id)));
    }
  };

  const canSubmit = name.trim() && selectedSubIds.length > 0 && file && !loading;

  const handleSubmit = async () => {
    if (!canSubmit || !file) return;
    setLoading(true);
    setError(null);
    try {
      await onUpload({ name: name.trim(), category_ids: selectedSubIds, file });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 14,
    fontWeight: 500,
    color: "#111827",
    marginBottom: 6,
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
        style={{
          background: "#ffffff",
          borderRadius: 16,
          width: "100%",
          maxWidth: 520,
          fontFamily: "'Inter', system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Close button — absolute top-right */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#9ca3af",
            padding: 4,
            lineHeight: 1,
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Decorative upload icon top-left */}
        <div style={{ padding: "24px 24px 0" }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              border: "1.5px solid #E9EAEB",
              background: "#FAFAFA",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 12,
            }}
          >
            <UploadSvg width={22} height={22} stroke="#374151" />
          </div>

          <h2
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: "#111827",
              margin: "0 0 20px",
            }}
          >
            Upload New Document
          </h2>
        </div>

        {/* Body */}
        <div
          style={{
            padding: "0 24px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {/* Document Name */}
          <div>
            <label style={labelStyle}>
              Document Name <span style={{ color: "#6366f1" }}>*</span>
            </label>
            <input
              type="text"
              placeholder="i.e Support and Resistance Levels"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: "100%",
                padding: "11px 14px",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                fontSize: 14,
                color: "#111827",
                background: "#ffffff",
                fontFamily: "'Inter', system-ui, sans-serif",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Technical Category */}
          <div>
            <label style={labelStyle}>
              Technical Category <span style={{ color: "#6366f1" }}>*</span>
            </label>
            <MultiSelect
              options={parentCategories}
              selected={selectedParentIds}
              onChange={handleParentChange}
              placeholder="Select a technical topic..."
            />
          </div>

          {/* Method Category */}
          <div>
            <label style={labelStyle}>
              Method Category <span style={{ color: "#6366f1" }}>*</span>
            </label>
            <MultiSelect
              options={subCategories}
              selected={selectedSubIds}
              onChange={setSelectedSubIds}
              placeholder="Select strategic area..."
            />
            {selectedParentIds.length > 0 && subCategories.length === 0 && (
              <p style={{ fontSize: 12, color: "#d97706", margin: "6px 0 0" }}>
                Selected category has no subcategories. Please choose a different technical category.
              </p>
            )}
          </div>

          {/* File upload */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `1px solid ${dragActive ? "#2563eb" : "#e5e7eb"}`,
              borderRadius: 8,
              background: dragActive ? "#eff6ff" : "#ffffff",
              padding: "20px 16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
              transition: "border-color 0.15s, background 0.15s",
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              style={{ display: "none" }}
              onChange={(e) => {
                if (e.target.files?.[0]) setFile(e.target.files[0]);
              }}
            />
            {file ? (
              <>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    border: "1.5px solid #16a34a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 12,
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#111827",
                    margin: "0 0 4px",
                  }}
                >
                  {file.name}
                </p>
                <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </>
            ) : (
              <>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    border: "1.5px solid #E9EAEB",
                    background: "#FAFAFA",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 10,
                  }}
                >
                  <UploadSvg width={20} height={20} stroke="#475467" />
                </div>
                <p
                  style={{ fontSize: 14, color: "#374151", margin: "0 0 4px" }}
                >
                  <span style={{ color: "#6366f1", fontWeight: 600 }}>
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </p>
                <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>
                  SVG, PNG, JPG or GIF (max. 800×400px)
                </p>
              </>
            )}
          </div>

          {/* Notes for Bruno */}
          <div>
            <h3
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#111827",
                margin: "0 0 8px",
              }}
            >
              Notes for Bruno
            </h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder={
                "Examples:\n• This replaces an older version on the same topic\n• Don't create rules from this yet\n• Focus on the entry signals section"
              }
              style={{
                width: "100%",
                padding: "11px 14px",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                fontSize: 14,
                color: "#111827",
                background: "#ffffff",
                fontFamily: "'Inter', system-ui, sans-serif",
                outline: "none",
                resize: "vertical",
                boxSizing: "border-box",
                lineHeight: 1.6,
              }}
            />
          </div>

          {error && (
            <p style={{ fontSize: 14, color: "#ef4444", margin: 0 }}>{error}</p>
          )}

          {/* Footer buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 12,
              paddingTop: 4,
            }}
          >
            <button
              onClick={onClose}
              style={{
                padding: "10px 24px",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                background: "#ffffff",
                color: "#111827",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "'Inter', system-ui, sans-serif",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              style={{
                padding: "10px 24px",
                borderRadius: 8,
                border: "none",
                background: canSubmit ? "#2563eb" : "#93c5fd",
                color: "#ffffff",
                fontSize: 14,
                fontWeight: 500,
                cursor: canSubmit ? "pointer" : "not-allowed",
                fontFamily: "'Inter', system-ui, sans-serif",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      strokeDasharray="31.4 31.4"
                      strokeLinecap="round"
                    />
                  </svg>
                  Uploading...
                </>
              ) : (
                "Upload Document"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
