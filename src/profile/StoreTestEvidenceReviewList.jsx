export default function StoreTestEvidenceReviewList({
  onReviewStoreTestEvidence,
  reviewingStoreTestEvidenceId,
  setStoreTestEvidenceReviewNotes,
  storeTestEvidenceLog,
  storeTestEvidenceMessage,
  storeTestEvidenceReviewNotes,
}) {
  return (
    <>
      {storeTestEvidenceLog.slice(0, 4).map(record => (
        <div key={record.id} style={{ marginTop: 10, borderRadius: 10, padding: 10, background: 'rgba(0,0,0,0.16)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ margin: 0, color: '#E0F2FE', fontSize: 10, fontWeight: 900 }}>
            {record.platform?.toUpperCase?.() || 'STORE'} · {record.productId || record.testCase || 'test evidence'}
          </p>
          <textarea
            value={storeTestEvidenceReviewNotes[record.id] || ''}
            onChange={e => setStoreTestEvidenceReviewNotes(prev => ({ ...prev, [record.id]: e.target.value }))}
            placeholder="Manual store test evidence review note"
            style={{ width: '100%', boxSizing: 'border-box', marginTop: 8, minHeight: 54, borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: '#fff', padding: 8, fontSize: 10 }}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
            {[
              ['verified', 'VERIFIED', '#34D399'],
              ['needs_review', 'NEEDS REVIEW', '#FBBF24'],
            ].map(([result, label, color]) => (
              <button
                key={result}
                type="button"
                disabled={reviewingStoreTestEvidenceId === record.id}
                onClick={() => onReviewStoreTestEvidence(record.id, result)}
                style={{ border: 0, borderRadius: 10, padding: '8px', background: `${color}18`, color, fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      ))}
      {storeTestEvidenceMessage && (
        <p style={{ margin: '8px 0 0', color: '#BAE6FD', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
          {storeTestEvidenceMessage}
        </p>
      )}
    </>
  );
}
