const LAUNCH_GATE_STATUSES = [
  ['approved', 'APPROVE'],
  ['waiting', 'WAIT'],
  ['not_ready', 'NOT READY'],
  ['declined', 'DECLINE'],
];

export default function CreatorPaidHostingLaunchGateReviewSection({
  creatorPaidHostingLaunchGateReviewNotes,
  creatorPaidHostingLaunchGateReviewQueue = [],
  handleCreatorPaidHostingLaunchGateReview,
  reviewingCreatorPaidHostingLaunchGateId,
  setCreatorPaidHostingLaunchGateReviewNotes,
}) {
  return (
    <div style={{ padding: 16, borderRadius: 12, background: 'rgba(244,114,182,0.06)', border: '1px solid rgba(244,114,182,0.16)', marginBottom: 14 }}>
      <div style={{ color: '#F472B6', fontSize: 10, fontFamily: 'monospace', fontWeight: 900 }}>CREATOR PAID HOSTING LAUNCH GATE REVIEW QUEUE</div>
      <p style={{ margin: '8px 0 12px', color: '#aaa', fontSize: 12, lineHeight: 1.45 }}>
        Admin-only queue for creatorPaidHostingLaunchGateReviews. Review first-party readiness evidence; approval does not turn paid hosting live, create contracts, collect payout or tax details, process payments, create purchases, write entitlements, or start revenue-share.
      </p>
      {creatorPaidHostingLaunchGateReviewQueue.length === 0 ? (
        <p style={{ margin: 0, color: '#777', fontSize: 11, fontWeight: 800 }}>No open paid hosting launch gate evidence.</p>
      ) : (
        <div style={{ display: 'grid', gap: 10 }}>
          {creatorPaidHostingLaunchGateReviewQueue.map(gate => (
            <div key={gate.id} style={{ borderRadius: 10, padding: 10, background: 'rgba(0,0,0,0.22)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                <span style={{ color: '#fff', fontSize: 12, fontWeight: 900 }}>{gate.displayName || gate.email || gate.uid}</span>
                <span style={{ color: gate.launchGateReady ? '#34D399' : '#FBBF24', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{gate.launchGateReady ? 'READY' : 'NEEDS REVIEW'}</span>
              </div>
              <div style={{ color: '#aaa', fontSize: 11, lineHeight: 1.35, marginTop: 6 }}>
                App: {gate.hostingApplicationStatus || 'missing'} · templates: {gate.publishedTemplateCount || 0} · pages: {gate.publishedBrandedPageCount || 0} · private invites: {gate.approvedPrivateInviteLaunchCount || 0}
              </div>
              <div style={{ color: '#777', fontSize: 10, lineHeight: 1.35, marginTop: 4 }}>
                Hosted: {gate.hostedChallengeCount || 0} · revenue-ready: {gate.revenueReadyCount || 0} · reach: {gate.memberReach || 0} · paid live: {gate.isPaidHostingLive ? 'yes' : 'no'}
              </div>
              <textarea
                value={creatorPaidHostingLaunchGateReviewNotes[gate.id] || ''}
                onChange={event => setCreatorPaidHostingLaunchGateReviewNotes(notes => ({ ...notes, [gate.id]: event.target.value }))}
                placeholder="Manual launch gate note: agreement, payout/tax, marketplace, support, moderation, and entitlement QA still outside client UI..."
                style={{ width: '100%', minHeight: 54, marginTop: 10, borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(0,0,0,0.22)', color: '#fff', padding: 8, fontSize: 11 }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 6, marginTop: 8 }}>
                {LAUNCH_GATE_STATUSES.map(([status, label]) => (
                  <button
                    key={status}
                    onClick={() => handleCreatorPaidHostingLaunchGateReview(gate, status)}
                    disabled={reviewingCreatorPaidHostingLaunchGateId === gate.id}
                    style={{ border: 0, borderRadius: 8, padding: '8px 6px', background: status === 'approved' ? '#F472B6' : 'rgba(255,255,255,0.08)', color: status === 'approved' ? '#220614' : '#fff', fontSize: 9, fontWeight: 900, cursor: 'pointer' }}
                  >
                    {reviewingCreatorPaidHostingLaunchGateId === gate.id ? '...' : label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
