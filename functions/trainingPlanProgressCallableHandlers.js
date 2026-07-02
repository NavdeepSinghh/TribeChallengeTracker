const TRAINING_PLAN_BADGES = [
  {
    id: 'plan_first_workout',
    label: 'Plan Starter',
    description: 'Complete your first guided workout from a training plan.',
    threshold: 1,
  },
  {
    id: 'plan_week_one',
    label: 'Week One Locked',
    description: 'Complete the first week of plan workouts.',
    threshold: 'first_week',
  },
  {
    id: 'plan_finisher',
    label: 'Plan Finisher',
    description: 'Complete every workout in a training plan.',
    threshold: 'finish',
  },
];

function httpsError(code, message) {
  const { HttpsError } = require('firebase-functions/v2/https');
  return new HttpsError(code, message);
}

function cleanString(value, fallback = '', maxLength = 160) {
  return String(value || fallback).trim().replace(/\s+/g, ' ').slice(0, maxLength);
}

function cleanList(value) {
  return Array.isArray(value)
    ? value.map(item => cleanString(item, '', 120)).filter(Boolean)
    : [];
}

function cleanInt(value, fallback = 0) {
  const number = Number(value);
  return Number.isInteger(number) && number >= 0 ? number : fallback;
}

function cleanPlanId(value) {
  const planId = cleanString(value, '', 180);
  if (!planId || planId.includes('/')) {
    throw httpsError('invalid-argument', 'A valid training plan is required.');
  }
  return planId;
}

