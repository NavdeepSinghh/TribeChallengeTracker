import ContentReportReviewQueueItem from './ContentReportReviewQueueItem';

export default function ContentReportReviewSection({
  contentReportQueue,
  contentReportReviewNotes,
  onContentReportReview,
  reviewingContentReportId,
  setContentReportReviewNotes,
}) {
  return (
    <>
      <p style={{ color: '#555', fontSize: 10, fontWeight: 700, letterSpacing: 2, fontFamily: 'monospace', margin: '0 0 12px' }}>CONTENT REPORTS</p>
      <div style={{
        background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.12)',
        borderRadius: 16, padding: 14, marginBottom: 20,
      }}>
        <p style={{ margin: '0 0 10px', color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
          Admin-only moderation queue for reported Tribe Activity, challenge updates, members, and profiles. Feed rows and challenge updates can be removed here; member/profile reports stay as manual review records.
        </p>
        {contentReportQueue.length === 0 ? (
          <div style={{ color: '#666', fontSize: 11, fontWeight: 800 }}>No open content reports.</div>
        ) : contentReportQueue.slice(0, 8).map(report => (
          <ContentReportReviewQueueItem
            key={report.id}
            contentReportReviewNotes={contentReportReviewNotes}
            onContentReportReview={onContentReportReview}
            report={report}
            reviewingContentReportId={reviewingContentReportId}
            setContentReportReviewNotes={setContentReportReviewNotes}
          />
        ))}
      </div>
    </>
  );
}
