const FEATURE_THRESHOLDS = {
  muscle_volume_heat_map: {
    completedSessions: 3,
    trainingWeeks: 1,
  },
  progressive_overload_suggestions: {
    completedSessions: 4,
    sessionsPerExercise: 4,
    trainingWeeksPerExercise: 2,
  },
  expanded_exercise_library: {
    completedSessions: 0,
  },
  shareable_workout_cards: {
    completedSessions: 1,
  },
};

const INSUFFICIENT_DATA_COPY = {
  muscle_volume_heat_map: "Log a few more workouts to unlock your first weekly muscle map.",
  progressive_overload_suggestions: "Log this exercise across a couple of weeks before TribeLog suggests the next step.",
  expanded_exercise_library: "No personal workout history required.",
  shareable_workout_cards: "Finish one workout to create your first share card.",
};

function cleanString(value, fallback = "") {
  return String(value || fallback).trim();
}

function cleanNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : fallback;
}

function completedSessionsOnly(sessions = []) {
  return Array.isArray(sessions)
    ? sessions.filter(session => cleanString(session.status, "completed") === "completed")
    : [];
}

function weekKey(dateStr = "") {
  const clean = cleanString(dateStr);
  if (!/^\d{4}-\d{2}-\d{2}/.test(clean)) return "";
  const date = new Date(`${clean.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return "";
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const dayOfYear = Math.floor((date - yearStart) / 86400000) + 1;
  const week = Math.max(1, Math.ceil((dayOfYear + yearStart.getUTCDay()) / 7));
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

export function countTrainingWeeks(sessions = []) {
  return new Set(
    completedSessionsOnly(sessions)
      .map(session => weekKey(session.dateStr || session.completedAt))
      .filter(Boolean)
  ).size;
}

export function countSessionsForExercise(sessions = [], exerciseId = "") {
  const targetId = cleanString(exerciseId);
  if (!targetId) return 0;
  return completedSessionsOnly(sessions).filter(session => (
    Array.isArray(session.exercises)
      && session.exercises.some(exercise => cleanString(exercise.exerciseId || exercise.id) === targetId)
  )).length;
}

export function countTrainingWeeksForExercise(sessions = [], exerciseId = "") {
  const targetId = cleanString(exerciseId);
  if (!targetId) return 0;
  return new Set(
    completedSessionsOnly(sessions)
      .filter(session => (
        Array.isArray(session.exercises)
          && session.exercises.some(exercise => cleanString(exercise.exerciseId || exercise.id) === targetId)
      ))
      .map(session => weekKey(session.dateStr || session.completedAt))
      .filter(Boolean)
  ).size;
}

export function getWorkoutInsightThreshold(featureId) {
  return FEATURE_THRESHOLDS[featureId] || null;
}

export function evaluateWorkoutInsightReadiness(featureId, context = {}) {
  const threshold = getWorkoutInsightThreshold(featureId);
  if (!threshold) {
    return {
      featureId,
      ready: false,
      blockers: ["Unknown insight feature."],
      copy: "This insight needs a little more setup before it can be shown.",
    };
  }

  const sessions = completedSessionsOnly(context.sessions);
  const blockers = [];

  if (sessions.length < threshold.completedSessions) {
    blockers.push(`Needs ${threshold.completedSessions - sessions.length} more completed workout(s).`);
  }

  if (threshold.trainingWeeks && countTrainingWeeks(sessions) < threshold.trainingWeeks) {
    blockers.push(`Needs workouts across ${threshold.trainingWeeks} training week(s).`);
  }

  if (threshold.sessionsPerExercise) {
    const exerciseSessions = countSessionsForExercise(sessions, context.exerciseId);
    if (exerciseSessions < threshold.sessionsPerExercise) {
      blockers.push(`Needs ${threshold.sessionsPerExercise - exerciseSessions} more completed session(s) for this exercise.`);
    }
  }

  if (threshold.trainingWeeksPerExercise) {
    const exerciseWeeks = countTrainingWeeksForExercise(sessions, context.exerciseId);
    if (exerciseWeeks < threshold.trainingWeeksPerExercise) {
      blockers.push(`Needs this exercise logged across ${threshold.trainingWeeksPerExercise} training week(s).`);
    }
  }

  return {
    featureId,
    ready: blockers.length === 0,
    blockers,
    copy: blockers.length === 0
      ? "Ready to show."
      : INSUFFICIENT_DATA_COPY[featureId],
  };
}

export function bucketPublicWorkoutMetric(metricId, value) {
  const number = cleanNumber(value);
  if (metricId === "weekly_muscle_volume_kg" || metricId === "total_volume_kg") {
    return Math.round(number / 100) * 100;
  }
  if (metricId === "duration_minutes") {
    return Math.round(number / 5) * 5;
  }
  if (metricId === "completed_sessions") {
    return Math.floor(number);
  }
  return number;
}

export function buildWorkoutInsightPrivacySummary(featureId) {
  const summaries = {
    muscle_volume_heat_map: "Owner-only by default. Share cards should use rounded weekly volume, never raw set logs.",
    progressive_overload_suggestions: "Owner-only suggestions. Do not post recommendations automatically.",
    expanded_exercise_library: "Public catalog metadata only.",
    shareable_workout_cards: "User-controlled preview and explicit share. Hide private notes and exact timestamps by default. Shared cards may remain saved outside TribeLog after sharing.",
  };
  return summaries[featureId] || "Keep private by default until reviewed.";
}

export const WORKOUT_INSIGHT_FEATURE_IDS = Object.freeze(Object.keys(FEATURE_THRESHOLDS));
