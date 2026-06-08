import { PARTNER_CAMPAIGN_APPLICATION_REVIEW_STATUS_OPTIONS } from './partnerCampaignApplicationReviewStatusOptions';

export default function PartnerCampaignReviewQueueItem({
  onPartnerCampaignApplicationReview,
  partnerCampaignApplicationReviewNotes,
  req,
  reviewingPartnerCampaignApplicationId,
  setPartnerCampaignApplicationReviewNotes,
}) {
  const isReviewing = reviewingPartnerCampaignApplicationId === req.id;

  return (
    <div style={{ padding: '10px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ color: '#fff', fontSize: 12, fontWeight: 900 }}>{req.displayName || req.email || req.uid}</span>
        <span style={{ color: '#2DD4BF', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{(req.topPerkLabel || 'PILOT').toUpperCase()}</span>
      </div>
      <div style={{ color: '#777', fontSize: 10, fontWeight: 700, marginTop: 4 }}>
        {req.demandCount || 0} demand · {req.totalDemand || 0} total · {req.campaignReach || 0} reach · {req.referralJoins || 0} refs · {req.source || 'unknown'}
      </div>
      <textarea
        value={partnerCampaignApplicationReviewNotes[req.id] || ''}
        onChange={event => setPartnerCampaignApplicationReviewNotes(notes => ({ ...notes, [req.id]: event.target.value.slice(0, 500) }))}
        placeholder="Manual campaign review note: partner terms, privacy, support readiness, destination safety..."
        style={{
          marginTop: 8, width: '100%', minHeight: 54, borderRadius: 10, padding: 8,
          border: '1px solid rgba(45,212,191,0.18)', background: 'rgba(0,0,0,0.24)',
          color: '#fff', fontSize: 10, lineHeight: 1.35, resize: 'vertical',
        }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 6, marginTop: 7 }}>
        {PARTNER_CAMPAIGN_APPLICATION_REVIEW_STATUS_OPTIONS.map(([status, label]) => (
          <button
            key={status}
            onClick={() => onPartnerCampaignApplicationReview(req.id, status)}
            disabled={isReviewing}
            style={{
              borderRadius: 9, padding: '7px 6px',
              border: '1px solid rgba(45,212,191,0.20)', background: 'rgba(45,212,191,0.10)',
              color: '#2DD4BF', fontSize: 8, fontWeight: 900, fontFamily: 'monospace',
            }}
          >
            {isReviewing ? 'SAVING' : label}
          </button>
        ))}
      </div>
    </div>
  );
}
