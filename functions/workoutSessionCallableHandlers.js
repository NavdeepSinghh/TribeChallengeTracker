const crypto = require('crypto');

const SHARE_VISIBILITIES = new Set(['private', 'tribe', 'public']);
const DEFAULT_WORKOUT_POINTS = 40;

function httpsError(code, message) {
  // Lazy import keeps pure helpers testable from the root Jest runner, which
  // does not resolve dependencies installed under functions/node_modules.
  // The callable runtime resolves this from the functions package.
  const { HttpsError } = require('firebase-functions/v2/https');
  return new HttpsError(code, message);
}

function sha256Short(value) {
  return crypto.createHash('sha256').update(String(value || '')).digest('hex').slice(0, 32);
}

function deterministicWorkoutIds(uid, sessionId) {
  return {
    activityLogId: sha256Short(`${sessionId}:activity`),
    feedId: sha256Short(`${sessionId}:feed`),
    publicWorkoutId: `${uid}_${sha256Short(`${sessionId}:publicWorkout`)}`,
  };
}

function deterministicCopiedWorkoutTemplateId(uid, publicWorkoutId) {
  return `${uid}_${sha256Short(`${publicWorkoutId}:copiedTemplate`)}`;
}

function cleanString(value, fallback = '', maxLength = 120) {
  const next = String(value || fallback).trim().replace(/\s+/g, ' ');
  return next.slice(0, maxLength);
}

function cleanDateStr(value) {
  const dateStr = cleanString(value, '', 20);
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  return new Date().toISOString().slice(0, 10);
}

function safeNumber(value, digits = 2) {
  const next = Number(value);
  if (!Number.isFinite(next) || next < 0) return 0;
  const multiplier = 10 ** digits;
  return Math.round(next * multiplier) / multiplier;
}

function workoutPoints(session = {}) {
  return safeNumber(session.points, 0) || DEFAULT_WORKOUT_POINTS;
}

function cleanSessionId(value) {
  const sessionId = String(value || '').trim();
  if (!sessionId || sessionId.length > 180 || sessionId.includes('/')) {
    throw httpsError('invalid-argument', 'A valid sessionId is required.');
  }
  return sessionId;
}

function cleanDocumentId(value, label = 'documentId') {
  const documentId = String(value || '').trim();
  if (!documentId || documentId.length > 180 || documentId.includes('/')) {
    throw httpsError('invalid-argument', `A valid ${label} is required.`);
  }
  return documentId;
}

function cleanShareVisibility(value) {
  const visibility = String(value || 'private').trim();
  return SHARE_VISIBILITIES.has(visibility) ? visibility : 'private';
}

function normalizeSet(set = {}, index = 0) {
  const reps = safeNumber(set.reps, 0);
  const weightKg = safeNumber(set.weightKg ?? set.weight, 2);
  return {
    setNumber: safeNumber(set.setNumber || index + 1, 0),
    reps,
    weightKg,
    durationSeconds: set.durationSeconds == null ? null : safeNumber(set.durationSeconds, 0),
    restSeconds: set.restSeconds == null ? null : safeNumber(set.restSeconds, 0),
    completedAt: set.completedAt || null,
    isWarmup: set.isWarmup === true,
    isPR: set.isPR === true,
  };
}

function normalizeExercise(exercise = {}, index = 0) {
  const exerciseId = cleanString(exercise.exerciseId || exercise.id || `exercise_${index + 1}`, `exercise_${index + 1}`, 100);
  const sets = Array.isArray(exercise.sets)
    ? exercise.sets.map(normalizeSet).filter((set) => set.reps > 0)
    : [];
  return {
    exerciseId,
    nameSnapshot: cleanString(exercise.nameSnapshot || exercise.name, 'Exercise', 100),
    order: safeNumber(exercise.order ?? index, 0),
    primaryMusclesSnapshot: Array.isArray(exercise.primaryMusclesSnapshot)
      ? exercise.primaryMusclesSnapshot.map((item) => cleanString(item, '', 40)).filter(Boolean).slice(0, 8)
      : Array.isArray(exercise.primaryMuscles)
        ? exercise.primaryMuscles.map((item) => cleanString(item, '', 40)).filter(Boolean).slice(0, 8)
        : [],
    assetHashSnapshot: cleanString(exercise.assetHashSnapshot, '', 120) || null,
    sets,
  };
}

