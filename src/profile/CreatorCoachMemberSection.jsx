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
  creatorBrandedPageMessage,
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
  creatorPrivateInviteLaunchMessage,
  creatorTemplateDraftMessage,
  creatorAgreementPrepCopy,
  creatorSupportHandoffCopy,
  creatorPaidHostingPolicyCopy,
  creatorPayoutReadinessCopy,
  creatorRevenueShareInterest,
  creatorSpecialty,
  creatorTermsReadinessCopy,
  handleCreatorHostingApplication,
  handleCreatorBrandedPageSubmit,
  handleCreatorLeaderboardSnapshotSubmit,
  handleCreatorPrivateInviteLaunchSubmit,
  handleCreatorTemplateDraftSubmit,
  handleCreatorSave,
  isSavingCreator,
  isSubmittingCreatorBrandedPage,
  isSubmittingCreatorHostingApplication,
  isSubmittingCreatorLeaderboardSnapshot,
  isSubmittingCreatorPrivateInviteLaunch,
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
      <div style={{ padding: 16, borderRadius: 12, background: 'rgba(96,165,250,0.07)', border: '1px solid rgba(96,165,250,0.18)', marginBottom: 14 }}>
        <div style={{ color: '#60A5FA', fontSize: 10, fontFamily: 'monospace', fontWeight: 900 }}>CREATOR BRANDED PAGE DRAFT</div>
        <p style={{ margin: '8px 0 12px', color: '#aaa', fontSize: 12, lineHeight: 1.45 }}>
          Save a Coach Host branded page draft for admin review. It stores creator profile, CTA, and hosted challenge summary only; no tracking pixels, payments, purchases, entitlements, revenue-share, or paid-hosting claims.
        </p>
        <button
          onClick={handleCreatorBrandedPageSubmit}
          disabled={!proActive || !creatorEnabled || isSubmittingCreatorBrandedPage}
          style={{ border: 0, borderRadius: 9, padding: '10px 12px', background: '#60A5FA', color: '#06111f', fontWeight: 900, fontSize: 11, cursor: 'pointer' }}
        >
          {isSubmittingCreatorBrandedPage ? 'SAVING...' : 'SAVE PAGE DRAFT FOR REVIEW'}
        </button>
        {creatorBrandedPageMessage && (
          <p style={{ margin: '10px 0 0', color: '#aaa', fontSize: 10, fontFamily: 'monospace', lineHeight: 1.35 }}>{creatorBrandedPageMessage}</p>
        )}
      </div>
      <div style={{ padding: 16, borderRadius: 12, background: 'rgba(251,191,36,0.07)', border: '1px solid rgba(251,191,36,0.18)', marginBottom: 14 }}>
        <div style={{ color: '#FBBF24', fontSize: 10, fontFamily: 'monospace', fontWeight: 900 }}>PRIVATE CREATOR INVITE LAUNCH</div>
        <p style={{ margin: '8px 0 12px', color: '#aaa', fontSize: 12, lineHeight: 1.45 }}>
          Save an app-first private challenge invite launch for admin review. It records private challenge readiness only; no auto-messaging, link-open tracking, payments, purchases, entitlements, revenue-share, or paid-hosting claims.
        </p>
        <button
          onClick={handleCreatorPrivateInviteLaunchSubmit}
          disabled={!proActive || !creatorEnabled || isSubmittingCreatorPrivateInviteLaunch}
          style={{ border: 0, borderRadius: 9, padding: '10px 12px', background: '#FBBF24', color: '#1f1300', fontWeight: 900, fontSize: 11, cursor: 'pointer' }}
        >
          {isSubmittingCreatorPrivateInviteLaunch ? 'SAVING...' : 'SAVE PRIVATE INVITE FOR REVIEW'}
        </button>
        {creatorPrivateInviteLaunchMessage && (
          <p style={{ margin: '10px 0 0', color: '#aaa', fontSize: 10, fontFamily: 'monospace', lineHeight: 1.35 }}>{creatorPrivateInviteLaunchMessage}</p>
        )}
      </div>
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
