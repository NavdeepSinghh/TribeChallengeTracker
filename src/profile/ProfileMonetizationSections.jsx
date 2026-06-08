import CreatorCoachSection from './CreatorCoachSection';
import MonetizationPreLaunchKits from './MonetizationPreLaunchKits';
import PartnerPerksSection from './PartnerPerksSection';
import { buildMonetizationSectionProps } from './profileMonetizationSectionProps';
import TribeProStoreSection from './TribeProStoreSection';

export default function ProfileMonetizationSections({ model, mode }) {
  const {
    creatorCoachProps,
    partnerPerksProps,
    prelaunchProps,
    tribeProStoreProps,
  } = buildMonetizationSectionProps(model);

  if (mode === 'prelaunch') {
    return <MonetizationPreLaunchKits {...prelaunchProps} />;
  }

  return (
    <>
      <PartnerPerksSection {...partnerPerksProps} />
      <TribeProStoreSection {...tribeProStoreProps} />
      <CreatorCoachSection {...creatorCoachProps} />
    </>
  );
}
