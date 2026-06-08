import CreatorDemandSummaryCard from './CreatorDemandSummaryCard';
import CreatorHostingDecisionReplyCard from './CreatorHostingDecisionReplyCard';
import CreatorHostingReviewQueueSection from './CreatorHostingReviewQueueSection';

export default function CreatorCoachAdminSection({
  creatorAnalytics,
  creatorHostingApplicationReviewNotes,
  creatorHostingApplicationReviewQueue,
  creatorHostingDecisionReplyCopy,
  creatorRevenueSharePitchCopy,
  creatorRevenueShareSummary,
  creatorRevenueShareTotal,
  handleCreatorHostingApplicationReview,
  reviewingCreatorHostingApplicationId,
  setCreatorHostingApplicationReviewNotes,
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
      <CreatorHostingDecisionReplyCard
        creatorAnalytics={creatorAnalytics}
        creatorHostingApplicationReviewQueue={creatorHostingApplicationReviewQueue}
        creatorHostingDecisionReplyCopy={creatorHostingDecisionReplyCopy}
      />
    </>
  );
}
