function httpsError(code, message, details) {
  const { HttpsError } = require('firebase-functions/v2/https');
  return new HttpsError(code, message, details);
}

const { assertWorkoutInsightSyncRateLimit } = require('./workoutInsightRateLimit');

const MIN_VOLUME_HEAT_MAP_SESSIONS = 3;

function cleanString(value, fallback = '', maxLength = 120) {
  return String(value || fallback).trim().replace(/\s+/g, ' ').slice(0, maxLength);
}

function safeNumber(value, digits = 2) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) return 0;
  const multiplier = 10 ** digits;
  return Math.round(number * multiplier) / multiplier;
}

function cleanList(value, max = 8) {
  return Array.isArray(value)
    ? value.map(item => cleanString(item, '', 40)).filter(Boolean).slice(0, max)
    : [];
}

function weekKeyForDate(value = new Date()) {
  const date = value instanceof Date ? value : new Date(String(value || ''));
  if (Number.isNaN(date.getTime())) {
    return weekKeyForDate(new Date());
  }
  const utcDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = utcDate.getUTCDay() || 7;
  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((utcDate - yearStart) / 86400000) + 1) / 7);
  return `${utcDate.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

function cleanWeekKey(value) {
  const weekKey = cleanString(value, '', 12).toUpperCase();
  return /^\d{4}-W\d{2}$/.test(weekKey) ? weekKey : '';
}

function aggregateDocIdForWeek(weekKey) {
  return `weekly_${cleanWeekKey(weekKey)}`;
}

function normalizeAggregateSet(set = {}) {
  return {
    reps: safeNumber(set.reps, 0),
    weightKg: safeNumber(set.weightKg ?? set.weight, 2),
  };
}

function normalizeAggregateExercise(exercise = {}, index = 0) {
  const sets = Array.isArray(exercise.sets)
    ? exercise.sets.map(normalizeAggregateSet).filter(set => set.reps > 0)
    : [];
  return {
    exerciseId: cleanString(exercise.exerciseId || exercise.id || `exercise_${index + 1}`, `exercise_${index + 1}`, 100),
    nameSnapshot: cleanString(exercise.nameSnapshot || exercise.name, 'Exercise', 100),
    primaryMuscles: cleanList(exercise.primaryMusclesSnapshot || exercise.primaryMuscles),
    sets,
  };
}

function normalizeAggregateSession(id, data = {}) {
  const dateStr = cleanString(data.dateStr || data.completedAt, '', 20).slice(0, 10);
  return {
    id: cleanString(data.id || id, id, 180),
    status: cleanString(data.status, 'completed', 40),
    dateStr,
    weekKey: cleanWeekKey(data.weekKey) || weekKeyForDate(dateStr),
    totalVolumeKg: safeNumber(data.totalVolumeKg, 1),
    exercises: Array.isArray(data.exercises)
      ? data.exercises.map(normalizeAggregateExercise).filter(exercise => exercise.sets.length > 0)
      : [],
  };
}

function volumeForExercise(exercise) {
  return safeNumber(exercise.sets.reduce((sum, set) => sum + (set.reps * set.weightKg), 0), 2);
}

function buildWeeklyMuscleVolumeAggregate(uid, weekKey, sessions = []) {
  const cleanUid = cleanString(uid, '', 128);
  const cleanWeek = cleanWeekKey(weekKey) || weekKeyForDate();
  const completedSessions = sessions
    .map((session, index) => normalizeAggregateSession(session.id || `session_${index + 1}`, session))
    .filter(session => session.status === 'completed' && session.weekKey === cleanWeek);

  const muscles = {};
  let totalAllocatedVolumeKg = 0;
  let setCount = 0;
  const exerciseIds = new Set();

  completedSessions.forEach((session) => {
    session.exercises.forEach((exercise) => {
      const primaryMuscles = exercise.primaryMuscles.length ? exercise.primaryMuscles : ['general'];
      const exerciseVolume = volumeForExercise(exercise);
      const allocated = safeNumber(exerciseVolume / primaryMuscles.length, 2);
      setCount += exercise.sets.length;
      exerciseIds.add(exercise.exerciseId);
      primaryMuscles.forEach((muscle) => {
        const key = cleanString(muscle, 'general', 40).toLowerCase().replace(/\s+/g, '_');
        const current = muscles[key] || {
          muscle: key,
          volumeKg: 0,
          setCount: 0,
          exerciseIds: [],
        };
        current.volumeKg = safeNumber(current.volumeKg + allocated, 2);
        current.setCount += exercise.sets.length;
        if (!current.exerciseIds.includes(exercise.exerciseId)) current.exerciseIds.push(exercise.exerciseId);
        muscles[key] = current;
        totalAllocatedVolumeKg = safeNumber(totalAllocatedVolumeKg + allocated, 2);
      });
    });
  });

  return {
    id: aggregateDocIdForWeek(cleanWeek),
    uid: cleanUid,
    periodType: 'week',
    periodKey: cleanWeek,
    metricVersion: 1,
    sessionCount: completedSessions.length,
    setCount,
    exerciseCount: exerciseIds.size,
    totalVolumeKg: totalAllocatedVolumeKg,
    minimumSessionCount: MIN_VOLUME_HEAT_MAP_SESSIONS,
    insufficientData: completedSessions.length < MIN_VOLUME_HEAT_MAP_SESSIONS,
    muscles,
  };
}

async function syncWorkoutInsightAggregates({ admin, request }) {
  const uid = request.auth?.uid;
  if (!uid) {
    throw httpsError('unauthenticated', 'Sign in is required.');
  }

  const db = admin.firestore();
  const data = request.data || {};
  const requestedWeek = cleanWeekKey(data.weekKey);
  const targetWeek = requestedWeek || weekKeyForDate();
  const userRef = db.collection('users').doc(uid);
  await assertWorkoutInsightSyncRateLimit({
    admin,
    db,
    functionName: 'syncWorkoutInsightAggregates',
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
  const sessions = sessionsSnap.docs.map(doc => normalizeAggregateSession(doc.id, doc.data()));
  const aggregate = buildWeeklyMuscleVolumeAggregate(uid, targetWeek, sessions);

  await userRef.collection('workoutInsightAggregates').doc(aggregate.id).set({
    ...aggregate,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: false });

  return {
    aggregateId: aggregate.id,
    periodKey: aggregate.periodKey,
    sessionCount: aggregate.sessionCount,
    insufficientData: aggregate.insufficientData,
  };
}

module.exports = {
  MIN_VOLUME_HEAT_MAP_SESSIONS,
  aggregateDocIdForWeek,
  buildWeeklyMuscleVolumeAggregate,
  cleanWeekKey,
  normalizeAggregateSession,
  syncWorkoutInsightAggregates,
  weekKeyForDate,
};
