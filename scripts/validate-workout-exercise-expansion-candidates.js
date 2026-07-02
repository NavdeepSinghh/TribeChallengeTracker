const fs = require('fs');
const path = require('path');

const DEFAULT_FILE = 'workout-exercise-expansion-candidates.json';
const VALID_STATUS = new Set(['draft_pending_review', 'approved', 'archived']);
const VALID_CATEGORIES = new Set(['upper_push', 'upper_pull', 'lower_body', 'core', 'cardio', 'mobility', 'power']);
const REQUIRED_LEVEL_VOCABULARY = ['beginner', 'intermediate', 'advanced'];
const UNSUPPORTED_CLAIM_PATTERN = /\b(cure|treat|diagnose|heal|rehab|therapy|injury|pain[- ]?free|guarantee|medical|doctor|clinical|prescribe)\b/i;

function cleanString(value) {
  return String(value || '').trim().replace(/\s+/g, ' ');
}

function slugify(value) {
  return cleanString(value)
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
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

function assertSafeText(recordId, fieldName, value) {
  const text = Array.isArray(value) ? value.join(' ') : cleanString(value);
  if (UNSUPPORTED_CLAIM_PATTERN.test(text)) {
    throw new Error(`${recordId}: ${fieldName} contains unsupported health or medical claim language.`);
  }
  return text;
}

function assertPositiveInt(recordId, fieldName, value, { min = 0, max = 999 } = {}) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < min || number > max) {
    throw new Error(`${recordId}: ${fieldName} must be an integer between ${min} and ${max}.`);
  }
  return number;
}

function validateUniqueSlugList(recordId, fieldName, values = [], { min = 1 } = {}) {
  if (!Array.isArray(values) || values.length < min) {
    throw new Error(`${recordId}: ${fieldName} must include at least ${min} item${min === 1 ? '' : 's'}.`);
  }
  const seen = new Set();
  return values.map((value) => {
    const item = assertSafeText(recordId, fieldName, value);
    const id = slugify(item);
    if (!/^[a-z0-9_]{3,100}$/.test(id)) {
      throw new Error(`${recordId}: ${fieldName} item ${item} must resolve to snake_case.`);
    }
    if (seen.has(id)) {
      throw new Error(`${recordId}: ${fieldName} contains duplicate ${id}.`);
    }
    seen.add(id);
    return id;
  });
}

function validateMetadataVocabulary(vocabulary = {}) {
  const equipment = validateUniqueSlugList('metadataVocabulary', 'equipment', vocabulary.equipment, { min: 8 });
  const levels = validateUniqueSlugList('metadataVocabulary', 'levels', vocabulary.levels, { min: REQUIRED_LEVEL_VOCABULARY.length });
  REQUIRED_LEVEL_VOCABULARY.forEach((level) => {
    if (!levels.includes(level)) {
      throw new Error(`metadataVocabulary: levels must include ${level}.`);
    }
  });
  assertSafeText('metadataVocabulary', 'policy', vocabulary.policy);
  return {
    equipment,
    levels,
    policy: cleanString(vocabulary.policy),
  };
}

function validateDeferredCandidates(deferredCandidates = {}, candidateIds = new Set()) {
  const phase4 = deferredCandidates.phase4CoachPro || {};
  assertSafeText('deferredCandidates.phase4CoachPro', 'reason', phase4.reason);
  const exercises = validateUniqueSlugList('deferredCandidates.phase4CoachPro', 'exercises', phase4.exercises, { min: 1 });
  exercises.forEach((exerciseId) => {
    if (candidateIds.has(exerciseId)) {
      throw new Error(`${exerciseId}: deferred candidate cannot also be in the active expansion list.`);
    }
  });
  return {
    phase4CoachPro: {
      reason: cleanString(phase4.reason),
      exercises,
    },
  };
}

