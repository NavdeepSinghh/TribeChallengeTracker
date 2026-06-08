import WeeklyCampaignMarketingSection from './WeeklyCampaignMarketingSection';
import { buildWeeklyCampaignMarketingProps } from './weeklyCampaignMarketingProps';

export default function ProfileWeeklyCampaignGrowthSection({ model }) {
  return <WeeklyCampaignMarketingSection {...buildWeeklyCampaignMarketingProps(model)} />;
}
