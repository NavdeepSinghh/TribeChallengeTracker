const fs = require('fs');
const path = require('path');

const DEFAULT_FILE = 'workout-training-plans-seed.json';
const EXERCISE_BATCH_PATTERN = /^workout-exercise-seed-batch-\d+\.json$/;

const VALID_STATUS = new Set(['draft', 'published', 'archived']);
const VALID_SOURCE = new Set(['official', 'community', 'coach']);
const VALID_VISIBILITY = new Set(['public', 'tribe', 'private']);
const VALID_LEVEL = new Set(['beginner', 'intermediate', 'advanced']);
const VALID_GOAL = new Set(['strength', 'endurance', 'mobility', 'general']);
const VALID_DAY_TYPE = new Set(['workout', 'rest', 'mobility']);
const UNSUPPORTED_CLAIM_PATTERN = /\b(cure|treat|diagnose|heal|rehab|therapy|injury|pain[- ]?free|guarantee|medical|doctor|clinical|prescribe)\b/i;

function cleanString(value) {
  return String(value || '').trim();
}

function parseArgs(argv = process.argv.slice(2)) {
  const options = {
    file: path.resolve(__dirname, DEFAULT_FILE),
  };

  argv.forEach((arg, index) => {
    if (arg === '--file') {
      options.file = path.resolve(process.cwd(), argv[index + 1]);
    } else if (arg.startsWith('--file=')) {
      options.file = path.resolve(process.cwd(), arg.split('=').slice(1).join('='));
    }
  });

  return options;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function loadOfficialExerciseIds(scriptsDir = __dirname) {
  const ids = new Set();
  fs.readdirSync(scriptsDir)
    .filter(fileName => EXERCISE_BATCH_PATTERN.test(fileName))
    .sort()
    .forEach((fileName) => {
      const exercises = readJson(path.resolve(scriptsDir, fileName));
      exercises.forEach((exercise) => {
        const id = cleanString(exercise.id);
        if (id) ids.add(id);
      });
    });

  if (ids.size < 50) {
    throw new Error(`Expected at least 50 official exercise ids; found ${ids.size}.`);
  }
  return ids;
}

function assertSafeText(planId, label, value) {
  const text = Array.isArray(value) ? value.join(' ') : cleanString(value);
  if (UNSUPPORTED_CLAIM_PATTERN.test(text)) {
    throw new Error(`${planId}: ${label} contains unsupported health or medical claim language.`);
  }
  return text;
}

function cleanList(planId, fieldName, value, { min = 1 } = {}) {
  if (!Array.isArray(value)) {
    throw new Error(`${planId}: ${fieldName} must be an array.`);
  }
  const list = value.map(cleanString).filter(Boolean);
  if (list.length < min) {
    throw new Error(`${planId}: ${fieldName} must include at least ${min} value(s).`);
  }
  assertSafeText(planId, fieldName, list);
  return list;
}

function validatePositiveInt(planId, fieldName, value, { min = 1, max = 999 } = {}) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < min || number > max) {
    throw new Error(`${planId}: ${fieldName} must be an integer between ${min} and ${max}.`);
  }
  return number;
}

function validateEnum(planId, fieldName, value, validValues) {
  const clean = cleanString(value);
  if (!validValues.has(clean)) {
    throw new Error(`${planId}: ${fieldName} must be one of ${[...validValues].join(', ')}.`);
  }
  return clean;
}

function validateExerciseStep(planId, dayIndex, exercise, exerciseIds) {
  const exerciseId = cleanString(exercise.exerciseId);
  if (!exerciseIds.has(exerciseId)) {
    throw new Error(`${planId}: day ${dayIndex} references unknown exerciseId ${exerciseId || '(empty)'}.`);
  }
  const targetSets = validatePositiveInt(planId, `day ${dayIndex} ${exerciseId}.targetSets`, exercise.targetSets, { min: 1, max: 12 });
  const restSeconds = validatePositiveInt(planId, `day ${dayIndex} ${exerciseId}.restSeconds`, exercise.restSeconds, { min: 0, max: 300 });
  const targetReps = assertSafeText(planId, `day ${dayIndex} ${exerciseId}.targetReps`, exercise.targetReps);
  if (!targetReps) {
    throw new Error(`${planId}: day ${dayIndex} ${exerciseId}.targetReps is required.`);
  }
  const notes = assertSafeText(planId, `day ${dayIndex} ${exerciseId}.notes`, exercise.notes);
  return {
    exerciseId,
    targetSets,
    targetReps,
    restSeconds,
    notes,
  };
}

