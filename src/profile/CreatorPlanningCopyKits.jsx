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
