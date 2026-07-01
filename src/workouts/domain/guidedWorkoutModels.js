const REST_SECONDS_DEFAULT = 60;
const DEFAULT_SET_COUNT = 3;

export function guidedWorkoutSessionId(now = Date.now()) {
  return `guided_${now}_${Math.random().toString(16).slice(2, 10)}`;
}

export function todayDateString(date = new Date()) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function cleanNumber(value, fallback = 0) {
  const next = Number(value);
  return Number.isFinite(next) && next >= 0 ? next : fallback;
}

export function createGuidedSetDraft(index = 0, previous = {}) {
  return {
    setNumber: index + 1,
    reps: String(previous.reps ?? 10),
    weightKg: String(previous.weightKg ?? ""),
    completedAt: previous.completedAt || "",
    restSeconds: Number.isFinite(Number(previous.restSeconds)) ? Number(previous.restSeconds) : REST_SECONDS_DEFAULT,
  };
}

export function createGuidedExerciseDraft(exercise, index = 0, previousSets = []) {
  return {
    exerciseId: exercise.id,
    nameSnapshot: exercise.name,
    order: index,
    primaryMusclesSnapshot: exercise.primaryMuscles || [],
    assetHashSnapshot: exercise.assetManifest?.assetHash || null,
    sets: Array.from({ length: DEFAULT_SET_COUNT }, (_, setIndex) => (
      createGuidedSetDraft(setIndex, previousSets[setIndex])
    )),
  };
}

export function createGuidedWorkoutSession({ exercises, name = "Guided workout", now = Date.now() }) {
  return {
    id: guidedWorkoutSessionId(now),
    name,
    type: "gym",
    source: "guided",
    dateStr: todayDateString(new Date(now)),
    startedAt: new Date(now).toISOString(),
    completedAt: "",
    status: "active",
    activeExerciseIndex: 0,
    activeSetIndex: 0,
    restRemainingSeconds: 0,
    exercises: exercises.map(createGuidedExerciseDraft),
  };
}

export function completedSetCount(session) {
  return (session?.exercises || []).reduce((sum, exercise) => (
    sum + (exercise.sets || []).filter(set => Boolean(set.completedAt)).length
  ), 0);
}

export function totalSetCount(session) {
  return (session?.exercises || []).reduce((sum, exercise) => sum + (exercise.sets || []).length, 0);
}

export function totalVolumeKg(session) {
  return (session?.exercises || []).reduce((sum, exercise) => (
    sum + (exercise.sets || []).reduce((setSum, set) => (
      set.completedAt ? setSum + (cleanNumber(set.reps) * cleanNumber(set.weightKg)) : setSum
    ), 0)
  ), 0);
}

export function durationSeconds(session, now = Date.now()) {
  const started = Date.parse(session?.startedAt || "");
  if (!Number.isFinite(started)) return 0;
  return Math.max(0, Math.floor((now - started) / 1000));
}

export function isWorkoutSessionComplete(session) {
  const total = totalSetCount(session);
  return total > 0 && completedSetCount(session) >= total;
}

export function updateGuidedSet(session, exerciseIndex, setIndex, patch) {
  return {
    ...session,
    exercises: session.exercises.map((exercise, currentExerciseIndex) => (
      currentExerciseIndex !== exerciseIndex
        ? exercise
        : {
            ...exercise,
            sets: exercise.sets.map((set, currentSetIndex) => (
              currentSetIndex === setIndex ? { ...set, ...patch } : set
            )),
          }
    )),
  };
}

export function completeCurrentSet(session, now = Date.now()) {
  const exerciseIndex = session.activeExerciseIndex || 0;
  const setIndex = session.activeSetIndex || 0;
  const exercise = session.exercises[exerciseIndex];
  const set = exercise?.sets?.[setIndex];
  if (!exercise || !set) return session;

  const completed = updateGuidedSet(session, exerciseIndex, setIndex, {
    completedAt: new Date(now).toISOString(),
  });
  const nextSetIndex = setIndex + 1;
  const hasNextSet = nextSetIndex < exercise.sets.length;
  const hasNextExercise = exerciseIndex + 1 < session.exercises.length;

  return {
    ...completed,
    activeExerciseIndex: hasNextSet ? exerciseIndex : hasNextExercise ? exerciseIndex + 1 : exerciseIndex,
    activeSetIndex: hasNextSet ? nextSetIndex : 0,
    restRemainingSeconds: isWorkoutSessionComplete(completed) ? 0 : REST_SECONDS_DEFAULT,
  };
}

export function tickRestTimer(session) {
  return {
    ...session,
    restRemainingSeconds: Math.max(0, Number(session.restRemainingSeconds || 0) - 1),
  };
}

export function buildFinalGuidedWorkoutPayload(session, { shareVisibility = "private", now = Date.now() } = {}) {
  const completedAt = session.completedAt || new Date(now).toISOString();
  const finalSession = {
    id: session.id,
    name: session.name || "Guided workout",
    type: session.type || "gym",
    source: "guided",
    dateStr: session.dateStr || todayDateString(new Date(now)),
    startedAt: session.startedAt || null,
    completedAt,
    durationSeconds: durationSeconds(session, now),
    totalVolumeKg: totalVolumeKg(session),
    points: Math.max(40, Math.round(durationSeconds(session, now) / 60) * 2),
    exercises: session.exercises.map((exercise, exerciseIndex) => ({
      exerciseId: exercise.exerciseId,
      nameSnapshot: exercise.nameSnapshot,
      order: exercise.order ?? exerciseIndex,
      primaryMusclesSnapshot: exercise.primaryMusclesSnapshot || [],
      assetHashSnapshot: exercise.assetHashSnapshot || null,
      sets: (exercise.sets || [])
        .filter(set => Boolean(set.completedAt))
        .map((set, setIndex) => ({
          setNumber: set.setNumber || setIndex + 1,
          reps: cleanNumber(set.reps),
          weightKg: cleanNumber(set.weightKg),
          restSeconds: cleanNumber(set.restSeconds, REST_SECONDS_DEFAULT),
          completedAt: set.completedAt,
        })),
    })).filter(exercise => exercise.sets.length > 0),
  };

  return {
    sessionId: session.id,
    shareVisibility,
    finalSession,
  };
}

export function guidedWorkoutSummary(session, now = Date.now()) {
  return {
    completedSets: completedSetCount(session),
    totalSets: totalSetCount(session),
    durationSeconds: durationSeconds(session, now),
    totalVolumeKg: totalVolumeKg(session),
    exerciseCount: session?.exercises?.length || 0,
  };
}