function sanitizeFinalSession(uid, sessionId, finalSession = {}) {
  const exercises = Array.isArray(finalSession.exercises)
    ? finalSession.exercises.map(normalizeExercise).filter((exercise) => exercise.sets.length > 0)
    : [];
  const totalVolumeKg = exercises.reduce((sum, exercise) => (
    sum + exercise.sets.reduce((setSum, set) => setSum + (set.reps * set.weightKg), 0)
  ), 0);
  const durationSeconds = safeNumber(finalSession.durationSeconds ?? finalSession.durationMinutes * 60, 0);

  return {
    id: sessionId,
    userId: uid,
    status: 'completed',
    source: cleanString(finalSession.source, 'guided', 40),
    templateId: cleanString(finalSession.templateId, '', 120) || null,
    copiedFromPublicWorkoutId: cleanString(finalSession.copiedFromPublicWorkoutId, '', 160) || null,
    copiedFromTemplateId: cleanString(finalSession.copiedFromTemplateId, '', 160) || null,
    originalCreatorUid: cleanString(finalSession.originalCreatorUid, '', 128) || null,
    originalCreatorDisplayName: cleanString(finalSession.originalCreatorDisplayName, '', 80) || null,
    name: cleanString(finalSession.name || finalSession.planName, 'Guided workout', 100),
    type: cleanString(finalSession.type, 'gym', 40),
    dateStr: cleanDateStr(finalSession.dateStr),
    startedAt: finalSession.startedAt || null,
    completedAt: finalSession.completedAt || null,
    durationSeconds,
    durationMinutes: Math.round(durationSeconds / 60),
    points: safeNumber(finalSession.points, 0),
    totalVolumeKg: safeNumber(finalSession.totalVolumeKg ?? totalVolumeKg, 1),
    intensity: cleanString(finalSession.intensity, '', 40) || null,
    exercises,
    exerciseCount: exercises.length,
    prFlags: Array.isArray(finalSession.prFlags)
      ? finalSession.prFlags.map((item) => cleanString(item, '', 120)).filter(Boolean).slice(0, 25)
      : [],
  };
}

function repRangeKey(reps) {
  if (reps <= 3) return 'reps_1_3';
  if (reps <= 6) return 'reps_4_6';
  if (reps <= 10) return 'reps_7_10';
  return 'reps_11_15';
}

function estimatedOneRepMax(weightKg, reps) {
  if (weightKg <= 0 || reps <= 0) return 0;
  return safeNumber(weightKg * (1 + reps / 30), 2);
}

function summarizeExercisePerformance(exercise) {
  const summary = {
    exerciseId: exercise.exerciseId,
    bestWeightKg: 0,
    bestVolumeKg: 0,
    bestEstimatedOneRepMaxKg: 0,
    repRangePRs: {},
  };

  exercise.sets.forEach((set) => {
    const setVolume = safeNumber(set.reps * set.weightKg, 2);
    summary.bestWeightKg = Math.max(summary.bestWeightKg, set.weightKg);
    summary.bestVolumeKg = Math.max(summary.bestVolumeKg, setVolume);
    summary.bestEstimatedOneRepMaxKg = Math.max(
      summary.bestEstimatedOneRepMaxKg,
      estimatedOneRepMax(set.weightKg, set.reps),
    );
    const key = repRangeKey(set.reps);
    summary.repRangePRs[key] = Math.max(summary.repRangePRs[key] || 0, set.weightKg);
  });

  return summary;
}

