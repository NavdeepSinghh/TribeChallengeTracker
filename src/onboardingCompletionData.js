import {
  ONBOARDING_ACTIVITY_LABELS,
  ONBOARDING_DATA_SOURCE_LABELS,
  ONBOARDING_FREQUENCY_LABELS,
  ONBOARDING_GOAL_LABELS,
  ONBOARDING_HEALTH_SYNC_LABELS,
  ONBOARDING_LEVEL_LABELS,
  ONBOARDING_MOTIVATION_LABELS,
  ONBOARDING_PRIVACY_LABELS,
} from './onboardingLabels';

export function buildOnboardingCompletionData(answers) {
  const activities = (answers.activities || []).map(a => ONBOARDING_ACTIVITY_LABELS[a]).filter(Boolean);
  const rows = [
    { label: 'GOAL', value: ONBOARDING_GOAL_LABELS[answers.goal] },
    { label: 'LEVEL', value: ONBOARDING_LEVEL_LABELS[answers.level] },
    { label: 'FREQUENCY', value: ONBOARDING_FREQUENCY_LABELS[answers.frequency] },
    { label: 'MOTIVATION', value: ONBOARDING_MOTIVATION_LABELS[answers.motivation] },
    { label: 'DATA SOURCE', value: ONBOARDING_DATA_SOURCE_LABELS[answers.dataSource] },
    { label: 'SYNC', value: ONBOARDING_HEALTH_SYNC_LABELS[answers.healthSync] },
    { label: 'PRIVACY', value: ONBOARDING_PRIVACY_LABELS[answers.privacy] },
  ].filter(r => r.value);

  return { activities, rows };
}
