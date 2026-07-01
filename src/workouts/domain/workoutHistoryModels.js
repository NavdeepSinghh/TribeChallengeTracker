function cleanString(value, fallback = "") {
  return String(value || fallback).trim();
}

function cleanNumber(value, fallback = 0) {
  const next = Number(value);
  return Number.isFinite(next) && next >= 0 ? next : fallback;
}

function readTimestamp(value) {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate().toISOString();
  if (typeof value === "string") return value;
  return null;
}

function cleanList(value) {
  return Array.isArray(value)
    ? value.map(item => cleanString(item)).filter(Boolean)
    : [];
}

export function mapWorkoutSet(data = {}, index = 0) {
  return {
    setNumber: cleanNumber(data.setNumber, index + 1),
    reps: cleanNumber(data.reps),
    weightKg: cleanNumber(data.weightKg ?? data.weight),
    completedAt: readTimestamp(data.completedAt) || cleanString(data.completedAt),
  };
}

export function mapWorkoutExercise(data = {}, index = 0) {
  const sets = Array.isArray(data.sets) ? data.sets.map(mapWorkoutSet).filter(set => set.reps > 0) : [];
  return {
    exerciseId: cleanString(data.exerciseId || data.id || `exercise_${index + 1}`),
    name: cleanString(data.nameSnapshot || data.name, "Exercise"),
    order: cleanNumber(data.order, index),
    primaryMuscles: cleanList(data.primaryMusclesSnapshot || data.primaryMuscles),
    assetHashSnapshot: cleanString(data.assetHashSnapshot) || null,
    sets,
    bestWeightKg: sets.reduce((max, set) => Math.max(max, set.weightKg), 0),
    volumeKg: sets.reduce((sum, set) => sum + set.reps * set.weightKg, 0),
  };
}

export function mapWorkoutSessionDocument(id, data = {}) {
  const exercises = Array.isArray(data.exercises) ? data.exercises.map(mapWorkoutExercise) : [];
  const completedAt = readTimestamp(data.completedAt) || cleanString(data.completedAt);
  const updatedAt = readTimestamp(data.updatedAt);
  return {
    id: cleanString(data.id || id),
    name: cleanString(data.name || data.planName, "Guided workout"),
    source: cleanString(data.source, "manual"),
    type: cleanString(data.type, "gym"),
    status: cleanString(data.status, "completed"),
    dateStr: cleanString(data.dateStr),
    startedAt: readTimestamp(data.startedAt) || cleanString(data.startedAt),
    completedAt,
    updatedAt,
    durationSeconds: cleanNumber(data.durationSeconds, cleanNumber(data.durationMinutes) * 60),
    durationMinutes: cleanNumber(data.durationMinutes, Math.round(cleanNumber(data.durationSeconds) / 60)),
    points: cleanNumber(data.points),
    totalVolumeKg: cleanNumber(data.totalVolumeKg),
    exerciseCount: cleanNumber(data.exerciseCount, exercises.length),
    activityLogId: cleanString(data.activityLogId) || null,
    feedId: cleanString(data.feedId) || null,
    publicWorkoutId: cleanString(data.publicWorkoutId) || null,
    routineVisibility: cleanString(data.routineVisibility, "private"),
    exercises,
  };
}

export function mapExercisePrDocument(id, data = {}) {
  return {
    exerciseId: cleanString(data.exerciseId || id),
    bestWeightKg: cleanNumber(data.bestWeightKg),
    bestVolumeKg: cleanNumber(data.bestVolumeKg),
    bestEstimatedOneRepMaxKg: cleanNumber(data.bestEstimatedOneRepMaxKg),
    repRangePRs: data.repRangePRs && typeof data.repRangePRs === "object" ? data.repRangePRs : {},
    updatedFromSessionId: cleanString(data.updatedFromSessionId) || null,
    updatedAt: readTimestamp(data.updatedAt),
  };
}

export function summarizeWorkoutHistory(sessions = [], prs = []) {
  const completed = sessions.filter(session => session.status === "completed");
  const totalVolumeKg = completed.reduce((sum, session) => sum + cleanNumber(session.totalVolumeKg), 0);
  const totalDurationSeconds = completed.reduce((sum, session) => sum + cleanNumber(session.durationSeconds), 0);
  const mirroredToFeed = completed.filter(session => Boolean(session.feedId)).length;
  return {
    sessionCount: completed.length,
    totalVolumeKg,
    totalDurationSeconds,
    totalDurationMinutes: Math.round(totalDurationSeconds / 60),
    personalRecordCount: prs.length,
    mirroredToFeed,
  };
}

export function buildVolumeTrend(sessions = [], limit = 6) {
  return [...sessions]
    .filter(session => session.status === "completed")
    .sort((left, right) => cleanString(left.dateStr).localeCompare(cleanString(right.dateStr)))
    .slice(-limit)
    .map(session => ({
      id: session.id,
      label: session.dateStr?.slice(5) || "Today",
      volumeKg: cleanNumber(session.totalVolumeKg),
    }));
}
