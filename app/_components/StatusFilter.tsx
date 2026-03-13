"use client";

import { useState, useRef, useEffect } from "react";

export type StatusFilterValue = "active" | "in_process" | "new" | null;

interface StatusFilterProps {
  value: StatusFilterValue;
  onChange: (status: StatusFilterValue) => void;
  totalCount: number;
}

const OPTIONS: {
  label: string;
  value: StatusFilterValue;
  dotColor: string;
}[] = [
  { label: "All Statuses", value: null, dotColor: "#374151" },
  { label: "Learned", value: "active", dotColor: "#16a34a" },
  { label: "In Process", value: "in_process", dotColor: "#d97706" },
  { label: "New", value: "new", dotColor: "#dc2626" },
];

export default function StatusFilter({
  value,
  onChange,
  totalCount,
}: StatusFilterProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentOption = OPTIONS.find((o) => o.value === value) ?? OPTIONS[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm transition-colors"
        style={{
          borderColor: "#e5e7eb",
          background: "#ffffff",
          color: "#374151",
          cursor: "pointer",
          fontFamily: "'Inter', system-ui, sans-serif",
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: currentOption.dotColor,
            display: "inline-block",
            flexShrink: 0,
          }}
        />
        {currentOption.label}
        <span
          className="text-xs px-1.5 py-0.5 rounded-full"
          style={{ background: "#f3f4f6", color: "#6b7280" }}
        >
          {totalCount}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#6b7280"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute top-full left-0 mt-1 py-1 rounded-lg border border-[#e5e7eb] shadow-lg z-50"
          style={{ background: "#ffffff", minWidth: 200 }}
        >
          {OPTIONS.map((opt) => (
            <button
              key={opt.label}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-[#f9fafb]"
              style={{
                color: "#111827",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontFamily: "'Inter', system-ui, sans-serif",
              }}
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
              <span className="flex-1 text-left">{opt.label}</span>
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
