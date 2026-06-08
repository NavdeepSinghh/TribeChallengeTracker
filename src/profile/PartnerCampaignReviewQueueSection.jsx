import PartnerCampaignReviewQueueItem from './PartnerCampaignReviewQueueItem';

export default function PartnerCampaignReviewQueueSection({
  onPartnerCampaignApplicationReview,
  partnerCampaignApplicationReviewNotes,
  partnerCampaignApplicationReviewQueue,
  reviewingPartnerCampaignApplicationId,
  setPartnerCampaignApplicationReviewNotes,
}) {
  return (
    <div style={{
      marginTop: 10, borderRadius: 12, padding: 11,
      background: 'rgba(45,212,191,0.075)', border: '1px solid rgba(45,212,191,0.18)',
    }}>
      <p style={{ margin: 0, color: '#2DD4BF', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>PARTNER CAMPAIGN APPLICATION REVIEW QUEUE</p>
      <p style={{ margin: '8px 0 10px', color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
        Admin-only queue for open partnerCampaignApplications. Review first-party demand, campaign reach, partner terms, privacy, and support readiness; do not add partner links, tracking pixels, ad targeting, affiliate payouts, purchases, entitlements, revenue-share, or paid-access claims from profile UI.
      </p>
      {partnerCampaignApplicationReviewQueue.length === 0 ? (
        <div style={{ color: '#666', fontSize: 11, fontWeight: 800 }}>No open partner campaign applications.</div>
      ) : partnerCampaignApplicationReviewQueue.slice(0, 5).map(req => (
        <PartnerCampaignReviewQueueItem
          key={req.id}
          onPartnerCampaignApplicationReview={onPartnerCampaignApplicationReview}
          partnerCampaignApplicationReviewNotes={partnerCampaignApplicationReviewNotes}
          req={req}
          reviewingPartnerCampaignApplicationId={reviewingPartnerCampaignApplicationId}
          setPartnerCampaignApplicationReviewNotes={setPartnerCampaignApplicationReviewNotes}
        />
      ))}
    </div>
  );
}
