import { ACTIVITY_TYPES } from "./activityModel";
import { useAppTheme } from "./AppThemeContext";

export default function LogTodaySummary({ lastAddedActivityId, loggedActivities, onDeleteActivity }) {
  const { theme } = useAppTheme();

  if (!loggedActivities.length) return null;

  return (
    <>
      <style>{`
        @keyframes todayLogFlyIn {
          from { opacity: 0; transform: translateY(18px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes todayLogGlow {
          0% { box-shadow: 0 0 0 rgba(52, 211, 153, 0); }
          35% { box-shadow: 0 10px 28px rgba(52, 211, 153, 0.22); }
          100% { box-shadow: 0 0 0 rgba(52, 211, 153, 0); }
        }
        .today-log-row-added {
          animation: todayLogFlyIn 420ms cubic-bezier(.2,.85,.2,1), todayLogGlow 900ms ease-out;
        }
        @media (prefers-reduced-motion: reduce) {
          .today-log-row-added {
            animation: none !important;
          }
        }
      `}</style>
      <div style={{ marginBottom: 20, padding: "12px 14px", borderRadius: 12, background: "rgba(52,211,153,0.05)", border: "1px solid rgba(52,211,153,0.15)" }}>
        <p style={{ color: "#34D399", fontSize: 10, fontWeight: 700, letterSpacing: 1, fontFamily: "monospace", margin: "0 0 8px" }}>
          TODAY — {loggedActivities.length} {loggedActivities.length === 1 ? "ACTIVITY" : "ACTIVITIES"} LOGGED
        </p>
        {loggedActivities.map((a, i) => {
          const ai = ACTIVITY_TYPES.find(x => x.id === (a.activityId || a.type));
          const isNew = a.id && a.id === lastAddedActivityId;
          return (
            <div
              key={a.id || i}
              className={isNew ? "today-log-row-added" : ""}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                margin: isNew ? "0 -6px" : 0,
                padding: isNew ? "7px 6px" : "5px 0",
                borderTop: i === 0 ? "none" : `1px solid ${theme.divider}`,
                borderRadius: isNew ? 10 : 0,
                background: isNew ? "rgba(52,211,153,0.10)" : "transparent",
              }}
            >
              <span style={{ fontSize: 15 }}>{ai?.icon}</span>
              <span style={{ flex: 1, fontSize: 12, color: theme.textSoft, fontWeight: 600 }}>
                {ai?.label} · {a.value} {ai?.unit}
                {a.note ? <span style={{ color: theme.mutedStrong, fontWeight: 400 }}> · {a.note}</span> : null}
              </span>
              <span style={{ fontSize: 11, color: ai?.color, fontFamily: "monospace", fontWeight: 700 }}>+{a.points} pts</span>
              {onDeleteActivity && (
                <button
                  onClick={() => {
                    if (window.confirm("Delete this activity? This updates your points and removes its Tribe Activity post when linked.")) {
                      onDeleteActivity(a, i);
                    }
                  }}
                  style={{
                    border: "1px solid rgba(239,68,68,0.35)",
                    background: "rgba(239,68,68,0.12)",
                    color: "#EF4444",
                    borderRadius: 999,
                    padding: "5px 8px",
                    fontSize: 10,
                    fontWeight: 800,
                    cursor: "pointer",
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  Delete
                </button>
              )}
            </div>
          );
        })}
        <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${theme.divider}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 10, color: theme.mutedStrong, fontFamily: "monospace", letterSpacing: 0.5 }}>TOTAL TODAY</span>
          <span style={{ fontSize: 13, color: "#FFD700", fontFamily: "monospace", fontWeight: 800 }}>
            +{loggedActivities.reduce((s, a) => s + (a.points || 0), 0)} pts
          </span>
        </div>
      </div>
    </>
  );
}
