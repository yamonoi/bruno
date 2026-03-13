"use client";

import { useState, useRef, useEffect } from "react";

export type StatusFilterValue = "active" | "in_process" | "new" | null;

interface StatusFilterProps {
  value: StatusFilterValue;
  onChange: (status: StatusFilterValue) => void;
  totalCount: number;
  statusCounts: { active: number; in_process: number; new: number };
}

const OPTIONS: {
  label: string;
  value: StatusFilterValue;
  dotColor: string;
}[] = [
  { label: "All Statuses", value: null, dotColor: "#6b7280" },
  { label: "Learned", value: "active", dotColor: "#16a34a" },
  { label: "In Process", value: "in_process", dotColor: "#d97706" },
  { label: "New", value: "new", dotColor: "#dc2626" },
];

function Badge({ count }: { count: number }) {
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

export default function StatusFilter({
  value,
  onChange,
  totalCount,
  statusCounts,
}: StatusFilterProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const counts: Record<string, number> = {
    all: totalCount,
    active: statusCounts.active,
    in_process: statusCounts.in_process,
    new: statusCounts.new,
  };

  const getCount = (v: StatusFilterValue) =>
    v === null ? counts.all : (counts[v] ?? 0);

  const currentOption = OPTIONS.find((o) => o.value === value) ?? OPTIONS[0];

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 14px",
          borderRadius: 12,
          border: "1px solid #e5e7eb",
          background: "#ffffff",
          color: "#374151",
          cursor: "pointer",
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: 14,
          fontWeight: 500,
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: currentOption.dotColor,
            display: "inline-block",
            flexShrink: 0,
          }}
        />
        {currentOption.label}
        <Badge count={getCount(value)} />
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#6b7280"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.15s",
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            zIndex: 50,
            minWidth: 220,
            padding: "6px 0",
          }}
        >
          {OPTIONS.map((opt) => (
            <button
              key={opt.label}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 16px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: 14,
                color: "#111827",
                fontWeight: 500,
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.background =
                  "#f9fafb")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.background =
                  "transparent")
              }
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: opt.dotColor,
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              <span style={{ textAlign: "left" }}>{opt.label}</span>
              <Badge count={getCount(opt.value)} />
              <span style={{ flex: 1 }} />
              {value === opt.value && (
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
          ))}
        </div>
      )}
    </div>
  );
}
