function httpsError(code, message, details) {
  const { HttpsError } = require('firebase-functions/v2/https');
  return new HttpsError(code, message, details);
}

const { assertWorkoutInsightSyncRateLimit } = require('./workoutInsightRateLimit');

const MIN_SESSIONS_PER_EXERCISE = 4;
const MIN_TRAINING_WEEKS_PER_EXERCISE = 2;
const LEVEL_REP_INCREMENT = {
  beginner: 1,
  intermediate: 1,
  advanced: 1,
};
const LEVEL_WEIGHT_INCREMENT_KG = {
  beginner: 1.25,
  intermediate: 2.5,
  advanced: 2.5,
};

function cleanString(value, fallback = '', maxLength = 120) {
  return String(value || fallback).trim().replace(/\s+/g, ' ').slice(0, maxLength);
}

function safeNumber(value, digits = 2) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) return 0;
  const multiplier = 10 ** digits;
  return Math.round(number * multiplier) / multiplier;
}

function roundToNearest(value, step = 0.5) {
  if (step <= 0) return safeNumber(value, 2);
  return safeNumber(Math.round(value / step) * step, 2);
}

function weekKeyForProgressionDate(value = '') {
  const date = new Date(`${cleanString(value).slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return '';
  const utcDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = utcDate.getUTCDay() || 7;
  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((utcDate - yearStart) / 86400000) + 1) / 7);
  return `${utcDate.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

function normalizeProgressionSet(set = {}) {
  return {
    reps: safeNumber(set.reps, 0),
    weightKg: safeNumber(set.weightKg ?? set.weight, 2),
    isWarmup: set.isWarmup === true,
  };
}

function normalizeProgressionExercise(exercise = {}, index = 0) {
  return {
    exerciseId: cleanString(exercise.exerciseId || exercise.id || `exercise_${index + 1}`, `exercise_${index + 1}`, 100),
    nameSnapshot: cleanString(exercise.nameSnapshot || exercise.name, 'Exercise', 100),
    sets: Array.isArray(exercise.sets)
      ? exercise.sets.map(normalizeProgressionSet).filter(set => set.reps > 0 && !set.isWarmup)
      : [],
  };
}

function normalizeProgressionSession(id, data = {}) {
  return {
    id: cleanString(data.id || id, id, 180),
    status: cleanString(data.status, 'completed', 40),
    dateStr: cleanString(data.dateStr || data.completedAt, '', 20).slice(0, 10),
    durationMinutes: safeNumber(data.durationMinutes ?? data.durationSeconds / 60, 0),
    totalVolumeKg: safeNumber(data.totalVolumeKg, 1),
    exercises: Array.isArray(data.exercises)
      ? data.exercises.map(normalizeProgressionExercise).filter(exercise => exercise.sets.length > 0)
      : [],
  };
}

function bestWorkingSet(exercise) {
  return exercise.sets.reduce((best, set) => {
    const setVolume = set.reps * set.weightKg;
    const bestVolume = best.reps * best.weightKg;
    if (set.weightKg > best.weightKg) return set;
    if (set.weightKg === best.weightKg && set.reps > best.reps) return set;
    if (best.weightKg === 0 && setVolume > bestVolume) return set;
    return best;
  }, { reps: 0, weightKg: 0 });
}

function exercisePerformances(sessions = [], exerciseId = '') {
  const targetId = cleanString(exerciseId);
  return sessions
    .map((session, index) => normalizeProgressionSession(session.id || `session_${index + 1}`, session))
    .filter(session => session.status === 'completed')
    .sort((left, right) => cleanString(left.dateStr).localeCompare(cleanString(right.dateStr)))
    .flatMap(session => session.exercises
      .filter(exercise => exercise.exerciseId === targetId)
      .map(exercise => ({
        sessionId: session.id,
        dateStr: session.dateStr,
        exerciseId: exercise.exerciseId,
        nameSnapshot: exercise.nameSnapshot,
        bestSet: bestWorkingSet(exercise),
        setCount: exercise.sets.length,
        volumeKg: safeNumber(exercise.sets.reduce((sum, set) => sum + (set.reps * set.weightKg), 0), 2),
      })));
}

function buildWorkoutIntensityScore(session = {}) {
  const normalized = normalizeProgressionSession(session.id || 'session', session);
  const setCount = normalized.exercises.reduce((sum, exercise) => sum + exercise.sets.length, 0);
  const volumeScore = Math.min(45, normalized.totalVolumeKg / 100);
  const setScore = Math.min(30, setCount * 3);
  const durationScore = Math.min(25, normalized.durationMinutes / 2);
  const score = Math.round(volumeScore + setScore + durationScore);
  let label = 'steady';
  if (score >= 75) label = 'high';
  else if (score >= 45) label = 'moderate';
  return {
    score: Math.max(0, Math.min(100, score)),
    label,
    factors: {
      totalVolumeKg: normalized.totalVolumeKg,
      setCount,
      durationMinutes: normalized.durationMinutes,
    },
  };
}

function buildProgressiveOverloadSuggestion({ exerciseId, sessions = [], level = 'beginner' } = {}) {
  const performances = exercisePerformances(sessions, exerciseId);
  const targetId = cleanString(exerciseId);
  const normalizedLevel = LEVEL_REP_INCREMENT[level] ? level : 'beginner';
  const observedTrainingWeeks = new Set(
    performances.map(performance => weekKeyForProgressionDate(performance.dateStr)).filter(Boolean)
  ).size;

  if (
    performances.length < MIN_SESSIONS_PER_EXERCISE
    || observedTrainingWeeks < MIN_TRAINING_WEEKS_PER_EXERCISE
  ) {
    return {
      exerciseId: targetId,
      status: 'insufficient_data',
      minimumSessions: MIN_SESSIONS_PER_EXERCISE,
      minimumTrainingWeeks: MIN_TRAINING_WEEKS_PER_EXERCISE,
      observedSessions: performances.length,
      observedTrainingWeeks,
      explanation: 'Log this exercise across a couple of weeks before TribeLog suggests the next step.',
    };
  }

  const recent = performances.slice(-2);
  const latest = recent[recent.length - 1];
  const previous = recent[0];
  const latestSet = latest.bestSet;
  const previousSet = previous.bestSet;
  const wasStableOrBetter = (
    latestSet.weightKg > previousSet.weightKg
    || (latestSet.weightKg === previousSet.weightKg && latestSet.reps >= previousSet.reps)
  );
  const canAddWeight = latestSet.weightKg > 0 && latestSet.reps >= 10 && wasStableOrBetter;
  const repIncrement = LEVEL_REP_INCREMENT[normalizedLevel];
  const weightIncrement = LEVEL_WEIGHT_INCREMENT_KG[normalizedLevel];

  const next = canAddWeight
    ? {
      targetWeightKg: roundToNearest(latestSet.weightKg + weightIncrement, 0.25),
      targetReps: Math.max(6, Math.min(latestSet.reps, 10)),
      type: 'weight',
    }
    : {
      targetWeightKg: latestSet.weightKg,
      targetReps: Math.min(latestSet.reps + repIncrement, 15),
      type: 'reps',
    };

  return {
    exerciseId: targetId,
    status: 'ready',
    level: normalizedLevel,
    observedSessions: performances.length,
    observedTrainingWeeks,
    latestBestSet: latestSet,
    previousBestSet: previousSet,
    suggestion: next,
    explanation: canAddWeight
      ? `You matched or improved your last ${targetId} session. Try a small weight increase and keep the reps controlled.`
      : `Keep the same weight and add ${repIncrement} rep if form still feels controlled.`,
  };
}

async function syncWorkoutProgressionSuggestions({ admin, request }) {
  const uid = request.auth?.uid;
  if (!uid) {
    throw httpsError('unauthenticated', 'Sign in is required.');
  }
  const data = request.data || {};
  const exerciseId = cleanString(data.exerciseId, '', 100);
  if (!exerciseId) {
    throw httpsError('invalid-argument', 'A valid exerciseId is required.');
  }

  const db = admin.firestore();
  const userRef = db.collection('users').doc(uid);
  await assertWorkoutInsightSyncRateLimit({
    admin,
    db,
    functionName: 'syncWorkoutProgressionSuggestions',
    throwRateLimitError: result => httpsError(
      'resource-exhausted',
      `Try again in ${result.retryAfterSeconds} seconds.`,
      {
        reason: result.reason,
        retryAfterSeconds: result.retryAfterSeconds,
      }
    ),
    uid,
  });
  const sessionsSnap = await userRef.collection('trainingSessions')
    .where('status', '==', 'completed')
    .get();
  const sessions = sessionsSnap.docs.map(doc => normalizeProgressionSession(doc.id, doc.data()));
  const suggestion = buildProgressiveOverloadSuggestion({
    exerciseId,
    sessions,
    level: data.level,
  });

  await userRef.collection('workoutProgressionSuggestions').doc(exerciseId).set({
    ...suggestion,
    uid,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: false });

  return {
    exerciseId,
    status: suggestion.status,
    observedSessions: suggestion.observedSessions,
    suggestion: suggestion.suggestion || null,
  };
}

module.exports = {
  MIN_SESSIONS_PER_EXERCISE,
  MIN_TRAINING_WEEKS_PER_EXERCISE,
  buildProgressiveOverloadSuggestion,
  buildWorkoutIntensityScore,
  exercisePerformances,
  normalizeProgressionSession,
  syncWorkoutProgressionSuggestions,
};
