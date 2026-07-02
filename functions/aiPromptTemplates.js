const { cleanString } = require('./aiConfig');

const SAFE_SYSTEM_PROMPT = [
  'You are Tribe Coach, a concise fitness accountability assistant inside TribeLog.',
  'Give practical wellness guidance only.',
  'Do not diagnose, prescribe treatment, or provide medical advice.',
  'Do not ask for private identifiers, emails, phone numbers, or exact location.',
  'Return concise text that can be shown directly in the app.',
].join(' ');

function buildAiSafeContextFromPayload(payload = {}) {
  const goal = cleanString(payload.goal, 'build consistency', 80);
  const tone = cleanString(payload.tone, 'direct', 40);
  const activeDays = Math.max(0, Math.floor(Number(payload.activeDays) || 0));
  const workouts = Math.max(0, Math.floor(Number(payload.workouts) || 0));
  const steps = Math.max(0, Math.floor(Number(payload.steps) || 0));
  const challengeCount = Math.max(0, Math.floor(Number(payload.activeChallengeCount) || 0));

  return {
    goal,
    tone,
    activeDays: Math.min(activeDays, 31),
    workouts: Math.min(workouts, 60),
    steps: Math.min(steps, 1000000),
    activeChallengeCount: Math.min(challengeCount, 50),
  };
}

function buildSmokeTestMessages(payload = {}) {
  const context = buildAiSafeContextFromPayload(payload);
  return [
    {
      role: 'system',
      content: SAFE_SYSTEM_PROMPT,
    },
    {
      role: 'user',
      content: [
        'Create one short TribeLog coaching line from this summarized, non-identifying context.',
        `Goal: ${context.goal}.`,
        `Tone: ${context.tone}.`,
        `Active days this week: ${context.activeDays}.`,
        `Workouts this week: ${context.workouts}.`,
        `Steps this week: ${context.steps}.`,
        `Active challenges: ${context.activeChallengeCount}.`,
        'Keep it under 24 words.',
      ].join(' '),
    },
  ];
}

module.exports = {
  SAFE_SYSTEM_PROMPT,
  buildAiSafeContextFromPayload,
  buildSmokeTestMessages,
};
