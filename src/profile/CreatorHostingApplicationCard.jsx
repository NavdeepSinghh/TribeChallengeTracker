export default function CreatorHostingApplicationCard({
  creatorEnabled,
  creatorHostingApplicationMessage,
  handleCreatorHostingApplication,
  isSubmittingCreatorHostingApplication,
  proActive,
}) {
  return (
    <div style={{
      borderRadius: 12, padding: 12, marginBottom: 10,
      background: proActive ? 'rgba(244,114,182,0.075)' : 'rgba(0,0,0,0.18)',
      border: '1px solid rgba(244,114,182,0.20)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start' }}>
        <div>
          <p style={{ margin: 0, color: '#F472B6', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>CREATOR HOSTING APPLICATION</p>
          <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 12, fontWeight: 900 }}>
            Request admin review for hosted challenge readiness
          </p>
        </div>
        <span style={{ color: proActive && creatorEnabled ? '#F472B6' : '#777', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
          REVIEW ONLY
        </span>
      </div>
      <p style={{ margin: '9px 0 0', color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
        Submit creatorHostingApplications for manual review using hosted challenge reach and creator profile details. This does not create contracts, payouts, purchases, entitlements, revenue-share, or paid-access claims.
      </p>
      <button
        onClick={handleCreatorHostingApplication}
        disabled={isSubmittingCreatorHostingApplication || !proActive || !creatorEnabled}
        style={{
          marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
          border: '1px solid rgba(244,114,182,0.24)', background: proActive && creatorEnabled ? 'rgba(244,114,182,0.12)' : 'rgba(255,255,255,0.05)',
          color: proActive && creatorEnabled ? '#F472B6' : '#666', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
          cursor: proActive && creatorEnabled ? 'pointer' : 'not-allowed',
        }}
      >
        {isSubmittingCreatorHostingApplication ? 'SENDING CREATOR HOSTING APPLICATION...' : 'APPLY FOR HOSTED REVIEW'}
      </button>
      {creatorHostingApplicationMessage && (
        <p style={{ margin: '8px 0 0', color: creatorHostingApplicationMessage.includes('sent') ? '#F472B6' : '#ffb199', fontSize: 10, lineHeight: 1.4, fontFamily: 'monospace' }}>
          {creatorHostingApplicationMessage}
        </p>
      )}
    </div>
  );
}
