"use client";

interface SidebarProps {
  chatOpen: boolean;
  onToggleChat: () => void;
}

export default function Sidebar({ chatOpen, onToggleChat }: SidebarProps) {
  const navItems = [
    { label: "Home", icon: HomeSvg, active: false },
    { label: "Analytics", icon: BarChartSvg, active: false },
    { label: "Documents", icon: LayersSvg, active: true },
    {
      label: "Chat",
      icon: MessageSquareSvg,
      active: chatOpen,
      onClick: onToggleChat,
    },
    { label: "History", icon: ClockSvg, active: false },
  ];

  return (
    <div
      className="flex flex-col items-center shrink-0 py-4"
      style={{
        width: 64,
        background: "#ffffff",
        borderRight: "1px solid #e5e7eb",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* Logo */}
      <div className="mb-8 mt-2">
        <div
          className="flex items-center justify-center rounded-xl"
          style={{ width: 36, height: 36, background: "#2563eb" }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>
      </div>

      {/* Nav icons */}
      <nav className="flex flex-col items-center gap-1 flex-1">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={item.onClick}
            title={item.label}
            className="flex items-center justify-center rounded-xl transition-colors"
            style={{
              width: 40,
              height: 40,
              background: item.active ? "#eff6ff" : "transparent",
              cursor: "pointer",
              border: "none",
            }}
          >
            <item.icon active={item.active} />
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div className="flex flex-col items-center gap-2 mb-2">
        <button
          title="Settings"
          className="flex items-center justify-center rounded-xl transition-colors hover:bg-[#f3f4f6]"
          style={{
            width: 40,
            height: 40,
            background: "transparent",
            cursor: "pointer",
            border: "none",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6b7280"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
        <div
          className="flex items-center justify-center rounded-full text-xs font-semibold"
          style={{
            width: 32,
            height: 32,
            background: "#F2F4F7",
            color: "#475467",
          }}
        >
          UK
        </div>
      </div>
    </div>
  );
}

function HomeSvg({ active }: { active: boolean }) {
  const color = active ? "#2563eb" : "#6b7280";
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function BarChartSvg({ active }: { active: boolean }) {
  const color = active ? "#2563eb" : "#6b7280";
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  );
}

function LayersSvg({ active }: { active: boolean }) {
  const color = active ? "#2563eb" : "#6b7280";
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

function MessageSquareSvg({ active }: { active: boolean }) {
  const color = active ? "#2563eb" : "#6b7280";
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function ClockSvg({ active }: { active: boolean }) {
  const color = active ? "#2563eb" : "#6b7280";
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
