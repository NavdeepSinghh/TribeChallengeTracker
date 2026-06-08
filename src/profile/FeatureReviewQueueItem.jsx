export default function FeatureReviewQueueItem({
  featureReviewNotes,
  handleReviewSubmission,
  setFeatureReviewNotes,
  submission,
}) {
  return (
    <div style={{ padding: '12px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <p style={{ margin: '0 0 3px', color: '#fff', fontSize: 12, fontWeight: 900 }}>
        {submission.displayName || submission.email || 'Tribe member'} {submission.instagramHandle ? `@${submission.instagramHandle}` : ''}
      </p>
      <p style={{ margin: '0 0 8px', color: '#777', fontSize: 10, lineHeight: 1.35 }}>{submission.story}</p>
      {submission.mediaImageData && (
        <img src={`data:image/jpeg;base64,${submission.mediaImageData}`} alt="Submission media" style={{ width: '100%', maxHeight: 160, objectFit: 'cover', borderRadius: 12, marginBottom: 8 }} />
      )}
      <textarea
        value={featureReviewNotes[submission.id] || ''}
        onChange={(event) => setFeatureReviewNotes(notes => ({ ...notes, [submission.id]: event.target.value }))}
        placeholder="Manual feature submission review note: consent, repost fit, claims safety, caption context..."
        rows={2}
        style={{
          width: '100%',
          marginBottom: 8,
          padding: 8,
          borderRadius: 10,
          border: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(0,0,0,0.2)',
          color: '#ddd',
          fontSize: 10,
          fontWeight: 700,
          fontFamily: "'Space Grotesk', sans-serif",
          resize: 'vertical',
          boxSizing: 'border-box',
        }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
        {['approved', 'featured', 'declined'].map(status => (
          <button
            key={status}
            onClick={() => handleReviewSubmission(submission.id, status)}
            style={{
              border: 'none', borderRadius: 10, padding: '9px 6px',
              background: status === 'declined' ? 'rgba(248,113,113,0.16)' : status === 'featured' ? 'rgba(52,211,153,0.16)' : 'rgba(96,165,250,0.16)',
              color: status === 'declined' ? '#F87171' : status === 'featured' ? '#34D399' : '#60A5FA',
              fontSize: 9, fontWeight: 900, fontFamily: 'monospace',
            }}
          >
            {status.toUpperCase()}
          </button>
        ))}
      </div>
      <p style={{ margin: '6px 0 0', color: '#777', fontSize: 9, fontWeight: 800, lineHeight: 1.35 }}>
        Manual UGC/content review only; do not auto-post, override consent, imply outcomes, or share unreviewed submissions.
      </p>
    </div>
  );
}
