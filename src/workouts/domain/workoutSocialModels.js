function cleanString(value, fallback = "") {
  return String(value || fallback).trim();
}

function cleanNumber(value, fallback = 0) {
  const next = Number(value);
  return Number.isFinite(next) && next >= 0 ? next : fallback;
}

function timestampToIso(value) {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate().toISOString();
  if (typeof value === "string") return value;
  return null;
}

function cleanExercises(value) {
  return Array.isArray(value)
    ? value.slice(0, 20).map((exercise, index) => ({
        exerciseId: cleanString(exercise.exerciseId || exercise.id || `exercise_${index + 1}`),
        name: cleanString(exercise.name || exercise.nameSnapshot, "Exercise"),
        primaryMuscles: Array.isArray(exercise.primaryMuscles) ? exercise.primaryMuscles.map(cleanString).filter(Boolean) : [],
        setCount: cleanNumber(exercise.setCount),
        repSummary: cleanString(exercise.repSummary),
        bestWeightKg: cleanNumber(exercise.bestWeightKg),
      }))
    : [];
}

export function mapPublicWorkoutDocument(id, data = {}) {
  const exercises = cleanExercises(data.exercises);
  return {
    id: cleanString(data.id || data.publicWorkoutId || id),
    publicWorkoutId: cleanString(data.publicWorkoutId || id),
    ownerUid: cleanString(data.ownerUid),
    ownerDisplayName: cleanString(data.ownerDisplayName, "Tribe member"),
    ownerAvatarEmoji: cleanString(data.ownerAvatarEmoji, "💪"),
    ownerAvatarColor: cleanString(data.ownerAvatarColor, "#FF6B35"),
    visibility: cleanString(data.visibility, "public"),
    sourceSessionId: cleanString(data.sourceSessionId),
    name: cleanString(data.name, "Shared workout"),
    dateStr: cleanString(data.dateStr),
    summary: cleanString(data.summary),
    exercises,
    exerciseCount: cleanNumber(data.exerciseCount, exercises.length),
    totalVolumeKg: cleanNumber(data.totalVolumeKg),
    durationSeconds: cleanNumber(data.durationSeconds),
    copiedCount: cleanNumber(data.copiedCount),
    publishedAt: timestampToIso(data.publishedAt),
    updatedAt: timestampToIso(data.updatedAt),
  };
}

export function sortPublicWorkouts(workouts = []) {
  return [...workouts].sort((left, right) => {
    const published = cleanString(right.publishedAt).localeCompare(cleanString(left.publishedAt));
    if (published) return published;
    return cleanString(right.dateStr).localeCompare(cleanString(left.dateStr));
  });
}

export function publicWorkoutSummary(workout = {}) {
  if (workout.summary) return workout.summary;
  const exerciseText = workout.exerciseCount === 1 ? "1 exercise" : `${workout.exerciseCount || 0} exercises`;
  const minutes = Math.round((workout.durationSeconds || 0) / 60);
  return `${exerciseText}${minutes > 0 ? ` · ${minutes} min` : ""}`;
}
