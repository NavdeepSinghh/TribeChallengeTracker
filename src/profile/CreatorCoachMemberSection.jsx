import CreatorHostingApplicationCard from './CreatorHostingApplicationCard';
import CreatorPlanningCopyKits from './CreatorPlanningCopyKits';
import CreatorProfileForm from './CreatorProfileForm';

export default function CreatorCoachMemberSection({
  creatorAnalytics,
  creatorBrandedPagePreviewCopy,
  creatorChallengeTemplateDraftCopy,
  creatorProfileCompletionCopy,
  creatorBio,
  creatorCtaUrl,
  creatorEnabled,
  creatorHostingApplicationMessage,
  creatorHostingObjectionReplyCopy,
  creatorHostingOfferCopy,
  creatorLaunchChallenge,
  creatorLaunchCopy,
  creatorLaunchLink,
  creatorMessage,
  creatorPrivateInviteCopy,
  creatorAgreementPrepCopy,
  creatorSupportHandoffCopy,
  creatorPayoutReadinessCopy,
  creatorRevenueShareInterest,
  creatorSpecialty,
  creatorTermsReadinessCopy,
  handleCreatorHostingApplication,
  handleCreatorSave,
  isSavingCreator,
  isSubmittingCreatorHostingApplication,
  proActive,
  setCreatorBio,
  setCreatorCtaUrl,
  setCreatorSpecialty,
}) {
  return (
    <>
      <CreatorPlanningCopyKits
        creatorAnalytics={creatorAnalytics}
        creatorBrandedPagePreviewCopy={creatorBrandedPagePreviewCopy}
        creatorChallengeTemplateDraftCopy={creatorChallengeTemplateDraftCopy}
        creatorProfileCompletionCopy={creatorProfileCompletionCopy}
        creatorEnabled={creatorEnabled}
        creatorHostingObjectionReplyCopy={creatorHostingObjectionReplyCopy}
        creatorHostingOfferCopy={creatorHostingOfferCopy}
        creatorLaunchChallenge={creatorLaunchChallenge}
        creatorLaunchCopy={creatorLaunchCopy}
        creatorLaunchLink={creatorLaunchLink}
        creatorPrivateInviteCopy={creatorPrivateInviteCopy}
        creatorAgreementPrepCopy={creatorAgreementPrepCopy}
        creatorSupportHandoffCopy={creatorSupportHandoffCopy}
        creatorPayoutReadinessCopy={creatorPayoutReadinessCopy}
        creatorRevenueShareInterest={creatorRevenueShareInterest}
        creatorTermsReadinessCopy={creatorTermsReadinessCopy}
        proActive={proActive}
      />
      <CreatorHostingApplicationCard
        creatorEnabled={creatorEnabled}
        creatorHostingApplicationMessage={creatorHostingApplicationMessage}
        handleCreatorHostingApplication={handleCreatorHostingApplication}
        isSubmittingCreatorHostingApplication={isSubmittingCreatorHostingApplication}
        proActive={proActive}
      />
      <CreatorProfileForm
        creatorBio={creatorBio}
        creatorCtaUrl={creatorCtaUrl}
        creatorMessage={creatorMessage}
        creatorSpecialty={creatorSpecialty}
        handleCreatorSave={handleCreatorSave}
        isSavingCreator={isSavingCreator}
        proActive={proActive}
        setCreatorBio={setCreatorBio}
        setCreatorCtaUrl={setCreatorCtaUrl}
        setCreatorSpecialty={setCreatorSpecialty}
      />
    </>
  );
}
