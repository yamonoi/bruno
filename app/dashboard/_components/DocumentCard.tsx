"use client";

import type { DocumentRead } from "@/lib/api/types";

interface DocumentCardProps {
  document: DocumentRead;
  categoryPath: string[];
  onView: (id: number) => void;
  onLinkedDocs: (doc: DocumentRead) => void;
}

function getStatusDisplay(doc: DocumentRead): {
  label: string;
  textColor: string;
  bgColor: string;
  icon: React.ReactNode;
} {
  if (doc.status === "active") {
    return {
      label: "Learned",
      textColor: "#16a34a",
      bgColor: "#dcfce7",
      icon: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    };
  }
  // draft with summary → in process
  if (doc.summary_text) {
    return {
      label: "In Process",
      textColor: "#d97706",
      bgColor: "#fef3c7",
      icon: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    };
  }
  // draft without summary → new
  return {
    label: "New",
    textColor: "#dc2626",
    bgColor: "#fee2e2",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  };
}

export default function DocumentCard({
  document,
  categoryPath,
  onView,
  onLinkedDocs,
}: DocumentCardProps) {
  const status = getStatusDisplay(document);

  return (
    <div
      className="border border-[#e5e7eb] rounded-lg p-4 mb-3 transition-shadow hover:shadow-sm"
      style={{
        background: "#ffffff",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-xs mb-2" style={{ color: "#6b7280" }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        {categoryPath.map((seg, i) => (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            )}
            <span>{seg}</span>
          </span>
        ))}
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold mb-1" style={{ color: "#111827" }}>
        {document.name}
      </h3>

      {/* Filename */}
      <p className="text-xs mb-3" style={{ color: "#6b7280" }}>
        {document.filename}
      </p>

      {/* Actions row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {/* View */}
          <button
            onClick={() => onView(document.id)}
            title="View document"
            className="flex items-center justify-center rounded-md transition-colors hover:bg-[#f3f4f6]"
            style={{ width: 32, height: 32, background: "transparent", border: "1px solid #e5e7eb", cursor: "pointer" }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>

          {/* Bruno AI (robot) */}
          <button
            title="Edit with Bruno"
            className="flex items-center justify-center rounded-md transition-colors hover:bg-[#f3f4f6]"
            style={{ width: 32, height: 32, background: "transparent", border: "1px solid #e5e7eb", cursor: "pointer" }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              {/* antenna */}
              <line x1="12" y1="2" x2="12" y2="5" />
              <circle cx="12" cy="1.5" r="1" fill="#6b7280" stroke="none" />
              {/* head */}
              <rect x="3" y="5" width="18" height="14" rx="3" />
              {/* eyes */}
              <circle cx="9" cy="11" r="1.5" fill="#6b7280" stroke="none" />
              <circle cx="15" cy="11" r="1.5" fill="#6b7280" stroke="none" />
              {/* mouth */}
              <path d="M9 15 h6" strokeWidth="1.8" />
            </svg>
          </button>

          {/* Linked docs */}
          <button
            onClick={() => onLinkedDocs(document)}
            title="Linked documents"
            className="flex items-center justify-center rounded-md transition-colors hover:bg-[#f3f4f6]"
            style={{ width: 32, height: 32, background: "transparent", border: "1px solid #e5e7eb", cursor: "pointer" }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </button>
        </div>

        {/* Status badge */}
        <span
          className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap"
          style={{ color: status.textColor, background: status.bgColor }}
        >
          {status.icon}
          {status.label}
        </span>
      </div>
    </div>
  );
}
