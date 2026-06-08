export default function StoreTestEvidenceHeaderActions({
  isCheckingValidationReadiness,
  onValidationReadinessCheck,
  storeTestEvidenceDecisionReplyCopy,
  storeTestEvidenceLog,
  validationReadinessMessage,
}) {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center' }}>
        <div>
          <p style={{ margin: 0, color: '#7DD3FC', fontSize: 11, fontWeight: 900, fontFamily: 'monospace' }}>STORE TEST EVIDENCE DECISION REPLY KIT</p>
          <p style={{ margin: '4px 0 0', color: '#aaa', fontSize: 10, fontWeight: 800 }}>
            Manual sandbox/license-test evidence replies
          </p>
        </div>
        <span style={{ color: storeTestEvidenceLog.length ? '#7DD3FC' : '#777', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
          {storeTestEvidenceLog.length} RECORDS
        </span>
      </div>
      <p style={{ margin: '10px 0 0', color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
        Copy verified, needs-review, failed, and archived replies without writing entitlements, creating purchases, processing refunds, bypassing marketplace policy, or marking paid access live.
      </p>
      <button
        type="button"
        onClick={() => navigator.clipboard?.writeText(storeTestEvidenceDecisionReplyCopy)}
        style={{
          marginTop: 10, width: '100%', border: 0, borderRadius: 12, padding: '10px',
          background: 'rgba(14,165,233,0.12)', color: '#7DD3FC',
          fontSize: 10, fontWeight: 900, fontFamily: 'monospace', letterSpacing: 1,
        }}
      >
        COPY STORE TEST EVIDENCE REPLIES
      </button>
      <button
        type="button"
        disabled={isCheckingValidationReadiness}
        onClick={onValidationReadinessCheck}
        style={{
          marginTop: 10, width: '100%', border: 0, borderRadius: 12, padding: '10px',
          background: 'rgba(52,211,153,0.12)', color: '#34D399',
          fontSize: 10, fontWeight: 900, fontFamily: 'monospace', letterSpacing: 1,
        }}
      >
        {isCheckingValidationReadiness ? 'CHECKING VALIDATION' : 'CHECK VALIDATION READINESS'}
      </button>
      {validationReadinessMessage && (
        <p style={{ margin: '8px 0 0', color: '#A7F3D0', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
          {validationReadinessMessage}
        </p>
      )}
    </>
  );
}
