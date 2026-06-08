import FeatureReviewQueueItem from './FeatureReviewQueueItem';
import FeatureReviewStatusMessage from './FeatureReviewStatusMessage';

export default function FeatureReviewQueueSection({
  isAdmin,
  featureReviewQueue,
  featureReviewNotes,
  setFeatureReviewNotes,
  handleReviewSubmission,
  reviewMessage,
}) {
  if (!isAdmin) return null;

  return (
    <div style={{
      borderRadius: 16, padding: 16, marginBottom: 20,
      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
    }}>
      <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Feature review queue</p>
      <p style={{ margin: '4px 0 12px', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
        Pending user stories waiting for Instagram/content review.
      </p>
      {featureReviewQueue.length === 0 ? (
        <p style={{ margin: 0, color: '#666', fontSize: 11, fontFamily: 'monospace' }}>No pending submissions.</p>
      ) : featureReviewQueue.slice(0, 5).map(submission => (
        <FeatureReviewQueueItem
          key={submission.id}
          featureReviewNotes={featureReviewNotes}
          handleReviewSubmission={handleReviewSubmission}
          setFeatureReviewNotes={setFeatureReviewNotes}
          submission={submission}
        />
      ))}
      <FeatureReviewStatusMessage reviewMessage={reviewMessage} />
    </div>
  );
}
