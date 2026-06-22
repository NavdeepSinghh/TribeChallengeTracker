import { useEffect, useState } from "react";
import { listenTodayTribeFeed } from "../userServices/tribeFeedService";
import { useAppTheme } from "./AppThemeContext";

export default function TribeFeedSection({ onLogActivity }) {
  const { theme } = useAppTheme();
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSheet, setShowSheet] = useState(false);
  const previewEntries = entries.slice(0, 3);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = listenTodayTribeFeed(nextEntries => {
      setEntries(nextEntries);
      setIsLoading(false);
    }, 10);
    return unsubscribe;
  }, []);

  return (
    <>
      <div style={{ padding: "0 20px 24px" }}>
        <button
          onClick={() => setShowSheet(true)}
          style={{
            width: "100%",
            textAlign: "left",
            background: theme.cardBg,
            border: `1px solid ${theme.cardBorder}`,
            borderRadius: 16,
            padding: 16,
            cursor: "pointer",
            color: theme.text,
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <p style={{ color: theme.mutedStrong, fontSize: 10, fontWeight: 800, letterSpacing: 1, fontFamily: "monospace", margin: "0 0 4px" }}>
                TRIBE ACTIVITY 🔥
              </p>
              <p style={{ color: theme.textSoft, fontSize: 12, fontWeight: 700, margin: 0 }}>
                See who logged today, then add yours.
              </p>
            </div>
            <span style={{ color: "#FF6B35", fontWeight: 900, fontSize: 18 }}>›</span>
          </div>

          <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
            {isLoading ? (
              <>
                <LoadingRow theme={theme} />
                <LoadingRow theme={theme} />
                <LoadingRow theme={theme} />
              </>
            ) : previewEntries.length ? (
              previewEntries.map(entry => <TribeFeedCard key={entry.id} entry={entry} compact />)
            ) : (
              <div>
                <p style={{ margin: "0 0 4px", color: theme.text, fontSize: 13, fontWeight: 800 }}>
                  No logs from the tribe yet today.
                </p>
                <p style={{ margin: 0, color: theme.textSoft, fontSize: 12 }}>
                  Tap to open today’s feed and log your activity.
                </p>
              </div>
            )}
          </div>
        </button>
      </div>

      {showSheet && (
        <div
          onClick={() => setShowSheet(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: theme.overlayBg,
            zIndex: 110,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <div
            onClick={event => event.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 460,
              maxHeight: "78vh",
              overflowY: "auto",
              background: theme.cardBgStrong,
              border: `1px solid ${theme.cardBorderStrong}`,
              borderRadius: 24,
              padding: 18,
              boxShadow: "0 24px 80px rgba(0,0,0,0.24)",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
              <div style={{ flex: 1 }}>
                <p style={{ color: theme.mutedStrong, fontSize: 10, fontWeight: 800, letterSpacing: 1, fontFamily: "monospace", margin: "0 0 4px" }}>
                  TODAY IN THE TRIBE 🔥
                </p>
                <h2 style={{ color: theme.text, fontSize: 22, lineHeight: 1.1, fontFamily: "'Syne', sans-serif", margin: 0 }}>
                  Last logs from different members today.
                </h2>
              </div>
              <button
                onClick={() => setShowSheet(false)}
                style={{
                  border: 0,
                  background: theme.cardBg,
                  color: "#FF6B35",
                  borderRadius: 14,
                  padding: "10px 12px",
                  fontWeight: 900,
                  cursor: "pointer",
                }}
              >
                Done
              </button>
            </div>

            <div style={{ display: "grid", gap: 8 }}>
              {isLoading ? (
                <>
                  <LoadingRow theme={theme} />
                  <LoadingRow theme={theme} />
                  <LoadingRow theme={theme} />
                </>
              ) : entries.length ? (
                entries.map(entry => <TribeFeedCard key={entry.id} entry={entry} />)
              ) : (
                <div style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: 16, padding: 14 }}>
                  <p style={{ margin: "0 0 4px", color: theme.text, fontSize: 16, fontWeight: 900 }}>
                    No one has logged yet today.
                  </p>
                  <p style={{ margin: 0, color: theme.textSoft, fontSize: 13 }}>
                    Start the feed by adding your activity.
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setShowSheet(false);
                onLogActivity?.();
              }}
              style={{
                width: "100%",
                marginTop: 14,
                border: 0,
                borderRadius: 16,
                padding: "14px 16px",
                background: "linear-gradient(90deg,#FF6B35,#FFD700)",
                color: "#080808",
                fontWeight: 900,
                fontSize: 15,
                cursor: "pointer",
              }}
            >
              + Log My Activity
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function LoadingRow({ theme }) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
      <div style={{ width: 36, height: 36, borderRadius: "50%", background: theme.cardBorderStrong }} />
      <div style={{ flex: 1 }}>
        <div style={{ width: "50%", height: 9, borderRadius: 99, background: theme.cardBorderStrong, marginBottom: 7 }} />
        <div style={{ width: "84%", height: 9, borderRadius: 99, background: theme.cardBorder }} />
      </div>
    </div>
  );
}

function TribeFeedCard({ entry }) {
  const { theme } = useAppTheme();
  const displayName = entry.displayName || "Tribe member";
  const value = Number(entry.value || 0);
  const valueText = Number.isInteger(value) ? String(value) : value.toFixed(1);
  const streakText = entry.currentStreak > 0 ? ` · 🔥 ${entry.currentStreak} day streak` : "";

  return (
    <div style={{
      display: "flex",
      gap: 10,
      alignItems: "flex-start",
      background: theme.cardBgStrong,
      border: `1px solid ${theme.cardBorder}`,
      borderRadius: 14,
      padding: 10,
    }}>
      <div style={{
        width: 38,
        height: 38,
        borderRadius: "50%",
        background: entry.avatarColor || "#FF6B35",
        display: "grid",
        placeItems: "center",
        flexShrink: 0,
        fontSize: 18,
      }}>
        {entry.avatarEmoji || "💪"}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
          <p style={{ margin: 0, color: theme.text, fontSize: 13, fontWeight: 900, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {displayName}
          </p>
          <span style={{ marginLeft: "auto", color: theme.muted, fontSize: 10, fontFamily: "monospace", flexShrink: 0 }}>
            {timeAgo(entry.loggedAt)}
          </span>
        </div>
        <p style={{ margin: "3px 0 0", color: theme.textSoft, fontSize: 12, fontWeight: 700, lineHeight: 1.35 }}>
          {entry.activityEmoji} {entry.activityLabel} · {valueText} {entry.unit} · {entry.points || 0} pts{streakText}
        </p>
      </div>
    </div>
  );
}

function timeAgo(timestamp) {
  const date = timestamp?.toDate?.();
  if (!date) return "";
  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
}
