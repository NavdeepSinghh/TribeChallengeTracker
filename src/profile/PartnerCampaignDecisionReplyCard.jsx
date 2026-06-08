export default function PartnerCampaignDecisionReplyCard({
  campaignPerformanceSummary,
  copyText,
  partnerCampaignApplicationReviewQueue,
  partnerCampaignDecisionReplyCopy,
  partnerDemandTotal,
}) {
  return (
    <div style={{
      marginTop: 10, borderRadius: 12, padding: 11,
      background: 'rgba(14,165,233,0.075)', border: '1px solid rgba(14,165,233,0.18)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
        <div>
          <p style={{ margin: 0, color: '#0EA5E9', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>PARTNER CAMPAIGN DECISION REPLY KIT</p>
          <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 12, fontWeight: 900 }}>
            Manual sponsor-pilot review replies
          </p>
        </div>
        <span style={{ color: '#0EA5E9', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>COPY ONLY</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {[
          ['OPEN', partnerCampaignApplicationReviewQueue.length],
          ['DEMAND', partnerDemandTotal],
          ['REACH', campaignPerformanceSummary.memberReach || 0],
        ].map(([label, value]) => (
          <div key={label} style={{ borderRadius: 10, padding: 8, background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ margin: 0, color: '#0EA5E9', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{label}</p>
            <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 18, fontWeight: 900 }}>{value}</p>
          </div>
        ))}
      </div>
      <p style={{ margin: '9px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
        Copy approved, waiting, not-ready, and declined sponsor-pilot replies without partner links, tracking, payouts, purchases, entitlements, or fulfillment promises.
      </p>
      <button
        onClick={() => copyText(partnerCampaignDecisionReplyCopy)}
        style={{
          marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
          border: '1px solid rgba(14,165,233,0.24)', background: 'rgba(14,165,233,0.10)',
          color: '#0EA5E9', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
        }}
      >
        COPY PARTNER CAMPAIGN DECISION REPLIES
      </button>
    </div>
  );
}
