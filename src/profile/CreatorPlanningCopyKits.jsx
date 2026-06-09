import CreatorPlanningCopyKitCard from './CreatorPlanningCopyKitCard';
import { buildCreatorPlanningCopyKitConfigs } from './creatorPlanningCopyKitConfigs';

export default function CreatorPlanningCopyKits({
  creatorAnalytics,
  creatorBrandedPagePreviewCopy,
  creatorChallengeTemplateDraftCopy,
  creatorProfileCompletionCopy,
  creatorEnabled,
  creatorHostingObjectionReplyCopy,
  creatorHostingOfferCopy,
  creatorLaunchChallenge,
  creatorLaunchCopy,
  creatorLaunchLink,
  creatorPrivateInviteCopy,
  creatorPayoutReadinessCopy,
  creatorRevenueShareInterest,
  creatorTermsReadinessCopy,
  proActive,
}) {
  const creatorPlanningCopyKitConfigs = buildCreatorPlanningCopyKitConfigs({
    creatorAnalytics,
    creatorBrandedPagePreviewCopy,
    creatorChallengeTemplateDraftCopy,
    creatorProfileCompletionCopy,
    creatorEnabled,
    creatorHostingObjectionReplyCopy,
    creatorHostingOfferCopy,
    creatorLaunchChallenge,
    creatorLaunchCopy,
    creatorLaunchLink,
    creatorPrivateInviteCopy,
    creatorPayoutReadinessCopy,
    creatorRevenueShareInterest,
    creatorTermsReadinessCopy,
    proActive,
  });

  return (
    <>
      {creatorPlanningCopyKitConfigs.map(config => (
        <CreatorPlanningCopyKitCard key={config.title} {...config} />
      ))}
    </>
  );
}
