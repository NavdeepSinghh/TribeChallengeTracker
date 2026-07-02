export const TRAINING_PLAN_ALL_FILTER = "all";

export const TRAINING_PLAN_GOALS = [
  { id: "strength", label: "Strength" },
  { id: "endurance", label: "Endurance" },
  { id: "mobility", label: "Mobility" },
  { id: "general", label: "General" },
];

export const TRAINING_PLAN_LEVELS = [
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
];

export const TRAINING_PLAN_ENROLLMENT_STATUS = {
  ACTIVE: "active",
  PAUSED: "paused",
  COMPLETED: "completed",
  LEFT: "left",
};

export const TRAINING_PLAN_BADGES = [
  {
    id: "plan_first_workout",
    label: "Plan Starter",
    description: "Complete your first guided workout from a training plan.",
    threshold: 1,
  },
  {
    id: "plan_week_one",
    label: "Week One Locked",
    description: "Complete the first week of plan workouts.",
    threshold: "first_week",
  },
  {
    id: "plan_finisher",
    label: "Plan Finisher",
    description: "Complete every workout in a training plan.",
    threshold: "finish",
  },
];

function cleanString(value) {
  return String(value || "").trim();
}

function cleanList(value) {
  return Array.isArray(value)
    ? value.map(item => cleanString(item)).filter(Boolean)
    : [];
}

function uniqueList(value) {
  return [...new Set(cleanList(value))];
}

function cleanExerciseSwapMap(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.entries(value).reduce((swaps, [key, replacement]) => {
    const cleanKey = cleanString(key);
    const cleanReplacement = cleanString(replacement);
    return cleanKey && cleanReplacement ? { ...swaps, [cleanKey]: cleanReplacement } : swaps;
  }, {});
}

function cleanInt(value, fallback = 0) {
  const number = Number(value);
  return Number.isInteger(number) ? number : fallback;
}

function readNonNegativeInt(value) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isInteger(number) && number >= 0 ? number : null;
}

function readTimestamp(value) {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate().toISOString();
  if (typeof value === "string") return value;
  return null;
}

function mapPlanExercise(value = {}) {
  return {
    exerciseId: cleanString(value.exerciseId),
    targetSets: cleanInt(value.targetSets, 0),
    targetReps: cleanString(value.targetReps),
    restSeconds: cleanInt(value.restSeconds, 0),
    notes: cleanString(value.notes),
  };
}

function mapWorkoutTemplate(value = {}) {
  return {
    name: cleanString(value.name),
    estimatedMinutes: cleanInt(value.estimatedMinutes, 0),
    exercises: Array.isArray(value.exercises)
      ? value.exercises.map(mapPlanExercise).filter(exercise => exercise.exerciseId)
      : [],
  };
}

function mapScheduleDay(value = {}) {
  const type = cleanString(value.type || "rest");
  const day = {
    dayIndex: cleanInt(value.dayIndex, 0),
    label: cleanString(value.label),
    type,
    notes: cleanString(value.notes),
  };
  if (type === "workout") {
    day.workoutTemplate = mapWorkoutTemplate(value.workoutTemplate);
  }
  return day;
}

