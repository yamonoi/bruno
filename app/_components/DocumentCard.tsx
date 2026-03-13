"use client";

import type { DocumentRead } from "@/lib/api/types";
import HomeSvg from "@/icons/home.svg";
import EyeSvg from "@/icons/eye.svg";
import RobotSvg from "@/icons/robot.svg";
import LinkSvg from "@/icons/link.svg";

interface DocumentCardProps {
  document: DocumentRead;
  categoryPath: string[];
  onView: (id: number) => void;
  onLinkedDocs: (doc: DocumentRead) => void;
  setChatOpen: (open: boolean) => void;
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
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#16a34a"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
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
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#d97706"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
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
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#dc2626"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
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
  setChatOpen,
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
      <div
        className="flex items-center gap-2 mb-3"
        style={{ color: "#374151" }}
      >
        {/* Home icon */}
        <HomeSvg width={20} height={20} />
        {categoryPath.map((seg, i) => (
          <span key={i} className="flex items-center gap-2">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9ca3af"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
            <span style={{ fontSize: 13, fontWeight: 400 }}>{seg}</span>
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
        <div className="flex items-center gap-2">
          {/* View */}
          <button
            onClick={() => onView(document.id)}
            title="View document"
            className="flex items-center justify-center rounded-md transition-colors hover:bg-[#f3f4f6]"
            style={{
              width: 32,
              height: 32,
              background: "transparent",
              border: "1px solid #e5e7eb",
              cursor: "pointer",
            }}
          >
            <EyeSvg width={20} height={20} />
          </button>

          {/* Bruno AI (robot) */}
          <button
            title="Edit with Bruno"
            className="flex items-center justify-center rounded-md transition-colors hover:bg-[#f3f4f6]"
            style={{
              width: 32,
              height: 32,
              background: "transparent",
              border: "1px solid #e5e7eb",
              cursor: "pointer",
            }}
            onClick={() => setChatOpen(true)}
          >
            <RobotSvg width={20} height={20} />
          </button>

          {/* Linked docs */}
          <button
            onClick={() => onLinkedDocs(document)}
            title="Linked documents"
            className="flex items-center justify-center rounded-md transition-colors hover:bg-[#f3f4f6]"
            style={{
              width: 32,
              height: 32,
              background: "transparent",
              border: "1px solid #e5e7eb",
              cursor: "pointer",
            }}
          >
            <LinkSvg width={20} height={20} />
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
