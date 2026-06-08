import {
  ONBOARDING_ACTIVITY_LABELS,
  ONBOARDING_FREQUENCY_LABELS,
  ONBOARDING_GOAL_LABELS,
  ONBOARDING_LEVEL_LABELS,
} from './onboardingLabels';

export function buildOnboardingCompletionData(answers) {
  const activities = (answers.activities || []).map(a => ONBOARDING_ACTIVITY_LABELS[a]).filter(Boolean);
  const rows = [
    { label: 'GOAL', value: ONBOARDING_GOAL_LABELS[answers.goal] },
    { label: 'LEVEL', value: ONBOARDING_LEVEL_LABELS[answers.level] },
    { label: 'FREQUENCY', value: ONBOARDING_FREQUENCY_LABELS[answers.frequency] },
  ].filter(r => r.value);

  return { activities, rows };
}
