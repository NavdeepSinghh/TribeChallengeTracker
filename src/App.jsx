import { useState, useEffect } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────
const BADGES = [
  { id: "streak3",   icon: "🔥", label: "On Fire",       desc: "3 days in a row",    color: "#FF6B35" },
  { id: "streak7",   icon: "⚡", label: "Week Warrior",  desc: "7 days in a row",    color: "#FFD700" },
  { id: "yoga",      icon: "🧘", label: "Yoga Guru",     desc: "10 yoga sessions",   color: "#A78BFA" },
  { id: "running",   icon: "🏃", label: "Run Champ",     desc: "50km total",         color: "#34D399" },
  { id: "gym",       icon: "💪", label: "Iron Tribe",    desc: "15 gym sessions",    color: "#F59E0B" },
  { id: "allround",  icon: "🌟", label: "All-Rounder",   desc: "3 activity types",   color: "#60A5FA" },
  { id: "early",     icon: "🌅", label: "Early Bird",    desc: "5 pre-7am sessions", color: "#FCA5A5" },
  { id: "century",   icon: "💯", label: "Century Club",  desc: "100 pts total",      color: "#C084FC" },
];

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

// seed 14 days of mock activity for "you"
const genHistory = () => {
  const h = {};
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = formatDate(d);
    if (Math.random() > 0.35) {
      const act = ACTIVITY_TYPES[Math.floor(Math.random() * ACTIVITY_TYPES.length)];
      h[key] = { type: act.id, value: Math.round((Math.random() * 60 + 10) * 10) / 10, points: Math.floor(Math.random() * 20 + 5) };
    }
  }
  return h;
};

