import { useEffect, useMemo, useState } from "react";
import {
  deleteTrainingSession,
  getTrainingSessions,
  saveTrainingSession,
} from "../userServices/trainingJournalService";
import { useAppTheme } from "./AppThemeContext";
import { WORKOUT_TEMPLATES, buildExerciseDraftsFromTemplate } from "./workoutTemplates";

const SESSION_TYPES = [
  { id: "gym", label: "Gym", icon: "💪", color: "#F59E0B" },
  { id: "run", label: "Run", icon: "🏃", color: "#34D399" },
  { id: "swim", label: "Swim", icon: "🏊", color: "#38BDF8" },
  { id: "yoga", label: "Yoga", icon: "🧘", color: "#A78BFA" },
];

const localDateStr = (date = new Date()) => {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};

const createSetDraft = (set = {}) => ({
  id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
  reps: set.reps ? String(set.reps) : "",
  weightKg: Number.isFinite(Number(set.weightKg)) && Number(set.weightKg) > 0 ? String(set.weightKg) : "",
});

const createExerciseDraft = (exercise = {}) => ({
  id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
  name: exercise.name || "Main lift",
  sets: exercise.sets?.length
    ? exercise.sets.map(createSetDraft)
    : [createSetDraft(), createSetDraft(), createSetDraft()],
});

