"use client";

import { useState } from "react";
import type { DocumentCategoryHierarchical } from "@/lib/api/types";

interface AddCategoryModalProps {
  categories: DocumentCategoryHierarchical[];
  onClose: () => void;
  onAdd: (params: { name: string; parent_id?: number }) => Promise<void>;
}

export default function AddCategoryModal({
  categories,
  onClose,
  onAdd,
}: AddCategoryModalProps) {
  const [type, setType] = useState<"main" | "sub">("main");
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parentCategories = categories.filter((c) => c.parent_id == null);
  const canSubmit =
    name.trim() && !loading && (type === "main" || parentId !== "");

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    try {
      await onAdd({
        name: name.trim(),
        ...(type === "sub" && parentId !== "" ? { parent_id: parentId as number } : {}),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create category");
      setLoading(false);
    }
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
        className="rounded-xl shadow-xl w-full max-w-md px-6 py-6"
        style={{
          background: "#ffffff",
          fontFamily: "'Inter', system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Close button */}
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
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Icon */}
        <div
          className="flex items-center justify-center rounded-xl mb-4"
          style={{ width: 48, height: 48, background: "#f3f4f6" }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            <line x1="12" y1="11" x2="12" y2="17" />
            <line x1="9" y1="14" x2="15" y2="14" />
          </svg>
        </div>

        {/* Heading */}
        <h2 className="text-base font-semibold mb-1" style={{ color: "#111827" }}>
          Add New Category
        </h2>
        <p className="text-sm mb-5" style={{ color: "#6b7280" }}>
          Lorem ipsum dolor sit amet consectetur.
        </p>

        {/* Radio — vertical */}
        <div className="flex flex-col gap-3 mb-5">
          <label
            className="flex items-center gap-2.5 text-sm cursor-pointer"
            style={{ color: "#374151" }}
          >
            <input
              type="radio"
              name="catType"
              checked={type === "main"}
              onChange={() => {
                setType("main");
                setParentId("");
              }}
              style={{ accentColor: "#2563eb", width: 16, height: 16 }}
            />
            Main Category
          </label>
          <label
            className="flex items-center gap-2.5 text-sm cursor-pointer"
            style={{ color: "#374151" }}
          >
            <input
              type="radio"
              name="catType"
              checked={type === "sub"}
              onChange={() => setType("sub")}
              style={{ accentColor: "#2563eb", width: 16, height: 16 }}
            />
            Subcategory
          </label>
        </div>

        {/* Parent dropdown for subcategory */}
        {type === "sub" && (
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "#374151" }}
            >
              Parent Category <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <select
              value={parentId}
              onChange={(e) =>
                setParentId(e.target.value ? Number(e.target.value) : "")
              }
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                fontSize: 14,
                color: "#111827",
                background: "#ffffff",
                fontFamily: "'Inter', system-ui, sans-serif",
                outline: "none",
              }}
            >
              <option value="">Select parent category</option>
              {parentCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Category Name */}
        <div className="mb-5">
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: "#374151" }}
          >
            Category Name <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <input
            type="text"
            placeholder="Enter category name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              fontSize: 14,
              color: "#111827",
              background: "#ffffff",
              fontFamily: "'Inter', system-ui, sans-serif",
              outline: "none",
            }}
          />
        </div>

        {error && (
          <p className="text-sm mb-4" style={{ color: "#ef4444" }}>
            {error}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              background: "#ffffff",
              color: "#374151",
              border: "1px solid #e5e7eb",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="px-5 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              background: canSubmit ? "#2563eb" : "#93c5fd",
              color: "#ffffff",
              border: "none",
              cursor: canSubmit ? "pointer" : "not-allowed",
            }}
          >
            {loading ? "Adding..." : "Add Category"}
          </button>
        </div>
      </div>
    </div>
  );
}
