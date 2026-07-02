import { useMemo, useState } from "react";
import {
  buildMuscleVolumeShareCard,
  buildPersonalRecordShareCard,
  buildWorkoutShareCaption,
  buildWorkoutSummaryShareCard,
} from "../../../../domain/workoutShareInsights";

function exerciseNameForPr(pr = {}, sessions = []) {
  const exerciseId = pr.exerciseId;
  const matched = sessions
    .flatMap(session => session.exercises || [])
    .find(exercise => exercise.exerciseId === exerciseId);
  return matched?.name || matched?.nameSnapshot || exerciseId?.replace(/_/g, " ") || "Exercise";
}

function cardOptions({ aggregate, personalRecords = [], profile = {}, sessions = [] }) {
  const latestSession = sessions[0];
  const firstRecord = personalRecords[0];
  return [
    latestSession ? {
      id: "workout",
      label: "Workout",
      card: buildWorkoutSummaryShareCard({ session: latestSession, profile }),
    } : null,
    aggregate ? {
      id: "muscles",
      label: "Muscles",
      card: buildMuscleVolumeShareCard({ aggregate, profile }),
    } : null,
    firstRecord ? {
      id: "pr",
      label: "PR",
      card: buildPersonalRecordShareCard({
        exerciseName: exerciseNameForPr(firstRecord, sessions),
        pr: firstRecord,
        profile,
      }),
    } : null,
  ].filter(Boolean);
}

export default function WorkoutInsightSharePanel({
  aggregate,
  personalRecords,
  profile,
  sessions,
}) {
  const options = useMemo(
    () => cardOptions({ aggregate, personalRecords, profile, sessions }),
    [aggregate, personalRecords, profile, sessions],
  );
  const [selectedId, setSelectedId] = useState(options[0]?.id || "");
  const [message, setMessage] = useState("");
  const selected = options.find(option => option.id === selectedId) || options[0];
  const card = selected?.card;
  const caption = card ? buildWorkoutShareCaption(card) : "";

  if (!card) return null;

  const copyCaption = async () => {
    try {
      await navigator.clipboard?.writeText(caption);
      setMessage("Caption copied.");
    } catch {
      setMessage("Could not copy caption.");
    }
  };

  const shareCard = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: card.title, text: caption });
        setMessage("Share sheet opened.");
        return;
      }
      await navigator.clipboard?.writeText(caption);
      setMessage("Caption copied.");
    } catch (error) {
      if (error?.name === "AbortError") {
        setMessage("Share cancelled.");
        return;
      }
      setMessage("Could not share card.");
    }
  };

  return (
    <div style={panelStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
        <div>
          <p style={eyebrowStyle}>SHARE CARD</p>
          <h4 style={titleStyle}>Share a clean progress proof.</h4>
        </div>
        <span style={privacyPillStyle}>PRIVATE PREVIEW</span>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
        {options.map(option => (
          <button
            key={option.id}
            onClick={() => {
              setSelectedId(option.id);
              setMessage("");
            }}
            style={option.id === selected?.id ? activeChoiceStyle : choiceStyle}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>

      <div style={previewStyle}>
        <div>
          <p style={{ color: "rgba(255,255,255,0.58)", fontFamily: "monospace", fontSize: 10, fontWeight: 900, letterSpacing: 1, margin: "0 0 10px" }}>
            {card.type.replace(/_/g, " ").toUpperCase()}
          </p>
          <h5 style={{ color: "#FFFFFF", fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 900, lineHeight: 1.02, margin: "0 0 8px" }}>
            {card.title}
          </h5>
          <p style={{ color: "rgba(255,255,255,0.68)", fontSize: 13, fontWeight: 700, margin: 0 }}>
            {card.subtitle}
          </p>
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          {(card.metrics || []).slice(0, 4).map(metric => (
            <div key={`${metric.label}-${metric.value}`} style={metricStyle}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
            </div>
          ))}
        </div>
        {card.highlights?.length ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {card.highlights.map(highlight => <span key={highlight} style={highlightStyle}>{highlight}</span>)}
          </div>
        ) : null}
        <p style={{ color: "rgba(255,255,255,0.44)", fontSize: 11, lineHeight: 1.35, margin: 0 }}>
          Excludes {card.privacy?.excludes?.join(", ") || "private details"}. Share only when you tap.
        </p>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <button onClick={shareCard} style={primaryButtonStyle} type="button">Share</button>
        <button onClick={copyCaption} style={secondaryButtonStyle} type="button">Copy caption</button>
      </div>
      {message ? <p style={messageStyle}>{message}</p> : null}
    </div>
  );
}

const panelStyle = {
  background: "linear-gradient(135deg, rgba(255,107,53,0.12), rgba(4,4,4,0.96))",
  border: "1px solid rgba(255,107,53,0.22)",
  borderRadius: 16,
  padding: 14,
};

const previewStyle = {
  background: "radial-gradient(circle at 15% 10%, rgba(255,107,53,0.26), transparent 34%), #101010",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 18,
  display: "grid",
  gap: 14,
  minHeight: 220,
  padding: 16,
};

const eyebrowStyle = {
  color: "#FF6B35",
  fontFamily: "monospace",
  fontSize: 10,
  fontWeight: 900,
  letterSpacing: 1.2,
  margin: "0 0 7px",
};

const titleStyle = {
  color: "#FFFFFF",
  fontFamily: "'Syne', sans-serif",
  fontSize: 20,
  fontWeight: 900,
  margin: 0,
};

const privacyPillStyle = {
  alignSelf: "start",
  background: "rgba(52,211,153,0.12)",
  border: "1px solid rgba(52,211,153,0.26)",
  borderRadius: 999,
  color: "#34D399",
  fontFamily: "monospace",
  fontSize: 9,
  fontWeight: 900,
  padding: "7px 9px",
  whiteSpace: "nowrap",
};

const choiceStyle = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.10)",
  borderRadius: 999,
  color: "rgba(255,255,255,0.68)",
  cursor: "pointer",
  fontFamily: "monospace",
  fontSize: 10,
  fontWeight: 900,
  padding: "8px 10px",
};

const activeChoiceStyle = {
  ...choiceStyle,
  background: "rgba(255,107,53,0.16)",
  border: "1px solid rgba(255,107,53,0.34)",
  color: "#FF6B35",
};

const metricStyle = {
  alignItems: "center",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 12,
  color: "rgba(255,255,255,0.64)",
  display: "flex",
  fontSize: 12,
  justifyContent: "space-between",
  padding: "10px 11px",
};

const highlightStyle = {
  border: "1px solid rgba(255,107,53,0.35)",
  borderRadius: 999,
  color: "#FF6B35",
  fontFamily: "monospace",
  fontSize: 10,
  fontWeight: 900,
  padding: "5px 8px",
};

const primaryButtonStyle = {
  background: "linear-gradient(135deg, #FF6B35, #FFD700)",
  border: "none",
  borderRadius: 12,
  color: "#040404",
  cursor: "pointer",
  flex: 1,
  fontFamily: "'Syne', sans-serif",
  fontSize: 13,
  fontWeight: 900,
  minHeight: 40,
};

const secondaryButtonStyle = {
  ...primaryButtonStyle,
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.10)",
  color: "#FFFFFF",
};

const messageStyle = {
  color: "rgba(255,255,255,0.62)",
  fontSize: 12,
  fontWeight: 700,
  margin: "10px 0 0",
};
