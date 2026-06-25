import {
  canRemoveReportedContent,
  contentReportLabel,
} from '../userService';

function shortId(value) {
  return value ? String(value).slice(0, 6) : 'unknown';
}

export default function ContentReportReviewQueueItem({
  onContentReportReview,
  report,
  reviewingContentReportId,
  setContentReportReviewNotes,
  contentReportReviewNotes,
}) {
  const isReviewing = reviewingContentReportId === report.id;
  const canRemove = canRemoveReportedContent(report) && !report.removedContent;

  return (
    <div style={{ padding: '10px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ color: '#fff', fontSize: 12, fontWeight: 900 }}>{contentReportLabel(report.contentType)}</span>
        <span style={{ color: '#EF4444', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{report.status || 'open'}</span>
      </div>
      <div style={{ color: '#777', fontSize: 10, fontWeight: 700, marginTop: 4 }}>
        reporter {shortId(report.reporterUid)} · reported {shortId(report.reportedUid)} · {report.source || 'unknown'}
      </div>
      {report.challengeId && (
        <div style={{ color: '#777', fontSize: 10, fontWeight: 700, marginTop: 2 }}>challenge {shortId(report.challengeId)}</div>
      )}
      <div style={{ color: '#ddd', fontSize: 11, lineHeight: 1.35, marginTop: 6, fontWeight: 800 }}>
        {report.reason || 'No reason provided'}
      </div>
      {report.details && (
        <div style={{ color: '#aaa', fontSize: 11, lineHeight: 1.35, marginTop: 4 }}>{report.details}</div>
      )}
      {report.removedContent && (
        <div style={{ color: '#EF4444', fontSize: 9, fontWeight: 900, fontFamily: 'monospace', marginTop: 6 }}>
          CONTENT REMOVED
        </div>
      )}
      <textarea
        value={contentReportReviewNotes[report.id] ?? report.reviewNote ?? ''}
        onChange={event => setContentReportReviewNotes(notes => ({ ...notes, [report.id]: event.target.value.slice(0, 500) }))}
        placeholder="Moderation note: action taken, safety follow-up, or why this report was dismissed..."
        rows={2}
        style={{
          width: '100%', marginTop: 8, border: '1px solid rgba(239,68,68,0.18)',
          borderRadius: 10, background: 'rgba(0,0,0,0.20)', color: '#fff', padding: 8,
          fontSize: 11, lineHeight: 1.35, resize: 'vertical', boxSizing: 'border-box',
        }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 6, marginTop: 8 }}>
        {[
          ['reviewing', 'REVIEW'],
          ['dismissed', 'DISMISS'],
          ['resolved', 'RESOLVE'],
        ].map(([status, label]) => (
          <button
            key={status}
            onClick={() => onContentReportReview(report, status, false)}
            disabled={isReviewing}
            style={{
              border: 0, borderRadius: 8, padding: '7px 6px',
              background: 'rgba(239,68,68,0.12)', color: '#EF4444',
              fontSize: 9, fontWeight: 900, fontFamily: 'monospace',
              cursor: isReviewing ? 'wait' : 'pointer',
            }}
          >
            {isReviewing ? 'SAVING' : label}
          </button>
        ))}
      </div>
      {canRemove && (
        <button
          onClick={() => onContentReportReview(report, 'resolved', true)}
          disabled={isReviewing}
          style={{
            width: '100%', border: 0, borderRadius: 10, padding: '9px 8px', marginTop: 8,
            background: '#EF4444', color: '#fff', fontSize: 10, fontWeight: 900,
            fontFamily: 'monospace', cursor: isReviewing ? 'wait' : 'pointer',
          }}
        >
          {isReviewing ? 'SAVING' : 'REMOVE CONTENT + RESOLVE'}
        </button>
      )}
    </div>
  );
}
