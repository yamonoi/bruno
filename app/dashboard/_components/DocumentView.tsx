"use client";

import type { DocumentReadDetail } from "@/lib/api/types";

interface DocumentViewProps {
  document: DocumentReadDetail;
  categoryPath: string[];
  onBack: () => void;
}

// ---------------------------------------------------------------------------
// Minimal markdown renderer (no external deps)
// Handles: ## headings, **bold**, bullet lists, numbered lists, paragraphs
// ---------------------------------------------------------------------------

function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split("\n");
  const nodes: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Skip blank lines between blocks
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Heading: ### or ## or #
    const headingMatch = line.match(/^(#{1,3})\s+(.+)/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const content = headingMatch[2];
      const fontSize = level === 1 ? 20 : level === 2 ? 17 : 15;
      const marginTop = level === 1 ? 28 : 20;
      nodes.push(
        <p
          key={i}
          style={{
            fontSize,
            fontWeight: 700,
            color: "#111827",
            marginTop: nodes.length === 0 ? 0 : marginTop,
            marginBottom: 8,
          }}
        >
          {inlineRender(content)}
        </p>
      );
      i++;
      continue;
    }

    // Bullet list block
    if (/^[-*•]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*•]\s/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*•]\s+/, ""));
        i++;
      }
      nodes.push(
        <ul
          key={i}
          style={{
            listStyleType: "disc",
            paddingLeft: 20,
            marginTop: 6,
            marginBottom: 6,
          }}
        >
          {items.map((item, j) => (
            <li key={j} style={{ color: "#374151", fontSize: 14, lineHeight: 1.7 }}>
              {inlineRender(item)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Numbered list block
    if (/^\d+[.)]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+[.)]\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+[.)]\s+/, ""));
        i++;
      }
      nodes.push(
        <ol
          key={i}
          style={{
            listStyleType: "decimal",
            paddingLeft: 20,
            marginTop: 6,
            marginBottom: 6,
          }}
        >
          {items.map((item, j) => (
            <li key={j} style={{ color: "#374151", fontSize: 14, lineHeight: 1.7 }}>
              {inlineRender(item)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Regular paragraph
    nodes.push(
      <p
        key={i}
        style={{
          color: "#374151",
          fontSize: 14,
          lineHeight: 1.75,
          marginTop: 6,
          marginBottom: 6,
        }}
      >
        {inlineRender(line)}
      </p>
    );
    i++;
  }

  return nodes;
}

/** Render inline markdown: **bold**, *italic* */
function inlineRender(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function DocumentView({
  document,
  categoryPath,
  onBack,
}: DocumentViewProps) {
  return (
    <div
      className="flex-1 overflow-y-auto"
      style={{
        background: "#ffffff",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* Header: breadcrumb + button */}
      <div
        className="flex items-center justify-between px-8 py-4 border-b border-[#e5e7eb]"
        style={{ background: "#ffffff" }}
      >
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-sm" style={{ color: "#6b7280" }}>
          {categoryPath.map((seg, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              )}
              <span>{seg}</span>
            </span>
          ))}
          {/* Document name — last crumb, bold */}
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span style={{ color: "#111827", fontWeight: 600 }}>{document.name}</span>
        </div>

        {/* Edit with Bruno — outlined button */}
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-[#f9fafb]"
          style={{
            background: "#ffffff",
            color: "#374151",
            border: "1px solid #e5e7eb",
            cursor: "pointer",
          }}
        >
          {/* Robot icon */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="2" x2="12" y2="5" />
            <circle cx="12" cy="1.5" r="1" fill="currentColor" stroke="none" />
            <rect x="3" y="5" width="18" height="14" rx="3" />
            <circle cx="9" cy="11" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="15" cy="11" r="1.5" fill="currentColor" stroke="none" />
            <path d="M9 15 h6" strokeWidth="1.8" />
          </svg>
          Edit with Bruno
        </button>
      </div>

      {/* Content */}
      <div className="px-8 py-8" style={{ maxWidth: 780 }}>
        {document.summary_text ? (
          <div>{renderMarkdown(document.summary_text)}</div>
        ) : (
          <div className="text-center py-16">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#d1d5db"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto mb-3"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            <p className="text-sm font-medium" style={{ color: "#6b7280" }}>
              No content available yet
            </p>
            <p className="text-xs mt-1" style={{ color: "#9ca3af" }}>
              Click &quot;Edit with Bruno&quot; to generate a summary
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
