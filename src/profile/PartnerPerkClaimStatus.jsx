export default function PartnerPerkClaimStatus({ partnerPerkClaims }) {
  return (
    <div style={{
      marginTop: 12, borderRadius: 12, padding: 11,
      background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)',
    }}>
      <p style={{ margin: 0, color: '#fff', fontSize: 11, fontWeight: 900 }}>Partner perk claim status</p>
      <p style={{ margin: '5px 0 0', color: '#777', fontSize: 10, lineHeight: 1.4 }}>
        Review-only claim history from partnerPerkClaims. Status updates are manual and do not create coupons, partner links, payouts, discounts, purchases, entitlements, or paid-access claims.
      </p>
      {partnerPerkClaims.length === 0 ? (
        <div style={{ marginTop: 8, color: '#666', fontSize: 11, fontWeight: 800 }}>No partner perk claims yet.</div>
      ) : partnerPerkClaims.slice(0, 3).map(claim => (
        <div key={claim.id} style={{ padding: '9px 0', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
            <span style={{ color: '#fff', fontSize: 12, fontWeight: 900 }}>{claim.perkLabel || 'Partner perk'}</span>
            <span style={{ color: claim.status === 'open' ? '#38BDF8' : '#888', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{(claim.status || 'open').toUpperCase()}</span>
          </div>
          <div style={{ color: '#777', fontSize: 10, fontWeight: 700, marginTop: 4 }}>
            {claim.current || 0}/{claim.target || 0} · {claim.requirement || 'eligible'} · {claim.source || 'unknown'}
          </div>
          {claim.reviewNote && (
            <div style={{ color: '#aaa', fontSize: 10, lineHeight: 1.4, marginTop: 5 }}>
              Review note: {claim.reviewNote}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
