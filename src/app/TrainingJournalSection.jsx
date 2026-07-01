import { useEffect, useMemo, useState } from "react";
import {
  deleteTrainingSession,
  getTrainingSessions,
  saveTrainingSession,
} from "../userServices/trainingJournalService";
import {
  ROUTINE_VISIBILITY,
  publishRoutine,
  unpublishRoutine,
} from "../userServices/followService";
import { useAppTheme } from "./AppThemeContext";
import { WORKOUT_TEMPLATES, buildExerciseDraftsFromTemplate } from "./workoutTemplates";

const SESSION_TYPES = [
  { id: "gym", label: "Gym", icon: "💪", color: "#F59E0B" },
  { id: "run", label: "Run", icon: "🏃", color: "#34D399" },
  { id: "swim", label: "Swim", icon: "🏊", color: "#38BDF8" },
  { id: "yoga", label: "Yoga", icon: "🧘", color: "#A78BFA" },
];

const DEFAULT_TEMPLATE_ID = WORKOUT_TEMPLATES[0]?.id || "";

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
  focus: exercise.focus || "",
  repRange: exercise.repRange || "",
  setRange: exercise.setRange || "",
  tip: exercise.tip || "",
  sets: exercise.sets?.length
    ? exercise.sets.map(createSetDraft)
    : [createSetDraft(), createSetDraft(), createSetDraft()],
});

