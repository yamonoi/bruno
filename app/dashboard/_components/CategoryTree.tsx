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

/** Sum docs for a category and all its descendants */
function sumDocs(
  cat: DocumentCategoryHierarchical,
  map: Record<number, number>,
): number {
  let count = map[cat.id] ?? 0;
  for (const child of cat.children) {
    count += sumDocs(child, map);
  }
  return count;
}

export default function CategoryTree({
  categories,
  selectedCategoryId,
  onSelectCategory,
  onAddCategory,
  allDocsTotal,
  docCountMap,
}: CategoryTreeProps) {
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div
      className="shrink-0 border-r border-[#e5e7eb] overflow-y-auto"
      style={{
        width: 280,
        minHeight: "100vh",
        background: "#ffffff",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-5 pb-3">
        <h2 className="text-sm font-semibold" style={{ color: "#111827" }}>
          Categories
        </h2>
        <button
          onClick={onAddCategory}
          className="flex items-center justify-center rounded-md transition-colors hover:bg-[#dbeafe]"
          style={{
            width: 28,
            height: 28,
            background: "#eff6ff",
            color: "#2563eb",
            border: "none",
            cursor: "pointer",
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          +
        </button>
      </div>

      {/* All Documents row */}
      <div className="px-3 mb-2">
        <button
          onClick={() => onSelectCategory(null)}
          className="flex items-center w-full px-3 py-2 rounded-lg text-left text-sm transition-colors"
          style={{
            background: selectedCategoryId === null ? "#eff6ff" : "transparent",
            color: selectedCategoryId === null ? "#2563eb" : "#111827",
            border: "none",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          {/* Folder icon */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ flexShrink: 0, marginRight: 8 }}
          >
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>

          <span style={{ marginRight: 6 }}>All Documents</span>

          {/* Count badge */}
          <span
            className="text-xs px-1.5 py-0.5 rounded-full"
            style={{
              background: selectedCategoryId === null ? "#dbeafe" : "#f3f4f6",
              color: selectedCategoryId === null ? "#2563eb" : "#6b7280",
            }}
          >
            {allDocsTotal}
          </span>

          {/* Spacer */}
          <span style={{ flex: 1 }} />

          {/* Chevron */}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ flexShrink: 0 }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "#f3f4f6", marginBottom: 8 }} />

      {/* Category tree */}
      <div className="px-3 pb-4">
        {categories.map((cat) => (
          <CategoryItem
            key={cat.id}
            category={cat}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={onSelectCategory}
            expandedIds={expandedIds}
            onToggleExpand={toggleExpand}
            docCountMap={docCountMap}
            depth={0}
          />
        ))}
      </div>
    </div>
  );
}

interface CategoryItemProps {
  category: DocumentCategoryHierarchical;
  selectedCategoryId: number | null;
  onSelectCategory: (id: number | null) => void;
  expandedIds: Set<number>;
  onToggleExpand: (id: number) => void;
  docCountMap: Record<number, number>;
  depth: number;
}

function CategoryItem({
  category,
  selectedCategoryId,
  onSelectCategory,
  expandedIds,
  onToggleExpand,
  docCountMap,
  depth,
}: CategoryItemProps) {
  const hasChildren = category.children.length > 0;
  const isExpanded = expandedIds.has(category.id);
  const isSelected = selectedCategoryId === category.id;
  const isParent = depth === 0;
  const docCount = sumDocs(category, docCountMap);

  return (
    <div>
      <button
        onClick={() => {
          if (hasChildren) onToggleExpand(category.id);
          onSelectCategory(category.id);
        }}
        className="flex items-center w-full py-2 rounded-lg text-left text-sm transition-colors"
        style={{
          paddingLeft: `${12 + depth * 20}px`,
          paddingRight: 12,
          background: isSelected ? "#eff6ff" : "transparent",
          color: isSelected ? "#2563eb" : "#111827",
          border: isSelected && !isParent ? "1px solid #bfdbfe" : "none",
          cursor: "pointer",
          fontWeight: isParent ? 600 : 400,
        }}
      >
        {/* Name */}
        <span
          className="truncate"
          style={{ marginRight: 6, flexShrink: 1, minWidth: 0 }}
        >
          {category.name}
        </span>

        {/* Count badge — next to title */}
        <span
          className="text-xs px-1.5 py-0.5 rounded-full"
          style={{
            background: isSelected ? "#dbeafe" : "#f3f4f6",
            color: isSelected ? "#2563eb" : "#6b7280",
            flexShrink: 0,
          }}
        >
          {docCount}
        </span>

        {/* Spacer */}
        <span style={{ flex: 1 }} />

        {/* Chevron for parent categories — on the right */}
        {hasChildren && (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.15s ease",
              flexShrink: 0,
            }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        )}
      </button>

      {hasChildren && isExpanded && (
        <div>
          {category.children.map((child) => (
            <CategoryItem
              key={child.id}
              category={child}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={onSelectCategory}
              expandedIds={expandedIds}
              onToggleExpand={onToggleExpand}
              docCountMap={docCountMap}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