export function mapTrainingPlanDocument(id, data = {}) {
  const documentId = cleanString(id || data.id);
  const schedule = Array.isArray(data.schedule)
    ? data.schedule.map(mapScheduleDay).filter(day => day.dayIndex > 0).sort((a, b) => a.dayIndex - b.dayIndex)
    : [];

  return {
    id: documentId,
    slug: cleanString(data.slug || documentId.replace(/_/g, "-")),
    name: cleanString(data.name),
    status: cleanString(data.status || "draft"),
    source: cleanString(data.source || "official"),
    visibility: cleanString(data.visibility || "public"),
    version: cleanInt(data.version, 1),
    goal: cleanString(data.goal || "general"),
    level: cleanString(data.level || "beginner"),
    frequencyDaysPerWeek: cleanInt(data.frequencyDaysPerWeek, 0),
    durationWeeks: cleanInt(data.durationWeeks, 0),
    estimatedMinutesPerSession: cleanInt(data.estimatedMinutesPerSession, 0),
    equipment: cleanList(data.equipment),
    focusMuscles: cleanList(data.focusMuscles),
    tags: cleanList(data.tags),
    description: cleanString(data.description),
    attribution: {
      creatorUid: cleanString(data.attribution?.creatorUid || "tribelog"),
      displayName: cleanString(data.attribution?.displayName || "TribeLog Official"),
    },
    progression: {
      type: cleanString(data.progression?.type || "manual"),
      notes: cleanString(data.progression?.notes),
    },
    schedule,
    updatedAt: readTimestamp(data.updatedAt),
    updatedBy: cleanString(data.updatedBy),
  };
}

export function trainingPlanWorkoutDays(plan = {}) {
  return Array.isArray(plan.schedule)
    ? plan.schedule.filter(day => day.type === "workout" && day.workoutTemplate)
    : [];
}

export function trainingPlanExerciseCount(plan = {}) {
  return trainingPlanWorkoutDays(plan).reduce((total, day) => (
    total + (day.workoutTemplate?.exercises?.length || 0)
  ), 0);
}

export function trainingPlanSummary(plan = {}) {
  const parts = [];
  if (plan.frequencyDaysPerWeek) parts.push(`${plan.frequencyDaysPerWeek} days/week`);
  if (plan.durationWeeks) parts.push(`${plan.durationWeeks} weeks`);
  if (plan.estimatedMinutesPerSession) parts.push(`${plan.estimatedMinutesPerSession} min/session`);
  return parts.join(" · ");
}

export function trainingPlanPreviewWorkouts(plan = {}, limit = 3) {
  return trainingPlanWorkoutDays(plan).slice(0, limit).map(day => ({
    dayIndex: day.dayIndex,
    label: day.label,
    name: day.workoutTemplate?.name || day.label,
    estimatedMinutes: day.workoutTemplate?.estimatedMinutes || plan.estimatedMinutesPerSession || 0,
    exerciseCount: day.workoutTemplate?.exercises?.length || 0,
    exercises: day.workoutTemplate?.exercises || [],
  }));
}

export function trainingPlanMatchesFilters(plan = {}, filters = {}) {
  const search = cleanString(filters.search).toLowerCase();
  const goal = filters.goal || TRAINING_PLAN_ALL_FILTER;
  const level = filters.level || TRAINING_PLAN_ALL_FILTER;

  if (goal !== TRAINING_PLAN_ALL_FILTER && plan.goal !== goal) return false;
  if (level !== TRAINING_PLAN_ALL_FILTER && plan.level !== level) return false;
  if (!search) return true;

  const searchText = [
    plan.name,
    plan.description,
    plan.goal,
    plan.level,
    ...plan.equipment,
    ...plan.focusMuscles,
    ...plan.tags,
    ...trainingPlanWorkoutDays(plan).flatMap(day => [
      day.workoutTemplate?.name,
      ...(day.workoutTemplate?.exercises || []).map(exercise => exercise.exerciseId),
    ]),
  ].join(" ").toLowerCase();

  return searchText.includes(search);
}

export function filterTrainingPlans(plans = [], filters = {}) {
  return [...plans]
    .filter(plan => trainingPlanMatchesFilters(plan, filters))
    .sort((left, right) => {
      const leftUpdated = left.updatedAt || "";
      const rightUpdated = right.updatedAt || "";
      if (leftUpdated !== rightUpdated) return rightUpdated.localeCompare(leftUpdated);
      return left.name.localeCompare(right.name);
    });
}

