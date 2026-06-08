import WeeklyCampaignCopyKitCard from './WeeklyCampaignCopyKitCard';
import WeeklyCampaignDmKeywordSection from './WeeklyCampaignDmKeywordSection';
import WeeklyCampaignInstagramCalendarSection from './WeeklyCampaignInstagramCalendarSection';
import WeeklyCampaignLaunchCardSection from './WeeklyCampaignLaunchCardSection';
import WeeklyCampaignMetricKitSection from './WeeklyCampaignMetricKitSection';
import { buildWeeklyCampaignMarketingSectionData } from './weeklyCampaignMarketingSectionData';

export default function WeeklyCampaignMarketingSection({
  isAdmin,
  creatorEnabled,
  ...props
}) {
  if (!isAdmin && !creatorEnabled) {
    return null;
  }

  const {
    dmKeywordSectionProps,
    instagramCalendarSectionProps,
    launchCardSectionProps,
    simpleWeeklyCampaignCopyCards,
    weeklyCampaignCollabCopyCards,
    weeklyCampaignMetricKitSections,
  } = buildWeeklyCampaignMarketingSectionData(props);

  return (
    <>
      <WeeklyCampaignLaunchCardSection {...launchCardSectionProps} />

      {weeklyCampaignMetricKitSections.map(section => (
        <WeeklyCampaignMetricKitSection key={section.title} {...section} />
      ))}

      <WeeklyCampaignDmKeywordSection {...dmKeywordSectionProps} />

      {simpleWeeklyCampaignCopyCards.map(card => (
        <WeeklyCampaignCopyKitCard key={card.title} {...card} />
      ))}

      {weeklyCampaignCollabCopyCards.map(card => (
        <WeeklyCampaignCopyKitCard key={card.title} {...card} />
      ))}

      <WeeklyCampaignInstagramCalendarSection {...instagramCalendarSectionProps} />
    </>
  );
}
