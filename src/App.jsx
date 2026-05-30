import { useState, useEffect, useRef } from "react";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { healthAvailable, requestHealthPerms, getTodayWorkouts, openHealthSettings } from "./healthService";
import { platform, isNative, isIOS, isAndroid, isWeb, canSyncHealth, WATCH_OPTIONS, syncHintText } from "./platformService";
import { useAuth } from "./AuthContext";
import { saveOnboarding, getUserProfile, saveActivity, getActivityLog } from "./userService";
import { getUserChallenges } from "./challengeService";
import AuthScreen from "./AuthScreen";
import OnboardingScreen from "./OnboardingScreen";
import ChallengesTab from "./ChallengesTab";
import ProfileScreen from "./ProfileScreen";
import {
  BADGES, BADGE_CATEGORIES, TRIBE_RANKS,
  checkBadges, getBadgeProgress, awardBadges, loadEarnedBadges,
  calcBadgeXP, getTribeRank,
} from "./badgeService";

const ACTIVITY_TYPES = [
  { id: "run",   label: "Run",       icon: "🏃", unit: "km",  color: "#34D399" },
  { id: "yoga",  label: "Yoga",      icon: "🧘", unit: "min", color: "#A78BFA" },
  { id: "gym",   label: "Gym",       icon: "💪", unit: "min", color: "#F59E0B" },
  { id: "cycle", label: "Cycle",     icon: "🚴", unit: "km",  color: "#60A5FA" },
  { id: "swim",  label: "Swim",      icon: "🏊", unit: "min", color: "#38BDF8" },
  { id: "walk",  label: "Walk",      icon: "🚶", unit: "km",  color: "#4ADE80" },
];

const today = new Date();
const formatDate = (d) => d.toISOString().split("T")[0];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const getStreak = (history) => {
  let streak = 0;
  let d = new Date(today);
  while (true) {
    const entry = history[formatDate(d)];
    // Works for both old single-entry format and new activities-array format
    const hasActivity = entry?.activities ? entry.activities.length > 0 : !!entry?.type;
    if (hasActivity) streak++;
    else break;
    d.setDate(d.getDate() - 1);
  }
  return streak;
};

const getCalendarDays = (history) => {
  const days = [];
  for (let i = 27; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = formatDate(d);
    days.push({ date: key, day: d.getDate(), weekday: d.toLocaleDateString("en", { weekday: "short" }), activity: history[key] || null });
  }
  return days;
};

// Returns activities array for a day entry — handles both old (single object)
// and new (activities array) Firestore formats for backward compatibility.
const getEntryActivities = (entry) =>
  entry?.activities ?? (entry?.type ? [entry] : []);

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function Avatar({ emoji, size = 40 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.5, flexShrink: 0 }}>
      {emoji}
    </div>
  );
}


