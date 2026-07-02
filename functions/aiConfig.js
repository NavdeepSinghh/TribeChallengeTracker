const DEFAULT_AI_CONFIG = {
  enabled: false,
  provider: 'deepseek',
  defaultModel: 'deepseek-v4-flash',
  reasoningModel: 'deepseek-v4-pro',
  monthlyBudgetUsd: 10,
  maxCallsPerUserPerWeek: 10,
  maxGlobalCallsPerMinute: 30,
  adminSmokeTestEnabled: true,
  requestLoggingEnabled: true,
};

const SUPPORTED_PROVIDERS = new Set(['deepseek']);
const FEATURE_REASONING_MODE = new Set([
  'workout_plan_adjustment',
  'complex_training_analysis',
]);

function cleanString(value, fallback = '', maxLength = 120) {
  const cleaned = String(value || fallback).trim().replace(/\s+/g, ' ');
  return cleaned.slice(0, maxLength);
}

function positiveNumber(value, fallback, { min = 0, max = Number.MAX_SAFE_INTEGER } = {}) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function boolValue(value, fallback = false) {
  return typeof value === 'boolean' ? value : fallback;
}

function normalizeAiConfig(data = {}) {
  const provider = cleanString(data.provider, DEFAULT_AI_CONFIG.provider, 40).toLowerCase();
  return {
    enabled: boolValue(data.enabled, DEFAULT_AI_CONFIG.enabled),
    provider: SUPPORTED_PROVIDERS.has(provider) ? provider : DEFAULT_AI_CONFIG.provider,
    defaultModel: cleanString(data.defaultModel, DEFAULT_AI_CONFIG.defaultModel, 80),
    reasoningModel: cleanString(data.reasoningModel, DEFAULT_AI_CONFIG.reasoningModel, 80),
    monthlyBudgetUsd: positiveNumber(
      data.monthlyBudgetUsd,
      DEFAULT_AI_CONFIG.monthlyBudgetUsd,
      { min: 0, max: 10000 }
    ),
    maxCallsPerUserPerWeek: Math.floor(positiveNumber(
      data.maxCallsPerUserPerWeek,
      DEFAULT_AI_CONFIG.maxCallsPerUserPerWeek,
      { min: 0, max: 10000 }
    )),
    maxGlobalCallsPerMinute: Math.floor(positiveNumber(
      data.maxGlobalCallsPerMinute,
      DEFAULT_AI_CONFIG.maxGlobalCallsPerMinute,
      { min: 1, max: 10000 }
    )),
    adminSmokeTestEnabled: boolValue(
      data.adminSmokeTestEnabled,
      DEFAULT_AI_CONFIG.adminSmokeTestEnabled
    ),
    requestLoggingEnabled: boolValue(
      data.requestLoggingEnabled,
      DEFAULT_AI_CONFIG.requestLoggingEnabled
    ),
  };
}

async function readAiConfig(db) {
  const snap = await db.collection('appConfig').doc('ai').get();
  return normalizeAiConfig(snap.exists ? snap.data() : {});
}

function modelForAiFeature(config, feature) {
  return FEATURE_REASONING_MODE.has(cleanString(feature, '', 80))
    ? config.reasoningModel
    : config.defaultModel;
}

function monthKeyForDate(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value);
  const valid = Number.isNaN(date.getTime()) ? new Date() : date;
  return `${valid.getUTCFullYear()}-${String(valid.getUTCMonth() + 1).padStart(2, '0')}`;
}

function weekKeyForDate(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value);
  const valid = Number.isNaN(date.getTime()) ? new Date() : date;
  const utcDate = new Date(Date.UTC(valid.getUTCFullYear(), valid.getUTCMonth(), valid.getUTCDate()));
  const day = utcDate.getUTCDay() || 7;
  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((utcDate - yearStart) / 86400000) + 1) / 7);
  return `${utcDate.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

module.exports = {
  DEFAULT_AI_CONFIG,
  cleanString,
  modelForAiFeature,
  monthKeyForDate,
  normalizeAiConfig,
  readAiConfig,
  weekKeyForDate,
};
