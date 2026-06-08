import { SIMPLE_WEEKLY_CAMPAIGN_COPY_CARD_DEFINITIONS } from './weeklyCampaignCopyCardDefinitions';

export function buildSimpleWeeklyCampaignCopyCards({ weeklyCampaignPrompt, ...copy }) {
  return SIMPLE_WEEKLY_CAMPAIGN_COPY_CARD_DEFINITIONS.map(definition => {
    const { copyKey, statusKey, ...card } = definition;
    return {
      ...card,
      status: statusKey ? weeklyCampaignPrompt[statusKey] : card.status,
      copyText: copy[copyKey],
    };
  });
}
