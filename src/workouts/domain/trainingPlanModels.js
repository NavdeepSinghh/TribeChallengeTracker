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

function cleanString(value) {
  return String(value || "").trim();
}

function cleanList(value) {
  return Array.isArray(value)
    ? value.map(item => cleanString(item)).filter(Boolean)
    : [];
}

function cleanInt(value, fallback = 0) {
  const number = Number(value);
  return Number.isInteger(number) ? number : fallback;
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
