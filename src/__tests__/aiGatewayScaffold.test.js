const fs = require('fs');
const path = require('path');
const {
  DEFAULT_AI_CONFIG,
  modelForAiFeature,
  monthKeyForDate,
  normalizeAiConfig,
  weekKeyForDate,
} = require('../../functions/aiConfig');
const {
  buildAiSafeContextFromPayload,
  buildSmokeTestMessages,
} = require('../../functions/aiPromptTemplates');
const {
  estimateDeepSeekCostUsd,
  normalizeDeepSeekUsage,
} = require('../../functions/aiProviderAdapters/deepseekProvider');
const {
  evaluateAiUsageLimit,
} = require('../../functions/aiUsageLimitService');

const repoRoot = path.resolve(__dirname, '../..');

describe('AI gateway scaffold', () => {
  it('keeps AI disabled by default while retaining DeepSeek routing defaults', () => {
    expect(normalizeAiConfig({})).toMatchObject({
      enabled: false,
      provider: 'deepseek',
      defaultModel: 'deepseek-v4-flash',
      reasoningModel: 'deepseek-v4-pro',
      monthlyBudgetUsd: DEFAULT_AI_CONFIG.monthlyBudgetUsd,
      maxCallsPerUserPerWeek: DEFAULT_AI_CONFIG.maxCallsPerUserPerWeek,
    });
  });

  it('chooses the reasoning model only for heavier AI features', () => {
    const config = normalizeAiConfig({
      enabled: true,
      defaultModel: 'deepseek-v4-flash',
      reasoningModel: 'deepseek-v4-pro',
    });

    expect(modelForAiFeature(config, 'smoke_test')).toBe('deepseek-v4-flash');
    expect(modelForAiFeature(config, 'workout_plan_adjustment')).toBe('deepseek-v4-pro');
  });

  it('builds a non-identifying smoke prompt from summarized fitness context', () => {
    const context = buildAiSafeContextFromPayload({
      goal: '  build muscle ',
      tone: 'competitive',
      activeDays: 4,
      workouts: 3,
      steps: 52750,
      activeChallengeCount: 2,
      email: 'private@example.com',
      uid: 'private_uid',
    });
    const messages = buildSmokeTestMessages(context);
    const promptText = messages.map(message => message.content).join(' ');

    expect(context).toEqual({
      goal: 'build muscle',
      tone: 'competitive',
      activeDays: 4,
      workouts: 3,
      steps: 52750,
      activeChallengeCount: 2,
    });
    expect(promptText).toContain('Do not diagnose');
    expect(promptText).toContain('Goal: build muscle.');
    expect(promptText).not.toContain('private@example.com');
    expect(promptText).not.toContain('private_uid');
  });

  it('estimates DeepSeek cost from normalized token usage without assuming cache hits', () => {
    const usage = normalizeDeepSeekUsage({
      prompt_tokens: 1000,
      completion_tokens: 500,
      total_tokens: 1500,
    });

    expect(usage).toMatchObject({
      promptTokens: 1000,
      completionTokens: 500,
      totalTokens: 1500,
    });
    expect(estimateDeepSeekCostUsd({
      model: 'deepseek-v4-flash',
      usage,
    })).toBe(0.00028);
  });

  it('blocks requests when weekly or monthly AI usage limits are reached', () => {
    const config = normalizeAiConfig({
      enabled: true,
      monthlyBudgetUsd: 5,
      maxCallsPerUserPerWeek: 2,
      maxGlobalCallsPerMinute: 3,
    });

    expect(evaluateAiUsageLimit({
      config,
      userWeek: { requestCount: 1 },
      globalMinute: { requestCount: 1, windowStartMs: 1000 },
      globalMonth: { estimatedCostUsd: 1 },
      nowMs: 1500,
    })).toMatchObject({ allowed: true });

    expect(evaluateAiUsageLimit({
      config,
      userWeek: { requestCount: 2 },
      globalMinute: { requestCount: 1, windowStartMs: 1000 },
      globalMonth: { estimatedCostUsd: 1 },
      nowMs: 1500,
    })).toMatchObject({
      allowed: false,
      reason: 'user_weekly_limit',
    });

    expect(evaluateAiUsageLimit({
      config,
      userWeek: { requestCount: 0 },
      globalMinute: { requestCount: 1, windowStartMs: 1000 },
      globalMonth: { estimatedCostUsd: 5 },
      nowMs: 1500,
    })).toMatchObject({
      allowed: false,
      reason: 'monthly_budget_limit',
    });
  });

  it('uses stable UTC period keys for AI usage accounting', () => {
    const date = new Date('2026-07-02T10:30:00Z');

    expect(monthKeyForDate(date)).toBe('2026-07');
    expect(weekKeyForDate(date)).toBe('2026-W27');
  });

  it('wires the callable behind the DeepSeek secret and keeps it admin-smoke scoped', () => {
    const indexSource = fs.readFileSync(path.join(repoRoot, 'functions/index.js'), 'utf8');
    const handlerSource = fs.readFileSync(path.join(repoRoot, 'functions/aiGatewayCallableHandlers.js'), 'utf8');

    expect(indexSource).toContain("defineSecret('DEEPSEEK_API_KEY')");
    expect(indexSource).toContain('exports.runAiGatewaySmokeTest');
    expect(indexSource).toContain('secrets: [deepseekApiKey]');
    expect(handlerSource).toContain("db.collection('admins').doc(uid)");
    expect(handlerSource).toContain("const AI_SMOKE_FEATURE = 'smoke_test'");
  });
});
