export default function ApprovedCreatorPaidHostingLaunchGateReviewsSection({
  approvedCreatorPaidHostingLaunchGateReviews = [],
}) {
  return (
    <div style={{ padding: 16, borderRadius: 12, background: 'rgba(244,114,182,0.06)', border: '1px solid rgba(244,114,182,0.16)', marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ color: '#F472B6', fontSize: 10, fontFamily: 'monospace', fontWeight: 900 }}>APPROVED PAID HOSTING LAUNCH GATE EVIDENCE</div>
        <span style={{ color: '#F472B6', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{approvedCreatorPaidHostingLaunchGateReviews.length} APPROVED</span>
      </div>
      <p style={{ margin: '8px 0 12px', color: '#aaa', fontSize: 12, lineHeight: 1.45 }}>
        Review-only launch gate evidence from creatorPaidHostingLaunchGateReviews. Approval confirms manual readiness review only and does not create contracts, payouts, purchases, entitlements, revenue-share, paid access, or paid-hosting-live claims.
      </p>
      {approvedCreatorPaidHostingLaunchGateReviews.length === 0 ? (
        <p style={{ margin: 0, color: '#777', fontSize: 11, fontWeight: 800 }}>No approved launch gate evidence yet.</p>
      ) : (
        <div style={{ display: 'grid', gap: 8 }}>
          {approvedCreatorPaidHostingLaunchGateReviews.slice(0, 5).map(gate => (
            <div key={gate.id} style={{ borderRadius: 10, padding: 10, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ color: '#fff', fontSize: 12, fontWeight: 900 }}>{gate.displayName || gate.creatorSpecialty || gate.uid}</div>
              <div style={{ color: '#aaa', fontSize: 11, lineHeight: 1.35, marginTop: 4 }}>
                {gate.hostedChallengeCount || 0} hosted · {gate.revenueReadyCount || 0} revenue-ready · paid live {gate.isPaidHostingLive ? 'yes' : 'no'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