function buildPrUpdate(existing = {}, performance, sessionId) {
  const next = {
    exerciseId: performance.exerciseId,
    bestWeightKg: Math.max(safeNumber(existing.bestWeightKg, 2), performance.bestWeightKg),
    bestVolumeKg: Math.max(safeNumber(existing.bestVolumeKg, 2), performance.bestVolumeKg),
    bestEstimatedOneRepMaxKg: Math.max(
      safeNumber(existing.bestEstimatedOneRepMaxKg, 2),
      performance.bestEstimatedOneRepMaxKg,
    ),
    repRangePRs: { ...(existing.repRangePRs || {}) },
    updatedFromSessionId: existing.updatedFromSessionId || null,
  };

  Object.entries(performance.repRangePRs).forEach(([key, value]) => {
    next.repRangePRs[key] = Math.max(safeNumber(next.repRangePRs[key], 2), value);
  });

  const changed = (
    next.bestWeightKg > safeNumber(existing.bestWeightKg, 2)
    || next.bestVolumeKg > safeNumber(existing.bestVolumeKg, 2)
    || next.bestEstimatedOneRepMaxKg > safeNumber(existing.bestEstimatedOneRepMaxKg, 2)
    || Object.entries(performance.repRangePRs).some(([key, value]) => value > safeNumber(existing.repRangePRs?.[key], 2))
  );

  return changed
    ? { ...next, updatedFromSessionId: sessionId }
    : null;
}

function buildActivityEntry(session, ids) {
  const points = workoutPoints(session);
  return {
    id: ids.activityLogId,
    activityId: 'guided_workout',
    type: session.type || 'gym',
    label: session.name,
    value: session.durationMinutes || Math.round((session.durationSeconds || 0) / 60),
    unit: 'min',
    points,
    workoutSessionId: session.id,
    loggedAt: session.dateStr,
  };
}

function buildActivityLogDocument(existing = {}, activityEntry) {
  const existingActivities = Array.isArray(existing.activities)
    ? existing.activities
    : existing.type
      ? [existing]
      : [];
  const activities = [
    ...existingActivities.filter((activity) => activity.id !== activityEntry.id),
    activityEntry,
  ];
  const totalPoints = activities.reduce((sum, activity) => sum + safeNumber(activity.points, 0), 0);
  return {
    ...existing,
    activities,
    points: totalPoints,
    totalPoints,
    date: existing.date || activityEntry.loggedAt,
  };
}

function publicExerciseSummary(exercise) {
  const bestWeightKg = exercise.sets.reduce((max, set) => Math.max(max, set.weightKg), 0);
  const repCounts = exercise.sets.map((set) => set.reps).filter(Boolean);
  const repSummary = repCounts.length
    ? `${exercise.sets.length} sets · ${Math.min(...repCounts)}-${Math.max(...repCounts)} reps`
    : `${exercise.sets.length} sets`;
  return {
    exerciseId: exercise.exerciseId,
    name: exercise.nameSnapshot,
    primaryMuscles: exercise.primaryMusclesSnapshot || [],
    setCount: exercise.sets.length,
    repSummary,
    bestWeightKg,
  };
}

function buildPublicWorkout(uid, profile, session, ids, visibility, existing = {}) {
  return {
    id: ids.publicWorkoutId,
    publicWorkoutId: ids.publicWorkoutId,
    ownerUid: uid,
    ownerDisplayName: cleanString(profile.displayName, 'Tribe member', 80),
    ownerAvatarEmoji: cleanString(profile.avatarEmoji, '💪', 8),
    ownerAvatarColor: cleanString(profile.avatarColor, '#FF6B35', 20),
    sourceSessionId: session.id,
    visibility,
    name: session.name,
    dateStr: session.dateStr,
    summary: `${session.exerciseCount} exercises · ${session.durationMinutes || 0} min`,
    exercises: session.exercises.map(publicExerciseSummary).slice(0, 20),
    totalVolumeKg: session.totalVolumeKg,
    durationSeconds: session.durationSeconds,
    copiedCount: safeNumber(existing.copiedCount, 0),
    reactionCounts: existing.reactionCounts || {},
  };
}

function canViewerReadPublicWorkout({
  viewerUid,
  workout = {},
  isFollower = false,
  viewerBlockedOwner = false,
  ownerBlockedViewer = false,
  isAdmin = false,
}) {
  const ownerUid = cleanString(workout.ownerUid, '', 128);
  if (!viewerUid || !ownerUid) return false;
  if (viewerUid === ownerUid || isAdmin) return true;
  if (viewerBlockedOwner || ownerBlockedViewer) return false;
  if (workout.visibility === 'public') return true;
  return workout.visibility === 'tribe' && isFollower === true;
}