export default function TrainingJournalSection({ user }) {
  const { theme } = useAppTheme();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showBuilder, setShowBuilder] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [selectedType, setSelectedType] = useState("gym");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [dateStr, setDateStr] = useState(localDateStr());
  const [planName, setPlanName] = useState("");
  const [intensity, setIntensity] = useState("steady");
  const [notes, setNotes] = useState("");
  const [exercises, setExercises] = useState([createExerciseDraft()]);
  const [runDistance, setRunDistance] = useState("");
  const [runMinutes, setRunMinutes] = useState("");
  const [swimDistanceMeters, setSwimDistanceMeters] = useState("");
  const [swimMinutes, setSwimMinutes] = useState("");
  const [swimStroke, setSwimStroke] = useState("Freestyle");
  const [swimLocation, setSwimLocation] = useState("Pool");
  const [yogaMinutes, setYogaMinutes] = useState("");
  const [yogaStyle, setYogaStyle] = useState("Flow");

  const loadSessions = () => {
    if (!user?.uid) return;
    setLoading(true);
    getTrainingSessions(user.uid)
      .then(items => setSessions(sortSessions(items)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSessions();
  }, [user?.uid]);

  const activeType = typeMeta(selectedType);
  const sessionsForType = useMemo(
    () => sessions.filter(session => session.type === selectedType),
    [sessions, selectedType]
  );
  const latestSession = sessions[0];
  const latestForType = sessionsForType[0];
  const overview = useMemo(() => buildOverview(sessions), [sessions]);
  const progressInsights = useMemo(
    () => buildTrainingInsights(sessionsForType, selectedType),
    [sessionsForType, selectedType]
  );

  const openNewSession = (type = selectedType) => {
    setSelectedType(type);
    resetDraft(type);
    setShowBuilder(true);
  };

  const copySessionToDraft = (session) => {
    if (!session) return;
    setSelectedTemplate(null);
    setSelectedType(session.type || "gym");
    setDateStr(localDateStr());
    setPlanName(session.planName || defaultPlanName(session.type));
    setIntensity(session.intensity || "steady");
    setNotes("");
    setExercises(session.exercises?.length ? session.exercises.map(createExerciseDraft) : [createExerciseDraft()]);
    setRunDistance(session.distanceKm ? String(session.distanceKm) : "");
    setRunMinutes(session.durationMinutes ? String(session.durationMinutes) : "");
    const meters = Number(session.distanceMeters) || (Number(session.distanceKm) || 0) * 1000;
    setSwimDistanceMeters(meters ? String(Math.round(meters)) : "");
    setSwimMinutes(session.durationMinutes ? String(session.durationMinutes) : "");
    setSwimStroke(session.style || "Freestyle");
    setSwimLocation(session.location || "Pool");
    setYogaMinutes(session.durationMinutes ? String(session.durationMinutes) : "");
    setYogaStyle(session.style || "Flow");
    setShowBuilder(true);
  };

  const resetDraft = (type = selectedType) => {
    setSelectedTemplate(null);
    setDateStr(localDateStr());
    setPlanName("");
    setIntensity("steady");
    setNotes("");
    setExercises([createExerciseDraft()]);
    setRunDistance("");
    setRunMinutes("");
    setSwimDistanceMeters("");
    setSwimMinutes("");
    setSwimStroke("Freestyle");
    setSwimLocation("Pool");
    setYogaMinutes("");
    setYogaStyle("Flow");
    if (type === "run") {
      setRunDistance("5");
      setRunMinutes("30");
    } else if (type === "swim") {
      setSwimDistanceMeters("1000");
      setSwimMinutes("30");
    } else if (type === "yoga") {
      setYogaMinutes("30");
    }
  };

  const applyWorkoutTemplate = (template) => {
    setSelectedTemplate(template);
    setSelectedType("gym");
    setDateStr(localDateStr());
    setPlanName(template.name);
    setIntensity("steady");
    setNotes("");
    setExercises(buildExerciseDraftsFromTemplate(template).map(createExerciseDraft));
    setRunDistance("");
    setRunMinutes("");
    setSwimDistanceMeters("");
    setSwimMinutes("");
    setSwimStroke("Freestyle");
    setSwimLocation("Pool");
    setYogaMinutes("");
    setYogaStyle("Flow");
    setShowBuilder(true);
  };

  const handleSave = async () => {
    if (!user?.uid || saving) return;
    const session = buildSessionPayload({
      dateStr,
      exercises,
      intensity,
      notes,
      planName,
      runDistance,
      runMinutes,
      selectedType,
      swimDistanceMeters,
      swimLocation,
      swimMinutes,
      swimStroke,
      yogaMinutes,
      yogaStyle,
    });
    if (!session) return;
    setSaving(true);
    try {
      const saved = await saveTrainingSession(user.uid, session);
      setSessions(current => sortSessions([saved, ...current.filter(item => item.id !== saved.id)]));
      setShowBuilder(false);
      resetDraft(selectedType);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (sessionId) => {
    if (!user?.uid || !sessionId) return;
    if (!window.confirm("Delete this training session?")) return;
    await deleteTrainingSession(user.uid, sessionId);
    setSessions(current => current.filter(session => session.id !== sessionId));
  };

  return (
    <>
      <section style={cardStyle(theme, 20, 18)}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={eyebrowStyle(theme)}>TRAINING JOURNAL</p>
            <h3 style={{ margin: 0, color: theme.text, fontSize: 19, fontWeight: 950, fontFamily: "'Syne', sans-serif" }}>
              Save a full workout in one go.
            </h3>
            <p style={{ margin: "7px 0 0", color: theme.textSoft, fontSize: 12, lineHeight: 1.35 }}>
              Copy a previous session, tweak today’s numbers, and keep charts separate from logging.
            </p>
          </div>
          <span style={{ fontSize: 26 }}>📓</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 14 }}>
          <MiniMetric label="SESSIONS" value={overview.totalSessions} color="#FFD700" theme={theme} />
          <MiniMetric label="THIS WEEK" value={overview.thisWeek} color="#34D399" theme={theme} />
          <MiniMetric label="LAST TYPE" value={latestSession ? typeMeta(latestSession.type).label : "-"} color="#60A5FA" theme={theme} />
        </div>

        <div style={{
          padding: 13,
          borderRadius: 14,
          background: theme.cardBgStrong,
          border: `1px solid ${theme.cardBorder}`,
          marginBottom: 14,
        }}>
          <p style={{ margin: "0 0 4px", color: theme.mutedStrong, fontSize: 9, fontFamily: "monospace", fontWeight: 900, letterSpacing: 0.7 }}>
            LATEST SESSION
          </p>
          {loading ? (
            <p style={{ margin: 0, color: theme.textSoft, fontSize: 12 }}>Loading training history...</p>
          ) : latestSession ? (
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ fontSize: 22 }}>{typeMeta(latestSession.type).icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, color: theme.text, fontWeight: 900, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {latestSession.planName || defaultPlanName(latestSession.type)}
                </p>
                <p style={{ margin: "3px 0 0", color: theme.textSoft, fontSize: 12 }}>{sessionSummary(latestSession)}</p>
              </div>
              <button onClick={() => copySessionToDraft(latestSession)} style={ghostButtonStyle(theme)}>
                Copy
              </button>
            </div>
          ) : (
            <p style={{ margin: 0, color: theme.textSoft, fontSize: 12 }}>No detailed workouts yet.</p>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: latestSession ? "1fr 1fr 1fr" : "1fr 1fr", gap: 8 }}>
          <button onClick={() => openNewSession()} style={primaryButtonStyle(activeType.color)}>
            Log workout
          </button>
          {latestSession && (
            <button onClick={() => copySessionToDraft(latestSession)} style={secondaryButtonStyle(theme)}>
              Use previous
            </button>
          )}
          <button onClick={() => setShowProgress(true)} style={secondaryButtonStyle(theme)}>
            Progress
          </button>
        </div>

        <WorkoutTemplateStrip templates={WORKOUT_TEMPLATES} onSelect={applyWorkoutTemplate} theme={theme} />

        {!!sessions.length && (
          <div style={{ marginTop: 14, display: "grid", gap: 8 }}>
            {sessions.slice(0, 3).map(session => (
              <RecentSessionRow key={session.id} session={session} onCopy={copySessionToDraft} onDelete={handleDelete} theme={theme} />
            ))}
          </div>
        )}
      </section>

      {showBuilder && (
        <ModalShell title="Log Training Session" onClose={() => setShowBuilder(false)} theme={theme}>
          <TypePicker selectedType={selectedType} onSelect={(type) => { setSelectedType(type); resetDraft(type); }} theme={theme} />

          {selectedType === "gym" && (
            <TemplateGuidance
              template={selectedTemplate || WORKOUT_TEMPLATES.find(template => template.name === planName)}
              theme={theme}
            />
          )}

          {!!sessions.length && (
            <div style={{ marginBottom: 14 }}>
              <p style={eyebrowStyle(theme)}>COPY PREVIOUS</p>
              <div style={{ display: "grid", gap: 7 }}>
                {sessions.slice(0, 5).map(session => (
                  <button key={session.id} onClick={() => copySessionToDraft(session)} style={previousButtonStyle(theme)}>
                    <span>{typeMeta(session.type).icon}</span>
                    <span style={{ flex: 1, textAlign: "left", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {session.planName || defaultPlanName(session.type)}
                    </span>
                    <span style={{ color: theme.mutedStrong, fontFamily: "monospace", fontSize: 10 }}>{session.dateStr}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            <TrainingInput label="Workout name" value={planName} onChange={setPlanName} placeholder={defaultPlanName(selectedType)} theme={theme} />
            <TrainingInput label="Date" value={dateStr} onChange={setDateStr} type="date" theme={theme} />
          </div>

          {selectedType === "gym" && (
            <GymSessionBuilder exercises={exercises} setExercises={setExercises} theme={theme} />
          )}

          {selectedType === "run" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
              <TrainingInput label="Distance km" value={runDistance} onChange={setRunDistance} type="number" theme={theme} />
              <TrainingInput label="Duration min" value={runMinutes} onChange={setRunMinutes} type="number" theme={theme} />
            </div>
          )}

          {selectedType === "swim" && (
            <div style={{ display: "grid", gap: 10, marginBottom: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <TrainingInput label="Distance m" value={swimDistanceMeters} onChange={setSwimDistanceMeters} type="number" theme={theme} />
                <TrainingInput label="Duration min" value={swimMinutes} onChange={setSwimMinutes} type="number" theme={theme} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <TrainingInput label="Stroke" value={swimStroke} onChange={setSwimStroke} placeholder="Freestyle, mixed" theme={theme} />
                <TrainingInput label="Water" value={swimLocation} onChange={setSwimLocation} placeholder="Pool or open water" theme={theme} />
              </div>
            </div>
          )}

          {selectedType === "yoga" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
              <TrainingInput label="Minutes" value={yogaMinutes} onChange={setYogaMinutes} type="number" theme={theme} />
              <TrainingInput label="Style" value={yogaStyle} onChange={setYogaStyle} placeholder="Flow, Yin, Mobility" theme={theme} />
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            <TrainingInput label="Effort" value={intensity} onChange={setIntensity} placeholder="easy / steady / hard" theme={theme} />
            <TrainingInput label="Notes" value={notes} onChange={setNotes} placeholder="How did it feel?" theme={theme} />
          </div>

          <button onClick={handleSave} disabled={saving} style={primaryButtonStyle(activeType.color, saving)}>
            {saving ? "Saving..." : `Save ${activeType.label} Session`}
          </button>
        </ModalShell>
      )}

      {showProgress && (
        <ModalShell title="Training Progress" onClose={() => setShowProgress(false)} theme={theme}>
          <TypePicker selectedType={selectedType} onSelect={setSelectedType} theme={theme} />
          <TrainingInsightRow insights={progressInsights} theme={theme} color={activeType.color} />
          <TrainingChart sessions={sessionsForType.slice(0, 12).reverse()} type={selectedType} color={activeType.color} theme={theme} />
          <div style={{ display: "grid", gap: 8 }}>
            {sessionsForType.slice(0, 10).map(session => (
              <RecentSessionRow key={session.id} session={session} onCopy={copySessionToDraft} onDelete={handleDelete} theme={theme} />
            ))}
            {!sessionsForType.length && (
              <p style={{ margin: 0, color: theme.textSoft, fontSize: 12 }}>No {activeType.label.toLowerCase()} sessions yet.</p>
            )}
          </div>
        </ModalShell>
      )}
    </>
  );
}

function WorkoutTemplateStrip({ onSelect, templates, theme }) {
  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", marginBottom: 9 }}>
        <p style={eyebrowStyle(theme)}>WORKOUT TEMPLATES</p>
        <span style={{ color: theme.textSoft, fontSize: 11, fontWeight: 800 }}>Tap to prefill</span>
      </div>
      <div style={{
        display: "flex",
        gap: 9,
        overflowX: "auto",
        paddingBottom: 4,
        WebkitOverflowScrolling: "touch",
      }}>
        {templates.map(template => (
          <button
            key={template.id}
            onClick={() => onSelect(template)}
            style={{
              flex: "0 0 154px",
              textAlign: "left",
              border: `1px solid ${theme.cardBorder}`,
              borderRadius: 14,
              background: theme.cardBgStrong,
              color: theme.text,
              padding: 12,
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 24 }}>{template.emoji}</span>
              <span style={{ color: "#FF6B35", fontSize: 10, fontFamily: "monospace", fontWeight: 900 }}>{template.minutes} MIN</span>
            </div>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 950, fontFamily: "'Syne', sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {template.name}
            </p>
            <p style={{ margin: "4px 0 0", color: theme.textSoft, fontSize: 11, lineHeight: 1.25 }}>
              {template.focus}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

function TemplateGuidance({ template, theme }) {
  if (!template) return null;
  return (
    <div style={{ padding: 12, borderRadius: 14, background: theme.cardBgStrong, border: `1px solid ${theme.cardBorder}`, marginBottom: 14 }}>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        <span style={{ fontSize: 24 }}>{template.emoji}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, color: theme.text, fontSize: 14, fontWeight: 950, fontFamily: "'Syne', sans-serif" }}>
            {template.name} template
          </p>
          <p style={{ margin: "3px 0 8px", color: theme.textSoft, fontSize: 12 }}>
            {template.summary}
          </p>
          <div style={{ display: "grid", gap: 6 }}>
            {template.guidance.map(item => (
              <p key={item} style={{ margin: 0, color: theme.textSoft, fontSize: 11, lineHeight: 1.35 }}>
                • {item}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalShell({ children, onClose, theme, title }) {
  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 50,
      background: "rgba(0,0,0,0.58)",
      display: "grid",
      placeItems: "end center",
      padding: "20px 14px max(env(safe-area-inset-bottom), 18px)",
    }}>
      <div style={{
        width: "min(680px, 100%)",
        maxHeight: "88vh",
        overflow: "auto",
        borderRadius: 22,
        background: theme.bg,
        border: `1px solid ${theme.cardBorder}`,
        boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
        padding: 18,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <h3 style={{ margin: 0, flex: 1, color: theme.text, fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 950 }}>
            {title}
          </h3>
          <button onClick={onClose} style={{
            border: `1px solid ${theme.cardBorder}`,
            background: theme.cardBg,
            color: theme.text,
            borderRadius: 999,
            width: 38,
            height: 38,
            fontSize: 18,
            cursor: "pointer",
          }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function TypePicker({ selectedType, onSelect, theme }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 14 }}>
      {SESSION_TYPES.map(type => (
        <button
          key={type.id}
          onClick={() => onSelect(type.id)}
          style={{
            border: `1px solid ${selectedType === type.id ? type.color : theme.cardBorder}`,
            background: selectedType === type.id ? `${type.color}22` : theme.cardBg,
            color: selectedType === type.id ? type.color : theme.textSoft,
            borderRadius: 12,
            padding: "10px 7px",
            fontSize: 12,
            fontWeight: 900,
            cursor: "pointer",
          }}
        >
          {type.icon} {type.label}
        </button>
      ))}
    </div>
  );
}

function GymSessionBuilder({ exercises, setExercises, theme }) {
  const updateExercise = (exerciseId, patch) => {
    setExercises(current => current.map(exercise => exercise.id === exerciseId ? { ...exercise, ...patch } : exercise));
  };
  const updateSet = (exerciseId, setId, patch) => {
    setExercises(current => current.map(exercise => {
      if (exercise.id !== exerciseId) return exercise;
      return {
        ...exercise,
        sets: exercise.sets.map(set => set.id === setId ? { ...set, ...patch } : set),
      };
    }));
  };
  const removeExercise = (exerciseId) => {
    setExercises(current => current.length > 1 ? current.filter(exercise => exercise.id !== exerciseId) : current);
  };
  const removeSet = (exerciseId, setId) => {
    setExercises(current => current.map(exercise => {
      if (exercise.id !== exerciseId || exercise.sets.length <= 1) return exercise;
      return { ...exercise, sets: exercise.sets.filter(set => set.id !== setId) };
    }));
  };

  return (
    <div style={{ display: "grid", gap: 12, marginBottom: 12 }}>
      {exercises.map((exercise, exerciseIndex) => (
        <div key={exercise.id} style={{ padding: 12, borderRadius: 14, background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
          <div style={{ display: "flex", alignItems: "end", gap: 8, marginBottom: 10 }}>
            <div style={{ flex: 1 }}>
              <TrainingInput
                label={`Exercise ${exerciseIndex + 1}`}
                value={exercise.name}
                onChange={value => updateExercise(exercise.id, { name: value })}
                placeholder="Lat pulldown, row, curl"
                theme={theme}
              />
            </div>
            {exercises.length > 1 && (
              <button onClick={() => removeExercise(exercise.id)} style={tinyButtonStyle(theme)}>Remove</button>
            )}
          </div>

          <div style={{ display: "grid", gap: 7 }}>
            {exercise.sets.map((set, setIndex) => (
              <div key={set.id} style={{ display: "grid", gridTemplateColumns: "44px 1fr 1fr auto", gap: 8, alignItems: "center" }}>
                <span style={{ color: theme.mutedStrong, fontSize: 10, fontFamily: "monospace", fontWeight: 900 }}>
                  Set {setIndex + 1}
                </span>
                <input
                  value={set.reps}
                  type="number"
                  min="0"
                  placeholder="reps"
                  onChange={event => updateSet(exercise.id, set.id, { reps: event.target.value })}
                  style={miniInputStyle(theme)}
                />
                <input
                  value={set.weightKg}
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="kg"
                  onChange={event => updateSet(exercise.id, set.id, { weightKg: event.target.value })}
                  style={miniInputStyle(theme)}
                />
                <button onClick={() => removeSet(exercise.id, set.id)} style={iconButtonStyle(theme)} disabled={exercise.sets.length <= 1}>×</button>
              </div>
            ))}
          </div>

          <button
            onClick={() => updateExercise(exercise.id, { sets: [...exercise.sets, createSetDraft()] })}
            style={{ ...secondaryButtonStyle(theme), marginTop: 10, width: "100%" }}
          >
            Add set
          </button>
        </div>
      ))}
      <button onClick={() => setExercises(current => [...current, createExerciseDraft({ name: "New exercise" })])} style={secondaryButtonStyle(theme)}>
        Add exercise
      </button>
    </div>
  );
}

function TrainingInput({ label, value, onChange, placeholder = "", type = "text", theme }) {
  return (
    <label style={{ display: "grid", gap: 5 }}>
      <span style={{ color: theme.mutedStrong, fontSize: 9, fontFamily: "monospace", fontWeight: 900, letterSpacing: 0.7 }}>
        {label.toUpperCase()}
      </span>
      <input
        type={type}
        value={value}
        min={type === "number" ? "0" : undefined}
        step={type === "number" ? "0.1" : undefined}
        onChange={event => onChange(event.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          boxSizing: "border-box",
          borderRadius: 12,
          border: `1px solid ${theme.cardBorder}`,
          background: theme.cardBgStrong,
          color: theme.text,
          padding: "10px 11px",
          fontSize: 13,
          fontWeight: 750,
        }}
      />
    </label>
  );
}

function MiniMetric({ color, label, theme, value }) {
  return (
    <div style={{ padding: "11px 9px", borderRadius: 12, background: theme.cardBgStrong, border: `1px solid ${theme.cardBorder}` }}>
      <p style={{ margin: "0 0 4px", color, fontSize: 16, fontWeight: 950, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</p>
      <p style={{ margin: 0, color: theme.mutedStrong, fontSize: 8, fontFamily: "monospace", fontWeight: 900, letterSpacing: 0.5 }}>{label}</p>
    </div>
  );
}

function TrainingInsightRow({ insights, color, theme }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 14 }}>
      {insights.map(item => (
        <MiniMetric key={item.label} color={color} label={item.label} value={item.value} theme={theme} />
      ))}
    </div>
  );
}

function TrainingChart({ sessions, type, color, theme }) {
  const values = sessions.map(session => chartValue(session, type));
  const max = Math.max(1, ...values);
  return (
    <div style={{ padding: 12, borderRadius: 14, background: theme.cardBgStrong, border: `1px solid ${theme.cardBorder}`, marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "end", gap: 6, minHeight: 112 }}>
        {sessions.length ? sessions.map((session, index) => {
          const value = values[index];
          return (
            <div key={session.id || index} style={{ flex: 1, minWidth: 0, display: "grid", alignItems: "end", gap: 5 }}>
              <div title={sessionSummary(session)} style={{
                height: Math.max(8, (value / max) * 96),
                borderRadius: 8,
                background: `linear-gradient(180deg, ${color}, ${color}77)`,
              }} />
              <span style={{ color: theme.mutedStrong, fontSize: 8, fontFamily: "monospace", textAlign: "center" }}>
                {dayLabel(session.dateStr)}
              </span>
            </div>
          );
        }) : (
          <p style={{ margin: 0, color: theme.textSoft, fontSize: 12 }}>Your chart appears after the first detailed session.</p>
        )}
      </div>
      <p style={{ margin: "10px 0 0", color: theme.mutedStrong, fontSize: 9, fontFamily: "monospace", fontWeight: 900 }}>
        {chartLabel(type)}
      </p>
    </div>
  );
}

function RecentSessionRow({ onCopy, onDelete, session, theme }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 10, borderRadius: 12, background: theme.cardBgStrong, border: `1px solid ${theme.cardBorder}` }}>
      <span style={{ fontSize: 18 }}>{typeMeta(session.type).icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, color: theme.text, fontWeight: 850, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {session.planName || defaultPlanName(session.type)}
        </p>
        <p style={{ margin: "2px 0 0", color: theme.textSoft, fontSize: 11, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {sessionSummary(session)}
        </p>
      </div>
      <button onClick={() => onCopy(session)} style={tinyButtonStyle(theme)}>Copy</button>
      <button onClick={() => onDelete(session.id)} style={iconButtonStyle(theme)}>×</button>
    </div>
  );
}

function buildSessionPayload({
  dateStr,
  exercises,
  intensity,
  notes,
  planName,
  runDistance,
  runMinutes,
  selectedType,
  swimDistanceMeters,
  swimLocation,
  swimMinutes,
  swimStroke,
  yogaMinutes,
  yogaStyle,
}) {
  const base = {
    type: selectedType,
    dateStr: dateStr || localDateStr(),
    planName: (planName || defaultPlanName(selectedType)).trim(),
    notes: notes.trim(),
    intensity: intensity.trim(),
  };

  if (selectedType === "gym") {
    const cleanExercises = exercises
      .map(exercise => ({
        name: (exercise.name || "Exercise").trim(),
        sets: exercise.sets
          .map(set => ({ reps: Number(set.reps), weightKg: Number(set.weightKg) || 0 }))
          .filter(set => Number.isFinite(set.reps) && set.reps > 0 && Number.isFinite(set.weightKg) && set.weightKg >= 0),
      }))
      .filter(exercise => exercise.sets.length > 0);
    if (!cleanExercises.length) return null;
    const allSets = cleanExercises.flatMap(exercise => exercise.sets);
    const totalVolumeKg = allSets.reduce((sum, set) => sum + (set.reps * set.weightKg), 0);
    return {
      ...base,
      exerciseCount: cleanExercises.length,
      totalVolumeKg,
      bestWeightKg: Math.max(...allSets.map(set => set.weightKg)),
      exercises: cleanExercises,
    };
  }

  if (selectedType === "run") {
    const distanceKm = Number(runDistance);
    const durationMinutes = Number(runMinutes);
    if (!distanceKm || !durationMinutes) return null;
    return {
      ...base,
      distanceKm,
      durationMinutes,
      paceSecondsPerKm: Math.round((durationMinutes * 60) / distanceKm),
    };
  }

  if (selectedType === "swim") {
    const distanceMeters = Number(swimDistanceMeters);
    const durationMinutes = Number(swimMinutes);
    if (!distanceMeters || !durationMinutes) return null;
    return {
      ...base,
      distanceMeters,
      distanceKm: distanceMeters / 1000,
      durationMinutes,
      paceSecondsPer100m: Math.round((durationMinutes * 60) / (distanceMeters / 100)),
      style: swimStroke.trim() || "Freestyle",
      location: swimLocation.trim() || "Pool",
    };
  }

  const durationMinutes = Number(yogaMinutes);
  if (!durationMinutes) return null;
  return {
    ...base,
    durationMinutes,
    style: yogaStyle.trim() || "Yoga",
  };
}

function buildOverview(sessions) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - 6);
  return {
    totalSessions: String(sessions.length),
    thisWeek: String(sessions.filter(session => new Date(`${session.dateStr}T00:00:00`) >= start).length),
  };
}

function buildTrainingInsights(sessions, type) {
  const latest = sessions[0];
  if (type === "gym") {
    const bestVolume = Math.max(0, ...sessions.map(session => Number(session.totalVolumeKg) || 0));
    return [
      { label: "SESSIONS", value: String(sessions.length) },
      { label: "BEST VOLUME", value: `${Math.round(bestVolume)} kg` },
      { label: "LATEST", value: latest ? `${Math.round(latest.totalVolumeKg || 0)} kg` : "0 kg" },
    ];
  }
  if (type === "run") {
    const bestPace = sessions.map(session => session.paceSecondsPerKm).filter(Boolean).sort((a, b) => a - b)[0];
    const totalKm = sessions.reduce((sum, session) => sum + (Number(session.distanceKm) || 0), 0);
    return [
      { label: "RUNS", value: String(sessions.length) },
      { label: "TOTAL KM", value: trimNumber(totalKm, 1) },
      { label: "BEST PACE", value: bestPace ? formatPace(bestPace) : "--" },
    ];
  }
  if (type === "swim") {
    const bestPace = sessions.map(session => session.paceSecondsPer100m).filter(Boolean).sort((a, b) => a - b)[0];
    const totalMeters = sessions.reduce((sum, session) => sum + (Number(session.distanceMeters) || (Number(session.distanceKm) || 0) * 1000), 0);
    return [
      { label: "SWIMS", value: String(sessions.length) },
      { label: "TOTAL", value: formatSwimDistance(totalMeters) },
      { label: "BEST /100M", value: bestPace ? formatPace(bestPace) : "--" },
    ];
  }
  const totalMinutes = sessions.reduce((sum, session) => sum + (Number(session.durationMinutes) || 0), 0);
  return [
    { label: "SESSIONS", value: String(sessions.length) },
    { label: "TOTAL TIME", value: `${Math.round(totalMinutes)}m` },
    { label: "LATEST", value: latest ? `${Math.round(latest.durationMinutes || 0)}m` : "0m" },
  ];
}

function chartValue(session, type) {
  if (type === "gym") return Number(session.totalVolumeKg) || 0;
  if (type === "run") return Number(session.distanceKm) || 0;
  if (type === "swim") return Number(session.distanceMeters) || (Number(session.distanceKm) || 0) * 1000;
  return Number(session.durationMinutes) || 0;
}

function chartLabel(type) {
  if (type === "gym") return "VOLUME TREND (KG)";
  if (type === "run") return "DISTANCE TREND (KM)";
  if (type === "swim") return "SWIM DISTANCE TREND (M)";
  return "YOGA TIME TREND (MIN)";
}

function sessionSummary(session) {
  if (session.type === "gym") {
    const exerciseCount = session.exerciseCount || session.exercises?.length || 0;
    return `${session.dateStr} · ${exerciseCount} exercise${exerciseCount === 1 ? "" : "s"} · ${Math.round(session.totalVolumeKg || 0)} kg volume`;
  }
  if (session.type === "run") {
    return `${session.dateStr} · ${trimNumber(session.distanceKm || 0, 1)} km · ${formatPace(session.paceSecondsPerKm)}/km`;
  }
  if (session.type === "swim") {
    const meters = Number(session.distanceMeters) || (Number(session.distanceKm) || 0) * 1000;
    const pace = session.paceSecondsPer100m ? ` · ${formatPace(session.paceSecondsPer100m)}/100m` : "";
    return `${session.dateStr} · ${formatSwimDistance(meters)} · ${Math.round(session.durationMinutes || 0)} min${pace}`;
  }
  return `${session.dateStr} · ${session.style || "Yoga"} · ${Math.round(session.durationMinutes || 0)} min`;
}

function typeMeta(type) {
  return SESSION_TYPES.find(item => item.id === type) || SESSION_TYPES[0];
}

function defaultPlanName(type) {
  if (type === "gym") return "Strength session";
  if (type === "run") return "Daily run";
  if (type === "swim") return "Swim session";
  return "Yoga practice";
}

function formatPace(seconds) {
  if (!seconds) return "--";
  const mins = Math.floor(seconds / 60);
  const secs = String(Math.round(seconds % 60)).padStart(2, "0");
  return `${mins}:${secs}`;
}

function trimNumber(value, digits = 1) {
  return Number(value || 0).toFixed(digits).replace(/\.0$/, "");
}

function formatSwimDistance(meters) {
  const value = Number(meters) || 0;
  if (value >= 1000) return `${trimNumber(value / 1000, 1)} km`;
  return `${Math.round(value)} m`;
}

function dayLabel(dateStr) {
  return String(dateStr || "").split("-").pop() || "";
}

function sortSessions(items) {
  return [...items].sort((a, b) => String(b.dateStr || "").localeCompare(String(a.dateStr || "")));
}

function cardStyle(theme, radius, padding) {
  return {
    marginBottom: 24,
    padding,
    borderRadius: radius,
    background: theme.cardBg,
    border: `1px solid ${theme.cardBorder}`,
  };
}

function eyebrowStyle(theme) {
  return {
    margin: "0 0 5px",
    color: theme.mutedStrong,
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: 1,
    fontFamily: "monospace",
  };
}

function primaryButtonStyle(color, disabled = false) {
  return {
    width: "100%",
    border: "none",
    borderRadius: 14,
    padding: "13px 12px",
    background: `linear-gradient(135deg, ${color}, #FFD700)`,
    color: "#111",
    fontSize: 13,
    fontWeight: 950,
    fontFamily: "'Syne', sans-serif",
    cursor: disabled ? "default" : "pointer",
    opacity: disabled ? 0.72 : 1,
  };
}

function secondaryButtonStyle(theme) {
  return {
    border: `1px solid ${theme.cardBorder}`,
    borderRadius: 14,
    padding: "12px 10px",
    background: theme.cardBgStrong,
    color: theme.text,
    fontSize: 12,
    fontWeight: 900,
    cursor: "pointer",
  };
}

function ghostButtonStyle(theme) {
  return {
    border: `1px solid ${theme.cardBorder}`,
    borderRadius: 999,
    padding: "8px 10px",
    background: theme.cardBg,
    color: theme.text,
    fontSize: 11,
    fontWeight: 900,
    cursor: "pointer",
  };
}

function previousButtonStyle(theme) {
  return {
    display: "flex",
    alignItems: "center",
    gap: 8,
    width: "100%",
    border: `1px solid ${theme.cardBorder}`,
    borderRadius: 12,
    background: theme.cardBg,
    color: theme.text,
    padding: "9px 10px",
    cursor: "pointer",
    fontWeight: 850,
  };
}

function tinyButtonStyle(theme) {
  return {
    border: `1px solid ${theme.cardBorder}`,
    background: theme.cardBg,
    color: theme.textSoft,
    borderRadius: 999,
    padding: "7px 9px",
    fontSize: 11,
    fontWeight: 850,
    cursor: "pointer",
  };
}

function iconButtonStyle(theme) {
  return {
    border: "none",
    background: "transparent",
    color: theme.mutedStrong,
    cursor: "pointer",
    fontSize: 17,
    padding: 4,
  };
}

function miniInputStyle(theme) {
  return {
    width: "100%",
    minWidth: 0,
    boxSizing: "border-box",
    borderRadius: 9,
    border: `1px solid ${theme.cardBorder}`,
    background: theme.cardBgStrong,
    color: theme.text,
    padding: "8px",
    fontSize: 12,
    fontWeight: 800,
  };
}