function labelFromId(value) {
  return cleanString(value)
    .split("_")
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function buildTrainingPlanFilterOptions(plans = []) {
  const goals = new Set();
  const levels = new Set();
  plans.forEach((plan) => {
    if (plan.goal) goals.add(plan.goal);
    if (plan.level) levels.add(plan.level);
  });
  return {
    goals: [...goals].sort().map(id => TRAINING_PLAN_GOALS.find(goal => goal.id === id) || { id, label: labelFromId(id) }),
    levels: [...levels].sort().map(id => TRAINING_PLAN_LEVELS.find(level => level.id === id) || { id, label: labelFromId(id) }),
  };
}

export function mapTrainingPlanAdherenceSummary(data = null) {
  if (!data || typeof data !== "object" || Array.isArray(data)) return null;
  const missedCount = readNonNegativeInt(data.missedCount);
  const dueCount = readNonNegativeInt(data.dueCount);
  const completedCount = readNonNegativeInt(data.completedCount);
  const completedDueCount = readNonNegativeInt(data.completedDueCount);
  const skippedDueCount = readNonNegativeInt(data.skippedDueCount);
  const totalWorkoutDays = readNonNegativeInt(data.totalWorkoutDays);
  const adherencePct = readNonNegativeInt(data.adherencePct);

  if (
    missedCount === null
    && dueCount === null
    && completedCount === null
    && completedDueCount === null
    && skippedDueCount === null
    && totalWorkoutDays === null
    && adherencePct === null
  ) {
    return null;
  }

  return {
    planId: cleanString(data.planId),
    planVersion: cleanInt(data.planVersion, 1),
    totalWorkoutDays,
    completedCount,
    dueCount,
    completedDueCount,
    skippedDueCount,
    missedCount,
    adherencePct,
    status: cleanString(data.status),
    lastCompletedDayKey: cleanString(data.lastCompletedDayKey),
    calculatedAtDate: cleanString(data.calculatedAtDate),
    updatedAt: readTimestamp(data.updatedAt),
  };
}

export function mapTrainingPlanEnrollmentDocument(id, data = {}) {
  const adherence = mapTrainingPlanAdherenceSummary(
    data.adherence || data.adherenceSummary || data.trustedAdherence
  );

  return {
    id: cleanString(data.id || id),
    uid: cleanString(data.uid),
    planId: cleanString(data.planId || id),
    planVersion: cleanInt(data.planVersion, 1),
    status: cleanString(data.status || TRAINING_PLAN_ENROLLMENT_STATUS.ACTIVE),
    startDate: cleanString(data.startDate),
    timezone: cleanString(data.timezone),
    completedDayKeys: cleanList(data.completedDayKeys),
    skippedDayKeys: cleanList(data.skippedDayKeys),
    customFrequencyDaysPerWeek: cleanInt(data.customFrequencyDaysPerWeek, 0),
    exerciseSwaps: cleanExerciseSwapMap(data.exerciseSwaps),
    currentDayIndex: cleanInt(data.currentDayIndex, 1),
    adherence,
    createdAt: readTimestamp(data.createdAt),
    updatedAt: readTimestamp(data.updatedAt),
  };
}

export function buildTrainingPlanEnrollment({ plan, timezone = "UTC", today = new Date() } = {}) {
  if (!plan?.id) {
    throw new Error("A training plan is required before enrollment.");
  }
  const startDate = today instanceof Date
    ? today.toISOString().slice(0, 10)
    : cleanString(today).slice(0, 10);
  return {
    id: plan.id,
    planId: plan.id,
    planVersion: plan.version || 1,
    status: TRAINING_PLAN_ENROLLMENT_STATUS.ACTIVE,
    startDate,
    timezone,
    completedDayKeys: [],
    skippedDayKeys: [],
    customFrequencyDaysPerWeek: 0,
    exerciseSwaps: {},
    currentDayIndex: 1,
  };
}

export function enrollmentForPlan(enrollments = [], planId = "") {
  return enrollments.find(enrollment => (
    enrollment.planId === planId
    && enrollment.status !== TRAINING_PLAN_ENROLLMENT_STATUS.LEFT
  )) || null;
}

function parseUtcDate(value) {
  const text = cleanString(value);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return null;
  return new Date(`${text}T00:00:00.000Z`);
}

export function selectTodayTrainingPlanWorkout(plan = {}, enrollment = {}, today = new Date()) {
  if (!plan?.schedule?.length || !enrollment?.startDate || enrollment.status !== TRAINING_PLAN_ENROLLMENT_STATUS.ACTIVE) {
    return null;
  }
  const startDate = parseUtcDate(enrollment.startDate);
  const todayDate = today instanceof Date ? today : parseUtcDate(today);
  if (!startDate || !todayDate) return null;
  const elapsedDays = Math.max(0, Math.floor((todayDate.getTime() - startDate.getTime()) / 86400000));
  const scheduleIndex = elapsedDays % plan.schedule.length;
  const weekIndex = Math.floor(elapsedDays / plan.schedule.length) + 1;
  const day = plan.schedule[scheduleIndex];
  if (!day) return null;
  return {
    ...day,
    weekIndex,
    dayKey: `w${weekIndex}-d${day.dayIndex}`,
    isWorkoutDay: day.type === "workout",
  };
}

export function readTrustedTrainingPlanMissedCount(enrollment = {}) {
  return readNonNegativeInt(enrollment.adherence?.missedCount)
    ?? readNonNegativeInt(enrollment.adherenceSummary?.missedCount)
    ?? readNonNegativeInt(enrollment.trustedAdherence?.missedCount)
    ?? readNonNegativeInt(enrollment.serverMissedCount)
    ?? null;
}

export function countMissedTrainingPlanWorkouts(plan = {}, enrollment = {}, today = new Date()) {
  if (enrollment.status !== TRAINING_PLAN_ENROLLMENT_STATUS.ACTIVE) {
    return 0;
  }
  const trustedMissedCount = readTrustedTrainingPlanMissedCount(enrollment);
  if (trustedMissedCount !== null) return trustedMissedCount;
  if (!plan?.schedule?.length || !enrollment?.startDate) {
    return 0;
  }
  const startDate = parseUtcDate(enrollment.startDate);
  const todayDate = today instanceof Date ? today : parseUtcDate(today);
  if (!startDate || !todayDate) return 0;
  const elapsedDays = Math.max(0, Math.floor((todayDate.getTime() - startDate.getTime()) / 86400000));
  const completed = new Set(cleanList(enrollment.completedDayKeys));
  const skipped = new Set(cleanList(enrollment.skippedDayKeys));
  let missed = 0;

  for (let offset = 0; offset < elapsedDays; offset += 1) {
    const scheduleIndex = offset % plan.schedule.length;
    const weekIndex = Math.floor(offset / plan.schedule.length) + 1;
    const day = plan.schedule[scheduleIndex];
    if (day?.type !== "workout") continue;
    const dayKey = `w${weekIndex}-d${day.dayIndex}`;
    if (!completed.has(dayKey) && !skipped.has(dayKey)) {
      missed += 1;
    }
  }

  return missed;
}

export function dueTrainingPlanWorkoutKeys(plan = {}, enrollment = {}, today = new Date()) {
  if (!plan?.schedule?.length || !enrollment?.startDate || enrollment.status !== TRAINING_PLAN_ENROLLMENT_STATUS.ACTIVE) {
    return [];
  }
  const startDate = parseUtcDate(enrollment.startDate);
  const todayDate = today instanceof Date ? today : parseUtcDate(today);
  if (!startDate || !todayDate) return [];
  const elapsedDays = Math.max(0, Math.floor((todayDate.getTime() - startDate.getTime()) / 86400000));
  const totalWorkoutDays = trainingPlanWorkoutDays(plan).length * Math.max(1, plan.durationWeeks || 1);
  const dueKeys = [];

  for (let offset = 0; offset <= elapsedDays; offset += 1) {
    const scheduleIndex = offset % plan.schedule.length;
    const weekIndex = Math.floor(offset / plan.schedule.length) + 1;
    const day = plan.schedule[scheduleIndex];
    if (day?.type === "workout") {
      dueKeys.push(`w${weekIndex}-d${day.dayIndex}`);
    }
  }

  return dueKeys.slice(0, totalWorkoutDays);
}

export function buildTrainingPlanAdherenceSnapshot(plan = {}, enrollment = {}, today = new Date()) {
  const completed = new Set(cleanList(enrollment.completedDayKeys));
  const skipped = new Set(cleanList(enrollment.skippedDayKeys));
  const dueKeys = dueTrainingPlanWorkoutKeys(plan, enrollment, today);
  const totalWorkoutDays = trainingPlanWorkoutDays(plan).length * Math.max(1, plan.durationWeeks || 1);
  const completedDueCount = dueKeys.filter(key => completed.has(key)).length;
  const skippedDueCount = dueKeys.filter(key => skipped.has(key)).length;
  const localMissedCount = dueKeys.filter(key => !completed.has(key) && !skipped.has(key)).length;
  const trusted = enrollment.adherence || enrollment.adherenceSummary || enrollment.trustedAdherence || {};
  const trustedTotalWorkoutDays = readNonNegativeInt(trusted.totalWorkoutDays);
  const trustedCompletedCount = readNonNegativeInt(trusted.completedCount);
  const trustedCompletedDueCount = readNonNegativeInt(trusted.completedDueCount);
  const trustedSkippedDueCount = readNonNegativeInt(trusted.skippedDueCount);
  const trustedDueCount = readNonNegativeInt(trusted.dueCount);
  const trustedMissedCount = readNonNegativeInt(trusted.missedCount);
  const trustedAdherencePct = readNonNegativeInt(trusted.adherencePct);
  const completedCount = completed.size;
  const dueCount = dueKeys.length;
  const finalTotalWorkoutDays = trustedTotalWorkoutDays ?? totalWorkoutDays;
  const finalCompletedCount = trustedCompletedCount ?? completedCount;
  return {
    planId: enrollment.planId || plan.id || "",
    totalWorkoutDays: finalTotalWorkoutDays,
    completedCount: finalCompletedCount,
    completedDueCount: trustedCompletedDueCount ?? completedDueCount,
    skippedDueCount: trustedSkippedDueCount ?? skippedDueCount,
    dueCount: trustedDueCount ?? dueCount,
    missedCount: trustedMissedCount ?? localMissedCount,
    adherencePct: trustedAdherencePct ?? (dueCount > 0 ? Math.round((completedDueCount / dueCount) * 100) : 0),
    isComplete: finalTotalWorkoutDays > 0 && finalCompletedCount >= finalTotalWorkoutDays,
  };
}

export function trainingPlanBadgeProgress(plan = {}, enrollment = {}) {
  const snapshot = buildTrainingPlanAdherenceSnapshot(plan, enrollment);
  const firstWeekTarget = Math.max(1, trainingPlanWorkoutDays(plan).length);
  return TRAINING_PLAN_BADGES.map((badge) => {
    const target = badge.threshold === "first_week"
      ? firstWeekTarget
      : badge.threshold === "finish"
        ? snapshot.totalWorkoutDays
        : badge.threshold;
    const current = Math.min(snapshot.completedCount, target);
    return {
      ...badge,
      current,
      target,
      earned: target > 0 && current >= target,
    };
  });
}

export function buildSkippedTrainingPlanDayEnrollment(enrollment = {}, dayKey = "") {
  const cleanDayKey = cleanString(dayKey);
  if (!cleanDayKey) throw new Error("A plan day is required before skipping.");
  return {
    ...enrollment,
    completedDayKeys: uniqueList(enrollment.completedDayKeys).filter(key => key !== cleanDayKey),
    skippedDayKeys: uniqueList([...(enrollment.skippedDayKeys || []), cleanDayKey]),
  };
}

export function buildTrainingPlanFrequencyAdjustment(enrollment = {}, daysPerWeek = 0) {
  const frequency = cleanInt(daysPerWeek, 0);
  if (frequency < 1 || frequency > 7) {
    throw new Error("Training plan frequency must be between 1 and 7 days per week.");
  }
  return {
    ...enrollment,
    customFrequencyDaysPerWeek: frequency,
  };
}

export function trainingPlanExerciseSwapKey({ dayKey = "", exerciseId = "" } = {}) {
  const cleanDayKey = cleanString(dayKey);
  const cleanExerciseId = cleanString(exerciseId);
  if (!cleanDayKey || !cleanExerciseId) {
    throw new Error("A plan day and exercise are required before swapping.");
  }
  return `${cleanDayKey}:${cleanExerciseId}`;
}

export function buildTrainingPlanExerciseSwap(enrollment = {}, { dayKey = "", exerciseId = "", replacementExerciseId = "" } = {}) {
  const replacement = cleanString(replacementExerciseId);
  if (!replacement) throw new Error("A replacement exercise is required.");
  return {
    ...enrollment,
    exerciseSwaps: {
      ...cleanExerciseSwapMap(enrollment.exerciseSwaps),
      [trainingPlanExerciseSwapKey({ dayKey, exerciseId })]: replacement,
    },
  };
}

export function applyTrainingPlanExerciseSwaps(day = {}, enrollment = {}) {
  const swaps = cleanExerciseSwapMap(enrollment.exerciseSwaps);
  if (!day?.workoutTemplate?.exercises?.length || !day.dayKey || !Object.keys(swaps).length) {
    return day;
  }
  return {
    ...day,
    workoutTemplate: {
      ...day.workoutTemplate,
      exercises: day.workoutTemplate.exercises.map(exercise => {
        const swapKey = trainingPlanExerciseSwapKey({ dayKey: day.dayKey, exerciseId: exercise.exerciseId });
        const replacementExerciseId = swaps[swapKey];
        return replacementExerciseId
          ? { ...exercise, originalExerciseId: exercise.exerciseId, exerciseId: replacementExerciseId }
          : exercise;
      }),
    },
  };
}

const LEVEL_RANK = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
};

