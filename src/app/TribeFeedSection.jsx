import { useEffect, useState } from "react";
import { listenRecentTribeFeed } from "../userServices/tribeFeedService";
import { useAppTheme } from "./AppThemeContext";

const TODAY_TRIBE_FEED_LIMIT = 5;
const TODAY_TRIBE_PULSE_LIMIT = 50;

function isLoggedToday(entry) {
  const value = entry?.loggedAt?.toDate?.() || entry?.loggedAt;
  const date = value instanceof Date ? value : value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return false;
  return date.toDateString() === new Date().toDateString();
}

export default function TribeFeedSection({ onLogActivity }) {
  const { theme } = useAppTheme();
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSheet, setShowSheet] = useState(false);
  const todayEntries = entries.filter(isLoggedToday);
  const visibleEntries = todayEntries.length ? todayEntries : entries;
  const isShowingRecentFallback = !todayEntries.length && entries.length > 0;
  const previewEntries = visibleEntries.slice(0, TODAY_TRIBE_FEED_LIMIT);
  const pulse = buildTribePulse(visibleEntries);
  const pulseTitle = isShowingRecentFallback ? "RECENT TRIBE PULSE" : "TODAY'S TRIBE PULSE";

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = listenRecentTribeFeed(nextEntries => {
      setEntries(nextEntries);
      setIsLoading(false);
    }, TODAY_TRIBE_PULSE_LIMIT);
    return unsubscribe;
  }, []);

  return (
    <>
      <style>{`
        @keyframes tribeFeedSlideIn {
          0% { opacity: 0; transform: translate3d(18px, 14px, 0) scale(0.94); }
          70% { opacity: 1; transform: translate3d(-2px, -1px, 0) scale(1.015); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes tribeFeedLatestGlow {
          0%, 100% { box-shadow: 0 0 0 rgba(255, 107, 53, 0), inset 0 0 0 rgba(255, 215, 0, 0); }
          50% { box-shadow: 0 0 22px rgba(255, 107, 53, 0.22), inset 0 0 18px rgba(255, 215, 0, 0.08); }
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
          0%, 100% { transform: translate3d(-4px, 2px, 0) rotate(-12deg) scale(0.92); }
          50% { transform: translate3d(5px, -5px, 0) rotate(14deg) scale(1.16); }
        }
        @keyframes tribeWorkoutWalk {
          0%, 100% { transform: translate3d(-3px, 1px, 0) rotate(-8deg); }
          50% { transform: translate3d(4px, -3px, 0) rotate(9deg); }
        }
        @keyframes tribeWorkoutCycle {
          0% { transform: rotate(-18deg) translateY(1px) scale(0.96); }
          50% { transform: rotate(18deg) translateY(-4px) scale(1.12); }
          100% { transform: rotate(-18deg) translateY(1px) scale(0.96); }
        }
        @keyframes tribeWorkoutSwim {
          0%, 100% { transform: translate3d(-5px, 3px, 0) rotate(-10deg); }
          50% { transform: translate3d(6px, -4px, 0) rotate(10deg); }
        }
        @keyframes tribeWorkoutYoga {
          0%, 100% { transform: scale(0.88); opacity: 0.72; }
          50% { transform: scale(1.18); opacity: 1; }
        }
        @keyframes tribeWorkoutGym {
          0%, 100% { transform: scale(0.88) rotate(-14deg); }
          50% { transform: scale(1.24) rotate(14deg); }
        }
        @keyframes tribeWorkoutDefault {
          0%, 100% { transform: translateY(2px) scale(0.94); }
          50% { transform: translateY(-5px) scale(1.14); }
        }
        @keyframes tribeBubbleAura {
          0%, 100% { transform: scale(0.86); opacity: 0.2; }
          50% { transform: scale(1.22); opacity: 0.52; }
        }
        @keyframes tribeSparkPop {
          0%, 100% { transform: translate3d(0, 0, 0) scale(0.55); opacity: 0.25; }
          50% { transform: translate3d(var(--spark-x), var(--spark-y), 0) scale(1); opacity: 1; }
        }
        .tribe-feed-live-card {
          animation: tribeFeedSlideIn 420ms cubic-bezier(.2,.8,.2,1) both;
        }
        .tribe-feed-live-card-latest {
          animation-name: tribeFeedSlideIn, tribeFeedLatestGlow;
          animation-duration: 420ms, 2.4s;
          animation-timing-function: cubic-bezier(.2,.8,.2,1), ease-in-out;
          animation-fill-mode: both, none;
          animation-iteration-count: 1, infinite;
        }
        .tribe-feed-live-avatar {
          animation: tribeFeedPulse 1.8s ease-in-out infinite;
        }
        .tribe-feed-live-dot {
          animation: tribeFeedLiveDot 1.2s ease-in-out infinite;
        }
        .tribe-workout-emoji {
          display: inline-block;
          text-align: center;
          transform-origin: 50% 72%;
          will-change: transform;
          position: relative;
          z-index: 2;
        }
        .tribe-workout-emoji-run { animation: tribeWorkoutRun 900ms ease-in-out infinite; }
        .tribe-workout-emoji-walk { animation: tribeWorkoutWalk 1150ms ease-in-out infinite; }
        .tribe-workout-emoji-cycle { animation: tribeWorkoutCycle 1050ms ease-in-out infinite; }
        .tribe-workout-emoji-swim { animation: tribeWorkoutSwim 1300ms ease-in-out infinite; }
        .tribe-workout-emoji-yoga { animation: tribeWorkoutYoga 1800ms ease-in-out infinite; }
        .tribe-workout-emoji-gym { animation: tribeWorkoutGym 1050ms ease-in-out infinite; }
        .tribe-workout-emoji-default { animation: tribeWorkoutDefault 1400ms ease-in-out infinite; }
        .tribe-workout-bubble {
          position: relative;
          display: inline-grid;
          place-items: center;
          flex: 0 0 auto;
          border-radius: 16px;
          overflow: visible;
          background: radial-gradient(circle at 32% 26%, rgba(255,255,255,0.72), rgba(255,215,0,0.18) 34%, rgba(255,107,53,0.2) 100%);
          border: 1px solid rgba(255, 107, 53, 0.34);
          box-shadow: 0 8px 20px rgba(255, 107, 53, 0.16);
        }
        .tribe-workout-bubble::before {
          content: "";
          position: absolute;
          inset: -6px;
          border-radius: 20px;
          background: radial-gradient(circle, rgba(52, 211, 153, 0.34), rgba(52, 211, 153, 0));
          animation: tribeBubbleAura 1.7s ease-in-out infinite;
          z-index: 0;
        }
        .tribe-workout-spark {
          position: absolute;
          width: 5px;
          height: 5px;
          border-radius: 999px;
          background: #FFD700;
          animation: tribeSparkPop 1.35s ease-in-out infinite;
          z-index: 3;
        }
        .tribe-workout-spark:nth-child(2) { --spark-x: 8px; --spark-y: -12px; right: 2px; top: 4px; }
        .tribe-workout-spark:nth-child(3) { --spark-x: -10px; --spark-y: -8px; left: 4px; top: 8px; animation-delay: 160ms; background: #34D399; }
        .tribe-workout-spark:nth-child(4) { --spark-x: 12px; --spark-y: 8px; right: 6px; bottom: 4px; animation-delay: 300ms; background: #FF6B35; }
        @media (prefers-reduced-motion: reduce) {
          .tribe-feed-live-card,
          .tribe-feed-live-card-latest,
          .tribe-feed-live-avatar,
          .tribe-feed-live-dot,
          .tribe-workout-emoji,
          .tribe-workout-bubble::before,
          .tribe-workout-spark {
            animation: none !important;
          }
        }
      `}</style>
      <div style={{ padding: "0 20px 24px" }}>
        <button
          onClick={() => {
            window.navigator?.vibrate?.(12);
            setShowSheet(true);
          }}
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
                {isShowingRecentFallback ? "No logs yet today. Recent tribe activity is below." : "Latest 5 logs from today. Tap to add yours."}
              </p>
            </div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#FF6B35", fontWeight: 900, fontSize: 18 }}>
              <span className="tribe-feed-live-dot" style={{ width: 8, height: 8, borderRadius: "50%", background: "#34D399", display: "inline-block" }} />
              ›
            </span>
          </div>

          <TribePulseSummary pulse={pulse} theme={theme} isLoading={isLoading} title={pulseTitle} />

          <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
            {isLoading ? (
              <>
                <LoadingRow theme={theme} />
                <LoadingRow theme={theme} />
                <LoadingRow theme={theme} />
              </>
            ) : previewEntries.length ? (
              previewEntries.map((entry, index) => (
                <TribeFeedCard key={entry.id} entry={entry} index={index} isLatest={index === 0} />
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
                  {isShowingRecentFallback ? "RECENT TRIBE ACTIVITY 🔥" : "TODAY IN THE TRIBE 🔥"}
                </p>
                <h2 style={{ color: theme.text, fontSize: 22, lineHeight: 1.1, fontFamily: "'Syne', sans-serif", margin: 0 }}>
                  {isShowingRecentFallback ? "No logs yet today, so here are recent logs." : "Latest activity from today."}
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
              <TribePulseSummary pulse={pulse} theme={theme} isLoading={isLoading} isExpanded title={pulseTitle} />

              {isLoading ? (
                <>
                  <LoadingRow theme={theme} />
                  <LoadingRow theme={theme} />
                  <LoadingRow theme={theme} />
                </>
              ) : visibleEntries.length ? (
                visibleEntries.map((entry, index) => (
                  <TribeFeedCard key={entry.id} entry={entry} index={index} isLatest={index === 0} isExpanded />
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
                window.navigator?.vibrate?.(18);
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

function TribePulseSummary({ pulse, theme, isLoading, isExpanded = false, title = "TODAY'S TRIBE PULSE" }) {
  const metrics = [
    { label: "Workout hours", value: pulse.hoursText, accent: "#FFD700" },
    { label: "Distance", value: pulse.distanceText, accent: "#34D399" },
    { label: "Steps", value: pulse.stepsText, accent: "#14B8A6" },
    { label: "Logs", value: pulse.logsText, accent: "#FF6B35" },
  ];

  return (
    <div style={{
      marginTop: isExpanded ? 0 : 14,
      marginBottom: isExpanded ? 10 : 0,
      padding: isExpanded ? 12 : 10,
      borderRadius: 16,
      background: theme.cardBgStrong,
      border: `1px solid ${theme.cardBorder}`,
    }}>
      <p style={{ margin: "0 0 8px", color: theme.mutedStrong, fontSize: 10, fontWeight: 900, letterSpacing: 1, fontFamily: "monospace" }}>
        {title}
      </p>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
        gap: 8,
      }}>
        {metrics.map(metric => (
          <div key={metric.label} style={{
            minWidth: 0,
            borderRadius: 12,
            padding: "9px 8px",
            background: isLoading ? theme.cardBorder : theme.cardBg,
            border: `1px solid ${theme.cardBorder}`,
          }}>
            <p style={{
              margin: "0 0 4px",
              color: metric.accent,
              fontSize: isExpanded ? 16 : 15,
              lineHeight: 1.05,
              fontWeight: 950,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}>
              {isLoading ? "..." : metric.value}
            </p>
            <p style={{
              margin: 0,
              color: theme.textSoft,
              fontSize: 9,
              lineHeight: 1.15,
              fontWeight: 800,
              fontFamily: "monospace",
              textTransform: "uppercase",
            }}>
              {metric.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TribeFeedCard({ entry, index = 0, isLatest = false, isExpanded = false }) {
  const { theme } = useAppTheme();
  const displayName = entry.displayName || "Tribe member";
  const value = Number(entry.value || 0);
  const valueText = Number.isInteger(value) ? String(value) : value.toFixed(1);
  const streakText = entry.currentStreak > 0 ? ` · 🔥 ${entry.currentStreak} day streak` : "";

  return (
    <div className={`tribe-feed-live-card${isLatest ? " tribe-feed-live-card-latest" : ""}`} style={{
      display: "flex",
      gap: 10,
      alignItems: "flex-start",
      background: isLatest
        ? `linear-gradient(135deg, ${theme.cardBgStrong}, rgba(255,107,53,0.10))`
        : theme.cardBgStrong,
      border: `1px solid ${isLatest ? "rgba(255,107,53,0.38)" : theme.cardBorder}`,
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
        <p style={{ margin: "5px 0 0", color: theme.textSoft, fontSize: isExpanded ? 13 : 12, fontWeight: 700, lineHeight: 1.35, display: "flex", alignItems: "center", gap: 8 }}>
          <AnimatedActivityEmoji entry={entry} isLatest={isLatest} isExpanded={isExpanded} index={index} />
          <span style={{ minWidth: 0 }}>
            {entry.activityLabel} · {valueText} {entry.unit} · {entry.points || 0} pts{streakText}
          </span>
        </p>
      </div>
    </div>
  );
}

function AnimatedActivityEmoji({ entry, isLatest = false, isExpanded = false, index = 0 }) {
  const emoji = entry.activityEmoji || "🔥";
  const size = isExpanded ? 42 : 34;
  return (
    <span
      className="tribe-workout-bubble"
      style={{
        width: size,
        height: size,
        animationDelay: `${Math.min(index, 4) * 120}ms`,
      }}
      aria-hidden="true"
    >
      <span className={`tribe-workout-emoji ${workoutMotionClass(entry)}`} style={{ fontSize: isExpanded ? 22 : 18 }}>
        {emoji}
      </span>
      {isLatest && (
        <>
          <span className="tribe-workout-spark" />
          <span className="tribe-workout-spark" />
          <span className="tribe-workout-spark" />
        </>
      )}
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

function buildTribePulse(entries) {
  return entries.reduce((pulse, entry) => {
    const value = Number(entry.value || 0);
    const unit = String(entry.unit || "").trim().toLowerCase();

    if (unit === "km" || unit === "kms" || unit.includes("kilomet")) {
      pulse.distanceKm += value;
    } else if (unit === "m" || unit === "meter" || unit === "meters" || unit === "metre" || unit === "metres") {
      pulse.distanceKm += value / 1000;
    }

    if (unit === "min" || unit === "mins" || unit.includes("minute")) {
      pulse.workoutMinutes += value;
    } else if (unit === "hr" || unit === "hrs" || unit.includes("hour")) {
      pulse.workoutMinutes += value * 60;
    }

    if (unit === "step" || unit === "steps") {
      pulse.steps += value;
    }

    pulse.logs += 1;
    pulse.hoursText = formatHours(pulse.workoutMinutes);
    pulse.distanceText = `${formatCompactNumber(pulse.distanceKm, 1)} km`;
    pulse.stepsText = formatCompactNumber(pulse.steps, 0);
    pulse.logsText = String(pulse.logs);
    return pulse;
  }, {
    workoutMinutes: 0,
    distanceKm: 0,
    steps: 0,
    logs: 0,
    hoursText: "0h",
    distanceText: "0 km",
    stepsText: "0",
    logsText: "0",
  });
}

function formatHours(minutes) {
  const hours = minutes / 60;
  if (hours === 0) return "0h";
  if (hours < 1) return `${Math.round(minutes)}m`;
  return `${formatCompactNumber(hours, 1)}h`;
}

function formatCompactNumber(value, fractionDigits = 0) {
  if (!Number.isFinite(value) || value <= 0) return "0";
  if (value >= 1000000) return `${trimNumber(value / 1000000, 1)}m`;
  if (value >= 10000) return `${trimNumber(value / 1000, 1)}k`;
  return trimNumber(value, fractionDigits);
}

function trimNumber(value, fractionDigits) {
  const fixed = value.toFixed(fractionDigits);
  return fixed.replace(/\.0$/, "");
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
