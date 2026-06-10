import CreatorHostingApplicationCard from './CreatorHostingApplicationCard';
import CreatorChallengeTemplateDraftCard from './CreatorChallengeTemplateDraftCard';
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
  creatorIdentityVerificationPrepCopy,
  creatorLeaderboardSnapshotMessage,
  creatorLeaderboardPreviewCopy,
  creatorModerationReadinessCopy,
  creatorPaidHostingLaunchGateCopy,
  creatorPaidHostingHoldPlanCopy,
  creatorLaunchChallenge,
  creatorLaunchCopy,
  creatorLaunchLink,
  creatorMessage,
  creatorPrivateInviteCopy,
  creatorTemplateDraftMessage,
  creatorAgreementPrepCopy,
  creatorSupportHandoffCopy,
  creatorPaidHostingPolicyCopy,
  creatorPayoutReadinessCopy,
  creatorRevenueShareInterest,
  creatorSpecialty,
  creatorTermsReadinessCopy,
  handleCreatorHostingApplication,
  handleCreatorLeaderboardSnapshotSubmit,
  handleCreatorTemplateDraftSubmit,
  handleCreatorSave,
  isSavingCreator,
  isSubmittingCreatorHostingApplication,
  isSubmittingCreatorLeaderboardSnapshot,
  isSubmittingCreatorTemplateDraft,
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
        creatorIdentityVerificationPrepCopy={creatorIdentityVerificationPrepCopy}
        creatorLeaderboardPreviewCopy={creatorLeaderboardPreviewCopy}
        creatorModerationReadinessCopy={creatorModerationReadinessCopy}
        creatorPaidHostingLaunchGateCopy={creatorPaidHostingLaunchGateCopy}
        creatorPaidHostingHoldPlanCopy={creatorPaidHostingHoldPlanCopy}
        creatorLaunchChallenge={creatorLaunchChallenge}
        creatorLaunchCopy={creatorLaunchCopy}
        creatorLaunchLink={creatorLaunchLink}
        creatorPrivateInviteCopy={creatorPrivateInviteCopy}
        creatorAgreementPrepCopy={creatorAgreementPrepCopy}
        creatorSupportHandoffCopy={creatorSupportHandoffCopy}
        creatorPaidHostingPolicyCopy={creatorPaidHostingPolicyCopy}
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
      <CreatorChallengeTemplateDraftCard
        creatorEnabled={creatorEnabled}
        creatorTemplateDraftMessage={creatorTemplateDraftMessage}
        handleCreatorTemplateDraftSubmit={handleCreatorTemplateDraftSubmit}
        isSubmittingCreatorTemplateDraft={isSubmittingCreatorTemplateDraft}
        proActive={proActive}
      />
      <div style={{ padding: 16, borderRadius: 12, background: 'rgba(52,211,153,0.07)', border: '1px solid rgba(52,211,153,0.18)', marginBottom: 14 }}>
        <div style={{ color: '#34D399', fontSize: 10, fontFamily: 'monospace', fontWeight: 900 }}>CREATOR LEADERBOARD SNAPSHOT</div>
        <p style={{ margin: '8px 0 12px', color: '#aaa', fontSize: 12, lineHeight: 1.45 }}>
          Save an aggregate hosted-challenge leaderboard snapshot for admin review. It uses first-party challenge counts and total points only; no member identities, per-user logs, payouts, purchases, entitlements, tracking, or paid-hosting claims.
        </p>
        <button
          onClick={handleCreatorLeaderboardSnapshotSubmit}
          disabled={!proActive || !creatorEnabled || isSubmittingCreatorLeaderboardSnapshot}
          style={{ border: 0, borderRadius: 9, padding: '10px 12px', background: '#34D399', color: '#04130d', fontWeight: 900, fontSize: 11, cursor: 'pointer' }}
        >
          {isSubmittingCreatorLeaderboardSnapshot ? 'SAVING...' : 'SAVE SNAPSHOT FOR REVIEW'}
        </button>
        {creatorLeaderboardSnapshotMessage && (
          <p style={{ margin: '10px 0 0', color: '#aaa', fontSize: 10, fontFamily: 'monospace', lineHeight: 1.35 }}>{creatorLeaderboardSnapshotMessage}</p>
        )}
      </div>
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
