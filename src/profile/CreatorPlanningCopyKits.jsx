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
  creatorIdentityVerificationPrepCopy,
  creatorLeaderboardPreviewCopy,
  creatorLeaderboardRankingReadinessCopy,
  creatorModerationReadinessCopy,
  creatorPaidHostingLaunchGateCopy,
  creatorPaidHostingHoldPlanCopy,
  creatorLaunchChallenge,
  creatorLaunchCopy,
  creatorLaunchLink,
  creatorPrivateInviteCopy,
  creatorAgreementPrepCopy,
  creatorSupportHandoffCopy,
  creatorPaidHostingPolicyCopy,
  creatorLegalPacketPrepCopy,
  creatorPayoutOperationsDryRunCopy,
  creatorPayoutReconciliationCopy,
  creatorTaxWorkflowReadinessCopy,
  creatorPayoutExceptionResponseCopy,
  creatorPayoutSupportEscalationCopy,
  creatorPayoutProviderSetupCopy,
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
    creatorIdentityVerificationPrepCopy,
    creatorLeaderboardPreviewCopy,
    creatorLeaderboardRankingReadinessCopy,
    creatorModerationReadinessCopy,
    creatorPaidHostingLaunchGateCopy,
    creatorPaidHostingHoldPlanCopy,
    creatorLaunchChallenge,
    creatorLaunchCopy,
    creatorLaunchLink,
    creatorPrivateInviteCopy,
    creatorAgreementPrepCopy,
    creatorSupportHandoffCopy,
    creatorPaidHostingPolicyCopy,
    creatorLegalPacketPrepCopy,
    creatorPayoutOperationsDryRunCopy,
    creatorPayoutReconciliationCopy,
    creatorTaxWorkflowReadinessCopy,
    creatorPayoutExceptionResponseCopy,
    creatorPayoutSupportEscalationCopy,
    creatorPayoutProviderSetupCopy,
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
