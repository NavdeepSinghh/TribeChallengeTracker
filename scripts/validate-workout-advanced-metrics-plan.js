const fs = require('fs');
const path = require('path');

const DEFAULT_FILE = 'workout-advanced-metrics-plan.json';
const VALID_STATUS = new Set(['draft_pending_tribe_vote', 'approved', 'archived']);
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

function assertSafeText(recordId, fieldName, value) {
  const text = Array.isArray(value) ? value.join(' ') : cleanString(value);
  if (UNSUPPORTED_CLAIM_PATTERN.test(text)) {
    throw new Error(`${recordId}: ${fieldName} contains unsupported health or medical claim language.`);
  }
  return text;
}

function assertSnakeId(recordId, fieldName, value) {
  const clean = cleanString(value);
  if (!/^[a-z0-9_]{3,80}$/.test(clean)) {
    throw new Error(`${recordId}: ${fieldName} must be snake_case.`);
  }
  return clean;
}

function assertPositiveInt(recordId, fieldName, value, { min = 0, max = 999 } = {}) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < min || number > max) {
    throw new Error(`${recordId}: ${fieldName} must be an integer between ${min} and ${max}.`);
  }
  return number;
}

function validateMinimumData(recordId, minimumData) {
  if (!minimumData || typeof minimumData !== 'object' || Array.isArray(minimumData)) {
    throw new Error(`${recordId}: minimumData is required.`);
  }
  return Object.fromEntries(
    Object.entries(minimumData).map(([key, value]) => [
      assertSnakeId(recordId, `minimumData.${key}`, key),
      assertPositiveInt(recordId, `minimumData.${key}`, value),
    ])
  );
}

function validateVoteOption(option) {
  const id = assertSnakeId('voteOption', 'id', option && option.id);
  const label = assertSafeText(id, 'label', option.label);
  const description = assertSafeText(id, 'description', option.description);
  const releaseShape = assertSafeText(id, 'releaseShape', option.releaseShape);
  const insufficientDataCopy = assertSafeText(id, 'insufficientDataCopy', option.insufficientDataCopy);
  const minimumData = validateMinimumData(id, option.minimumData);
  if (id === 'progressive_overload_suggestions') {
    if (minimumData.completed_sessions < 4) {
      throw new Error(`${id}: minimumData.completed_sessions must be at least 4.`);
    }
    if (minimumData.sessions_per_exercise < 4) {
      throw new Error(`${id}: minimumData.sessions_per_exercise must be at least 4.`);
    }
    if (minimumData.training_weeks_per_exercise < 2) {
      throw new Error(`${id}: minimumData.training_weeks_per_exercise must be at least 2.`);
    }
  }
  if (!label || !description || !releaseShape || !insufficientDataCopy) {
    throw new Error(`${id}: label, description, releaseShape, and insufficientDataCopy are required.`);
  }
  return {
    id,
    label,
    description,
    releaseShape,
    minimumData,
    insufficientDataCopy,
  };
}

function validateMetric(metric, optionIds) {
  const id = assertSnakeId('metric', 'id', metric && metric.id);
  const featureId = assertSnakeId(id, 'featureId', metric.featureId);
  if (!optionIds.has(featureId)) {
    throw new Error(`${id}: featureId must reference a vote option.`);
  }
  const definition = assertSafeText(id, 'definition', metric.definition);
  const trustBoundary = assertSafeText(id, 'trustBoundary', metric.trustBoundary);
  const privacy = assertSafeText(id, 'privacy', metric.privacy);
  if (!definition || !trustBoundary || !privacy) {
    throw new Error(`${id}: definition, trustBoundary, and privacy are required.`);
  }
  if (!Array.isArray(metric.dataSources) || metric.dataSources.length === 0) {
    throw new Error(`${id}: dataSources must include at least one source.`);
  }
  metric.dataSources.forEach(source => assertSafeText(id, 'dataSources', source));
  return {
    id,
    featureId,
    definition,
    dataSources: metric.dataSources.map(cleanString).filter(Boolean),
    trustBoundary,
    privacy,
  };
}

function validateAdvancedMetricsPlan(plan) {
  if (!plan || typeof plan !== 'object' || Array.isArray(plan)) {
    throw new Error('Advanced metrics plan must be an object.');
  }
  const version = assertPositiveInt('plan', 'version', plan.version, { min: 1, max: 100 });
  const status = cleanString(plan.status);
  if (!VALID_STATUS.has(status)) {
    throw new Error(`plan: status must be one of ${[...VALID_STATUS].join(', ')}.`);
  }
  assertSafeText('plan', 'voteQuestion', plan.voteQuestion);
  assertSafeText('plan', 'positioning', plan.positioning);
  if (!Array.isArray(plan.privacyPrinciples) || plan.privacyPrinciples.length < 3) {
    throw new Error('plan: privacyPrinciples must include at least three items.');
  }
  plan.privacyPrinciples.forEach(value => assertSafeText('plan', 'privacyPrinciples', value));

  if (!Array.isArray(plan.voteOptions) || plan.voteOptions.length < 3) {
    throw new Error('plan: voteOptions must include at least three options.');
  }
  const voteOptions = plan.voteOptions.map(validateVoteOption);
  const optionIds = new Set();
  voteOptions.forEach((option) => {
    if (optionIds.has(option.id)) {
      throw new Error(`${option.id}: duplicate vote option id.`);
    }
    optionIds.add(option.id);
  });

  if (!Array.isArray(plan.metrics) || plan.metrics.length < voteOptions.length) {
    throw new Error('plan: metrics must include at least one metric per vote option.');
  }
  const metrics = plan.metrics.map(metric => validateMetric(metric, optionIds));
  const metricFeatureIds = new Set(metrics.map(metric => metric.featureId));
  voteOptions.forEach((option) => {
    if (!metricFeatureIds.has(option.id)) {
      throw new Error(`${option.id}: must have at least one metric.`);
    }
  });

  return {
    version,
    status,
    voteQuestion: cleanString(plan.voteQuestion),
    positioning: cleanString(plan.positioning),
    privacyPrinciples: plan.privacyPrinciples.map(cleanString).filter(Boolean),
    voteOptions,
    metrics,
  };
}

function loadAdvancedMetricsPlan(filePath) {
  return validateAdvancedMetricsPlan(readJson(filePath));
}

function main() {
  const options = parseArgs();
  const plan = loadAdvancedMetricsPlan(options.file);
  console.log(`Validated advanced metrics plan v${plan.version}: ${plan.voteOptions.length} options, ${plan.metrics.length} metrics.`);
}

if (require.main === module) {
  main();
}

module.exports = {
  parseArgs,
  validateAdvancedMetricsPlan,
  validateMetric,
  validateVoteOption,
  loadAdvancedMetricsPlan,
};