function copiedExerciseTarget(exercise = {}, index = 0) {
  return {
    exerciseId: cleanString(exercise.exerciseId || exercise.id || `exercise_${index + 1}`, `exercise_${index + 1}`, 100),
    nameSnapshot: cleanString(exercise.nameSnapshot || exercise.name, 'Exercise', 100),
    order: safeNumber(exercise.order ?? index, 0),
    primaryMusclesSnapshot: Array.isArray(exercise.primaryMuscles)
      ? exercise.primaryMuscles.map((item) => cleanString(item, '', 40)).filter(Boolean).slice(0, 8)
      : [],
    targetSetCount: safeNumber(exercise.setCount, 0),
    targetRepSummary: cleanString(exercise.repSummary, '', 40) || null,
    suggestedWeightKg: safeNumber(exercise.bestWeightKg, 2),
  };
}

function buildCopiedWorkoutTemplate(uid, publicWorkoutId, workout = {}, existing = {}) {
  const sourceCreatorUid = cleanString(workout.originalCreatorUid || workout.ownerUid, '', 128);
  const sourceCreatorName = cleanString(
    workout.originalCreatorDisplayName || workout.ownerDisplayName,
    'Tribe member',
    80,
  );
  const exercises = Array.isArray(workout.exercises)
    ? workout.exercises.map(copiedExerciseTarget).filter((exercise) => exercise.exerciseId).slice(0, 30)
    : [];

  return {
    id: deterministicCopiedWorkoutTemplateId(uid, publicWorkoutId),
    ownerUid: uid,
    status: 'draft',
    visibility: 'private',
    source: 'copied_public_workout',
    sourcePublicWorkoutId: publicWorkoutId,
    sourceSessionId: cleanString(workout.sourceSessionId, '', 180) || null,
    originalCreatorUid: sourceCreatorUid,
    originalCreatorDisplayName: sourceCreatorName,
    attribution: {
      sourcePublicWorkoutId: publicWorkoutId,
      originalCreatorUid: sourceCreatorUid,
      originalCreatorDisplayName: sourceCreatorName,
      copiedFromOwnerUid: cleanString(workout.ownerUid, '', 128) || null,
      copiedFromOwnerDisplayName: cleanString(workout.ownerDisplayName, 'Tribe member', 80),
    },
    name: cleanString(workout.name, 'Copied workout', 100),
    summary: cleanString(workout.summary, '', 120) || null,
    exerciseCount: safeNumber(workout.exerciseCount ?? exercises.length, 0),
    totalVolumeKg: safeNumber(workout.totalVolumeKg, 1),
    durationSeconds: safeNumber(workout.durationSeconds, 0),
    copiedFromPublicWorkoutId: publicWorkoutId,
    copiedFromPublishedAt: workout.publishedAt || null,
    exercises,
    createdAt: existing.createdAt || null,
  };
}

function buildTribeFeedEntry(uid, profile, session, ids, publicWorkoutId) {
  const points = workoutPoints(session);
  return {
    uid,
    displayName: cleanString(profile.displayName, 'Tribe member', 80),
    avatarEmoji: cleanString(profile.avatarEmoji, '💪', 8),
    avatarColor: cleanString(profile.avatarColor, '#FF6B35', 20),
    activityType: session.type || 'gym',
    activityLabel: session.name,
    activityEmoji: '💪',
    value: session.durationMinutes || Math.round((session.durationSeconds || 0) / 60),
    unit: 'min',
    points,
    challengeName: null,
    challengeId: null,
    currentStreak: safeNumber(profile.currentStreak, 0),
    reactionCounts: {},
    reactionUsers: {},
    reactionTotal: 0,
    activityLogId: ids.activityLogId,
    activityDate: session.dateStr,
    workoutSessionId: session.id,
    publicWorkoutId: publicWorkoutId || null,
  };
}

