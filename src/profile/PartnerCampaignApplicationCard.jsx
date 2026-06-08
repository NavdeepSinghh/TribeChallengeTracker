export default function PartnerCampaignApplicationCard({
  isSubmittingPartnerCampaignApplication,
  onPartnerCampaignApplication,
  partnerCampaignApplicationMessage,
  partnerCampaignApplicationSignalTotal,
}) {
  return (
    <div style={{
      marginTop: 12, borderRadius: 12, padding: 12,
      background: 'rgba(45,212,191,0.075)', border: '1px solid rgba(45,212,191,0.18)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start' }}>
        <div>
          <p style={{ margin: 0, color: '#2DD4BF', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>PARTNER CAMPAIGN APPLICATION</p>
          <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 12, fontWeight: 900 }}>
            Request manual sponsor-pilot review
          </p>
        </div>
        <span style={{ color: partnerCampaignApplicationSignalTotal ? '#2DD4BF' : '#777', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
          REVIEW ONLY
        </span>
      </div>
      <p style={{ margin: '9px 0 0', color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
        Submit partnerCampaignApplications for manual review using saved perk demand, campaign reach, and referral signals. This does not add partner links, tracking pixels, ad targeting, affiliate payouts, purchases, entitlements, revenue-share, or paid-access claims.
      </p>
      <button
        onClick={onPartnerCampaignApplication}
        disabled={isSubmittingPartnerCampaignApplication || !partnerCampaignApplicationSignalTotal}
        style={{
          marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
          border: '1px solid rgba(45,212,191,0.24)', background: partnerCampaignApplicationSignalTotal ? 'rgba(45,212,191,0.12)' : 'rgba(255,255,255,0.05)',
          color: partnerCampaignApplicationSignalTotal ? '#2DD4BF' : '#666', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
          cursor: partnerCampaignApplicationSignalTotal ? 'pointer' : 'not-allowed',
        }}
      >
        {isSubmittingPartnerCampaignApplication ? 'SENDING PARTNER CAMPAIGN APPLICATION...' : 'APPLY FOR PARTNER PILOT REVIEW'}
      </button>
      {partnerCampaignApplicationMessage && (
        <p style={{ margin: '8px 0 0', color: partnerCampaignApplicationMessage.includes('sent') ? '#2DD4BF' : '#ffb199', fontSize: 10, lineHeight: 1.4, fontFamily: 'monospace' }}>
          {partnerCampaignApplicationMessage}
        </p>
      )}
    </div>
  );
}
