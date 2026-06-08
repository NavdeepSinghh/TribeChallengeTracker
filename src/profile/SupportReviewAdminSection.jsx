import SupportDecisionReplyKit from './SupportDecisionReplyKit';
import SupportReviewQueue from './SupportReviewQueue';

export default function SupportReviewAdminSection({
  supportReviewQueue,
  supportReviewNotes,
  setSupportReviewNotes,
  onSupportRequestReview,
  reviewingSupportRequestId,
  supportDecisionReplyCopy,
  copyText,
}) {
  return (
    <>
      <SupportReviewQueue
        onSupportRequestReview={onSupportRequestReview}
        reviewingSupportRequestId={reviewingSupportRequestId}
        setSupportReviewNotes={setSupportReviewNotes}
        supportReviewNotes={supportReviewNotes}
        supportReviewQueue={supportReviewQueue}
      />
      <SupportDecisionReplyKit
        copyText={copyText}
        supportDecisionReplyCopy={supportDecisionReplyCopy}
      />
    </>
  );
}