function CalendarGrid({ history, challenges = [] }) {
  const days   = getCalendarDays(history);
  const actMap = Object.fromEntries(ACTIVITY_TYPES.map(a => [a.id, a]));
  const weeks  = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));

  // Window boundaries for the 28-day grid
  const windowStart = new Date(today); windowStart.setDate(today.getDate() - 27); windowStart.setHours(0,0,0,0);
  const windowEnd   = new Date(today); windowEnd.setHours(23,59,59,999);

  // Pre-compute per-day challenge start markers: { [dateStr]: challenge }
  const challengeStartMap = {};
  challenges.forEach(c => {
    if (c.startDate >= formatDate(windowStart) && c.startDate <= formatDate(today)) {
      challengeStartMap[c.startDate] = c;
    }
  });

  // Active challenges overlapping the window (for timeline bars)
  const activeChallenges = challenges.filter(c =>
    c.startDate <= formatDate(today) && c.endDate >= formatDate(windowStart)
  );

  return (
    <div>
      {/* Day-of-week header */}
      <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(w => (
          <div key={w} style={{ width: 36, textAlign: "center", fontSize: 9, color: "#555", fontWeight: 700, letterSpacing: 0.5, fontFamily: "monospace" }}>{w}</div>
        ))}
      </div>

      {/* Calendar cells */}
      {weeks.map((week, wi) => (
        <div key={wi} style={{ display: "flex", gap: 4, marginBottom: 4 }}>
          {week.map((d, di) => {
            const entry    = d.activity;
            const acts     = getEntryActivities(entry);
            const firstAct = acts[0] || null;
            const aInfo    = firstAct ? actMap[firstAct.type] : null;
            const count    = acts.length;
            const isToday  = d.date === formatDate(today);
            const startChallenge = challengeStartMap[d.date];
            const totalDayPts = acts.reduce((s, a) => s + (a.points || 0), 0);
            const tip = count === 0 ? d.date
              : acts.map(a => `${actMap[a.type]?.icon} ${a.value}${actMap[a.type]?.unit}`).join(' · ')
                + ` · ${totalDayPts} pts`;
            return (
              <div key={di} title={tip}
                style={{
                  width: 36, height: 36, borderRadius: 8, position: "relative",
                  background: firstAct ? `${aInfo?.color}33` : "rgba(255,255,255,0.04)",
                  border: `1.5px solid ${isToday ? "#fff" : firstAct ? aInfo?.color : "rgba(255,255,255,0.06)"}`,
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  cursor: "default", transition: "all .2s",
                  boxShadow: firstAct ? `0 0 8px ${aInfo?.color}44` : "none",
                }}>
                <span style={{ fontSize: 14 }}>{firstAct ? aInfo?.icon : ""}</span>
                <span style={{ fontSize: 8, color: "#666", fontFamily: "monospace" }}>{d.day}</span>
                {/* Multi-activity badge */}
                {count > 1 && (
                  <div style={{
                    position: "absolute", top: -5, right: -5,
                    width: 14, height: 14, borderRadius: "50%",
                    background: "#FF6B35", border: "2px solid #080808",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 8, fontWeight: 900, color: "#fff", fontFamily: "monospace", lineHeight: 1,
                  }}>{count}</div>
                )}
                {/* Challenge start-date flag */}
                {startChallenge && (
                  <div title={`${startChallenge.name} started`} style={{
                    position: "absolute", bottom: -1, left: "50%", transform: "translateX(-50%)",
                    width: 6, height: 6, borderRadius: "50%",
                    background: startChallenge.color,
                    border: "1.5px solid #080808",
                    boxShadow: `0 0 4px ${startChallenge.color}`,
                  }} />
                )}
              </div>
            );
          })}
        </div>
      ))}

      {/* Challenge timeline bars */}
      {activeChallenges.length > 0 && (
        <div style={{ marginTop: 16, borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 14 }}>
          <p style={{ color: "#444", fontSize: 9, fontWeight: 700, letterSpacing: 1, fontFamily: "monospace", margin: "0 0 10px" }}>CHALLENGE TIMELINE</p>
          {activeChallenges.map(c => {
            const cStart   = new Date(c.startDate); cStart.setHours(0,0,0,0);
            const cEnd     = new Date(c.endDate);   cEnd.setHours(23,59,59,999);
            const daysLeft = Math.max(0, Math.ceil((cEnd - new Date()) / 86400000));
            const dayNum   = Math.min(c.duration, Math.max(1, Math.floor((new Date() - cStart) / 86400000) + 1));

            // Pixel positions relative to 28-day window (total width = 28 cells + gaps)
            const totalDays = 27; // index 0..27
            const barStartDay = Math.max(0, Math.floor((cStart - windowStart) / 86400000));
            const barEndDay   = Math.min(totalDays, Math.floor((cEnd   - windowStart) / 86400000));
            const leftPct     = (barStartDay / totalDays) * 100;
            const widthPct    = Math.max(2, ((barEndDay - barStartDay + 1) / totalDays) * 100);
            // "today" marker within the bar
            const todayDay    = totalDays; // today is always index 27 (rightmost)
            const todayPct    = Math.min(100, Math.max(0, ((todayDay - barStartDay) / Math.max(1, barEndDay - barStartDay + 1)) * 100));

            return (
              <div key={c.id} style={{ marginBottom: 12 }}>
                {/* Label row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#ccc" }}>
                    {c.emoji} {c.name}
                  </span>
                  <span style={{ fontSize: 9, color: "#555", fontFamily: "monospace", fontWeight: 700 }}>
                    DAY {dayNum}/{c.duration} · {daysLeft === 0 ? "ENDS TODAY" : `${daysLeft}d LEFT`}
                  </span>
                </div>
                {/* Bar track */}
                <div style={{ position: "relative", height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3 }}>
                  {/* Challenge fill */}
                  <div style={{
                    position: "absolute", top: 0, height: "100%",
                    left: `${leftPct}%`, width: `${widthPct}%`,
                    background: `${c.color}55`, borderRadius: 3,
                  }} />
                  {/* Completed portion (up to today) */}
                  <div style={{
                    position: "absolute", top: 0, height: "100%",
                    left: `${leftPct}%`, width: `${(widthPct * todayPct) / 100}%`,
                    background: c.color, borderRadius: 3,
                    boxShadow: `0 0 6px ${c.color}88`,
                  }} />
                </div>
                {/* Date labels */}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
                  <span style={{ fontSize: 8, color: "#444", fontFamily: "monospace" }}>
                    {new Date(c.startDate).toLocaleDateString("en", { day: "numeric", month: "short" })}
                  </span>
                  <span style={{ fontSize: 8, color: "#444", fontFamily: "monospace" }}>
                    {new Date(c.endDate).toLocaleDateString("en", { day: "numeric", month: "short" })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function LogModal({ onClose, onLog, todayActivities = [] }) {
  const [type, setType]             = useState("run");
  const [value, setValue]           = useState("");
  const [note, setNote]             = useState("");
  // Running list of activities logged this modal session (pre-seeded with what's already saved today)
  const [loggedActivities, setLoggedActivities] = useState(todayActivities);
  // Wearable sync state
  const [syncState, setSyncState]   = useState("idle"); // idle | loading | picking | error | unavailable
  const [syncWorkouts, setSyncWorkouts] = useState([]);
  const [syncError, setSyncError]   = useState("");

  const actInfo = ACTIVITY_TYPES.find(a => a.id === type);

  // Add activity without closing the modal
  const handle = () => {
    if (!value) return;
    const entry = { type, value: parseFloat(value), note, points: Math.floor(parseFloat(value) * 2 + 5) };
    onLog(entry);
    setLoggedActivities(prev => [...prev, entry]);
    setValue("");
    setNote("");
    // keep type selected — user may want to log same type again
  };

  const handleSync = async () => {
    setSyncState("loading");
    try {
      const available = await healthAvailable();
      if (!available) { setSyncState("unavailable"); return; }
      await requestHealthPerms();
      const workouts = await getTodayWorkouts();
      if (!workouts.length) {
        setSyncError("No workouts found for today. Finish a workout on your watch, then try again.");
        setSyncState("error");
        return;
      }
      setSyncWorkouts(workouts);
      setSyncState("picking");
    } catch (e) {
      setSyncError(e.message || "Could not read health data.");
      setSyncState("error");
    }
  };

  const applyWorkout = (w) => {
    setType(w.type);
    setValue(String(w.value));
    setNote(`Synced from ${w.source}${w.calories ? ` · ${w.calories} cal` : ""}`);
    setSyncState("idle");
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }}>
      <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, padding: 28, width: "100%", maxWidth: 380, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: loggedActivities.length ? 16 : 24 }}>
          <div>
            <h3 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, margin: "0 0 3px" }}>Log Activity</h3>
            <p style={{ margin: 0, fontSize: 10, color: "#555", fontFamily: "monospace", fontWeight: 700, letterSpacing: 1 }}>
              FOR · {today.toLocaleDateString("en", { weekday: "long", day: "numeric", month: "long" }).toUpperCase()}
            </p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#666", fontSize: 24, cursor: "pointer", marginTop: -2 }}>×</button>
        </div>

        {/* Today's logged activities — grows as user adds more */}
        {loggedActivities.length > 0 && (
          <div style={{ marginBottom: 20, padding: "12px 14px", borderRadius: 12, background: "rgba(52,211,153,0.05)", border: "1px solid rgba(52,211,153,0.15)" }}>
            <p style={{ color: "#34D399", fontSize: 10, fontWeight: 700, letterSpacing: 1, fontFamily: "monospace", margin: "0 0 8px" }}>
              TODAY — {loggedActivities.length} {loggedActivities.length === 1 ? "ACTIVITY" : "ACTIVITIES"} LOGGED
            </p>
            {loggedActivities.map((a, i) => {
              const ai = ACTIVITY_TYPES.find(x => x.id === a.type);
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,0.05)" }}>
                  <span style={{ fontSize: 15 }}>{ai?.icon}</span>
                  <span style={{ flex: 1, fontSize: 12, color: "#ccc", fontWeight: 600 }}>
                    {ai?.label} · {a.value} {ai?.unit}
                    {a.note ? <span style={{ color: "#555", fontWeight: 400 }}> · {a.note}</span> : null}
                  </span>
                  <span style={{ fontSize: 11, color: ai?.color, fontFamily: "monospace", fontWeight: 700 }}>+{a.points} pts</span>
                </div>
              );
            })}
            <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 10, color: "#555", fontFamily: "monospace", letterSpacing: 0.5 }}>TOTAL TODAY</span>
              <span style={{ fontSize: 13, color: "#FFD700", fontFamily: "monospace", fontWeight: 800 }}>
                +{loggedActivities.reduce((s, a) => s + (a.points || 0), 0)} pts
              </span>
            </div>
          </div>
        )}

        {/* Activity type picker */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 20 }}>
          {ACTIVITY_TYPES.map(a => (
            <button key={a.id} onClick={() => setType(a.id)} style={{
              padding: "10px 6px", borderRadius: 12, border: `1.5px solid ${type === a.id ? a.color : "rgba(255,255,255,0.08)"}`,
              background: type === a.id ? `${a.color}22` : "rgba(255,255,255,0.03)",
              color: "#fff", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              fontSize: 10, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: 0.5,
              boxShadow: type === a.id ? `0 0 12px ${a.color}44` : "none", transition: "all .2s",
            }}>
              <span style={{ fontSize: 20 }}>{a.icon}</span>{a.label}
            </button>
          ))}
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ color: "#888", fontSize: 11, fontWeight: 700, letterSpacing: 1, fontFamily: "monospace", display: "block", marginBottom: 6 }}>
            {actInfo?.unit.toUpperCase()} / AMOUNT
          </label>
          <input value={value} onChange={e => setValue(e.target.value)} type="number" placeholder={`e.g. ${actInfo?.id === "run" ? "5.2" : "45"}`}
            style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: 16, fontFamily: "'Space Grotesk', sans-serif", boxSizing: "border-box", outline: "none" }} />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ color: "#888", fontSize: 11, fontWeight: 700, letterSpacing: 1, fontFamily: "monospace", display: "block", marginBottom: 6 }}>NOTE (optional)</label>
          <input value={note} onChange={e => setNote(e.target.value)} placeholder="How'd it feel?"
            style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: 14, fontFamily: "'Space Grotesk', sans-serif", boxSizing: "border-box", outline: "none" }} />
        </div>

        {/* ── Wearable sync section ── */}
        <div style={{ marginBottom: 20, padding: "14px 16px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <p style={{ color: "#555", fontSize: 11, fontWeight: 700, letterSpacing: 1, fontFamily: "monospace", margin: "0 0 10px" }}>SYNC FROM WEARABLE</p>

          {/* ─ WEB: informational panel — no sync available ─ */}
          {isWeb && (
            <div>
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                {WATCH_OPTIONS.map(w => (
                  <div key={w.id} style={{
                    flex: 1, padding: "10px 6px", borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.06)",
                    background: "rgba(255,255,255,0.02)",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                  }}>
                    <span style={{ fontSize: 20, opacity: 0.3 }}>{w.icon}</span>
                    <span style={{ fontSize: 9, color: "#555", fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>{w.label}</span>
                    <span style={{
                      fontSize: 8, color: "#444", fontFamily: "monospace",
                      background: "rgba(255,255,255,0.05)", padding: "1px 6px", borderRadius: 4,
                    }}>{w.platformLabel}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 12px", borderRadius: 10, background: "rgba(255,107,53,0.06)", border: "1px solid rgba(255,107,53,0.15)" }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>📱</span>
                <div>
                  <p style={{ margin: "0 0 3px", fontSize: 11, fontWeight: 700, color: "#FF6B35" }}>Available on iOS &amp; Android</p>
                  <p style={{ margin: 0, fontSize: 10, color: "#666", lineHeight: 1.5 }}>
                    The mobile app auto-imports workouts from Apple Health (iPhone) and Health Connect (Android) so you never log manually again.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ─ NATIVE IDLE: show platform-specific watch buttons ─ */}
          {isNative && syncState === "idle" && (
            <>
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                {WATCH_OPTIONS.map(w => (
                  w.isActive ? (
                    // Active platform button — tappable, triggers sync
                    <button key={w.id} onClick={handleSync} style={{
                      flex: 1, padding: "10px 6px", borderRadius: 10, cursor: "pointer",
                      border: "1px solid rgba(255,107,53,0.45)",
                      background: "rgba(255,107,53,0.1)",
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                      transition: "all .2s",
                      boxShadow: "0 0 10px rgba(255,107,53,0.2)",
                    }}>
                      <span style={{ fontSize: 20 }}>{w.icon}</span>
                      <span style={{ fontSize: 9, color: "#FF6B35", fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>{w.label}</span>
                      <span style={{ fontSize: 8, color: "#FF6B3599", fontFamily: "monospace" }}>TAP TO SYNC</span>
                    </button>
                  ) : (
                    // Inactive platform — shown grayed out with platform label
                    <div key={w.id} style={{
                      flex: 1, padding: "10px 6px", borderRadius: 10,
                      border: "1px solid rgba(255,255,255,0.05)",
                      background: "rgba(255,255,255,0.02)",
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                    }}>
                      <span style={{ fontSize: 20, opacity: 0.25 }}>{w.icon}</span>
                      <span style={{ fontSize: 9, color: "#444", fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>{w.label}</span>
                      <span style={{
                        fontSize: 8, color: "#444", fontFamily: "monospace",
                        background: "rgba(255,255,255,0.04)", padding: "1px 6px", borderRadius: 4,
                      }}>{w.platformLabel} only</span>
                    </div>
                  )
                ))}
              </div>
              {syncHintText && (
                <p style={{ color: "#444", fontSize: 10, margin: 0, fontFamily: "monospace" }}>
                  {syncHintText}
                </p>
              )}
            </>
          )}

          {/* ─ loading ─ */}
          {isNative && syncState === "loading" && (
            <div style={{ textAlign: "center", padding: "10px 0" }}>
              <p style={{ margin: 0, fontSize: 13, color: "#888" }}>⏳  Fetching workouts…</p>
            </div>
          )}

          {/* ─ workout picker ─ */}
          {isNative && syncState === "picking" && (
            <div>
              <p style={{ color: "#555", fontSize: 10, fontWeight: 700, letterSpacing: 1, fontFamily: "monospace", margin: "0 0 8px" }}>
                TODAY'S WORKOUTS — TAP TO IMPORT
              </p>
              {syncWorkouts.map((w, i) => {
                const ai = ACTIVITY_TYPES.find(a => a.id === w.type);
                const pts = Math.floor(w.value * 2 + 5);
                return (
                  <button key={i} onClick={() => applyWorkout(w)} style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 10,
                    padding: "11px 12px", borderRadius: 12, marginBottom: 7,
                    background: `${ai?.color || "#FF6B35"}12`,
                    border: `1.5px solid ${ai?.color || "#FF6B35"}44`,
                    cursor: "pointer", textAlign: "left", transition: "all .15s",
                  }}>
                    <span style={{ fontSize: 20 }}>{ai?.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>
                        {ai?.label} · {w.value} {w.unit}
                      </div>
                      <div style={{ fontSize: 10, color: "#555", fontFamily: "monospace", marginTop: 2 }}>
                        {w.durMin} min{w.calories ? ` · ${w.calories} cal` : ""} · {w.source}
                      </div>
                    </div>
                    <span style={{ fontSize: 11, color: ai?.color, fontFamily: "monospace", fontWeight: 700, flexShrink: 0 }}>
                      +{pts} pts →
                    </span>
                  </button>
                );
              })}
              <button onClick={() => setSyncState("idle")} style={{
                width: "100%", padding: "7px", borderRadius: 8,
                background: "none", border: "1px solid rgba(255,255,255,0.07)",
                color: "#555", fontSize: 11, fontFamily: "monospace", cursor: "pointer", marginTop: 2,
              }}>
                ← Cancel
              </button>
            </div>
          )}

          {/* ─ error ─ */}
          {isNative && syncState === "error" && (
            <div>
              <p style={{ margin: "0 0 10px", fontSize: 12, color: "#888", lineHeight: 1.5 }}>{syncError}</p>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setSyncState("idle")} style={{
                  flex: 1, padding: "7px", borderRadius: 8,
                  background: "none", border: "1px solid rgba(255,255,255,0.07)",
                  color: "#555", fontSize: 11, fontFamily: "monospace", cursor: "pointer",
                }}>← Back</button>
                <button onClick={handleSync} style={{
                  flex: 1, padding: "7px", borderRadius: 8,
                  background: "rgba(255,107,53,0.1)", border: "1px solid rgba(255,107,53,0.3)",
                  color: "#FF6B35", fontSize: 11, fontFamily: "monospace", cursor: "pointer",
                }}>Retry</button>
              </div>
            </div>
          )}

          {/* ─ health API unavailable (Health Connect not installed etc.) ─ */}
          {isNative && syncState === "unavailable" && (
            <div>
              <p style={{ margin: "0 0 10px", fontSize: 12, color: "#888", lineHeight: 1.5 }}>
                {isAndroid
                  ? "Health Connect isn't installed on this device. Get it from the Play Store to enable sync."
                  : "Health data isn't available. Check your Health app permissions in Settings."}
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setSyncState("idle")} style={{
                  flex: 1, padding: "7px", borderRadius: 8,
                  background: "none", border: "1px solid rgba(255,255,255,0.07)",
                  color: "#555", fontSize: 11, fontFamily: "monospace", cursor: "pointer",
                }}>← Back</button>
                {isAndroid && (
                  <button onClick={openHealthSettings} style={{
                    flex: 1, padding: "7px", borderRadius: 8,
                    background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)",
                    color: "#34D399", fontSize: 11, fontFamily: "monospace", cursor: "pointer",
                  }}>Open Settings</button>
                )}
              </div>
            </div>
          )}
        </div>

        <button onClick={handle} disabled={!value} style={{
          width: "100%", padding: "14px", borderRadius: 14, border: "none",
          background: value && actInfo ? `linear-gradient(135deg, ${actInfo.color}, ${actInfo.color}88)` : "rgba(255,255,255,0.07)",
          color: value ? "#fff" : "#555", fontSize: 15, fontWeight: 800, cursor: value ? "pointer" : "default",
          fontFamily: "'Syne', sans-serif", letterSpacing: 0.5,
          boxShadow: value && actInfo ? `0 4px 20px ${actInfo.color}55` : "none",
          transition: "all .2s",
        }}>
          {actInfo?.icon} Add Activity{value ? ` · +${Math.floor(parseFloat(value || 0) * 2 + 5)} pts` : ""}
        </button>

        {/* Done — only appears once at least one activity is logged */}
        <button onClick={onClose} style={{
          width: "100%", marginTop: 10, padding: "13px", borderRadius: 14,
          border: `1px solid ${loggedActivities.length ? "rgba(52,211,153,0.3)" : "rgba(255,255,255,0.07)"}`,
          background: "none",
          color: loggedActivities.length ? "#34D399" : "#444",
          fontSize: 14, fontWeight: 700, cursor: "pointer",
          fontFamily: "'Space Grotesk', sans-serif",
          transition: "all .2s",
        }}>
          {loggedActivities.length
            ? `✓ Done — ${loggedActivities.length} ${loggedActivities.length === 1 ? "activity" : "activities"} logged`
            : "Cancel"}
        </button>
      </div>
    </div>
  );
}

function BadgeUnlockOverlay({ badge, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3800);
    return () => clearTimeout(t);
  }, [badge.id]);

  return (
    <div onClick={onDismiss} style={{
      position: "fixed", inset: 0, zIndex: 300,
      background: "rgba(0,0,0,0.92)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: 32,
    }}>
      <div style={{ textAlign: "center", maxWidth: 300 }}>
        <p style={{ margin: "0 0 20px", fontSize: 10, color: badge.color, fontFamily: "monospace", letterSpacing: 3, fontWeight: 700 }}>✦ BADGE UNLOCKED ✦</p>
        <div style={{
          width: 114, height: 114, borderRadius: 34, margin: "0 auto 22px",
          background: `${badge.color}18`,
          border: `2px solid ${badge.color}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 58,
          boxShadow: `0 0 60px ${badge.color}55, 0 0 120px ${badge.color}22`,
        }}>
          {badge.icon}
        </div>
        <h2 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: "#fff" }}>
          {badge.label}
        </h2>
        <p style={{ margin: "0 0 22px", fontSize: 13, color: "#888", lineHeight: 1.5 }}>{badge.desc}</p>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 7,
          padding: "9px 20px", borderRadius: 24,
          background: `${badge.color}22`, border: `1px solid ${badge.color}55`,
        }}>
          <span style={{ fontSize: 15 }}>⭐</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: badge.color, fontFamily: "monospace", letterSpacing: 0.5 }}>+{badge.xp} XP EARNED</span>
        </div>
        <p style={{ margin: "18px 0 0", fontSize: 10, color: "#333", fontFamily: "monospace", letterSpacing: 1 }}>TAP TO CONTINUE</p>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function TribeChallenge() {
  const { user } = useAuth();

  // ── ALL state declarations must be before any conditional returns ──
  const [onboarded, setOnboarded] = useState(null);
  const [earnedBadges, setEarnedBadges] = useState(new Set());
  const sessionEarnedRef = useRef(null); // badges already in Firestore before this session
  const [badgeQueue, setBadgeQueue] = useState([]);
  const [tab, setTab] = useState("home");
  const [pendingJoinCode, setPendingJoinCode] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("join") || sessionStorage.getItem("pendingJoinCode") || null;
  });
  const [challengeStats, setChallengeStats] = useState({ joined: 0, owned: 0 });
  const [myChallenges, setMyChallenges]     = useState([]);
  const [showLog, setShowLog] = useState(false);
  const [myHistory, setMyHistory] = useState({});
  const [toast, setToast] = useState(null);
  const [badgeCat, setBadgeCat] = useState("all");
  const [showProfile, setShowProfile] = useState(false);

  // ── ALL effects must be before any conditional returns ──
  useEffect(() => {
    if (!user) return;
    loadEarnedBadges(user.uid).then(loaded => {
      sessionEarnedRef.current = loaded; // snapshot of what was earned before this session
      setEarnedBadges(loaded);
    });
  }, [user?.uid]);

  useEffect(() => {
    if (!user) { setOnboarded(null); return; }
    const cached = localStorage.getItem("onboarding_" + user.uid);
    if (cached) { setOnboarded(true); return; }
    getUserProfile(user.uid).then(profile => {
      if (profile?.onboarding || profile?.onboardingDone) {
        localStorage.setItem("onboarding_" + user.uid, "1");
        setOnboarded(true);
      } else {
        setOnboarded(false);
      }
    });
  }, [user?.uid]);

  useEffect(() => {
    if (!pendingJoinCode) return;
    sessionStorage.setItem("pendingJoinCode", pendingJoinCode);
    setTab("challenges");
  }, [pendingJoinCode]);

  useEffect(() => {
    if (!user) { setMyChallenges([]); return; }
    getUserProfile(user.uid).then(p => {
      // Fall back to the old flat literal-dot field name in case the
      // migration in createUserIfNew hasn't run for this account yet.
      setChallengeStats({
        joined: (p?.stats?.challengesJoined ?? p?.['stats.challengesJoined']) || 0,
        owned:  (p?.stats?.challengesOwned  ?? p?.['stats.challengesOwned'])  || 0,
      });
      const ids = p?.joinedChallengeIds || [];
      if (ids.length) getUserChallenges(ids).then(setMyChallenges);
      else setMyChallenges([]);
    });
  }, [user?.uid]);

  // Load persisted activity history from Firestore on sign-in
  useEffect(() => {
    if (!user) { setMyHistory({}); return; }
    getActivityLog(user.uid).then(log => setMyHistory(log));
  }, [user?.uid]);

  // ── conditional returns (no hooks below this line) ──
  if (user === undefined || (user && onboarded === null)) {
    return (
      <div style={{ minHeight: "100vh", background: "#080808", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 32 }}>🏃</span>
      </div>
    );
  }

  if (!user) return <AuthScreen />;

  if (!onboarded) {
    return (
      <OnboardingScreen
        userName={user.displayName}
        onComplete={async (answers) => {
          try {
            await saveOnboarding(user.uid, answers);
          } catch (e) {
            console.error("saveOnboarding failed:", e);
          }
          localStorage.setItem("onboarding_" + user.uid, "1");
          setOnboarded(true);
        }}
      />
    );
  }

  const streak = getStreak(myHistory);
  // Flatten all activities across all days for counts and totals
  const allActivities = Object.values(myHistory).flatMap(entry => getEntryActivities(entry));
  const totalPts = allActivities.reduce((s, a) => s + (a.points || 0), 0);
  const actCounts = ACTIVITY_TYPES.reduce((acc, a) => {
    acc[a.id] = allActivities.filter(h => h.type === a.id).length;
    return acc;
  }, {});

  const buildStats = (history, cStats) => {
    // Flatten all individual activity sessions across all days
    const allActs = Object.values(history).flatMap(entry => getEntryActivities(entry));
    // Days that have at least one activity
    const activeDates = Object.keys(history).filter(
      date => getEntryActivities(history[date]).length > 0
    );
    const ac = ACTIVITY_TYPES.reduce((acc, a) => {
      acc[a.id] = allActs.filter(h => h.type === a.id).length;
      return acc;
    }, {});
    const runKm   = allActs.filter(h => h.type === "run").reduce((s, h) => s + (h.value || 0), 0);
    const cycleKm = allActs.filter(h => h.type === "cycle").reduce((s, h) => s + (h.value || 0), 0);
    const walkKm  = allActs.filter(h => h.type === "walk").reduce((s, h) => s + (h.value || 0), 0);
    const sortedDates = activeDates.sort();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    weekStart.setHours(0, 0, 0, 0);
    return {
      totalLogs: allActs.length,                      // total individual sessions
      streak: getStreak(history),
      totalPts: allActs.reduce((s, a) => s + (a.points || 0), 0),
      daysActive: activeDates.length,                  // unique days with activity
      runKm, cycleKm, walkKm,
      actCounts: ac,
      uniqueTypes: Object.values(ac).filter(v => v > 0).length,
      challengesJoined: cStats.joined,
      challengesOwned: cStats.owned,
      challengesCompleted: cStats.completed || 0,
      top1Finishes: cStats.top1 || 0,
      weekendWarrior: sortedDates.some(date => {
        const d = new Date(date);
        if (d.getDay() !== 6) return false;
        const sun = new Date(d); sun.setDate(d.getDate() + 1);
        return getEntryActivities(history[formatDate(sun)]).length > 0;
      }),
      comeback: sortedDates.some((date, i) => i > 0 &&
        (new Date(date) - new Date(sortedDates[i - 1])) / 86400000 >= 3),
      weeklyLogs: sortedDates.filter(d => new Date(d) >= weekStart).length,
      isOG: true, // beta: all early members get OG status
    };
  };

  const triggerBadgeCheck = (history, cStats) => {
    const stats = buildStats(history, cStats);
    // Use union of pre-session + in-session earned to avoid re-awarding
    const alreadyEarned = new Set([...(sessionEarnedRef.current || new Set()), ...earnedBadges]);
    const newIds = checkBadges(stats, alreadyEarned);
    if (!newIds.length) return;
    const newSet = new Set([...alreadyEarned, ...newIds]);
    setEarnedBadges(newSet);
    // Only queue overlay for badges not earned before this session started
    const overlayIds = newIds.filter(id => !sessionEarnedRef.current?.has(id));
    if (overlayIds.length) {
      setBadgeQueue(q => [...q, ...overlayIds.map(id => BADGES.find(b => b.id === id)).filter(Boolean)]);
    }
    awardBadges(user.uid, newIds).catch(console.error);
  };

  const handleLog = (entry) => {
    const key = formatDate(today);
    // Accumulate: append to existing activities for the day (backward-compat with old single-entry format)
    const existingActivities = getEntryActivities(myHistory[key]);
    const activities = [...existingActivities, entry];
    const dayEntry = {
      activities,
      points: activities.reduce((s, a) => s + (a.points || 0), 0),
    };
    const updated = { ...myHistory, [key]: dayEntry };
    setMyHistory(updated);
    saveActivity(user.uid, key, dayEntry).catch(console.error);
    showToast(`${ACTIVITY_TYPES.find(a => a.id === entry.type)?.icon} +${entry.points} pts logged!`);
    triggerBadgeCheck(updated, challengeStats);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#080808",
      fontFamily: "'Space Grotesk', sans-serif",
      color: "#fff", maxWidth: 430, margin: "0 auto", position: "relative",
      paddingBottom: 80,
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Badge unlock overlay — shows queued badges one at a time */}
      {badgeQueue[0] && (
        <BadgeUnlockOverlay
          badge={badgeQueue[0]}
          onDismiss={() => setBadgeQueue(q => q.slice(1))}
        />
      )}

      {/* Profile screen */}
      {showProfile && (
        <ProfileScreen
          user={user}
          earnedBadges={earnedBadges}
          myHistory={myHistory}
          challengeStats={challengeStats}
          onClose={() => setShowProfile(false)}
        />
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)",
          background: "rgba(255,255,255,0.1)", backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.2)", borderRadius: 40,
          padding: "10px 22px", color: "#fff", fontSize: 14, fontWeight: 700,
          zIndex: 200, whiteSpace: "nowrap", boxShadow: "0 4px 30px rgba(0,0,0,0.5)"
        }}>{toast}</div>
      )}

      {showLog && (
        <LogModal
          onClose={() => setShowLog(false)}
          onLog={handleLog}
          todayActivities={getEntryActivities(myHistory[formatDate(today)])}
        />
      )}

      {/* ── HOME TAB ── */}
      {tab === "home" && (
        <div>
          {/* Header */}
          <div style={{ padding: "52px 24px 20px", background: "linear-gradient(180deg, #0f0f0f 0%, #080808 100%)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ color: "#555", fontSize: 11, fontWeight: 700, letterSpacing: 2, margin: "0 0 4px", fontFamily: "monospace" }}>RISE WITH THE TRIBE</p>
                <h1 style={{ margin: 0, fontSize: 28, fontWeight: 900, fontFamily: "'Syne', sans-serif", lineHeight: 1.1 }}>
                  30-Day<br /><span style={{ background: "linear-gradient(90deg, #FF6B35, #FFD700)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Challenge</span>
                </h1>
              </div>
              <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                <button onClick={() => setShowProfile(true)} style={{
                  width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
                  background: `${getTribeRank(calcBadgeXP(earnedBadges)).color}22`,
                  border: `2px solid ${getTribeRank(calcBadgeXP(earnedBadges)).color}55`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, cursor: "pointer",
                }}>
                  {getTribeRank(calcBadgeXP(earnedBadges)).icon}
                </button>
                <div>
                  <div style={{ fontSize: 11, color: "#444", fontFamily: "monospace", fontWeight: 700, letterSpacing: 1 }}>POINTS</div>
                  <div style={{ fontSize: 36, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: "#FFD700" }}>{totalPts}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div style={{ padding: "0 20px 20px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {[
              { label: "STREAK", value: streak, suffix: "🔥", color: "#FF6B35" },
              { label: "POINTS", value: totalPts, suffix: "pts", color: "#FFD700" },
              { label: "DAYS ACTIVE", value: Object.keys(myHistory).filter(d => getEntryActivities(myHistory[d]).length > 0).length, suffix: "", color: "#34D399" },
            ].map(s => (
              <div key={s.label} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 16, padding: "14px 12px", border: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: s.color }}>{s.value}<span style={{ fontSize: 14 }}>{s.suffix}</span></div>
                <div style={{ fontSize: 9, color: "#555", fontWeight: 700, letterSpacing: 1, fontFamily: "monospace", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Log CTA */}
          <div style={{ padding: "0 20px 24px" }}>
            <button onClick={() => setShowLog(true)} style={{
              width: "100%", padding: "16px", borderRadius: 18,
              background: "linear-gradient(135deg, #FF6B35 0%, #FFD700 100%)",
              border: "none", color: "#000", fontSize: 16, fontWeight: 800,
              cursor: "pointer", fontFamily: "'Syne', sans-serif", letterSpacing: 0.5,
              boxShadow: "0 4px 30px rgba(255,107,53,0.4)", display: "flex",
              alignItems: "center", justifyContent: "center", gap: 10
            }}>
              <span style={{ fontSize: 22 }}>➕</span> Log Today's Activity
            </button>
          </div>

          {/* Activity breakdown */}
          <div style={{ padding: "0 20px 24px" }}>
            <p style={{ color: "#555", fontSize: 11, fontWeight: 700, letterSpacing: 1, fontFamily: "monospace", margin: "0 0 12px" }}>ACTIVITY BREAKDOWN</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {ACTIVITY_TYPES.filter(a => actCounts[a.id] > 0).map(a => (
                <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 18, width: 24, textAlign: "center" }}>{a.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#ccc" }}>{a.label}</span>
                      <span style={{ fontSize: 11, color: "#666", fontFamily: "monospace" }}>{actCounts[a.id]}x</span>
                    </div>
                    <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 4 }}>
                      <div style={{ height: "100%", borderRadius: 4, background: a.color, width: `${Math.min(100, (actCounts[a.id] / 15) * 100)}%`, transition: "width .6s ease" }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar */}
          <div style={{ padding: "0 20px 24px" }}>
            <p style={{ color: "#555", fontSize: 11, fontWeight: 700, letterSpacing: 1, fontFamily: "monospace", margin: "0 0 12px" }}>28-DAY CALENDAR</p>
            <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 16, padding: 16, border: "1px solid rgba(255,255,255,0.06)" }}>
              <CalendarGrid history={myHistory} challenges={myChallenges} />
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                {ACTIVITY_TYPES.map(a => (
                  <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: a.color }} />
                    <span style={{ fontSize: 9, color: "#555", fontFamily: "monospace" }}>{a.icon}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Challenge stats */}
          <div style={{ padding: "0 20px 20px" }}>
            <p style={{ color: "#555", fontSize: 11, fontWeight: 700, letterSpacing: 1, fontFamily: "monospace", margin: "0 0 12px" }}>YOUR CHALLENGES</p>
            <button onClick={() => setTab("challenges")} style={{
              width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,107,53,0.2)",
              borderRadius: 16, padding: "16px 20px", cursor: "pointer", textAlign: "left",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div style={{ display: "flex", gap: 24 }}>
                {[
                  { label: "JOINED", value: challengeStats.joined },
                  { label: "STARTED", value: challengeStats.owned },
                ].map(s => (
                  <div key={s.label}>
                    <div style={{ fontSize: 22, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: "#FF6B35" }}>{s.value}</div>
                    <div style={{ fontSize: 9, color: "#555", fontFamily: "monospace", fontWeight: 700, letterSpacing: 1 }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <span style={{ color: "#FF6B35", fontSize: 14, fontFamily: "monospace", fontWeight: 700 }}>VIEW →</span>
            </button>
          </div>

          {/* Share card */}
          <div style={{ padding: "0 20px" }}>
            <div style={{
              borderRadius: 18, padding: 20,
              background: "linear-gradient(135deg, rgba(255,107,53,0.12), rgba(255,215,0,0.08))",
              border: "1px solid rgba(255,107,53,0.2)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#FFD700" }}>Share Your Progress</span>
                <span style={{ fontSize: 18 }}>📤</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {["Instagram Story", "Copy Link", "WhatsApp"].map(s => (
                  <button key={s} onClick={() => showToast(`Sharing to ${s}...`)} style={{
                    flex: 1, padding: "8px 4px", borderRadius: 10,
                    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)",
                    color: "#888", fontSize: 9, fontWeight: 700, fontFamily: "monospace",
                    cursor: "pointer", letterSpacing: 0.3
                  }}>{s}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile app nudge — web only */}
          {isWeb && (
            <div style={{ padding: "16px 20px 0" }}>
              <div style={{
                borderRadius: 16, padding: "14px 16px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                display: "flex", gap: 14, alignItems: "center",
              }}>
                <span style={{ fontSize: 30, flexShrink: 0 }}>📱</span>
                <div>
                  <p style={{ margin: "0 0 3px", fontSize: 12, fontWeight: 700, color: "#666" }}>More on the mobile app</p>
                  <p style={{ margin: 0, fontSize: 11, color: "#444", lineHeight: 1.5 }}>
                    Auto-sync from <span style={{ color: "#666" }}>Apple Watch</span> &amp; <span style={{ color: "#666" }}>Galaxy Watch</span>, push notifications for challenges and more — iOS &amp; Android coming soon.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── BOARD TAB ── */}
      {tab === "board" && (
        <div style={{ padding: "52px 20px 20px" }}>
          <p style={{ color: "#555", fontSize: 11, fontWeight: 700, letterSpacing: 2, margin: "0 0 6px", fontFamily: "monospace" }}>YOUR STATS</p>
          <h2 style={{ margin: "0 0 24px", fontSize: 26, fontWeight: 900, fontFamily: "'Syne', sans-serif" }}>Performance 📊</h2>

          {/* Stats grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
            {[
              { label: "TOTAL POINTS", value: totalPts, suffix: " pts", color: "#FFD700", icon: "⭐" },
              { label: "CURRENT STREAK", value: streak, suffix: " days", color: "#FF6B35", icon: "🔥" },
              { label: "DAYS ACTIVE", value: Object.keys(myHistory).filter(d => getEntryActivities(myHistory[d]).length > 0).length, suffix: " days", color: "#34D399", icon: "📅" },
              { label: "ACTIVITIES", value: allActivities.length, suffix: " total", color: "#60A5FA", icon: "💪" },
            ].map(s => (
              <div key={s.label} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 16, padding: "16px", border: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
                <div style={{ fontSize: 26, marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontSize: 24, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: s.color }}>{s.value}<span style={{ fontSize: 13 }}>{s.suffix}</span></div>
                <div style={{ fontSize: 9, color: "#555", fontWeight: 700, letterSpacing: 1, fontFamily: "monospace", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Challenge leaderboards CTA */}
          <div style={{ padding: "20px", borderRadius: 18, background: "linear-gradient(135deg, rgba(255,107,53,0.12), rgba(255,215,0,0.08))", border: "1px solid rgba(255,107,53,0.2)", marginBottom: 24 }}>
            <p style={{ margin: "0 0 6px", fontSize: 14, fontWeight: 800, color: "#FFD700", fontFamily: "'Syne', sans-serif" }}>Challenge Leaderboards 🏆</p>
            <p style={{ margin: "0 0 14px", fontSize: 12, color: "#888" }}>Join or create a challenge to compete with the tribe and climb the leaderboard.</p>
            <button onClick={() => setTab("challenges")} style={{ padding: "10px 18px", borderRadius: 12, background: "linear-gradient(135deg, #FF6B35, #FFD700)", border: "none", color: "#000", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "'Syne', sans-serif" }}>
              View Challenges →
            </button>
          </div>

          {/* Activity breakdown */}
          <p style={{ color: "#555", fontSize: 11, fontWeight: 700, letterSpacing: 1, fontFamily: "monospace", margin: "0 0 12px" }}>ACTIVITY BREAKDOWN</p>
          {Object.values(actCounts).some(v => v > 0) ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {ACTIVITY_TYPES.filter(a => actCounts[a.id] > 0).map(a => (
                <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "rgba(255,255,255,0.03)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)" }}>
                  <span style={{ fontSize: 22 }}>{a.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#ccc" }}>{a.label}</span>
                      <span style={{ fontSize: 11, color: "#666", fontFamily: "monospace" }}>{actCounts[a.id]}x</span>
                    </div>
                    <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 4 }}>
                      <div style={{ height: "100%", borderRadius: 4, background: a.color, width: `${Math.min(100, (actCounts[a.id] / 15) * 100)}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: "32px 20px", borderRadius: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: 13, color: "#555" }}>No activities logged yet.<br />Tap <span style={{ color: "#FF6B35", fontWeight: 700 }}>Log Today's Activity</span> to get started!</p>
            </div>
          )}
        </div>
      )}

      {/* ── BADGES TAB ── */}
      {tab === "badges" && (() => {
        const stats = buildStats(myHistory, challengeStats);
        const badgeXP = calcBadgeXP(earnedBadges);
        const rank = getTribeRank(badgeXP);
        const inProgressCount = BADGES.filter(b => {
          if (earnedBadges.has(b.id)) return false;
          const p = getBadgeProgress(b.id, stats);
          return p.current > 0;
        }).length;
        const filtered = badgeCat === "all" ? BADGES : BADGES.filter(b => b.cat === badgeCat);

        return (
          <div style={{ padding: "52px 0 20px" }}>
            {/* ── Tribe Rank Card ── */}
            <div style={{ padding: "0 20px 20px" }}>
              <div style={{
                borderRadius: 22, padding: "20px 22px",
                background: `linear-gradient(135deg, ${rank.color}18, rgba(255,255,255,0.02))`,
                border: `1px solid ${rank.color}44`,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <div>
                    <p style={{ margin: "0 0 4px", fontSize: 10, color: "#555", fontFamily: "monospace", fontWeight: 700, letterSpacing: 2 }}>TRIBE RANK</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 28 }}>{rank.icon}</span>
                      <span style={{ fontSize: 22, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: rank.color }}>{rank.label}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 26, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: rank.color }}>{badgeXP}</div>
                    <div style={{ fontSize: 9, color: "#555", fontFamily: "monospace", fontWeight: 700, letterSpacing: 1 }}>TOTAL XP</div>
                  </div>
                </div>
                {rank.next ? (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 10, color: "#555", fontFamily: "monospace" }}>Next: {rank.next.icon} {rank.next.label}</span>
                      <span style={{ fontSize: 10, color: rank.color, fontFamily: "monospace", fontWeight: 700 }}>{badgeXP}/{rank.next.min} XP</span>
                    </div>
                    <div style={{ height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 5 }}>
                      <div style={{
                        height: "100%", borderRadius: 5,
                        background: `linear-gradient(90deg, ${rank.color}, ${rank.next.color})`,
                        width: `${Math.min(100, ((badgeXP - rank.min) / (rank.next.min - rank.min)) * 100)}%`,
                        transition: "width .8s ease",
                      }} />
                    </div>
                  </>
                ) : (
                  <div style={{ padding: "8px 14px", borderRadius: 10, background: `${rank.color}22`, textAlign: "center" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: rank.color, fontFamily: "'Syne', sans-serif" }}>👑 Maximum Rank Achieved!</span>
                  </div>
                )}
              </div>
            </div>

            {/* ── Summary stats ── */}
            <div style={{ padding: "0 20px 20px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {[
                { label: "UNLOCKED", value: earnedBadges.size, color: "#FFD700" },
                { label: "TOTAL XP",  value: badgeXP,          color: rank.color  },
                { label: "IN PROGRESS", value: inProgressCount, color: "#60A5FA" },
              ].map(s => (
                <div key={s.label} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "12px 10px", border: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 8, color: "#555", fontWeight: 700, letterSpacing: 1, fontFamily: "monospace", marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* ── Category filter pills ── */}
            <div style={{ overflowX: "auto", paddingBottom: 4, marginBottom: 18 }}>
              <div style={{ display: "flex", gap: 8, padding: "0 20px", width: "max-content" }}>
                {BADGE_CATEGORIES.map(cat => {
                  const active = badgeCat === cat.id;
                  return (
                    <button key={cat.id} onClick={() => setBadgeCat(cat.id)} style={{
                      padding: "7px 15px", borderRadius: 20, whiteSpace: "nowrap",
                      background: active ? "rgba(255,107,53,0.18)" : "rgba(255,255,255,0.04)",
                      border: `1px solid ${active ? "#FF6B35" : "rgba(255,255,255,0.08)"}`,
                      color: active ? "#FF6B35" : "#666",
                      fontSize: 12, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif",
                      cursor: "pointer", transition: "all .2s",
                    }}>
                      {cat.icon} {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Badge grid ── */}
            <div style={{ padding: "0 20px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {filtered.map(b => {
                const earned = earnedBadges.has(b.id);
                const prog = getBadgeProgress(b.id, stats);
                const pct = prog.target > 0 ? Math.min(100, (prog.current / prog.target) * 100) : 0;
                const inProg = prog.current > 0 && !earned;

                return (
                  <div key={b.id} style={{
                    borderRadius: 18, padding: "15px 10px 12px", textAlign: "center",
                    background: earned ? `${b.color}18` : "rgba(255,255,255,0.03)",
                    border: `1.5px solid ${earned ? b.color + "66" : inProg ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.05)"}`,
                    opacity: earned ? 1 : inProg ? 0.82 : 0.38,
                    boxShadow: earned ? `0 0 22px ${b.color}22` : "none",
                    transition: "all .3s", position: "relative",
                  }}>
                    {earned && (
                      <div style={{
                        position: "absolute", top: 8, right: 8,
                        width: 17, height: 17, borderRadius: "50%",
                        background: "#34D399", display: "flex", alignItems: "center",
                        justifyContent: "center", fontSize: 9, color: "#000", fontWeight: 900,
                      }}>✓</div>
                    )}
                    <div style={{ fontSize: 34, marginBottom: 7, filter: earned || inProg ? "none" : "grayscale(1)" }}>
                      {earned ? b.icon : inProg ? b.icon : "🔒"}
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: earned ? "#fff" : "#888", fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.3 }}>
                      {b.label}
                    </div>
                    {earned && (
                      <div style={{ marginTop: 5, fontSize: 9, color: b.color, fontFamily: "monospace", fontWeight: 700 }}>+{b.xp} XP</div>
                    )}
                    {inProg && (
                      <>
                        <div style={{ height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 3, marginTop: 8 }}>
                          <div style={{ height: "100%", borderRadius: 3, background: b.color, width: `${pct}%`, transition: "width .6s" }} />
                        </div>
                        <div style={{ marginTop: 4, fontSize: 9, color: "#666", fontFamily: "monospace" }}>{prog.current}/{prog.target} {prog.label}</div>
                      </>
                    )}
                    {!earned && !inProg && (
                      <div style={{ marginTop: 5, fontSize: 9, color: "#444", fontFamily: "monospace" }}>{prog.target} {prog.label}</div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ── How to earn (detail list) ── */}
            <div style={{ padding: "24px 20px 0" }}>
              <p style={{ color: "#555", fontSize: 10, fontWeight: 700, letterSpacing: 2, margin: "0 0 14px", fontFamily: "monospace" }}>ALL BADGES</p>
              {filtered.map(b => {
                const earned = earnedBadges.has(b.id);
                return (
                  <div key={b.id} style={{
                    display: "flex", alignItems: "center", gap: 14, padding: "11px 0",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                    opacity: earned ? 1 : 0.45,
                  }}>
                    <div style={{ width: 38, height: 38, borderRadius: 11, flexShrink: 0,
                      background: earned ? `${b.color}22` : "rgba(255,255,255,0.04)",
                      border: `1.5px solid ${earned ? b.color + "66" : "rgba(255,255,255,0.08)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                      {earned ? b.icon : "🔒"}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: earned ? "#fff" : "#888" }}>{b.label}</div>
                      <div style={{ fontSize: 11, color: "#555", fontFamily: "monospace", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.desc}</div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      {earned
                        ? <span style={{ fontSize: 10, color: "#34D399", fontWeight: 700, fontFamily: "monospace" }}>✓ EARNED</span>
                        : <span style={{ fontSize: 10, color: "#555", fontFamily: "monospace" }}>+{b.xp} XP</span>
                      }
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* ── CHALLENGES TAB ── */}
      {tab === "challenges" && (
        <ChallengesTab
          pendingJoinCode={pendingJoinCode}
          onStatsChanged={() => {
            getUserProfile(user.uid).then(p => {
              const newStats = {
                joined: (p?.stats?.challengesJoined ?? p?.['stats.challengesJoined']) || 0,
                owned:  (p?.stats?.challengesOwned  ?? p?.['stats.challengesOwned'])  || 0,
              };
              setChallengeStats(newStats);
              triggerBadgeCheck(myHistory, newStats);
            });
          }}
          onJoinHandled={() => {
            setPendingJoinCode(null);
            sessionStorage.removeItem("pendingJoinCode");
            getUserProfile(user.uid).then(p => {
              const newStats = {
                joined: (p?.stats?.challengesJoined ?? p?.['stats.challengesJoined']) || 0,
                owned:  (p?.stats?.challengesOwned  ?? p?.['stats.challengesOwned'])  || 0,
              };
              setChallengeStats(newStats);
              triggerBadgeCheck(myHistory, newStats);
            });
          }}
        />
      )}

      {/* ── NAV ── */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 430, background: "rgba(8,8,8,0.95)",
        backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.06)",
        display: "flex", padding: "10px 0 20px",
      }}>
        {[
          { id: "home",       icon: "🏠", label: "Home" },
          { id: "challenges", icon: "🎯", label: "Challenges" },
          { id: "board",      icon: "🏆", label: "Board" },
          { id: "badges",     icon: "⭐", label: "Badges" },
        ].map(n => (
          <button key={n.id} onClick={() => setTab(n.id)} style={{
            flex: 1, background: "none", border: "none", color: tab === n.id ? "#FF6B35" : "#444",
            cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            padding: "4px 0", transition: "color .2s",
          }}>
            <span style={{ fontSize: 20 }}>{n.icon}</span>
            <span style={{ fontSize: 10, fontWeight: 700, fontFamily: "monospace", letterSpacing: 0.5 }}>{n.label.toUpperCase()}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
