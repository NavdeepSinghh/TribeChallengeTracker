import CreatorDemandSummaryCard from './CreatorDemandSummaryCard';
import ApprovedCreatorPrivateInviteLaunchesSection from './ApprovedCreatorPrivateInviteLaunchesSection';
import CreatorBrandedPageReviewSection from './CreatorBrandedPageReviewSection';
import CreatorChallengeTemplateDraftReviewQueueSection from './CreatorChallengeTemplateDraftReviewQueueSection';
import CreatorHostingDecisionReplyCard from './CreatorHostingDecisionReplyCard';
import CreatorHostingReviewQueueSection from './CreatorHostingReviewQueueSection';
import CreatorLeaderboardSnapshotReviewSection from './CreatorLeaderboardSnapshotReviewSection';
import CreatorPrivateInviteLaunchReviewSection from './CreatorPrivateInviteLaunchReviewSection';
import PublishedCreatorChallengeTemplateCatalogSection from './PublishedCreatorChallengeTemplateCatalogSection';
import PublishedCreatorBrandedPagesSection from './PublishedCreatorBrandedPagesSection';
import PublishedCreatorLeaderboardSnapshotsSection from './PublishedCreatorLeaderboardSnapshotsSection';

export default function CreatorCoachAdminSection({
  creatorAnalytics,
  approvedCreatorPrivateInviteLaunches,
  creatorBrandedPageReviewNotes,
  creatorBrandedPageReviewQueue,
  creatorHostingApplicationReviewNotes,
  creatorHostingApplicationReviewQueue,
  creatorHostingDecisionReplyCopy,
  creatorLeaderboardSnapshotReviewNotes,
  creatorLeaderboardSnapshotReviewQueue,
  creatorPrivateInviteLaunchReviewNotes,
  creatorPrivateInviteLaunchReviewQueue,
  creatorTemplateDraftReviewNotes,
  creatorTemplateDraftReviewQueue,
  creatorRevenueSharePitchCopy,
  creatorRevenueShareSummary,
  creatorRevenueShareTotal,
  handleCreatorHostingApplicationReview,
  handleCreatorBrandedPageReview,
  handleCreatorLeaderboardSnapshotReview,
  handleCreatorPrivateInviteLaunchReview,
  handleCreatorTemplateDraftReview,
  publishedCreatorChallengeTemplates,
  publishedCreatorBrandedPages,
  publishedCreatorLeaderboardSnapshots,
  reviewingCreatorHostingApplicationId,
  reviewingCreatorBrandedPageId,
  reviewingCreatorLeaderboardSnapshotId,
  reviewingCreatorPrivateInviteLaunchId,
  reviewingCreatorTemplateDraftId,
  setCreatorHostingApplicationReviewNotes,
  setCreatorBrandedPageReviewNotes,
  setCreatorLeaderboardSnapshotReviewNotes,
  setCreatorPrivateInviteLaunchReviewNotes,
  setCreatorTemplateDraftReviewNotes,
}) {
  return (
    <>
      <CreatorDemandSummaryCard
        creatorRevenueSharePitchCopy={creatorRevenueSharePitchCopy}
        creatorRevenueShareSummary={creatorRevenueShareSummary}
        creatorRevenueShareTotal={creatorRevenueShareTotal}
      />
      <CreatorHostingReviewQueueSection
        creatorHostingApplicationReviewNotes={creatorHostingApplicationReviewNotes}
        creatorHostingApplicationReviewQueue={creatorHostingApplicationReviewQueue}
        handleCreatorHostingApplicationReview={handleCreatorHostingApplicationReview}
        reviewingCreatorHostingApplicationId={reviewingCreatorHostingApplicationId}
        setCreatorHostingApplicationReviewNotes={setCreatorHostingApplicationReviewNotes}
      />
      <CreatorChallengeTemplateDraftReviewQueueSection
        creatorTemplateDraftReviewNotes={creatorTemplateDraftReviewNotes}
        creatorTemplateDraftReviewQueue={creatorTemplateDraftReviewQueue}
        handleCreatorTemplateDraftReview={handleCreatorTemplateDraftReview}
        reviewingCreatorTemplateDraftId={reviewingCreatorTemplateDraftId}
        setCreatorTemplateDraftReviewNotes={setCreatorTemplateDraftReviewNotes}
      />
      <PublishedCreatorChallengeTemplateCatalogSection
        publishedCreatorChallengeTemplates={publishedCreatorChallengeTemplates}
      />
      <CreatorBrandedPageReviewSection
        creatorBrandedPageReviewNotes={creatorBrandedPageReviewNotes}
        creatorBrandedPageReviewQueue={creatorBrandedPageReviewQueue}
        handleCreatorBrandedPageReview={handleCreatorBrandedPageReview}
        reviewingCreatorBrandedPageId={reviewingCreatorBrandedPageId}
        setCreatorBrandedPageReviewNotes={setCreatorBrandedPageReviewNotes}
      />
      <PublishedCreatorBrandedPagesSection
        publishedCreatorBrandedPages={publishedCreatorBrandedPages}
      />
      <CreatorPrivateInviteLaunchReviewSection
        creatorPrivateInviteLaunchReviewNotes={creatorPrivateInviteLaunchReviewNotes}
        creatorPrivateInviteLaunchReviewQueue={creatorPrivateInviteLaunchReviewQueue}
        handleCreatorPrivateInviteLaunchReview={handleCreatorPrivateInviteLaunchReview}
        reviewingCreatorPrivateInviteLaunchId={reviewingCreatorPrivateInviteLaunchId}
        setCreatorPrivateInviteLaunchReviewNotes={setCreatorPrivateInviteLaunchReviewNotes}
      />
      <ApprovedCreatorPrivateInviteLaunchesSection
        approvedCreatorPrivateInviteLaunches={approvedCreatorPrivateInviteLaunches}
      />
      <CreatorLeaderboardSnapshotReviewSection
        creatorLeaderboardSnapshotReviewNotes={creatorLeaderboardSnapshotReviewNotes}
        creatorLeaderboardSnapshotReviewQueue={creatorLeaderboardSnapshotReviewQueue}
        handleCreatorLeaderboardSnapshotReview={handleCreatorLeaderboardSnapshotReview}
        reviewingCreatorLeaderboardSnapshotId={reviewingCreatorLeaderboardSnapshotId}
        setCreatorLeaderboardSnapshotReviewNotes={setCreatorLeaderboardSnapshotReviewNotes}
      />
      <PublishedCreatorLeaderboardSnapshotsSection
        publishedCreatorLeaderboardSnapshots={publishedCreatorLeaderboardSnapshots}
      />
      <CreatorHostingDecisionReplyCard
        creatorAnalytics={creatorAnalytics}
        creatorHostingApplicationReviewQueue={creatorHostingApplicationReviewQueue}
        creatorHostingDecisionReplyCopy={creatorHostingDecisionReplyCopy}
      />
    </>
  );
}
