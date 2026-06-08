import { PARTNER_PERK_CLAIM_REVIEW_STATUS_OPTIONS } from './partnerPerkClaimReviewStatusOptions';

export default function PartnerPerkClaimReviewQueueItem({
  onPartnerPerkClaimReview,
  partnerPerkReviewNotes,
  req,
  reviewingPartnerPerkClaimId,
  setPartnerPerkReviewNotes,
}) {
  const isReviewing = reviewingPartnerPerkClaimId === req.id;

  return (
    <div style={{ padding: '10px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ color: '#fff', fontSize: 12, fontWeight: 900 }}>{req.displayName || req.email || req.uid}</span>
        <span style={{ color: '#60A5FA', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{(req.perkLabel || 'PERK').toUpperCase()}</span>
      </div>
      <div style={{ color: '#777', fontSize: 10, fontWeight: 700, marginTop: 4 }}>
        {req.current || 0}/{req.target || 0} · {req.requirement || 'eligible'} · {req.source || 'unknown'}
      </div>
      <textarea
        value={partnerPerkReviewNotes[req.id] || ''}
        onChange={event => setPartnerPerkReviewNotes(notes => ({ ...notes, [req.id]: event.target.value.slice(0, 500) }))}
        placeholder="Manual review note: eligibility proof, partner terms, support owner, destination safety..."
        style={{
          marginTop: 8, width: '100%', minHeight: 54, borderRadius: 10, padding: 8,
          border: '1px solid rgba(96,165,250,0.18)', background: 'rgba(0,0,0,0.24)',
          color: '#fff', fontSize: 10, lineHeight: 1.35, resize: 'vertical',
        }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 6, marginTop: 7 }}>
        {PARTNER_PERK_CLAIM_REVIEW_STATUS_OPTIONS.map(([status, label]) => (
          <button
            key={status}
            onClick={() => onPartnerPerkClaimReview(req.id, status)}
            disabled={isReviewing}
            style={{
              borderRadius: 9, padding: '7px 6px',
              border: '1px solid rgba(96,165,250,0.20)', background: 'rgba(96,165,250,0.10)',
              color: '#60A5FA', fontSize: 8, fontWeight: 900, fontFamily: 'monospace',
            }}
          >
            {isReviewing ? 'SAVING' : label}
          </button>
        ))}
      </div>
    </div>
  );
}