function hasOverlap(left = [], right = []) {
  const rightSet = new Set(cleanList(right));
  return cleanList(left).some(item => rightSet.has(item));
}

export function recommendExerciseSubstitutions(originalExercise = {}, exercises = [], { limit = 4 } = {}) {
  if (!originalExercise?.id) return [];
  const originalLevel = LEVEL_RANK[originalExercise.level] || 1;
  return exercises
    .filter(candidate => candidate?.id && candidate.id !== originalExercise.id)
    .filter(candidate => (LEVEL_RANK[candidate.level] || 1) <= originalLevel + 1)
    .filter(candidate => (
      candidate.movementPattern === originalExercise.movementPattern
      || hasOverlap(candidate.primaryMuscles, originalExercise.primaryMuscles)
    ))
    .filter(candidate => (
      !originalExercise.equipment?.length
      || hasOverlap(candidate.equipment, originalExercise.equipment)
      || cleanList(candidate.equipment).includes("bodyweight")
    ))
    .sort((left, right) => {
      const leftScore = Number(left.movementPattern === originalExercise.movementPattern) + Number(hasOverlap(left.primaryMuscles, originalExercise.primaryMuscles));
      const rightScore = Number(right.movementPattern === originalExercise.movementPattern) + Number(hasOverlap(right.primaryMuscles, originalExercise.primaryMuscles));
      if (leftScore !== rightScore) return rightScore - leftScore;
      return left.name.localeCompare(right.name);
    })
    .slice(0, limit);
}
