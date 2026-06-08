import CommunityEventInterestSection from './CommunityEventInterestSection';
import { CopyKitPanel } from './MonetizationKitCards';
import MonetizationLaunchBoard from './MonetizationLaunchBoard';
import { buildMonetizationPreLaunchSectionData } from './monetizationPreLaunchSectionData';
import RevenuePathwayPlanner from './RevenuePathwayPlanner';

export default function MonetizationPreLaunchKits({
  isAdmin,
  ...props
}) {
  const {
    canShowPlanningKits,
    communityEventInterestSectionProps,
    followUpCopyKits,
    launchBoardProps,
    primaryCopyKit,
    revenuePathwayPlannerProps,
  } = buildMonetizationPreLaunchSectionData({
    isAdmin,
    ...props,
  });

  return (
    <>
      {isAdmin && (
        <MonetizationLaunchBoard {...launchBoardProps} />
      )}

      {canShowPlanningKits && (
        <RevenuePathwayPlanner {...revenuePathwayPlannerProps} />
      )}

      {canShowPlanningKits && <CopyKitPanel {...primaryCopyKit} />}

      {canShowPlanningKits && (
        <CommunityEventInterestSection {...communityEventInterestSectionProps} />
      )}

      {canShowPlanningKits && followUpCopyKits.map(kit => (
        <CopyKitPanel key={kit.title} {...kit} />
      ))}
    </>
  );
}