async function finishWorkoutSession({ admin, request }) {
  const uid = request.auth?.uid;
  if (!uid) {
    throw httpsError('unauthenticated', 'Sign in is required.');
  }

  const data = request.data || {};
  const sessionId = cleanSessionId(data.sessionId);
  const shareVisibility = cleanShareVisibility(data.shareVisibility);
  const ids = deterministicWorkoutIds(uid, sessionId);
  const session = sanitizeFinalSession(uid, sessionId, data.finalSession || {});

  const db = admin.firestore();
  const FieldValue = admin.firestore.FieldValue;
  const userRef = db.collection('users').doc(uid);
  const sessionRef = userRef.collection('trainingSessions').doc(sessionId);
  const activityRef = userRef.collection('activityLog').doc(session.dateStr);
  const feedRef = db.collection('tribeFeed').doc(ids.feedId);
  const publicWorkoutRef = db.collection('publicWorkouts').doc(ids.publicWorkoutId);
  const prRefs = session.exercises.map((exercise) => ({
    exercise,
    ref: userRef.collection('exercisePRs').doc(exercise.exerciseId),
  }));

  let result = null;

  await db.runTransaction(async (transaction) => {
    const [
      userSnap,
      existingSessionSnap,
      activitySnap,
      publicWorkoutSnap,
      ...prSnaps
    ] = await Promise.all([
      transaction.get(userRef),
      transaction.get(sessionRef),
      transaction.get(activityRef),
      transaction.get(publicWorkoutRef),
      ...prRefs.map((entry) => transaction.get(entry.ref)),
    ]);

    const existingSession = existingSessionSnap.exists ? existingSessionSnap.data() || {} : {};
    if (existingSession.userId && existingSession.userId !== uid) {
      throw httpsError('permission-denied', 'Workout session ownership mismatch.');
    }

    const profile = userSnap.exists ? userSnap.data() || {} : {};
    const existingActivity = activitySnap.exists ? activitySnap.data() || {} : {};
    const publicWorkoutId = shareVisibility === 'private' ? null : ids.publicWorkoutId;

    const activityEntry = buildActivityEntry(session, ids);
    const activityLog = buildActivityLogDocument(existingActivity, activityEntry);
    const prUpdates = [];

    prRefs.forEach((entry, index) => {
      const existing = prSnaps[index].exists ? prSnaps[index].data() || {} : {};
      const performance = summarizeExercisePerformance(entry.exercise);
      const update = buildPrUpdate(existing, performance, sessionId);
      if (update) {
        prUpdates.push({ ref: entry.ref, data: update });
      }
    });

    transaction.set(sessionRef, {
      ...session,
      routineVisibility: shareVisibility,
      activityLogId: ids.activityLogId,
      feedId: ids.feedId,
      publicWorkoutId,
      updatedAt: FieldValue.serverTimestamp(),
      completedAt: session.completedAt || FieldValue.serverTimestamp(),
    }, { merge: true });

    transaction.set(activityRef, {
      ...activityLog,
      savedAt: FieldValue.serverTimestamp(),
    }, { merge: true });

    transaction.set(feedRef, {
      ...buildTribeFeedEntry(uid, profile, session, ids, publicWorkoutId),
      loggedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });

    if (shareVisibility === 'private') {
      transaction.delete(publicWorkoutRef);
    } else {
      const existingPublicWorkout = publicWorkoutSnap.exists ? publicWorkoutSnap.data() || {} : {};
      transaction.set(publicWorkoutRef, {
        ...buildPublicWorkout(uid, profile, session, ids, shareVisibility, existingPublicWorkout),
        publishedAt: existingPublicWorkout.publishedAt || FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      }, { merge: true });
    }

    prUpdates.forEach((entry) => {
      transaction.set(entry.ref, {
        ...entry.data,
        updatedAt: FieldValue.serverTimestamp(),
      }, { merge: true });
    });

    result = {
      sessionId,
      activityLogId: ids.activityLogId,
      feedId: ids.feedId,
      publicWorkoutId,
      prUpdates: prUpdates.map((entry) => ({
        exerciseId: entry.data.exerciseId,
        bestWeightKg: entry.data.bestWeightKg,
        bestVolumeKg: entry.data.bestVolumeKg,
        bestEstimatedOneRepMaxKg: entry.data.bestEstimatedOneRepMaxKg,
      })),
      status: 'completed',
    };
  });

  return result;
}