function validateScheduleDay(planId, day, exerciseIds) {
  const dayIndex = validatePositiveInt(planId, 'schedule.dayIndex', day.dayIndex, { min: 1, max: 14 });
  const label = assertSafeText(planId, `day ${dayIndex}.label`, day.label);
  const type = validateEnum(planId, `day ${dayIndex}.type`, day.type, VALID_DAY_TYPE);
  const notes = assertSafeText(planId, `day ${dayIndex}.notes`, day.notes);

  if (!label) {
    throw new Error(`${planId}: day ${dayIndex}.label is required.`);
  }

  if (type !== 'workout') {
    return { dayIndex, label, type, notes };
  }

  if (!day.workoutTemplate || typeof day.workoutTemplate !== 'object') {
    throw new Error(`${planId}: day ${dayIndex}.workoutTemplate is required for workout days.`);
  }

  const workoutTemplate = {
    name: assertSafeText(planId, `day ${dayIndex}.workoutTemplate.name`, day.workoutTemplate.name),
    estimatedMinutes: validatePositiveInt(planId, `day ${dayIndex}.workoutTemplate.estimatedMinutes`, day.workoutTemplate.estimatedMinutes, { min: 5, max: 180 }),
    exercises: Array.isArray(day.workoutTemplate.exercises)
      ? day.workoutTemplate.exercises.map(exercise => validateExerciseStep(planId, dayIndex, exercise, exerciseIds))
      : [],
  };

  if (!workoutTemplate.name) {
    throw new Error(`${planId}: day ${dayIndex}.workoutTemplate.name is required.`);
  }
  if (workoutTemplate.exercises.length === 0) {
    throw new Error(`${planId}: day ${dayIndex}.workoutTemplate.exercises must include at least one exercise.`);
  }

  return {
    dayIndex,
    label,
    type,
    notes,
    workoutTemplate,
  };
}

function validateTrainingPlan(record, exerciseIds = loadOfficialExerciseIds()) {
  const id = cleanString(record && record.id);
  if (!/^[a-z0-9_]{3,80}$/.test(id)) {
    throw new Error(`${id || 'record'}: id must be snake_case.`);
  }

  const slug = cleanString(record.slug);
  if (!/^[a-z0-9-]{3,100}$/.test(slug)) {
    throw new Error(`${id}: slug must be kebab-case.`);
  }

  const schedule = Array.isArray(record.schedule)
    ? record.schedule.map(day => validateScheduleDay(id, day, exerciseIds)).sort((a, b) => a.dayIndex - b.dayIndex)
    : [];

  if (schedule.length < 3) {
    throw new Error(`${id}: schedule must include at least three days.`);
  }
  const workoutDayCount = schedule.filter(day => day.type === 'workout').length;
  const frequencyDaysPerWeek = validatePositiveInt(id, 'frequencyDaysPerWeek', record.frequencyDaysPerWeek, { min: 1, max: 7 });
  if (workoutDayCount > frequencyDaysPerWeek) {
    throw new Error(`${id}: schedule has ${workoutDayCount} workout days but frequencyDaysPerWeek is ${frequencyDaysPerWeek}.`);
  }

  const name = assertSafeText(id, 'name', record.name);
  const description = assertSafeText(id, 'description', record.description);
  const progressionNotes = assertSafeText(id, 'progression.notes', record.progression && record.progression.notes);

  if (!name || !description) {
    throw new Error(`${id}: name and description are required.`);
  }

  return {
    id,
    slug,
    name,
    status: validateEnum(id, 'status', record.status, VALID_STATUS),
    source: validateEnum(id, 'source', record.source, VALID_SOURCE),
    visibility: validateEnum(id, 'visibility', record.visibility, VALID_VISIBILITY),
    version: validatePositiveInt(id, 'version', record.version, { min: 1, max: 100 }),
    goal: validateEnum(id, 'goal', record.goal, VALID_GOAL),
    level: validateEnum(id, 'level', record.level, VALID_LEVEL),
    frequencyDaysPerWeek,
    durationWeeks: validatePositiveInt(id, 'durationWeeks', record.durationWeeks, { min: 1, max: 52 }),
    estimatedMinutesPerSession: validatePositiveInt(id, 'estimatedMinutesPerSession', record.estimatedMinutesPerSession, { min: 5, max: 180 }),
    equipment: cleanList(id, 'equipment', record.equipment),
    focusMuscles: cleanList(id, 'focusMuscles', record.focusMuscles),
    tags: cleanList(id, 'tags', record.tags),
    description,
    attribution: {
      creatorUid: cleanString(record.attribution && record.attribution.creatorUid) || 'tribelog',
      displayName: assertSafeText(id, 'attribution.displayName', record.attribution && record.attribution.displayName) || 'TribeLog Official',
    },
    progression: {
      type: cleanString(record.progression && record.progression.type) || 'manual',
      notes: progressionNotes,
    },
    schedule,
  };
}

function validateTrainingPlans(records, options = {}) {
  if (!Array.isArray(records)) {
    throw new Error('Workout training plans file must be an array.');
  }
  const exerciseIds = options.exerciseIds || loadOfficialExerciseIds();
  const seen = new Set();
  return records.map((record) => {
    const plan = validateTrainingPlan(record, exerciseIds);
    if (seen.has(plan.id)) {
      throw new Error(`${plan.id}: duplicate plan id.`);
    }
    seen.add(plan.id);
    return plan;
  });
}

function loadTrainingPlans(filePath, options = {}) {
  return validateTrainingPlans(readJson(filePath), options);
}

function main() {
  const options = parseArgs();
  const plans = loadTrainingPlans(options.file);
  console.log(`Validated ${plans.length} official workout training plans.`);
  plans.forEach((plan) => {
    console.log(`- ${plan.id}: ${plan.frequencyDaysPerWeek} days/week, ${plan.durationWeeks} weeks, ${plan.schedule.filter(day => day.type === 'workout').length} workouts`);
  });
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

module.exports = {
  loadOfficialExerciseIds,
  loadTrainingPlans,
  parseArgs,
  validateTrainingPlan,
  validateTrainingPlans,
};
