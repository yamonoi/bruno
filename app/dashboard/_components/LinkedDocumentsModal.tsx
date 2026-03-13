"use client";

import type { DocumentRead } from "@/lib/api/types";

interface LinkedDoc {
  id: number;
  title: string;
  type: string;
  category: string;
}

// Static mockup data — no real API for linked documents
const MOCK_LINKED: LinkedDoc[] = [
  { id: 1, title: "Double Top Confirmation Signals", type: "Confirmation Tool", category: "Pattern Analysis" },
  { id: 2, title: "Risk Management for Reversal Patterns", type: "Trade Management", category: "Risk Management" },
  { id: 3, title: "Multi-Timeframe Pattern Analysis", type: "Pattern Strategy", category: "Market Structure" },
];

interface LinkedDocumentsModalProps {
  document: DocumentRead;
  onClose: () => void;
}

export default function LinkedDocumentsModal({
  document,
  onClose,
}: LinkedDocumentsModalProps) {
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
        {/* Close */}
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
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-base font-semibold mb-4" style={{ color: "#111827" }}>
          Linked Documents ({MOCK_LINKED.length})
        </h2>

        {/* List */}
        <div className="flex flex-col gap-2 mb-5">
          {MOCK_LINKED.map((doc) => (
            <button
              key={doc.id}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                background: doc.id === 2 ? "#eff6ff" : "#ffffff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
                textAlign: "left",
                borderColor: doc.id === 2 ? "#bfdbfe" : "#e5e7eb",
              }}
            >
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: "#111827", marginBottom: 2 }}
                >
                  {doc.title}
                </p>
                <p className="text-xs" style={{ color: "#6b7280" }}>
                  Type: {doc.type} • Category: {doc.category}
                </p>
              </div>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6b7280"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ flexShrink: 0 }}
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-sm font-medium"
            style={{
              background: "#ffffff",
              color: "#374151",
              border: "1px solid #e5e7eb",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