async function copyPublicWorkout({ admin, request }) {
  const uid = request.auth?.uid;
  if (!uid) {
    throw httpsError('unauthenticated', 'Sign in is required.');
  }

  const publicWorkoutId = cleanDocumentId(request.data?.publicWorkoutId, 'publicWorkoutId');
  const db = admin.firestore();
  const FieldValue = admin.firestore.FieldValue;
  const publicWorkoutRef = db.collection('publicWorkouts').doc(publicWorkoutId);

  let result = null;

  await db.runTransaction(async (transaction) => {
    const publicWorkoutSnap = await transaction.get(publicWorkoutRef);
    if (!publicWorkoutSnap.exists) {
      throw httpsError('not-found', 'Workout is no longer available.');
    }

    const workout = publicWorkoutSnap.data() || {};
    const ownerUid = cleanString(workout.ownerUid, '', 128);
    if (!ownerUid) {
      throw httpsError('failed-precondition', 'Workout is missing creator attribution.');
    }

    const copyTemplateId = deterministicCopiedWorkoutTemplateId(uid, publicWorkoutId);
    const copyTemplateRef = db.collection('workoutTemplates').doc(copyTemplateId);
    const viewerBlocksOwnerRef = db.collection('users').doc(uid).collection('blockedUsers').doc(ownerUid);
    const ownerBlocksViewerRef = db.collection('users').doc(ownerUid).collection('blockedUsers').doc(uid);
    const followerRef = db.collection('users').doc(ownerUid).collection('followers').doc(uid);

    const [
      viewerBlocksOwnerSnap,
      ownerBlocksViewerSnap,
      followerSnap,
      existingCopySnap,
    ] = await Promise.all([
      transaction.get(viewerBlocksOwnerRef),
      transaction.get(ownerBlocksViewerRef),
      transaction.get(followerRef),
      transaction.get(copyTemplateRef),
    ]);

    const canRead = canViewerReadPublicWorkout({
      viewerUid: uid,
      workout,
      isFollower: followerSnap.exists,
      viewerBlockedOwner: viewerBlocksOwnerSnap.exists,
      ownerBlockedViewer: ownerBlocksViewerSnap.exists,
    });
    if (!canRead) {
      throw httpsError('permission-denied', 'Workout is not visible to this account.');
    }

    const existingCopy = existingCopySnap.exists ? existingCopySnap.data() || {} : {};
    const copiedTemplate = buildCopiedWorkoutTemplate(uid, publicWorkoutId, workout, existingCopy);

    transaction.set(copyTemplateRef, {
      ...copiedTemplate,
      createdAt: existingCopy.createdAt || FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      copiedAt: existingCopy.copiedAt || FieldValue.serverTimestamp(),
    }, { merge: true });

    if (!existingCopySnap.exists) {
      transaction.set(publicWorkoutRef, {
        copiedCount: FieldValue.increment(1),
        lastCopiedAt: FieldValue.serverTimestamp(),
      }, { merge: true });
    }

    result = {
      templateId: copyTemplateId,
      sourcePublicWorkoutId: publicWorkoutId,
      originalCreatorUid: copiedTemplate.originalCreatorUid,
      originalCreatorDisplayName: copiedTemplate.originalCreatorDisplayName,
      status: existingCopySnap.exists ? 'already_copied' : 'copied',
    };
  });

  return result;
}

module.exports = {
  DEFAULT_WORKOUT_POINTS,
  buildActivityEntry,
  buildActivityLogDocument,
  buildCopiedWorkoutTemplate,
  buildPrUpdate,
  buildPublicWorkout,
  buildTribeFeedEntry,
  canViewerReadPublicWorkout,
  cleanShareVisibility,
  copyPublicWorkout,
  deterministicCopiedWorkoutTemplateId,
  deterministicWorkoutIds,
  finishWorkoutSession,
  sanitizeFinalSession,
  sha256Short,
  summarizeExercisePerformance,
  workoutPoints,
};
