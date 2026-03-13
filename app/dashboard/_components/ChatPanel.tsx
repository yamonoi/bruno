"use client";

interface ChatPanelProps {
  onClose: () => void;
}

// Bot can have multiple bubbles per turn
type Message =
  | { role: "bot"; bubbles: string[] }
  | { role: "user"; text: string }
  | { role: "typing" };

const MOCK_MESSAGES: Message[] = [
  {
    role: "bot",
    bubbles: [
      `Hi! What filter would you like to apply to the training data? You can ask me things like "show me only approved stocks" or "filter by high confidence patterns"`,
    ],
  },
  { role: "typing" },
  { role: "user", text: "scan for setups" },
  {
    role: "bot",
    bubbles: [
      "Perfect! Opening the Scan for Setups canvas to find the best trading opportunities.",
      "Shall I update your calendar and notify Sienna and the team?",
    ],
  },
  {
    role: "user",
    text: "Yes, but can we do the strategy session on Friday instead?",
  },
  { role: "typing" },
];

function BotIcon() {
  return (
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        background: "#e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#374151"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" y1="2" x2="12" y2="5" />
        <circle cx="12" cy="1.5" r="1" fill="#374151" stroke="none" />
        <rect x="3" y="5" width="18" height="14" rx="3" />
        <circle cx="9" cy="11" r="1.5" fill="#374151" stroke="none" />
        <circle cx="15" cy="11" r="1.5" fill="#374151" stroke="none" />
        <path d="M9 15 h6" />
      </svg>
    </div>
  );
}

function UserAvatar() {
  return (
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        background: "#1e293b",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        color: "#ffffff",
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: "0.02em",
      }}
    >
      UK
    </div>
  );
}

function TypingIndicator() {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        background: "#ffffff",
        borderRadius: 10,
        padding: "8px 14px",
      }}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#9ca3af",
            display: "inline-block",
          }}
        />
      ))}
    </div>
  );
}

/** Render inline bold: "text" */
function renderInline(text: string): React.ReactNode {
  const parts = text.split(/("([^"]+)")/g);
  const result: React.ReactNode[] = [];
  let i = 0;
  const regex = /"([^"]+)"/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) result.push(text.slice(last, match.index));
    result.push(<strong key={i++}>"{match[1]}"</strong>);
    last = match.index + match[0].length;
  }
  result.push(text.slice(last));
  return result;
}

export default function ChatPanel({ onClose }: ChatPanelProps) {
  return (
    <div
      className="shrink-0 border-l border-[#e5e7eb] flex flex-col"
      style={{
        width: 360,
        minHeight: "100vh",
        background: "#f9fafb",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* Close button */}
      <div className="flex justify-end px-4 pt-4 pb-2">
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#9ca3af",
            padding: 4,
            fontSize: 18,
            lineHeight: 1,
          }}
        >
          ×
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-4">
        {MOCK_MESSAGES.map((msg, i) => {
          if (msg.role === "typing") {
            return (
              <div key={i}>
                <TypingIndicator />
              </div>
            );
          }

          if (msg.role === "bot") {
            return (
              <div key={i} className="flex items-start gap-3">
                <BotIcon />
                <div className="flex flex-col gap-2">
                  {msg.bubbles.map((bubble, j) => (
                    <div
                      key={j}
                      style={{
                        background: "#ffffff",
                        borderRadius: 12,
                        padding: "10px 14px",
                        fontSize: 14,
                        lineHeight: 1.6,
                        color: "#111827",
                        maxWidth: 260,
                      }}
                    >
                      {renderInline(bubble)}
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          // user
          return (
            <div key={i} className="flex items-start gap-3 justify-end">
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: 12,
                  padding: "10px 14px",
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: "#111827",
                  maxWidth: 260,
                }}
              >
                {msg.text}
              </div>
              <UserAvatar />
            </div>
          );
        })}
      </div>

      {/* Input + footer */}
      <div
        style={{
          background: "#ffffff",
          borderTop: "1px solid #e5e7eb",
          padding: "12px 16px",
        }}
      >
        <textarea
          placeholder="Ask me anything..."
          rows={3}
          readOnly
          style={{
            width: "100%",
            border: "1px solid #e5e7eb",
            borderRadius: 10,
            padding: "10px 12px",
            fontSize: 14,
            color: "#111827",
            background: "#ffffff",
            fontFamily: "'Inter', system-ui, sans-serif",
            outline: "none",
            resize: "none",
            marginBottom: 10,
          }}
        />

        {/* Footer bar */}
        <div className="flex items-center gap-3">
          {/* AAPL tag */}
          <span
            className="flex items-center gap-1 text-xs font-medium"
            style={{ color: "#374151" }}
          >
            AAPL
            <button
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#9ca3af",
                padding: 0,
                lineHeight: 1,
                fontSize: 13,
              }}
            >
              ×
            </button>
          </span>

          <div style={{ flex: 1 }} />

          {/* Shortcuts */}
          <button
            className="flex items-center gap-1 text-xs"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#6b7280",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <path d="M8 21h8M12 17v4" />
            </svg>
            Shortcuts
          </button>

          {/* Attach */}
          <button
            className="flex items-center gap-1 text-xs"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#6b7280",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
            </svg>
            Attach
          </button>
        </div>
      </div>
    </div>
  );
}
