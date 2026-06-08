import { CORE_CHALLENGE_TEMPLATES } from './coreChallengeTemplates';
import { CUSTOM_CHALLENGE_TEMPLATE } from './customChallengeTemplate';
import { PREMIUM_CHALLENGE_TEMPLATES } from './premiumChallengeTemplates';
import { SEASONAL_CHALLENGE_TEMPLATES } from './seasonalChallengeTemplates';

export const CHALLENGE_TEMPLATES = [
  ...CORE_CHALLENGE_TEMPLATES,
  ...PREMIUM_CHALLENGE_TEMPLATES,
  ...SEASONAL_CHALLENGE_TEMPLATES,
  CUSTOM_CHALLENGE_TEMPLATE,
];

const getCampaignWeekNumber = (date = new Date()) => {
  const start = new Date(date.getFullYear(), 0, 1);
  const diffDays = Math.floor((date - start) / 86400000);
  return Math.floor((diffDays + start.getDay()) / 7) + 1;
};

export function getWeeklyCampaignPrompt(date = new Date()) {
  const campaignTemplates = CHALLENGE_TEMPLATES.filter(template => template.campaignId);
  const week = getCampaignWeekNumber(date);
  const template = campaignTemplates[(week - 1) % campaignTemplates.length] || CHALLENGE_TEMPLATES[0];
  return {
    week,
    templateId: template.id,
    campaignId: template.campaignId || template.id,
    label: template.campaignLabel || 'Weekly Campaign',
    name: template.name,
    hashtag: template.campaignHashtag || '#RiseWithTheTribe',
    cta: template.campaignCta || 'Tag @risewiththetribe and invite one accountability partner.',
    duration: template.duration,
    difficulty: template.difficulty,
  };
}
