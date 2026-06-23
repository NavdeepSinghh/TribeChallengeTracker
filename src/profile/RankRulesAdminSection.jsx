import { useEffect, useMemo, useState } from "react";
import { DEFAULT_TRIBE_RANK_RULES, normalizeRankRules } from "../rankRules";
import { fetchRankRules, publishRankRules } from "../userServices/rankRulesService";

const fieldStyle = theme => ({
  width: "100%",
  boxSizing: "border-box",
  border: `1px solid ${theme.inputBorder}`,
  borderRadius: 10,
  background: theme.inputBg,
  color: theme.text,
  padding: "10px 11px",
  fontSize: 13,
  fontWeight: 800,
  outline: "none",
});

export default function RankRulesAdminSection({ isAdmin, theme, user }) {
  const [rules, setRules] = useState(() => normalizeRankRules(DEFAULT_TRIBE_RANK_RULES));
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;
    let mounted = true;
    fetchRankRules().then(next => {
      if (mounted) setRules(next);
    });
    return () => { mounted = false; };
  }, [isAdmin]);

  const normalized = useMemo(() => normalizeRankRules(rules), [rules]);
  if (!isAdmin) return null;

  function updateLevel(index, key, value) {
    setRules(current => ({
      ...current,
      levels: normalized.levels.map((level, i) => (
        i === index ? { ...level, [key]: value } : level
      )),
    }));
  }

  async function handlePublish() {
    setSaving(true);
    setMessage("");
    try {
      const published = await publishRankRules(normalized, user?.uid);
      setRules(published);
      setMessage("Rank rules published. Apps will use these rules after their next refresh.");
    } catch (error) {
      setMessage(error?.message || "Could not publish rank rules.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section style={{
      marginTop: 18,
      borderRadius: 18,
      border: `1px solid ${theme.cardBorder}`,
      background: theme.cardBg,
      padding: 16,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", marginBottom: 14 }}>
        <div>
          <p style={{ margin: "0 0 4px", color: theme.mutedStrong, fontSize: 10, fontWeight: 900, fontFamily: "monospace", letterSpacing: 1 }}>
            ADMIN CMS
          </p>
          <h3 style={{ margin: 0, color: theme.text, fontSize: 17, fontWeight: 900, fontFamily: "'Syne', sans-serif" }}>
            Tribe Status Rules
          </h3>
          <p style={{ margin: "7px 0 0", color: theme.textSoft, fontSize: 12, lineHeight: 1.4 }}>
            Publish score, active-day, streak, and challenge-completion requirements without shipping a new app build.
          </p>
        </div>
        <button
          onClick={handlePublish}
          disabled={saving}
          style={{
            border: "none",
            borderRadius: 999,
            background: saving ? theme.cardBorderStrong : "#FF6B35",
            color: "#080808",
            padding: "10px 13px",
            fontSize: 12,
            fontWeight: 900,
            cursor: saving ? "default" : "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {saving ? "Saving..." : "Publish"}
        </button>
      </div>

      <label style={{ display: "block", color: theme.mutedStrong, fontSize: 10, fontWeight: 900, fontFamily: "monospace", marginBottom: 6 }}>
        DAILY SCORE CAP
      </label>
      <input
        type="number"
        min="20"
        value={normalized.dailyRankPointCap}
        onChange={event => setRules(current => ({ ...current, dailyRankPointCap: event.target.value }))}
        style={{ ...fieldStyle(theme), marginBottom: 14 }}
      />

      <div style={{ display: "grid", gap: 10 }}>
        {normalized.levels.map((level, index) => (
          <div key={level.id} style={{
            borderRadius: 14,
            border: `1px solid ${theme.cardBorder}`,
            background: theme.cardBgStrong,
            padding: 12,
          }}>
            <div style={{ display: "grid", gridTemplateColumns: "44px 1fr", gap: 8, marginBottom: 8 }}>
              <input value={level.icon} onChange={event => updateLevel(index, "icon", event.target.value)} style={fieldStyle(theme)} />
              <input value={level.label} onChange={event => updateLevel(index, "label", event.target.value)} style={fieldStyle(theme)} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <input type="number" min="0" value={level.minScore} onChange={event => updateLevel(index, "minScore", event.target.value)} style={fieldStyle(theme)} aria-label={`${level.label} score`} />
              <input type="number" min="0" value={level.minActiveDays} onChange={event => updateLevel(index, "minActiveDays", event.target.value)} style={fieldStyle(theme)} aria-label={`${level.label} active days`} />
              <input type="number" min="0" value={level.minStreak} onChange={event => updateLevel(index, "minStreak", event.target.value)} style={fieldStyle(theme)} aria-label={`${level.label} streak`} />
              <input type="number" min="0" value={level.completedChallenges} onChange={event => updateLevel(index, "completedChallenges", event.target.value)} style={fieldStyle(theme)} aria-label={`${level.label} completed challenges`} />
            </div>
            <p style={{ margin: "8px 0 0", color: theme.mutedStrong, fontSize: 10, fontFamily: "monospace", fontWeight: 800 }}>
              score · active days · streak · completed challenges
            </p>
          </div>
        ))}
      </div>

      {message && (
        <p style={{ margin: "12px 0 0", color: message.includes("Could not") ? "#F87171" : "#34D399", fontSize: 12, fontWeight: 800 }}>
          {message}
        </p>
      )}
    </section>
  );
}

