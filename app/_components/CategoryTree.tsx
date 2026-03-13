"use client";

import { useState } from "react";
import type { DocumentCategoryHierarchical } from "@/lib/api/types";

interface CategoryTreeProps {
  categories: DocumentCategoryHierarchical[];
  selectedCategoryId: number | null;
  onSelectCategory: (id: number | null) => void;
  onAddCategory: () => void;
  allDocsTotal: number;
  docCountMap: Record<number, number>;
}

function sumDocs(
  cat: DocumentCategoryHierarchical,
  map: Record<number, number>,
): number {
  let n = map[cat.id] ?? 0;
  for (const c of cat.children) n += sumDocs(c, map);
  return n;
}

function Badge({ count, active }: { count: number; active?: boolean }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 26,
        height: 26,
        borderRadius: 13,
        border: "1.5px solid #E9EAEB",
        fontSize: 12,
        fontWeight: 500,
        color: "#374151",
        background: "#FAFAFA",
        flexShrink: 0,
        padding: "0 5px",
        lineHeight: 1,
      }}
    >
      {count}
    </span>
  );
}

const HR = () => (
  <div style={{ height: 1, margin: "0 16px", background: "#E9EAEB" }} />
);

export default function CategoryTree({
  categories,
  selectedCategoryId,
  onSelectCategory,
  onAddCategory,
  allDocsTotal,
  docCountMap,
}: CategoryTreeProps) {
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  const toggle = (id: number) =>
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <div
      className="shrink-0 overflow-y-auto no-scrollbar"
      style={{
        width: 248,
        background: "#ffffff",
        fontFamily: "'Inter', system-ui, sans-serif",
        borderRadius: 12,
      }}
    >
      {/* ── Header ───────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 16px 18px",
        }}
      >
        <span style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>
          Categories
        </span>
        <button
          onClick={onAddCategory}
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            background: "#2563eb",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 22,
            fontWeight: 300,
            lineHeight: 1,
            flexShrink: 0,
          }}
        >
          +
        </button>
      </div>

      <HR />

      {/* ── All Documents ────────────────────────── */}
      <button
        onClick={() => onSelectCategory(null)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          padding: "14px 16px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          fontFamily: "'Inter', system-ui, sans-serif",
          gap: 8,
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#6b7280"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ flexShrink: 0 }}
        >
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#414651" }}>
          All Documents
        </span>
        <Badge count={allDocsTotal} active={selectedCategoryId === null} />
        <span style={{ flex: 1 }} />
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#9ca3af"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <HR />

      {/* ── Category list ────────────────────────── */}
      {categories.map((cat) => (
        <div key={cat.id}>
          <ParentRow
            category={cat}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={onSelectCategory}
            expandedIds={expandedIds}
            onToggle={toggle}
            docCountMap={docCountMap}
          />
          <HR />
        </div>
      ))}
    </div>
  );
}

// ── Parent row + its children ──────────────────────────────────────────────

interface ParentRowProps {
  category: DocumentCategoryHierarchical;
  selectedCategoryId: number | null;
  onSelectCategory: (id: number | null) => void;
  expandedIds: Set<number>;
  onToggle: (id: number) => void;
  docCountMap: Record<number, number>;
}

function ParentRow({
  category,
  selectedCategoryId,
  onSelectCategory,
  expandedIds,
  onToggle,
  docCountMap,
}: ParentRowProps) {
  const hasChildren = category.children.length > 0;
  const isExpanded = expandedIds.has(category.id);
  const docCount = sumDocs(category, docCountMap);

  return (
    <>
      <button
        onClick={() => {
          if (hasChildren) onToggle(category.id);
          onSelectCategory(category.id);
        }}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          padding: "14px 16px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          fontFamily: "'Inter', system-ui, sans-serif",
          gap: 8,
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "#414651",
            flexShrink: 1,
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {category.name}
        </span>
        <Badge count={docCount} />
        <span style={{ flex: 1 }} />
        {hasChildren && (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9ca3af"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.15s",
              flexShrink: 0,
            }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        )}
      </button>

      {hasChildren && isExpanded && (
        <div style={{ paddingBottom: 6 }}>
          {category.children.map((child) => (
            <ChildRow
              key={child.id}
              category={child}
              isSelected={selectedCategoryId === child.id}
              onSelect={() => onSelectCategory(child.id)}
              docCount={docCountMap[child.id] ?? 0}
            />
          ))}
        </div>
      )}
    </>
  );
}

// ── Child / subcategory row ────────────────────────────────────────────────

interface ChildRowProps {
  category: DocumentCategoryHierarchical;
  isSelected: boolean;
  onSelect: () => void;
  docCount: number;
}

function ChildRow({ category, isSelected, onSelect, docCount }: ChildRowProps) {
  return (
    <div style={{ padding: "3px 8px" }}>
      <button
        onClick={onSelect}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          padding: "8px 0px 8px 24px",
          gap: 8,
          background: isSelected ? "#eff6ff" : "transparent",
          border: `1.5px solid ${isSelected ? "#3b82f6" : "transparent"}`,
          borderRadius: 8,
          cursor: "pointer",
          fontFamily: "'Inter', system-ui, sans-serif",
          transition: "background 0.1s",
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: "#414651",
            flexShrink: 1,
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {category.name}
        </span>
        <Badge count={docCount} active={isSelected} />
      </button>
    </div>
  );
}
