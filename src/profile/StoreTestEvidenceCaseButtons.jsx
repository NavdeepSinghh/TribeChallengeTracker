export default function StoreTestEvidenceCaseButtons({
  onRecordStoreTestEvidence,
  recordingStoreTestEvidenceId,
  storeTestEvidenceCases,
}) {
  return (
    <div style={{ display: 'grid', gap: 7, marginTop: 10 }}>
      {storeTestEvidenceCases.map(test => (
        <button
          key={test.id}
          type="button"
          disabled={recordingStoreTestEvidenceId === test.id || !test.productId}
          onClick={() => onRecordStoreTestEvidence(test)}
          style={{
            border: '1px solid rgba(125,211,252,0.18)', borderRadius: 10, padding: '9px 10px',
            background: 'rgba(125,211,252,0.07)', color: '#E0F2FE',
            display: 'flex', justifyContent: 'space-between', gap: 10,
            fontSize: 10, fontWeight: 900,
          }}
        >
          <span>{test.label}</span>
          <span style={{ color: '#7DD3FC', fontFamily: 'monospace' }}>{recordingStoreTestEvidenceId === test.id ? 'SAVING' : 'RECORD'}</span>
        </button>
      ))}
    </div>
  );
}
