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

function titleCase(value = "") {
  return cleanString(value)
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, letter => letter.toUpperCase());
}

function sessionExerciseEntries(sessions = []) {
  return sessions
    .filter(session => session.status === "completed")
    .flatMap(session => (Array.isArray(session.exercises) ? session.exercises : [])
      .map(exercise => ({
        exerciseId: cleanString(exercise.exerciseId || exercise.id),
        name: cleanString(exercise.name || exercise.nameSnapshot, "Exercise"),
        dateStr: session.dateStr || session.completedAt || "",
        volumeKg: cleanNumber(exercise.volumeKg),
      }))
      .filter(exercise => exercise.exerciseId));
}

export function mapWorkoutProgressionSuggestionDocument(id, data = {}) {
  return {
    exerciseId: cleanString(data.exerciseId || id),
    status: cleanString(data.status, "insufficient_data"),
    level: cleanString(data.level, "beginner"),
    observedSessions: cleanNumber(data.observedSessions),
    observedTrainingWeeks: cleanNumber(data.observedTrainingWeeks),
    minimumSessions: cleanNumber(data.minimumSessions, 4),
    minimumTrainingWeeks: cleanNumber(data.minimumTrainingWeeks, 2),
    latestBestSet: {
      reps: cleanNumber(data.latestBestSet?.reps),
      weightKg: cleanNumber(data.latestBestSet?.weightKg),
    },
    previousBestSet: {
      reps: cleanNumber(data.previousBestSet?.reps),
      weightKg: cleanNumber(data.previousBestSet?.weightKg),
    },
    suggestion: data.suggestion ? {
      targetReps: cleanNumber(data.suggestion.targetReps),
      targetWeightKg: cleanNumber(data.suggestion.targetWeightKg),
      type: cleanString(data.suggestion.type, "reps"),
    } : null,
    explanation: cleanString(data.explanation, "Keep logging this lift so TribeLog can suggest the next step."),
    updatedAt: readTimestamp(data.updatedAt),
  };
}

export function mapWorkoutInsightAggregateDocument(id, data = {}) {
  const muscles = Object.values(data.muscles || {})
    .map(muscle => ({
      muscle: cleanString(muscle.muscle, "general").toLowerCase().replace(/\s+/g, "_"),
      label: titleCase(muscle.muscle || "general"),
      volumeKg: cleanNumber(muscle.volumeKg),
      setCount: cleanNumber(muscle.setCount),
      exerciseIds: Array.isArray(muscle.exerciseIds)
        ? muscle.exerciseIds.map(exerciseId => cleanString(exerciseId)).filter(Boolean)
        : [],
    }))
    .sort((left, right) => right.volumeKg - left.volumeKg);

  return {
    id: cleanString(data.id || id),
    periodType: cleanString(data.periodType, "week"),
    periodKey: cleanString(data.periodKey, "This week"),
    metricVersion: cleanNumber(data.metricVersion, 1),
    sessionCount: cleanNumber(data.sessionCount),
    setCount: cleanNumber(data.setCount),
    exerciseCount: cleanNumber(data.exerciseCount),
    totalVolumeKg: cleanNumber(data.totalVolumeKg),
    minimumSessionCount: cleanNumber(data.minimumSessionCount, 3),
    insufficientData: data.insufficientData === true,
    muscles,
    updatedAt: readTimestamp(data.updatedAt),
  };
}

export function selectProgressionExerciseCandidate(sessions = [], suggestions = []) {
  const suggestedReady = suggestions.find(suggestion => suggestion.status === "ready");
  if (suggestedReady?.exerciseId) {
    const matchedExercise = sessionExerciseEntries(sessions).find(entry => entry.exerciseId === suggestedReady.exerciseId);
    return {
      exerciseId: suggestedReady.exerciseId,
      name: matchedExercise?.name || titleCase(suggestedReady.exerciseId),
      reason: "Existing progression signal is ready.",
    };
  }

  const entries = sessionExerciseEntries(sessions);
  const scores = entries.reduce((acc, entry) => {
    const current = acc[entry.exerciseId] || {
      exerciseId: entry.exerciseId,
      name: entry.name,
      latestDateStr: "",
      sessionCount: 0,
      totalVolumeKg: 0,
    };
    current.sessionCount += 1;
    current.totalVolumeKg += entry.volumeKg;
    if (String(entry.dateStr).localeCompare(String(current.latestDateStr)) > 0) {
      current.latestDateStr = entry.dateStr;
      current.name = entry.name;
    }
    acc[entry.exerciseId] = current;
    return acc;
  }, {});

  const ranked = Object.values(scores).sort((left, right) => (
    right.sessionCount - left.sessionCount
    || String(right.latestDateStr).localeCompare(String(left.latestDateStr))
    || right.totalVolumeKg - left.totalVolumeKg
  ));
  const candidate = ranked[0] || null;
  return candidate ? {
    exerciseId: candidate.exerciseId,
    name: candidate.name,
    reason: candidate.sessionCount >= 4
      ? "Most repeated recent exercise."
      : "Most logged exercise so far.",
  } : null;
}

export function buildProgressionInsightCopy({ candidate, suggestion } = {}) {
  if (!candidate) {
    return {
      title: "No suggestion yet",
      body: "Finish a few guided workouts and TribeLog will suggest a conservative next step.",
      actionLabel: "Log workouts first",
    };
  }

  if (!suggestion) {
    return {
      title: `Check ${candidate.name}`,
      body: "Refresh the private insight to see if there is enough history for a next-step suggestion.",
      actionLabel: "Refresh suggestion",
    };
  }

  if (suggestion.status !== "ready" || !suggestion.suggestion) {
    return {
      title: `${candidate.name} needs more history`,
      body: suggestion.explanation || "Log this exercise across a couple of weeks before TribeLog suggests the next step.",
      actionLabel: "Refresh later",
    };
  }

  const target = suggestion.suggestion;
  const typeCopy = target.type === "weight"
    ? "Try a small weight increase"
    : "Add one controlled rep";
  return {
    title: `${candidate.name}: ${target.targetWeightKg} kg x ${target.targetReps}`,
    body: `${typeCopy}. ${suggestion.explanation}`,
    actionLabel: "Refresh suggestion",
  };
}

export function buildMuscleVolumeInsight(aggregate = {}) {
  const muscles = Array.isArray(aggregate.muscles) ? aggregate.muscles : [];
  const maxVolumeKg = Math.max(1, ...muscles.map(muscle => cleanNumber(muscle.volumeKg)));
  return {
    ...aggregate,
    maxVolumeKg,
    topMuscles: muscles.slice(0, 6).map(muscle => ({
      ...muscle,
      intensity: Math.max(0.08, cleanNumber(muscle.volumeKg) / maxVolumeKg),
    })),
  };
}
