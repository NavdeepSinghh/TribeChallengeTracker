import { useEffect, useState } from "react";
import { listenTodayTribeFeed } from "../userServices/tribeFeedService";
import { useAppTheme } from "./AppThemeContext";

const TODAY_TRIBE_FEED_LIMIT = 5;

export default function TribeFeedSection({ onLogActivity }) {
  const { theme } = useAppTheme();
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSheet, setShowSheet] = useState(false);
  const previewEntries = entries.slice(0, TODAY_TRIBE_FEED_LIMIT);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = listenTodayTribeFeed(nextEntries => {
      setEntries(nextEntries);
      setIsLoading(false);
    }, TODAY_TRIBE_FEED_LIMIT);
    return unsubscribe;
  }, []);

  return (
    <>
      <style>{`
        @keyframes tribeFeedSlideIn {
          from { opacity: 0; transform: translateY(10px) scale(0.985); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes tribeFeedPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.34); }
          50% { box-shadow: 0 0 0 6px rgba(52, 211, 153, 0); }
        }
        @keyframes tribeFeedLiveDot {
          0%, 100% { opacity: 0.5; transform: scale(0.88); }
          50% { opacity: 1; transform: scale(1.08); }
        }
        @keyframes tribeWorkoutRun {
          0%, 100% { transform: translate3d(-1px, 0, 0) rotate(-5deg); }
          50% { transform: translate3d(2px, -2px, 0) rotate(6deg); }
        }
        @keyframes tribeWorkoutWalk {
          0%, 100% { transform: translate3d(-1px, 0, 0) rotate(-3deg); }
          50% { transform: translate3d(1px, -1px, 0) rotate(3deg); }
        }
        @keyframes tribeWorkoutCycle {
          0%, 100% { transform: rotate(-8deg) translateY(0); }
          50% { transform: rotate(8deg) translateY(-1px); }
        }
        @keyframes tribeWorkoutSwim {
          0%, 100% { transform: translate3d(-1px, 1px, 0) rotate(-4deg); }
          50% { transform: translate3d(2px, -2px, 0) rotate(4deg); }
        }
        @keyframes tribeWorkoutYoga {
          0%, 100% { transform: scale(0.96); opacity: 0.78; }
          50% { transform: scale(1.08); opacity: 1; }
        }
        @keyframes tribeWorkoutGym {
          0%, 100% { transform: scale(0.96) rotate(-6deg); }
          50% { transform: scale(1.12) rotate(6deg); }
        }
        @keyframes tribeWorkoutDefault {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-2px) scale(1.05); }
        }
        .tribe-feed-live-card {
          animation: tribeFeedSlideIn 420ms cubic-bezier(.2,.8,.2,1) both;
        }
        .tribe-feed-live-avatar {
          animation: tribeFeedPulse 1.8s ease-in-out infinite;
        }
        .tribe-feed-live-dot {
          animation: tribeFeedLiveDot 1.2s ease-in-out infinite;
        }
        .tribe-workout-emoji {
          display: inline-block;
          width: 1.45em;
          min-width: 1.45em;
          text-align: center;
          transform-origin: 50% 72%;
          will-change: transform;
        }
        .tribe-workout-emoji-run { animation: tribeWorkoutRun 900ms ease-in-out infinite; }
        .tribe-workout-emoji-walk { animation: tribeWorkoutWalk 1150ms ease-in-out infinite; }
        .tribe-workout-emoji-cycle { animation: tribeWorkoutCycle 1050ms ease-in-out infinite; }
        .tribe-workout-emoji-swim { animation: tribeWorkoutSwim 1300ms ease-in-out infinite; }
        .tribe-workout-emoji-yoga { animation: tribeWorkoutYoga 1800ms ease-in-out infinite; }
        .tribe-workout-emoji-gym { animation: tribeWorkoutGym 1050ms ease-in-out infinite; }
        .tribe-workout-emoji-default { animation: tribeWorkoutDefault 1400ms ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .tribe-feed-live-card,
          .tribe-feed-live-avatar,
          .tribe-feed-live-dot,
          .tribe-workout-emoji {
            animation: none !important;
          }
        }
      `}</style>
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
                Latest 5 logs from today. Tap to add yours.
              </p>
            </div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#FF6B35", fontWeight: 900, fontSize: 18 }}>
              <span className="tribe-feed-live-dot" style={{ width: 8, height: 8, borderRadius: "50%", background: "#34D399", display: "inline-block" }} />
              ›
            </span>
          </div>

          <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
            {isLoading ? (
              <>
                <LoadingRow theme={theme} />
                <LoadingRow theme={theme} />
                <LoadingRow theme={theme} />
              </>
            ) : previewEntries.length ? (
              previewEntries.map((entry, index) => (
                <TribeFeedCard key={entry.id} entry={entry} index={index} />
              ))
            ) : (
              <div>
                <p style={{ margin: "0 0 4px", color: theme.text, fontSize: 13, fontWeight: 800 }}>
                  No logs from the tribe yet today.
                </p>
                <p style={{ margin: 0, color: theme.textSoft, fontSize: 12 }}>
                  Tap to open the live feed and log your activity.
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
                  Latest activity from today.
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
                entries.map((entry, index) => (
                  <TribeFeedCard key={entry.id} entry={entry} index={index} />
                ))
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

function TribeFeedCard({ entry, index = 0 }) {
  const { theme } = useAppTheme();
  const displayName = entry.displayName || "Tribe member";
  const value = Number(entry.value || 0);
  const valueText = Number.isInteger(value) ? String(value) : value.toFixed(1);
  const streakText = entry.currentStreak > 0 ? ` · 🔥 ${entry.currentStreak} day streak` : "";

  return (
    <div className="tribe-feed-live-card" style={{
      display: "flex",
      gap: 10,
      alignItems: "flex-start",
      background: theme.cardBgStrong,
      border: `1px solid ${theme.cardBorder}`,
      borderRadius: 14,
      padding: 10,
      animationDelay: `${Math.min(index, 4) * 65}ms`,
    }}>
      <div className="tribe-feed-live-avatar" style={{
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
        <p style={{ margin: "3px 0 0", color: theme.textSoft, fontSize: 12, fontWeight: 700, lineHeight: 1.35, display: "flex", alignItems: "center", gap: 4 }}>
          <AnimatedActivityEmoji entry={entry} />
          <span style={{ minWidth: 0 }}>
            {entry.activityLabel} · {valueText} {entry.unit} · {entry.points || 0} pts{streakText}
          </span>
        </p>
      </div>
    </div>
  );
}

function AnimatedActivityEmoji({ entry }) {
  const emoji = entry.activityEmoji || "🔥";
  return (
    <span className={`tribe-workout-emoji ${workoutMotionClass(entry)}`} aria-hidden="true">
      {emoji}
    </span>
  );
}

function workoutMotionClass(entry) {
  const descriptor = `${entry.activityType || ""} ${entry.activityLabel || ""} ${entry.activityEmoji || ""}`.toLowerCase();
  if (descriptor.includes("run") || descriptor.includes("🏃")) return "tribe-workout-emoji-run";
  if (descriptor.includes("walk") || descriptor.includes("🚶") || descriptor.includes("step")) return "tribe-workout-emoji-walk";
  if (descriptor.includes("cycle") || descriptor.includes("bike") || descriptor.includes("biking") || descriptor.includes("🚴")) return "tribe-workout-emoji-cycle";
  if (descriptor.includes("swim") || descriptor.includes("🏊")) return "tribe-workout-emoji-swim";
  if (descriptor.includes("yoga") || descriptor.includes("🧘")) return "tribe-workout-emoji-yoga";
  if (descriptor.includes("gym") || descriptor.includes("strength") || descriptor.includes("workout") || descriptor.includes("💪")) return "tribe-workout-emoji-gym";
  return "tribe-workout-emoji-default";
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