export default function TrainingJournalSection({
  followFeatureEnabled = false,
  onRoutineUsed,
  routineToUse,
  user,
  userProfile,
}) {
  const { theme } = useAppTheme();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showBuilder, setShowBuilder] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [selectedType, setSelectedType] = useState("gym");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedPlanId, setSelectedPlanId] = useState(DEFAULT_TEMPLATE_ID);
  const [selectedPlanFlowId, setSelectedPlanFlowId] = useState("");
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
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
  const [routineShareMessage, setRoutineShareMessage] = useState("");

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

  useEffect(() => {
    if (!routineToUse) return;
    copyRoutineToDraft(routineToUse);
    onRoutineUsed?.();
  }, [routineToUse, onRoutineUsed]);

  const activeType = typeMeta(selectedType);
  const selectedPlan = useMemo(
    () => WORKOUT_TEMPLATES.find(template => template.id === selectedPlanId) || WORKOUT_TEMPLATES[0],
    [selectedPlanId]
  );
  const activeWorkoutTemplate = useMemo(
    () => WORKOUT_TEMPLATES.find(template => template.id === activeWorkout?.templateId),
    [activeWorkout?.templateId]
  );
  const selectedPlanFlow = useMemo(
    () => WORKOUT_TEMPLATES.find(template => template.id === selectedPlanFlowId),
    [selectedPlanFlowId]
  );
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

  useEffect(() => {
    if (!activeWorkout?.startedAt) {
      setElapsedSeconds(0);
      return undefined;
    }
    const updateElapsed = () => {
      setElapsedSeconds(Math.max(0, Math.floor((Date.now() - activeWorkout.startedAt) / 1000)));
    };
    updateElapsed();
    const timer = window.setInterval(updateElapsed, 1000);
    return () => window.clearInterval(timer);
  }, [activeWorkout?.startedAt]);

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

  const copyRoutineToDraft = (routine) => {
    if (!routine) return;
    const type = routine.type || "gym";
    setSelectedTemplate(null);
    setSelectedType(type);
    setDateStr(localDateStr());
    setPlanName(routine.planName || defaultPlanName(type));
    setIntensity("steady");
    setNotes("");
    setExercises(routine.exercises?.length ? routine.exercises.map(createExerciseDraft) : [createExerciseDraft()]);
    setRunDistance(routine.distanceKm ? String(routine.distanceKm) : "");
    setRunMinutes(routine.durationMinutes ? String(routine.durationMinutes) : "");
    const meters = Number(routine.distanceMeters) || (Number(routine.distanceKm) || 0) * 1000;
    setSwimDistanceMeters(meters ? String(Math.round(meters)) : "");
    setSwimMinutes(routine.durationMinutes ? String(routine.durationMinutes) : "");
    setSwimStroke(routine.style || "Freestyle");
    setSwimLocation(routine.location || "Pool");
    setYogaMinutes(routine.durationMinutes ? String(routine.durationMinutes) : "");
    setYogaStyle(routine.style || "Flow");
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

  const openWorkoutPlanFlow = (planId = selectedPlanId) => {
    const plan = WORKOUT_TEMPLATES.find(template => template.id === planId) || selectedPlan;
    if (!plan) return;
    setSelectedPlanId(plan.id);
    setSelectedPlanFlowId(plan.id);
  };

  const startWorkoutFromTemplate = (template = selectedPlan) => {
    if (!template) return;
    setSelectedType("gym");
    setSelectedTemplate(template);
    setSelectedPlanId(template.id);
    setActiveWorkout({
      templateId: template.id,
      startedAt: Date.now(),
    });
    setSelectedPlanFlowId("");
  };

  const stopActiveWorkout = () => {
    setActiveWorkout(null);
    setElapsedSeconds(0);
  };

  const finishActiveWorkout = () => {
    const template = activeWorkoutTemplate || selectedPlan;
    stopActiveWorkout();
    if (template) {
      applyWorkoutTemplate(template);
    }
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

  const handlePublishRoutine = async (session) => {
    if (!user?.uid || !session?.id) return;
    setRoutineShareMessage("");
    try {
      const profile = userProfile || user || {};
      const preferredVisibility = profile?.followProfile?.routineDefaultVisibility;
      const visibility = preferredVisibility && preferredVisibility !== ROUTINE_VISIBILITY.PRIVATE
        ? preferredVisibility
        : ROUTINE_VISIBILITY.PUBLIC;
      const published = await publishRoutine(user.uid, profile, session, visibility);
      setSessions(current => current.map(item => (
        item.id === session.id
          ? { ...item, routineVisibility: visibility, publicRoutineId: published.publicRoutineId || published.id }
          : item
      )));
      setRoutineShareMessage(visibility === ROUTINE_VISIBILITY.FOLLOWERS ? "Routine is visible to followers." : "Routine is public on your profile.");
    } catch (error) {
      setRoutineShareMessage(error.message || "Could not share this routine.");
    }
  };

  const handleUnpublishRoutine = async (session) => {
    if (!user?.uid || !session?.id) return;
    setRoutineShareMessage("");
    try {
      await unpublishRoutine(user.uid, session);
      setSessions(current => current.map(item => (
        item.id === session.id
          ? { ...item, routineVisibility: ROUTINE_VISIBILITY.PRIVATE, publicRoutineId: null }
          : item
      )));
      setRoutineShareMessage("Routine is private again.");
    } catch (error) {
      setRoutineShareMessage(error.message || "Could not update routine privacy.");
    }
  };

  return (
    <>
      <TrainingJournalAnimationStyles />
      <section style={cardStyle(theme, 20, 18)}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={eyebrowStyle(theme)}>TRAINING PLAN</p>
            <h3 style={{ margin: 0, color: theme.text, fontSize: 19, fontWeight: 950, fontFamily: "'Syne', sans-serif" }}>
              Start focused sessions from your activity tab.
            </h3>
            <p style={{ margin: "7px 0 0", color: theme.textSoft, fontSize: 12, lineHeight: 1.35 }}>
              Pick a plan, preview the target muscles, start the workout timer, then save the finished session.
            </p>
          </div>
          <span style={{ fontSize: 26 }}>🏋️</span>
        </div>

        <TrainingPlanShowcase
          activeWorkout={activeWorkout}
          elapsedSeconds={elapsedSeconds}
          onLogPlan={() => applyWorkoutTemplate(selectedPlan)}
          onOpenPlan={openWorkoutPlanFlow}
          onSelectPlan={(planId) => {
            setSelectedPlanId(planId);
            openWorkoutPlanFlow(planId);
          }}
          onStart={() => openWorkoutPlanFlow(selectedPlanId)}
          onStop={stopActiveWorkout}
          selectedPlan={selectedPlan}
          selectedPlanId={selectedPlanId}
          templates={WORKOUT_TEMPLATES}
          theme={theme}
        />

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

        {followFeatureEnabled && routineShareMessage && (
          <p style={{ margin: "12px 0 0", color: "#FF6B35", fontSize: 12, fontWeight: 850 }}>
            {routineShareMessage}
          </p>
        )}

        {!!sessions.length && (
          <div style={{ marginTop: 14, display: "grid", gap: 8 }}>
            {sessions.slice(0, 3).map(session => (
              <RecentSessionRow
                key={session.id}
                onCopy={copySessionToDraft}
                onDelete={handleDelete}
                onPublish={handlePublishRoutine}
                onUnpublish={handleUnpublishRoutine}
                session={session}
                showRoutineSharing={followFeatureEnabled}
                theme={theme}
              />
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

      {selectedPlanFlow && (
        <WorkoutPlanFlow
          activeWorkout={activeWorkout}
          elapsedSeconds={elapsedSeconds}
          onClose={() => setSelectedPlanFlowId("")}
          onLogPlan={() => {
            applyWorkoutTemplate(selectedPlanFlow);
            setSelectedPlanFlowId("");
          }}
          onStart={() => startWorkoutFromTemplate(selectedPlanFlow)}
          onStop={stopActiveWorkout}
          template={selectedPlanFlow}
          theme={theme}
        />
      )}

      {showProgress && (
        <ModalShell title="Training Progress" onClose={() => setShowProgress(false)} theme={theme}>
          <TypePicker selectedType={selectedType} onSelect={setSelectedType} theme={theme} />
          <TrainingInsightRow insights={progressInsights} theme={theme} color={activeType.color} />
          <TrainingChart sessions={sessionsForType.slice(0, 12).reverse()} type={selectedType} color={activeType.color} theme={theme} />
          <div style={{ display: "grid", gap: 8 }}>
            {sessionsForType.slice(0, 10).map(session => (
              <RecentSessionRow
                key={session.id}
                onCopy={copySessionToDraft}
                onDelete={handleDelete}
                onPublish={handlePublishRoutine}
                onUnpublish={handleUnpublishRoutine}
                session={session}
                showRoutineSharing={followFeatureEnabled}
                theme={theme}
              />
            ))}
            {!sessionsForType.length && (
              <p style={{ margin: 0, color: theme.textSoft, fontSize: 12 }}>No {activeType.label.toLowerCase()} sessions yet.</p>
            )}
          </div>
        </ModalShell>
      )}

      {activeWorkout && (
        <ActiveWorkoutDock
          elapsedSeconds={elapsedSeconds}
          onFinish={finishActiveWorkout}
          onStop={stopActiveWorkout}
          template={activeWorkoutTemplate || selectedPlan}
          theme={theme}
        />
      )}
    </>
  );
}

function TrainingPlanShowcase({
  activeWorkout,
  elapsedSeconds,
  onLogPlan,
  onOpenPlan,
  onSelectPlan,
  onStart,
  onStop,
  selectedPlan,
  selectedPlanId,
  templates,
  theme,
}) {
  if (!selectedPlan) return null;
  const planStats = buildPlanStats(selectedPlan);
  const activeThisPlan = activeWorkout?.templateId === selectedPlan.id;
  return (
    <div style={{
      marginBottom: 16,
      borderRadius: 18,
      border: `1px solid ${theme.cardBorder}`,
      background: `linear-gradient(145deg, ${theme.cardBgStrong}, ${theme.cardBg})`,
      overflow: "hidden",
    }}>
      <WorkoutTemplateStrip
        onSelect={onSelectPlan}
        selectedTemplateId={selectedPlanId}
        templates={templates}
        theme={theme}
      />
      <div style={{ padding: "0 13px 13px" }}>
        <div
          className="tribe-workout-plan-card-grid"
          style={{
            display: "grid",
            gap: 12,
            alignItems: "stretch",
          }}
        >
          <div style={{
            minWidth: 0,
            padding: 13,
            borderRadius: 15,
            background: theme.cardBg,
            border: `1px solid ${theme.cardBorder}`,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
              <div style={{ minWidth: 0 }}>
                <p style={{ margin: "0 0 5px", color: "#34D399", fontSize: 10, fontWeight: 950, fontFamily: "monospace" }}>
                  NEXT WORKOUT
                </p>
                <h4 style={{ margin: 0, color: theme.text, fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 950, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {selectedPlan.name}
                </h4>
                <p style={{ margin: "5px 0 0", color: theme.textSoft, fontSize: 12, lineHeight: 1.35 }}>
                  {selectedPlan.focus}
                </p>
              </div>
              <span style={{
                flex: "0 0 auto",
                borderRadius: 999,
                background: "rgba(52,211,153,0.16)",
                color: "#34D399",
                fontSize: 10,
                fontWeight: 950,
                fontFamily: "monospace",
                padding: "6px 8px",
              }}>
                {activeThisPlan ? formatElapsed(elapsedSeconds) : `${selectedPlan.minutes} MIN`}
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 7, marginBottom: 11 }}>
              <PlanMetric label="SETS" value={planStats.sets} theme={theme} />
              <PlanMetric label="EXERCISES" value={planStats.exercises} theme={theme} />
              <PlanMetric label="FOCUS" value={planStats.focusCount} theme={theme} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: activeThisPlan ? "1fr auto" : "1fr 1fr", gap: 8 }}>
              {activeThisPlan ? (
                <>
                  <button onClick={onLogPlan} style={primaryButtonStyle("#34D399")}>
                    Open log
                  </button>
                  <button onClick={onStop} style={secondaryButtonStyle(theme)}>
                    Stop
                  </button>
                </>
              ) : (
                <>
                  <button onClick={onStart} style={primaryButtonStyle("#34D399")}>
                    Open workout
                  </button>
                  <button onClick={() => onOpenPlan(selectedPlan.id)} style={secondaryButtonStyle(theme)}>
                    Preview
                  </button>
                </>
              )}
            </div>
          </div>
          <WorkoutPhotoHero compact template={selectedPlan} theme={theme} />
        </div>
      </div>
    </div>
  );
}

function WorkoutTemplateStrip({ onSelect, selectedTemplateId, templates, theme }) {
  return (
    <div style={{ padding: "13px 13px 11px" }}>
      <p style={eyebrowStyle(theme)}>WORKOUT TEMPLATES</p>
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
            onClick={() => onSelect(template.id)}
            className="tribe-workout-template-card"
            style={{
              flex: "0 0 148px",
              textAlign: "left",
              border: `1px solid ${selectedTemplateId === template.id ? "#34D399" : theme.cardBorder}`,
              borderRadius: 14,
              background: selectedTemplateId === template.id ? "rgba(52,211,153,0.13)" : theme.cardBgStrong,
              color: theme.text,
              padding: 12,
              cursor: "pointer",
              boxShadow: selectedTemplateId === template.id ? "0 10px 26px rgba(52,211,153,0.12)" : "none",
            }}
          >
            <div style={{
              height: 76,
              margin: "-4px -4px 9px",
              borderRadius: 11,
              overflow: "hidden",
              border: `1px solid ${theme.cardBorder}`,
            }}>
              <WorkoutPhotoHero bare compact template={template} theme={theme} />
            </div>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 950, fontFamily: "'Syne', sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {template.name}
            </p>
            <p style={{ margin: "4px 0 0", color: selectedTemplateId === template.id ? "#34D399" : "#FF6B35", fontSize: 10, fontFamily: "monospace", fontWeight: 900 }}>
              {template.minutes} MIN · {template.exercises?.length || 0} MOVES
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

function WorkoutPhotoHero({ bare = false, compact = false, template, theme }) {
  const fallback = workoutFallbackGradient(template);
  const backgroundImage = template?.imageUrl
    ? `linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.70)), url("${template.imageUrl}")`
    : fallback;
  return (
    <div
      role="img"
      aria-label={`${template?.name || "Workout"} preview`}
      style={{
        position: "relative",
        minHeight: compact ? "100%" : 260,
        width: "100%",
        height: compact ? "100%" : "auto",
        borderRadius: bare ? 0 : 15,
        background: fallback,
        backgroundImage,
        backgroundSize: "cover",
        backgroundPosition: template?.imagePosition || "center",
        border: bare ? "none" : `1px solid ${theme.cardBorder}`,
        overflow: "hidden",
      }}
    >
      {!bare && (
        <div style={{
          position: "absolute",
          inset: "auto 10px 10px",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 10,
        }}>
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: 0, color: "white", fontSize: compact ? 12 : 22, fontWeight: 950, fontFamily: "'Syne', sans-serif", textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}>
              {template?.name}
            </p>
            {!compact && (
              <p style={{ margin: "5px 0 0", color: "rgba(255,255,255,0.82)", fontSize: 12, fontWeight: 800 }}>
                {template?.focus}
              </p>
            )}
          </div>
          <span style={{
            flex: "0 0 auto",
            borderRadius: 999,
            background: "rgba(255,255,255,0.92)",
            color: "#111",
            fontSize: 10,
            fontFamily: "monospace",
            fontWeight: 950,
            padding: "6px 8px",
          }}>
            {template?.minutes} MIN
          </span>
        </div>
      )}
    </div>
  );
}

function workoutFallbackGradient(template) {
  const muscles = inferTemplateMuscles(template);
  const first = muscles[0] || "core";
  const second = muscles[1] || "shoulders";
  return `linear-gradient(145deg, ${muscleColor(first)}66, ${muscleColor(second)}33 45%, rgba(10,10,10,0.36))`;
}

function WorkoutPlanFlow({ activeWorkout, elapsedSeconds, onClose, onLogPlan, onStart, onStop, template, theme }) {
  const stats = buildPlanStats(template);
  const activeThisPlan = activeWorkout?.templateId === template.id;
  return (
    <ModalShell title={template.name} onClose={onClose} theme={theme}>
      <div style={{ display: "grid", gap: 14 }}>
        <WorkoutPhotoHero template={template} theme={theme} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          <PlanMetric label="SETS" value={stats.sets} theme={theme} />
          <PlanMetric label="EXERCISES" value={stats.exercises} theme={theme} />
          <PlanMetric label="FOCUS" value={stats.focusCount} theme={theme} />
        </div>
        <div style={{
          padding: 12,
          borderRadius: 14,
          background: theme.cardBgStrong,
          border: `1px solid ${theme.cardBorder}`,
        }}>
          <p style={{ margin: "0 0 5px", color: theme.text, fontSize: 14, fontWeight: 950, fontFamily: "'Syne', sans-serif" }}>
            {template.summary}
          </p>
          <p style={{ margin: 0, color: theme.textSoft, fontSize: 12, lineHeight: 1.4 }}>
            Review the plan, then start the timer or open the log to adjust sets, reps, and weight for today.
          </p>
        </div>
        <WorkoutMuscleMap template={template} theme={theme} />
        <ExercisePreviewList exercises={template.exercises || []} theme={theme} />
        <TemplateGuidance template={template} theme={theme} />
        <div style={{ display: "grid", gridTemplateColumns: activeThisPlan ? "1fr auto" : "1fr 1fr", gap: 9, position: "sticky", bottom: 0, paddingTop: 4, background: theme.bg }}>
          {activeThisPlan ? (
            <>
              <button onClick={onLogPlan} style={primaryButtonStyle("#34D399")}>
                Open log · {formatElapsed(elapsedSeconds)}
              </button>
              <button onClick={onStop} style={secondaryButtonStyle(theme)}>
                Stop
              </button>
            </>
          ) : (
            <>
              <button onClick={onStart} style={primaryButtonStyle("#34D399")}>
                Start workout
              </button>
              <button onClick={onLogPlan} style={secondaryButtonStyle(theme)}>
                Log/edit sets
              </button>
            </>
          )}
        </div>
      </div>
    </ModalShell>
  );
}

function WorkoutMuscleMap({ template, theme }) {
  const muscles = inferTemplateMuscles(template);
  const active = (name) => muscles.includes(name);
  return (
    <div style={{
      minHeight: 214,
      borderRadius: 15,
      background: "linear-gradient(180deg, rgba(10,10,10,0.16), rgba(52,211,153,0.08))",
      border: `1px solid ${theme.cardBorder}`,
      display: "grid",
      placeItems: "center",
      padding: 9,
      overflow: "hidden",
    }}>
      <svg viewBox="0 0 132 206" role="img" aria-label={`${template.name} muscle targets`} style={{ width: "100%", height: "100%", minHeight: 190 }}>
        <defs>
          <filter id={`glow-${template.id}`} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <BodySilhouette x={18} baseFill={theme.cardBgStrong} baseStroke={theme.cardBorder} />
        <BodySilhouette x={72} baseFill={theme.cardBgStrong} baseStroke={theme.cardBorder} />
        <MuscleShape active={active("shoulders")} d="M34 48 C27 50 24 58 26 65 L45 65 C46 57 43 50 34 48 Z" />
        <MuscleShape active={active("chest")} d="M34 61 C28 62 27 70 28 78 C32 81 38 81 42 78 C43 70 41 62 34 61 Z" />
        <MuscleShape active={active("core")} d="M34 80 C29 84 29 98 34 104 C39 98 39 84 34 80 Z" />
        <MuscleShape active={active("biceps")} d="M21 69 C16 78 15 91 18 99 C23 91 25 80 24 70 Z" />
        <MuscleShape active={active("triceps")} d="M47 69 C45 80 47 91 51 99 C55 90 53 78 48 69 Z" />
        <MuscleShape active={active("quads")} d="M29 109 C24 123 24 141 29 153 C34 142 34 124 32 110 Z" />
        <MuscleShape active={active("quads")} d="M39 109 C36 124 36 142 41 153 C46 141 46 123 40 109 Z" />
        <MuscleShape active={active("calves")} d="M28 153 C24 164 24 177 29 187 C33 176 33 164 31 153 Z" />
        <MuscleShape active={active("calves")} d="M40 153 C37 164 37 176 42 187 C46 177 45 164 41 153 Z" />
        <MuscleShape active={active("back")} d="M88 56 C81 63 81 85 88 96 C95 86 95 64 88 56 Z" />
        <MuscleShape active={active("back")} d="M88 48 C79 50 76 58 77 68 L99 68 C100 58 97 50 88 48 Z" />
        <MuscleShape active={active("hamstrings")} d="M83 111 C79 125 79 144 84 155 C89 143 89 126 86 111 Z" />
        <MuscleShape active={active("hamstrings")} d="M93 111 C90 126 90 143 95 155 C100 144 99 125 94 111 Z" />
        <MuscleShape active={active("glutes")} d="M88 99 C80 100 78 108 81 115 C85 118 92 118 96 115 C99 108 96 100 88 99 Z" />
        <text x="34" y="200" fill={theme.mutedStrong} fontSize="8" fontFamily="monospace" fontWeight="900" textAnchor="middle">FRONT</text>
        <text x="88" y="200" fill={theme.mutedStrong} fontSize="8" fontFamily="monospace" fontWeight="900" textAnchor="middle">BACK</text>
      </svg>
    </div>
  );
}

function BodySilhouette({ baseFill, baseStroke, x }) {
  return (
    <g transform={`translate(${x}, 0)`} fill={baseFill} stroke={baseStroke} strokeWidth="1.2" opacity="0.94">
      <circle cx="16" cy="27" r="9" />
      <path d="M16 38 C7 45 5 69 9 91 L12 108 L20 108 L23 91 C27 69 25 45 16 38 Z" />
      <path d="M8 58 C-2 70 -3 92 1 114 L7 112 C5 95 7 79 13 68 Z" />
      <path d="M24 58 C34 70 35 92 31 114 L25 112 C27 95 25 79 19 68 Z" />
      <path d="M12 107 C6 128 6 160 10 187 L16 187 L17 110 Z" />
      <path d="M20 107 C26 128 26 160 22 187 L16 187 L15 110 Z" />
    </g>
  );
}

function MuscleShape({ active, d }) {
  if (!active) return null;
  return (
    <path
      className="tribe-muscle-highlight"
      d={d}
      fill="#38BDF8"
      opacity="0.9"
    />
  );
}

function ExercisePreviewList({ exercises, theme }) {
  const visibleExercises = exercises.slice(0, 5);
  return (
    <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
      {visibleExercises.map((exercise, index) => (
        <div key={`${exercise.name}_${index}`} className="tribe-exercise-preview-card" style={{
          display: "grid",
          gridTemplateColumns: "54px minmax(0, 1fr) auto",
          gap: 10,
          alignItems: "center",
          minHeight: 70,
          padding: 9,
          borderRadius: 14,
          background: theme.cardBg,
          border: `1px solid ${theme.cardBorder}`,
        }}>
          <ExerciseThumbnail exercise={exercise} />
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: 0, color: theme.text, fontSize: 13, fontWeight: 900, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {exercise.name}
            </p>
            <p style={{ margin: "4px 0 0", color: theme.textSoft, fontSize: 11, lineHeight: 1.25, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {exercise.focus || inferExerciseFocus(exercise)}
            </p>
          </div>
          <span style={{
            color: "#38BDF8",
            fontSize: 10,
            fontFamily: "monospace",
            fontWeight: 950,
            whiteSpace: "nowrap",
          }}>
            {exerciseTargetText(exercise)}
          </span>
        </div>
      ))}
    </div>
  );
}

function ExerciseThumbnail({ exercise }) {
  const muscles = inferExerciseMuscles(exercise);
  const primary = muscles[0] || "core";
  const color = muscleColor(primary);
  return (
    <div style={{
      width: 54,
      height: 54,
      borderRadius: 13,
      display: "grid",
      placeItems: "center",
      background: `linear-gradient(145deg, ${color}26, rgba(255,255,255,0.08))`,
      border: `1px solid ${color}66`,
      overflow: "hidden",
    }}>
      <svg viewBox="0 0 54 54" aria-hidden="true" style={{ width: 54, height: 54 }}>
        <rect x="5" y="38" width="44" height="5" rx="2.5" fill="rgba(255,255,255,0.2)" />
        <path d="M13 35 L24 24 L33 34" fill="none" stroke="rgba(255,255,255,0.44)" strokeWidth="4" strokeLinecap="round" />
        <circle cx="25" cy="17" r="5" fill="rgba(255,255,255,0.72)" />
        <path className="tribe-exercise-pulse" d="M17 24 C22 19 31 19 37 24 L34 34 L20 34 Z" fill={color} />
        <path d="M9 15 H17 M37 15 H45 M13 11 V19 M41 11 V19" stroke="rgba(255,255,255,0.5)" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function PlanMetric({ label, value, theme }) {
  return (
    <div style={{
      borderRadius: 11,
      background: theme.cardBgStrong,
      border: `1px solid ${theme.cardBorder}`,
      padding: "8px 7px",
      minWidth: 0,
    }}>
      <p style={{ margin: 0, color: theme.text, fontSize: 14, fontWeight: 950, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{value}</p>
      <p style={{ margin: "2px 0 0", color: theme.mutedStrong, fontSize: 8, fontFamily: "monospace", fontWeight: 900 }}>{label}</p>
    </div>
  );
}

function ActiveWorkoutDock({ elapsedSeconds, onFinish, onStop, template, theme }) {
  return (
    <div style={{
      position: "fixed",
      left: "50%",
      bottom: "96px",
      transform: "translateX(-50%)",
      zIndex: 45,
      width: "min(392px, calc(100% - 32px))",
      borderRadius: 18,
      border: "1px solid rgba(52,211,153,0.34)",
      background: theme.navBg || theme.cardBgStrong,
      boxShadow: "0 18px 50px rgba(0,0,0,0.32)",
      backdropFilter: "blur(18px)",
      padding: 10,
      display: "grid",
      gridTemplateColumns: "minmax(0, 1fr) auto auto",
      gap: 8,
      alignItems: "center",
    }}>
      <div style={{ minWidth: 0 }}>
        <p style={{ margin: 0, color: "#34D399", fontSize: 10, fontFamily: "monospace", fontWeight: 950 }}>
          ACTIVE {formatElapsed(elapsedSeconds)}
        </p>
        <p style={{ margin: "2px 0 0", color: theme.text, fontSize: 13, fontWeight: 950, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {template?.name || "Workout"}
        </p>
      </div>
      <button onClick={onFinish} style={{ ...primaryButtonStyle("#34D399"), padding: "10px 12px", whiteSpace: "nowrap" }}>
        Finish
      </button>
      <button onClick={onStop} style={{ ...secondaryButtonStyle(theme), padding: "10px 11px" }}>
        End
      </button>
    </div>
  );
}

function TrainingJournalAnimationStyles() {
  return (
    <style>{`
      @keyframes tribeMusclePulse {
        0%, 100% { opacity: 0.62; transform: scale(0.98); transform-origin: center; }
        50% { opacity: 1; transform: scale(1.035); transform-origin: center; }
      }
      @keyframes tribeExercisePulse {
        0%, 100% { opacity: 0.72; }
        50% { opacity: 1; }
      }
      .tribe-muscle-highlight {
        animation: tribeMusclePulse 1.9s ease-in-out infinite;
        filter: drop-shadow(0 0 5px rgba(56, 189, 248, 0.64));
      }
      .tribe-exercise-pulse {
        animation: tribeExercisePulse 1.7s ease-in-out infinite;
      }
      .tribe-workout-template-card,
      .tribe-exercise-preview-card {
        transition: transform 160ms ease, border-color 160ms ease, box-shadow 160ms ease;
      }
      .tribe-workout-plan-card-grid {
        grid-template-columns: minmax(0, 1fr) 148px;
      }
      .tribe-workout-template-card:hover,
      .tribe-exercise-preview-card:hover {
        transform: translateY(-1px);
      }
      @media (max-width: 430px) {
        .tribe-workout-plan-card-grid {
          grid-template-columns: minmax(0, 1fr);
        }
        .tribe-workout-plan-card-grid > [role="img"] {
          min-height: 168px !important;
        }
      }
      @media (max-width: 380px) {
        .tribe-exercise-preview-card {
          grid-template-columns: 48px minmax(0, 1fr);
        }
        .tribe-exercise-preview-card > span {
          grid-column: 2;
        }
      }
    `}</style>
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
          {!!template.exercises?.length && (
            <div style={{ display: "grid", gap: 7, marginTop: 10 }}>
              {template.exercises.map(exercise => (
                <div key={exercise.name} style={{ padding: "8px 9px", borderRadius: 10, background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
                  <p style={{ margin: 0, color: theme.text, fontSize: 11, fontWeight: 900 }}>{exercise.name}</p>
                  <p style={{ margin: "3px 0 0", color: theme.textSoft, fontSize: 10, lineHeight: 1.3 }}>
                    {exerciseTargetText(exercise)}
                    {exercise.focus ? ` · ${exercise.focus}` : ""}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function exerciseTargetText(exercise) {
  const setLabel = exercise.setRange || exercise.sets;
  const repLabel = exercise.repRange || exercise.reps;
  return `${setLabel} sets x ${repLabel} reps`;
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
          {(exercise.setRange || exercise.repRange || exercise.focus || exercise.tip) && (
            <div style={{ margin: "-2px 0 10px", display: "grid", gap: 4 }}>
              {(exercise.setRange || exercise.repRange || exercise.focus) && (
                <p style={{ margin: 0, color: theme.textSoft, fontSize: 11, lineHeight: 1.35 }}>
                  Target: {exercise.setRange ? `${exercise.setRange} sets` : "sets as needed"}
                  {exercise.repRange ? ` x ${exercise.repRange} reps` : ""}
                  {exercise.focus ? ` · ${exercise.focus}` : ""}
                </p>
              )}
              {exercise.tip && (
                <p style={{ margin: 0, color: theme.mutedStrong, fontSize: 10, lineHeight: 1.35 }}>
                  Tip: {exercise.tip}
                </p>
              )}
            </div>
          )}

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

function RecentSessionRow({
  onCopy,
  onDelete,
  onPublish,
  onUnpublish,
  session,
  showRoutineSharing = false,
  theme,
}) {
  const isShared = session.routineVisibility && session.routineVisibility !== ROUTINE_VISIBILITY.PRIVATE;
  const sharedLabel = session.routineVisibility === ROUTINE_VISIBILITY.FOLLOWERS ? "Followers" : "Public";
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
      <div style={{ display: "flex", gap: 6, alignItems: "center", justifyContent: "flex-end", flexWrap: "wrap" }}>
        {showRoutineSharing && (
          <button
            onClick={() => isShared ? onUnpublish(session) : onPublish(session)}
            style={isShared ? tinyButtonStyle(theme) : shareButtonStyle(theme)}
          >
            {isShared ? sharedLabel : "Share"}
          </button>
        )}
        <button onClick={() => onCopy(session)} style={tinyButtonStyle(theme)}>Copy</button>
        <button onClick={() => onDelete(session.id)} style={iconButtonStyle(theme)}>×</button>
      </div>
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
    routineVisibility: ROUTINE_VISIBILITY.PRIVATE,
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

function buildPlanStats(template) {
  const exercises = template?.exercises || [];
  const sets = exercises.reduce((sum, exercise) => sum + (Number(exercise.sets) || 0), 0);
  return {
    exercises: String(exercises.length),
    sets: String(sets),
    focusCount: String(inferTemplateMuscles(template).length),
  };
}

function inferTemplateMuscles(template) {
  const text = [
    template?.name,
    template?.focus,
    ...(template?.exercises || []).flatMap(exercise => [exercise.name, exercise.focus, exercise.tip]),
  ].join(" ").toLowerCase();
  const muscles = [];
  const add = (key, patterns) => {
    if (patterns.some(pattern => text.includes(pattern))) muscles.push(key);
  };
  add("chest", ["chest", "bench", "press", "fly", "push-up"]);
  add("shoulders", ["shoulder", "delt", "lateral", "overhead"]);
  add("triceps", ["tricep", "pushdown", "extension"]);
  add("back", ["back", "lat", "row", "pull", "rear delt"]);
  add("biceps", ["bicep", "curl"]);
  add("quads", ["quad", "squat", "leg press", "leg extension", "goblet"]);
  add("hamstrings", ["hamstring", "deadlift", "hinge", "romanian"]);
  add("glutes", ["glute", "hip", "squat", "leg press"]);
  add("calves", ["calf"]);
  add("core", ["core", "plank"]);
  return [...new Set(muscles.length ? muscles : ["core"])];
}

function inferExerciseMuscles(exercise) {
  return inferTemplateMuscles({
    name: exercise?.name,
    focus: exercise?.focus,
    exercises: [exercise],
  });
}

function inferExerciseFocus(exercise) {
  const labels = {
    back: "Back",
    biceps: "Biceps",
    calves: "Calves",
    chest: "Chest",
    core: "Core",
    glutes: "Glutes",
    hamstrings: "Hamstrings",
    quads: "Quads",
    shoulders: "Shoulders",
    triceps: "Triceps",
  };
  return inferExerciseMuscles(exercise).map(muscle => labels[muscle] || muscle).join(", ");
}

function muscleColor(muscle) {
  const colors = {
    back: "#38BDF8",
    biceps: "#A78BFA",
    calves: "#34D399",
    chest: "#FF6B35",
    core: "#F59E0B",
    glutes: "#F472B6",
    hamstrings: "#60A5FA",
    quads: "#FFD700",
    shoulders: "#22D3EE",
    triceps: "#FB7185",
  };
  return colors[muscle] || "#38BDF8";
}

function formatElapsed(seconds) {
  const safeSeconds = Math.max(0, Number(seconds) || 0);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const secs = safeSeconds % 60;
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  return `${minutes}:${String(secs).padStart(2, "0")}`;
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

function shareButtonStyle(theme) {
  return {
    border: "none",
    background: "linear-gradient(135deg, #FF6B35, #FFD700)",
    color: "#111",
    borderRadius: 999,
    padding: "7px 9px",
    fontSize: 11,
    fontWeight: 900,
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
