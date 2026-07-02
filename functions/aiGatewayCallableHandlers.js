function httpsError(code, message) {
  const { HttpsError } = require('firebase-functions/v2/https');
  return new HttpsError(code, message);
}

const {
  cleanString,
  modelForAiFeature,
  readAiConfig,
} = require('./aiConfig');
const {
  buildSmokeTestMessages,
} = require('./aiPromptTemplates');
const {
  AiProviderError,
  createDeepSeekProvider,
} = require('./aiProviderAdapters/deepseekProvider');
const {
  assertAiUsageAllowed,
  recordAiUsageResult,
} = require('./aiUsageLimitService');

const AI_SMOKE_FEATURE = 'smoke_test';

async function assertAdmin(db, uid) {
  if (!uid) {
    throw httpsError('unauthenticated', 'Sign in is required.');
  }
  const snap = await db.collection('admins').doc(uid).get();
  if (!snap.exists) {
    throw httpsError('permission-denied', 'Admin access is required.');
  }
}

function providerFromConfig({ config, env }) {
  if (config.provider === 'deepseek') {
    return createDeepSeekProvider({
      apiKey: env.DEEPSEEK_API_KEY,
    });
  }
  throw httpsError('failed-precondition', `Unsupported AI provider: ${config.provider}`);
}

function normalizeProviderError(error) {
  if (error instanceof AiProviderError) {
    if (error.status === 402) {
      return httpsError('failed-precondition', 'AI provider balance is insufficient.');
    }
    if (error.status === 429) {
      return httpsError('resource-exhausted', 'AI provider rate limit reached.');
    }
    if (error.code === 'missing_api_key') {
      return httpsError('failed-precondition', error.message);
    }
    return httpsError(error.retryable ? 'unavailable' : 'internal', error.message);
  }
  return error;
}

async function logAiRequest({
  admin,
  db,
  feature,
  model,
  provider,
  status,
  uid,
  usage = null,
  estimatedCostUsd = 0,
  errorCode = null,
}) {
  const ref = db.collection('aiRequests').doc();
  await ref.set({
    uid,
    feature,
    provider,
    model,
    status,
    usage,
    estimatedCostUsd,
    errorCode,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  return ref.id;
}

async function handleRunAiGatewaySmokeTest({ admin, env = process.env, now = new Date(), request }) {
  const uid = request.auth?.uid;
  const db = admin.firestore();
  await assertAdmin(db, uid);

  const config = await readAiConfig(db);
  if (!config.adminSmokeTestEnabled) {
    throw httpsError('failed-precondition', 'AI admin smoke test is disabled.');
  }
  if (!config.enabled) {
    return {
      status: 'disabled',
      provider: config.provider,
      model: modelForAiFeature(config, AI_SMOKE_FEATURE),
      message: 'AI gateway is configured but disabled in appConfig/ai.',
    };
  }

  const feature = AI_SMOKE_FEATURE;
  const model = modelForAiFeature(config, feature);
  const usageWindow = await assertAiUsageAllowed({
    admin,
    config,
    db,
    feature,
    now,
    throwRateLimitError: result => httpsError(
      'resource-exhausted',
      `AI usage limit reached: ${result.reason}.`
    ),
    uid,
  });

  const messages = buildSmokeTestMessages(request.data || {});
  let requestId = null;
  try {
    const provider = providerFromConfig({ config, env });
    const result = await provider.generateText({
      maxTokens: 80,
      messages,
      model,
      thinking: { type: 'disabled' },
    });

    requestId = await logAiRequest({
      admin,
      db,
      estimatedCostUsd: result.estimatedCostUsd,
      feature,
      model: result.model,
      provider: result.provider,
      status: 'success',
      uid,
      usage: result.usage,
    });
    await recordAiUsageResult({
      admin,
      db,
      estimatedCostUsd: result.estimatedCostUsd,
      feature,
      model: result.model,
      monthKey: usageWindow.monthKey,
      provider: result.provider,
      requestId,
      uid,
      usage: result.usage,
    });

    return {
      status: 'ok',
      requestId,
      provider: result.provider,
      model: result.model,
      outputText: cleanString(result.outputText, '', 400),
      usage: result.usage,
      estimatedCostUsd: result.estimatedCostUsd,
    };
  } catch (error) {
    await logAiRequest({
      admin,
      db,
      errorCode: error.code || error.status || 'unknown',
      feature,
      model,
      provider: config.provider,
      status: 'failed',
      uid,
    }).catch(() => {});
    throw normalizeProviderError(error);
  }
}

module.exports = {
  AI_SMOKE_FEATURE,
  assertAdmin,
  handleRunAiGatewaySmokeTest,
  logAiRequest,
};