function parseDateStr(value) {
  const text = cleanString(value, '', 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return null;
  return new Date(`${text}T00:00:00.000Z`);
}

function dateStr(value = new Date()) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  const text = cleanString(value, '', 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(text) ? text : new Date().toISOString().slice(0, 10);
}

function planWorkoutDays(plan = {}) {
  return Array.isArray(plan.schedule)
    ? plan.schedule.filter(day => day?.type === 'workout')
    : [];
}

function totalPlanWorkoutDays(plan = {}) {
  const weeks = cleanInt(plan.durationWeeks, 1) || 1;
  return planWorkoutDays(plan).length * weeks;
}

function firstWeekWorkoutTarget(plan = {}) {
  return Math.max(1, planWorkoutDays(plan).length);
}

function dayKeysDueThroughToday(plan = {}, enrollment = {}, today = new Date()) {
  const start = parseDateStr(enrollment.startDate);
  const current = today instanceof Date ? today : parseDateStr(today);
  if (!start || !current || !Array.isArray(plan.schedule) || plan.schedule.length === 0) return [];

  const elapsedDays = Math.max(0, Math.floor((current.getTime() - start.getTime()) / 86400000));
  const dueKeys = [];
  for (let offset = 0; offset <= elapsedDays; offset += 1) {
    const scheduleIndex = offset % plan.schedule.length;
    const weekIndex = Math.floor(offset / plan.schedule.length) + 1;
    const day = plan.schedule[scheduleIndex];
    if (day?.type === 'workout' && day.dayIndex) {
      dueKeys.push(`w${weekIndex}-d${day.dayIndex}`);
    }
  }
  return dueKeys.slice(0, totalPlanWorkoutDays(plan));
}

function buildTrainingPlanAdherenceSummary(plan = {}, enrollment = {}, { today = new Date() } = {}) {
  const completed = new Set(cleanList(enrollment.completedDayKeys));
  const skipped = new Set(cleanList(enrollment.skippedDayKeys));
  const dueKeys = dayKeysDueThroughToday(plan, enrollment, today);
  const missed = dueKeys.filter(key => !completed.has(key) && !skipped.has(key));
  const completedDue = dueKeys.filter(key => completed.has(key));
  const skippedDue = dueKeys.filter(key => skipped.has(key));
  const totalWorkoutDays = totalPlanWorkoutDays(plan);
  const completedCount = completed.size;
  const dueCount = dueKeys.length;
  const adherencePct = dueCount > 0 ? Math.round((completedDue.length / dueCount) * 100) : 0;

  return {
    planId: cleanString(enrollment.planId || plan.id),
    planVersion: cleanInt(enrollment.planVersion || plan.version, 1),
    totalWorkoutDays,
    completedCount,
    dueCount,
    completedDueCount: completedDue.length,
    skippedDueCount: skippedDue.length,
    missedCount: missed.length,
    adherencePct,
    status: cleanString(enrollment.status || 'active', 'active', 40),
    lastCompletedDayKey: cleanList(enrollment.completedDayKeys).slice(-1)[0] || null,
    calculatedAtDate: dateStr(today),
  };
}

function trainingPlanBadgeDocId(planId, badgeId) {
  return `${cleanString(planId, '', 120)}_${cleanString(badgeId, '', 80)}`;
}

function trainingPlanBadgeAwards(plan = {}, enrollment = {}, { today = new Date() } = {}) {
  const summary = buildTrainingPlanAdherenceSummary(plan, enrollment, { today });
  const firstWeekTarget = firstWeekWorkoutTarget(plan);
  const completedCount = summary.completedCount;
  return TRAINING_PLAN_BADGES
    .filter((badge) => {
      if (badge.threshold === 'first_week') return completedCount >= firstWeekTarget;
      if (badge.threshold === 'finish') return summary.totalWorkoutDays > 0 && completedCount >= summary.totalWorkoutDays;
      return completedCount >= badge.threshold;
    })
    .map(badge => ({
      id: trainingPlanBadgeDocId(summary.planId, badge.id),
      badgeId: badge.id,
      uid: cleanString(enrollment.uid, '', 128) || null,
      planId: summary.planId,
      planVersion: summary.planVersion,
      label: badge.label,
      description: badge.description,
      category: 'training_plan',
      source: 'syncTrainingPlanProgress',
      completedCount,
      totalWorkoutDays: summary.totalWorkoutDays,
    }));
}

function buildCompletedPlanDayPatch(enrollment = {}, dayKey = '') {
  const cleanDayKey = cleanString(dayKey, '', 80);
  if (!cleanDayKey) return null;
  const completedDayKeys = [...new Set([...cleanList(enrollment.completedDayKeys), cleanDayKey])];
  const skippedDayKeys = cleanList(enrollment.skippedDayKeys).filter(key => key !== cleanDayKey);
  return {
    completedDayKeys,
    skippedDayKeys,
  };
}

async function syncTrainingPlanProgress({ admin, request }) {
  const uid = request.auth?.uid;
  if (!uid) throw httpsError('unauthenticated', 'Sign in is required.');

  const planId = cleanPlanId(request.data?.planId);
  const db = admin.firestore();
  const FieldValue = admin.firestore.FieldValue;
  const userRef = db.collection('users').doc(uid);
  const planRef = db.collection('trainingPlans').doc(planId);
  const enrollmentRef = userRef.collection('trainingPlanEnrollments').doc(planId);
  const adherenceRef = userRef.collection('trainingPlanAdherence').doc(planId);

  let result = null;
  await db.runTransaction(async (transaction) => {
    const [planSnap, enrollmentSnap] = await Promise.all([
      transaction.get(planRef),
      transaction.get(enrollmentRef),
    ]);
    if (!planSnap.exists) throw httpsError('not-found', 'Training plan was not found.');
    if (!enrollmentSnap.exists) throw httpsError('failed-precondition', 'Join the plan before syncing progress.');

    const plan = { id: planSnap.id, ...planSnap.data() };
    const enrollment = { id: enrollmentSnap.id, ...enrollmentSnap.data(), uid, planId };
    const summary = buildTrainingPlanAdherenceSummary(plan, enrollment);
    const awards = trainingPlanBadgeAwards(plan, enrollment);

    transaction.set(adherenceRef, {
      ...summary,
      uid,
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });

    awards.forEach((award) => {
      transaction.set(userRef.collection('trainingPlanBadges').doc(award.id), {
        ...award,
        uid,
        awardedAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      }, { merge: true });
    });

    result = {
      planId,
      adherence: summary,
      awardedBadgeIds: awards.map(award => award.badgeId),
    };
  });

  return result;
}

module.exports = {
  TRAINING_PLAN_BADGES,
  buildCompletedPlanDayPatch,
  buildTrainingPlanAdherenceSummary,
  dayKeysDueThroughToday,
  syncTrainingPlanProgress,
  totalPlanWorkoutDays,
  trainingPlanBadgeAwards,
  trainingPlanBadgeDocId,
};
