import CreatorDemandSummaryCard from './CreatorDemandSummaryCard';
import CreatorChallengeTemplateDraftReviewQueueSection from './CreatorChallengeTemplateDraftReviewQueueSection';
import CreatorHostingDecisionReplyCard from './CreatorHostingDecisionReplyCard';
import CreatorHostingReviewQueueSection from './CreatorHostingReviewQueueSection';
import CreatorLeaderboardSnapshotReviewSection from './CreatorLeaderboardSnapshotReviewSection';
import PublishedCreatorChallengeTemplateCatalogSection from './PublishedCreatorChallengeTemplateCatalogSection';
import PublishedCreatorLeaderboardSnapshotsSection from './PublishedCreatorLeaderboardSnapshotsSection';

export default function CreatorCoachAdminSection({
  creatorAnalytics,
  creatorHostingApplicationReviewNotes,
  creatorHostingApplicationReviewQueue,
  creatorHostingDecisionReplyCopy,
  creatorLeaderboardSnapshotReviewNotes,
  creatorLeaderboardSnapshotReviewQueue,
  creatorTemplateDraftReviewNotes,
  creatorTemplateDraftReviewQueue,
  creatorRevenueSharePitchCopy,
  creatorRevenueShareSummary,
  creatorRevenueShareTotal,
  handleCreatorHostingApplicationReview,
  handleCreatorLeaderboardSnapshotReview,
  handleCreatorTemplateDraftReview,
  publishedCreatorChallengeTemplates,
  publishedCreatorLeaderboardSnapshots,
  reviewingCreatorHostingApplicationId,
  reviewingCreatorLeaderboardSnapshotId,
  reviewingCreatorTemplateDraftId,
  setCreatorHostingApplicationReviewNotes,
  setCreatorLeaderboardSnapshotReviewNotes,
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
