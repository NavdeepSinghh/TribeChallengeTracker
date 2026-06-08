export default function FeatureReviewStatusMessage({ reviewMessage }) {
  if (!reviewMessage) return null;

  return (
    <p style={{ margin: '8px 0 0', color: reviewMessage.includes('Could not') ? '#ffb199' : '#777', fontSize: 10, fontFamily: 'monospace' }}>
      {reviewMessage}
    </p>
  );
}