const LEADERBOARD_SEEDS = [
  { id: "you",     name: "You",          handle: "@risewiththetribe", avatar: "🧡", pts: 0, history: null },
  { id: "sam",     name: "Sam K.",        handle: "@samfit",           avatar: "💚", pts: 184, history: genHistory() },
  { id: "priya",   name: "Priya M.",      handle: "@priyamoves",       avatar: "💜", pts: 171, history: genHistory() },
  { id: "jake",    name: "Jake T.",       handle: "@jaketribe",        avatar: "💙", pts: 156, history: genHistory() },
  { id: "lena",    name: "Lena R.",       handle: "@lenarun",          avatar: "🩷", pts: 143, history: genHistory() },
  { id: "omar",    name: "Omar H.",       handle: "@omarhustle",       avatar: "🧡", pts: 122, history: genHistory() },
  { id: "mia",     name: "Mia Z.",        handle: "@miazest",          avatar: "💛", pts: 109, history: genHistory() },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const getStreak = (history) => {
  let streak = 0;
  let d = new Date(today);
  while (true) {
    if (history[formatDate(d)]) streak++;
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

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function Avatar({ emoji, size = 40 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.5, flexShrink: 0 }}>
      {emoji}
    </div>
  );
}

function Badge({ badge, unlocked }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
      opacity: unlocked ? 1 : 0.25, transition: "all .3s",
      filter: unlocked ? "none" : "grayscale(1)"
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 16,
        background: unlocked ? `${badge.color}22` : "rgba(255,255,255,0.04)",
        border: `2px solid ${unlocked ? badge.color : "rgba(255,255,255,0.08)"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 26, transition: "all .3s",
        boxShadow: unlocked ? `0 0 18px ${badge.color}44` : "none",
      }}>
        {unlocked ? badge.icon : "🔒"}
      </div>
      <span style={{ fontSize: 10, color: unlocked ? "#fff" : "#666", fontWeight: 600, textAlign: "center", fontFamily: "'Space Grotesk', sans-serif", letterSpacing: 0.3 }}>{badge.label}</span>
    </div>
  );
}

function CalendarGrid({ history }) {
  const days = getCalendarDays(history);
  const actMap = Object.fromEntries(ACTIVITY_TYPES.map(a => [a.id, a]));
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));

  return (
    <div style={{ overflowX: "auto" }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(w => (
          <div key={w} style={{ width: 36, textAlign: "center", fontSize: 9, color: "#555", fontWeight: 700, letterSpacing: 0.5, fontFamily: "monospace" }}>{w}</div>
        ))}
      </div>
      {weeks.map((week, wi) => (
        <div key={wi} style={{ display: "flex", gap: 4, marginBottom: 4 }}>
          {week.map((d, di) => {
            const act = d.activity;
            const aInfo = act ? actMap[act.type] : null;
            const isToday = d.date === formatDate(today);
            return (
              <div key={di} title={act ? `${aInfo?.icon} ${act.value}${aInfo?.unit} · ${act.points}pts` : d.date}
                style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: act ? `${aInfo?.color}33` : "rgba(255,255,255,0.04)",
                  border: `1.5px solid ${isToday ? "#fff" : act ? aInfo?.color : "rgba(255,255,255,0.06)"}`,
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  cursor: "default", transition: "all .2s",
                  boxShadow: act ? `0 0 8px ${aInfo?.color}44` : "none",
                }}>
                <span style={{ fontSize: 14 }}>{act ? aInfo?.icon : ""}</span>
                <span style={{ fontSize: 8, color: "#666", fontFamily: "monospace" }}>{d.day}</span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function LogModal({ onClose, onLog }) {
  const [type, setType] = useState("run");
  const [value, setValue] = useState("");
  const [note, setNote] = useState("");
  const actInfo = ACTIVITY_TYPES.find(a => a.id === type);

  const handle = () => {
    if (!value) return;
    onLog({ type, value: parseFloat(value), note, points: Math.floor(parseFloat(value) * 2 + 5) });
    onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }}>
      <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, padding: 28, width: "100%", maxWidth: 380 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h3 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, margin: 0 }}>Log Activity</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#666", fontSize: 24, cursor: "pointer" }}>×</button>
        </div>

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

        {/* Sync options */}
        <div style={{ marginBottom: 20, padding: "12px 16px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <p style={{ color: "#555", fontSize: 11, fontWeight: 700, letterSpacing: 1, fontFamily: "monospace", margin: "0 0 8px" }}>SYNC FROM WEARABLE</p>
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { label: "Apple Watch", icon: "⌚", color: "#fff" },
              { label: "Galaxy Watch", icon: "⌚", color: "#1DB954" },
            ].map(w => (
              <button key={w.label} style={{ flex: 1, padding: "8px 6px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", color: "#888", cursor: "pointer", fontSize: 10, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>
                {w.icon} {w.label}
              </button>
            ))}
          </div>
          <p style={{ color: "#444", fontSize: 10, margin: "8px 0 0", fontFamily: "monospace" }}>Connect via Health/Fit app to auto-sync</p>
        </div>

        <button onClick={handle} style={{
          width: "100%", padding: "14px", borderRadius: 14, border: "none",
          background: actInfo ? `linear-gradient(135deg, ${actInfo.color}, ${actInfo.color}88)` : "#333",
          color: "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer",
          fontFamily: "'Syne', sans-serif", letterSpacing: 0.5,
          boxShadow: actInfo ? `0 4px 20px ${actInfo.color}55` : "none",
        }}>
          LOG {actInfo?.icon} +{value ? Math.floor(parseFloat(value || 0) * 2 + 5) : "?"} pts
        </button>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function TribeChallenge() {
  const [tab, setTab] = useState("home");
  const [showLog, setShowLog] = useState(false);
  const [myHistory, setMyHistory] = useState(genHistory());
  const [leaderboard, setLeaderboard] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const myPts = Object.values(myHistory).reduce((s, a) => s + (a.points || 0), 0);
    const lb = LEADERBOARD_SEEDS.map(u => u.id === "you" ? { ...u, pts: myPts, history: myHistory } : u);
    lb.sort((a, b) => b.pts - a.pts);
    setLeaderboard(lb);
  }, [myHistory]);

  const streak = getStreak(myHistory);
  const totalPts = Object.values(myHistory).reduce((s, a) => s + (a.points || 0), 0);
  const actCounts = ACTIVITY_TYPES.reduce((acc, a) => {
    acc[a.id] = Object.values(myHistory).filter(h => h.type === a.id).length;
    return acc;
  }, {});
  const runKm = Object.values(myHistory).filter(h => h.type === "run" || h.type === "cycle").reduce((s, h) => s + (h.value || 0), 0);

  const unlockedBadges = new Set([
    streak >= 3 && "streak3", streak >= 7 && "streak7",
    actCounts.yoga >= 10 && "yoga",
    runKm >= 50 && "running",
    actCounts.gym >= 15 && "gym",
    Object.values(actCounts).filter(v => v > 0).length >= 3 && "allround",
    totalPts >= 100 && "century",
  ].filter(Boolean));

  const handleLog = (entry) => {
    const key = formatDate(today);
    const updated = { ...myHistory, [key]: entry };
    setMyHistory(updated);
    showToast(`${ACTIVITY_TYPES.find(a => a.id === entry.type)?.icon} +${entry.points} pts logged!`);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const myRank = leaderboard ? leaderboard.findIndex(u => u.id === "you") + 1 : "-";

  return (
    <div style={{
      minHeight: "100vh", background: "#080808",
      fontFamily: "'Space Grotesk', sans-serif",
      color: "#fff", maxWidth: 430, margin: "0 auto", position: "relative",
      paddingBottom: 80,
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />

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

      {showLog && <LogModal onClose={() => setShowLog(false)} onLog={handleLog} />}

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
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "#444", fontFamily: "monospace", fontWeight: 700, letterSpacing: 1 }}>RANK</div>
                <div style={{ fontSize: 36, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: myRank <= 3 ? "#FFD700" : "#fff" }}>#{myRank}</div>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div style={{ padding: "0 20px 20px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {[
              { label: "STREAK", value: streak, suffix: "🔥", color: "#FF6B35" },
              { label: "POINTS", value: totalPts, suffix: "pts", color: "#FFD700" },
              { label: "DAYS ACTIVE", value: Object.keys(myHistory).length, suffix: "", color: "#34D399" },
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
              <CalendarGrid history={myHistory} />
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
        </div>
      )}

      {/* ── LEADERBOARD TAB ── */}
      {tab === "board" && leaderboard && (
        <div style={{ padding: "52px 20px 20px" }}>
          <p style={{ color: "#555", fontSize: 11, fontWeight: 700, letterSpacing: 2, margin: "0 0 6px", fontFamily: "monospace" }}>CHALLENGE STANDINGS</p>
          <h2 style={{ margin: "0 0 24px", fontSize: 26, fontWeight: 900, fontFamily: "'Syne', sans-serif" }}>Leaderboard 🏆</h2>

          {leaderboard.map((user, i) => {
            const isMe = user.id === "you";
            const rank = i + 1;
            const rankEmoji = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`;
            const userStreak = user.history ? getStreak(user.history) : 0;

            return (
              <div key={user.id} style={{
                marginBottom: 10, padding: "16px", borderRadius: 18,
                background: isMe ? "linear-gradient(135deg, rgba(255,107,53,0.15), rgba(255,215,0,0.08))" : "rgba(255,255,255,0.03)",
                border: `1.5px solid ${isMe ? "rgba(255,107,53,0.4)" : "rgba(255,255,255,0.06)"}`,
                display: "flex", alignItems: "center", gap: 14,
                transition: "all .2s",
              }}>
                <div style={{ fontSize: 22, width: 32, textAlign: "center", fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>
                  {rankEmoji}
                </div>
                <Avatar emoji={user.avatar} size={42} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: isMe ? "#FFD700" : "#fff" }}>{user.name}</span>
                    {userStreak >= 3 && <span title={`${userStreak} day streak`} style={{ fontSize: 12 }}>🔥</span>}
                  </div>
                  <span style={{ fontSize: 11, color: "#555", fontFamily: "monospace" }}>{user.handle}</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 20, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: rank === 1 ? "#FFD700" : "#fff" }}>{user.pts}</div>
                  <div style={{ fontSize: 9, color: "#555", fontFamily: "monospace", fontWeight: 700 }}>PTS</div>
                </div>
              </div>
            );
          })}

          {/* Progress to next rank */}
          {leaderboard && (() => {
            const myIdx = leaderboard.findIndex(u => u.id === "you");
            const me = leaderboard[myIdx];
            const above = leaderboard[myIdx - 1];
            if (!above) return (
              <div style={{ margin: "16px 0", padding: 16, borderRadius: 16, background: "rgba(255,215,0,0.08)", border: "1px solid rgba(255,215,0,0.2)", textAlign: "center" }}>
                <p style={{ margin: 0, color: "#FFD700", fontWeight: 800, fontFamily: "'Syne', sans-serif" }}>🏆 You're leading the tribe!</p>
              </div>
            );
            const gap = above.pts - me.pts;
            return (
              <div style={{ margin: "16px 0", padding: 16, borderRadius: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <p style={{ margin: "0 0 8px", fontSize: 12, color: "#888", fontFamily: "monospace" }}>
                  <span style={{ color: "#FF6B35", fontWeight: 700 }}>{gap} pts</span> behind {above.name}
                </p>
                <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 6 }}>
                  <div style={{ height: "100%", borderRadius: 6, background: "linear-gradient(90deg, #FF6B35, #FFD700)", width: `${Math.min(100, (me.pts / above.pts) * 100)}%` }} />
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ── BADGES TAB ── */}
      {tab === "badges" && (
        <div style={{ padding: "52px 20px 20px" }}>
          <p style={{ color: "#555", fontSize: 11, fontWeight: 700, letterSpacing: 2, margin: "0 0 6px", fontFamily: "monospace" }}>ACHIEVEMENTS</p>
          <h2 style={{ margin: "0 0 8px", fontSize: 26, fontWeight: 900, fontFamily: "'Syne', sans-serif" }}>Your Badges</h2>
          <p style={{ color: "#555", fontSize: 12, margin: "0 0 24px" }}>{unlockedBadges.size}/{BADGES.length} unlocked</p>

          {/* Progress bar */}
          <div style={{ marginBottom: 28, padding: "14px 16px", borderRadius: 14, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: "#888", fontFamily: "monospace", fontWeight: 700 }}>BADGE PROGRESS</span>
              <span style={{ fontSize: 12, color: "#FFD700", fontFamily: "monospace", fontWeight: 700 }}>{unlockedBadges.size}/{BADGES.length}</span>
            </div>
            <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 6 }}>
              <div style={{ height: "100%", borderRadius: 6, background: "linear-gradient(90deg, #FF6B35, #FFD700)", width: `${(unlockedBadges.size / BADGES.length) * 100}%`, transition: "width 1s ease" }} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {BADGES.map(b => <Badge key={b.id} badge={b} unlocked={unlockedBadges.has(b.id)} />)}
          </div>

          {/* Badge details */}
          <div style={{ marginTop: 28 }}>
            <p style={{ color: "#555", fontSize: 11, fontWeight: 700, letterSpacing: 1, fontFamily: "monospace", margin: "0 0 12px" }}>HOW TO UNLOCK</p>
            {BADGES.map(b => (
              <div key={b.id} style={{
                display: "flex", alignItems: "center", gap: 14, padding: "12px 0",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                opacity: unlockedBadges.has(b.id) ? 1 : 0.5,
              }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${b.color}22`, border: `1.5px solid ${b.color}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                  {unlockedBadges.has(b.id) ? b.icon : "🔒"}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: unlockedBadges.has(b.id) ? "#fff" : "#888" }}>{b.label}</div>
                  <div style={{ fontSize: 11, color: "#555", fontFamily: "monospace" }}>{b.desc}</div>
                </div>
                {unlockedBadges.has(b.id) && <span style={{ marginLeft: "auto", fontSize: 11, color: "#34D399", fontWeight: 700, fontFamily: "monospace" }}>✓ EARNED</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── NAV ── */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 430, background: "rgba(8,8,8,0.95)",
        backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.06)",
        display: "flex", padding: "10px 0 20px",
      }}>
        {[
          { id: "home",   icon: "🏠", label: "Home" },
          { id: "board",  icon: "🏆", label: "Board" },
          { id: "badges", icon: "⭐", label: "Badges" },
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
