import CreatorDemandSummaryCard from './CreatorDemandSummaryCard';
import CreatorChallengeTemplateDraftReviewQueueSection from './CreatorChallengeTemplateDraftReviewQueueSection';
import CreatorHostingDecisionReplyCard from './CreatorHostingDecisionReplyCard';
import CreatorHostingReviewQueueSection from './CreatorHostingReviewQueueSection';
import PublishedCreatorChallengeTemplateCatalogSection from './PublishedCreatorChallengeTemplateCatalogSection';

export default function CreatorCoachAdminSection({
  creatorAnalytics,
  creatorHostingApplicationReviewNotes,
  creatorHostingApplicationReviewQueue,
  creatorHostingDecisionReplyCopy,
  creatorTemplateDraftReviewNotes,
  creatorTemplateDraftReviewQueue,
  creatorRevenueSharePitchCopy,
  creatorRevenueShareSummary,
  creatorRevenueShareTotal,
  handleCreatorHostingApplicationReview,
  handleCreatorTemplateDraftReview,
  publishedCreatorChallengeTemplates,
  reviewingCreatorHostingApplicationId,
  reviewingCreatorTemplateDraftId,
  setCreatorHostingApplicationReviewNotes,
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
      <CreatorHostingDecisionReplyCard
        creatorAnalytics={creatorAnalytics}
        creatorHostingApplicationReviewQueue={creatorHostingApplicationReviewQueue}
        creatorHostingDecisionReplyCopy={creatorHostingDecisionReplyCopy}
      />
    </>
  );
}
