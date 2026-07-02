class AiProviderError extends Error {
  constructor(message, {
    code = 'provider_error',
    provider = 'deepseek',
    status = 500,
    retryable = false,
  } = {}) {
    super(message);
    this.name = 'AiProviderError';
    this.code = code;
    this.provider = provider;
    this.status = status;
    this.retryable = retryable;
  }
}

function normalizeDeepSeekUsage(usage = {}) {
  return {
    promptTokens: Number(usage.prompt_tokens ?? usage.promptTokens) || 0,
    completionTokens: Number(usage.completion_tokens ?? usage.completionTokens) || 0,
    totalTokens: Number(usage.total_tokens ?? usage.totalTokens) || 0,
    promptCacheHitTokens: Number(usage.prompt_cache_hit_tokens ?? usage.promptCacheHitTokens) || 0,
    promptCacheMissTokens: Number(usage.prompt_cache_miss_tokens ?? usage.promptCacheMissTokens) || 0,
  };
}

function deepSeekPricingForModel(model = '') {
  if (String(model).includes('v4-pro')) {
    return {
      inputCacheHitPerMillionUsd: 0.003625,
      inputCacheMissPerMillionUsd: 0.435,
      outputPerMillionUsd: 0.87,
    };
  }
  return {
    inputCacheHitPerMillionUsd: 0.0028,
    inputCacheMissPerMillionUsd: 0.14,
    outputPerMillionUsd: 0.28,
  };
}

function estimateDeepSeekCostUsd({ model, usage = {} } = {}) {
  const normalized = normalizeDeepSeekUsage(usage);
  const pricing = deepSeekPricingForModel(model);
  const explicitCacheTokens = normalized.promptCacheHitTokens + normalized.promptCacheMissTokens;
  const cacheHitTokens = normalized.promptCacheHitTokens;
  const cacheMissTokens = explicitCacheTokens > 0
    ? normalized.promptCacheMissTokens
    : normalized.promptTokens;
  const inputCost = (
    (cacheHitTokens / 1000000) * pricing.inputCacheHitPerMillionUsd
    + (cacheMissTokens / 1000000) * pricing.inputCacheMissPerMillionUsd
  );
  const outputCost = (normalized.completionTokens / 1000000) * pricing.outputPerMillionUsd;
  return Math.round((inputCost + outputCost) * 1000000) / 1000000;
}

function createDeepSeekProvider({ apiKey, fetchImpl = fetch } = {}) {
  if (!apiKey || !String(apiKey).startsWith('sk-')) {
    throw new AiProviderError('DeepSeek API key is not configured.', {
      code: 'missing_api_key',
      status: 500,
    });
  }

  async function generateText({
    maxTokens = 120,
    messages = [],
    model = 'deepseek-v4-flash',
    thinking,
  } = {}) {
    const response = await fetchImpl('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        stream: false,
        max_tokens: maxTokens,
        ...(thinking ? { thinking } : {}),
      }),
    });
    const text = await response.text();
    let body = {};
    try {
      body = text ? JSON.parse(text) : {};
    } catch (error) {
      throw new AiProviderError('DeepSeek returned an unreadable response.', {
        code: 'invalid_provider_response',
        status: response.status,
        retryable: response.status >= 500,
      });
    }

    if (!response.ok) {
      throw new AiProviderError(body.error?.message || 'DeepSeek request failed.', {
        code: body.error?.code || 'provider_request_failed',
        status: response.status,
        retryable: response.status === 429 || response.status >= 500,
      });
    }

    const usage = normalizeDeepSeekUsage(body.usage || {});
    return {
      provider: 'deepseek',
      model: body.model || model,
      outputText: String(body.choices?.[0]?.message?.content || '').trim(),
      usage,
      estimatedCostUsd: estimateDeepSeekCostUsd({ model: body.model || model, usage }),
    };
  }

  return {
    generateText,
  };
}

module.exports = {
  AiProviderError,
  createDeepSeekProvider,
  deepSeekPricingForModel,
  estimateDeepSeekCostUsd,
  normalizeDeepSeekUsage,
};