function validateGroup(group = {}) {
  const id = slugify(group.id);
  if (!/^[a-z0-9_]{3,100}$/.test(id)) {
    throw new Error(`${group.id || 'group'}: id must be snake_case.`);
  }
  const category = cleanString(group.category);
  if (!VALID_CATEGORIES.has(category)) {
    throw new Error(`${id}: category must be one of ${[...VALID_CATEGORIES].join(', ')}.`);
  }
  const assetBatchStart = assertPositiveInt(id, 'assetBatchStart', group.assetBatchStart, { min: 6, max: 99 });
  const primaryMuscles = Array.isArray(group.primaryMuscles)
    ? group.primaryMuscles.map(slugify).filter(Boolean)
    : [];
  if (primaryMuscles.length === 0) {
    throw new Error(`${id}: primaryMuscles must include at least one item.`);
  }
  if (!Array.isArray(group.exercises) || group.exercises.length === 0) {
    throw new Error(`${id}: exercises must include at least one item.`);
  }
  const exercises = group.exercises.map((name) => {
    const cleanName = assertSafeText(id, 'exercise name', name);
    const exerciseId = slugify(cleanName);
    if (!/^[a-z0-9_]{3,100}$/.test(exerciseId)) {
      throw new Error(`${id}: invalid exercise name ${cleanName}.`);
    }
    return {
      id: exerciseId,
      name: cleanName,
      category,
      primaryMuscles,
      assetBatchStart,
      reviewStatus: 'candidate',
    };
  });

  return {
    id,
    category,
    assetBatchStart,
    primaryMuscles,
    exercises,
  };
}

function validateExpansionCandidates(plan = {}) {
  const version = assertPositiveInt('plan', 'version', plan.version, { min: 1, max: 100 });
  const status = cleanString(plan.status);
  if (!VALID_STATUS.has(status)) {
    throw new Error(`plan: status must be one of ${[...VALID_STATUS].join(', ')}.`);
  }
  const targetTotalOfficialExercises = assertPositiveInt('plan', 'targetTotalOfficialExercises', plan.targetTotalOfficialExercises, { min: 51, max: 1000 });
  const existingOfficialExerciseCount = assertPositiveInt('plan', 'existingOfficialExerciseCount', plan.existingOfficialExerciseCount, { min: 1, max: 500 });
  const candidateCountTarget = assertPositiveInt('plan', 'candidateCountTarget', plan.candidateCountTarget, { min: 1, max: 500 });
  assertSafeText('plan', 'assetReviewPolicy', plan.assetReviewPolicy);
  const metadataVocabulary = validateMetadataVocabulary(plan.metadataVocabulary);

  if (!Array.isArray(plan.groups) || plan.groups.length < 3) {
    throw new Error('plan: groups must include at least three groups.');
  }

  const groups = plan.groups.map(validateGroup);
  const allExercises = groups.flatMap(group => group.exercises);
  const seenIds = new Set();
  allExercises.forEach((exercise) => {
    if (seenIds.has(exercise.id)) {
      throw new Error(`${exercise.id}: duplicate expansion exercise id.`);
    }
    seenIds.add(exercise.id);
  });

  if (allExercises.length !== candidateCountTarget) {
    throw new Error(`plan: candidateCountTarget is ${candidateCountTarget} but found ${allExercises.length} exercises.`);
  }
  if (existingOfficialExerciseCount + allExercises.length < targetTotalOfficialExercises) {
    throw new Error('plan: candidates do not reach targetTotalOfficialExercises.');
  }
  const deferredCandidates = validateDeferredCandidates(plan.deferredCandidates, seenIds);

  return {
    version,
    status,
    targetTotalOfficialExercises,
    existingOfficialExerciseCount,
    candidateCountTarget,
    assetReviewPolicy: cleanString(plan.assetReviewPolicy),
    metadataVocabulary,
    deferredCandidates,
    groups,
    exercises: allExercises,
  };
}

function loadExpansionCandidates(filePath) {
  return validateExpansionCandidates(readJson(filePath));
}

function main() {
  const options = parseArgs();
  const plan = loadExpansionCandidates(options.file);
  console.log(`Validated ${plan.exercises.length} expansion candidates across ${plan.groups.length} groups.`);
}

if (require.main === module) {
  main();
}

module.exports = {
  loadExpansionCandidates,
  parseArgs,
  slugify,
  validateExpansionCandidates,
  validateMetadataVocabulary,
  validateGroup,
};
