export default function PartnerMetrics({ color, partnerDemandTotal, campaignPerformanceSummary, referralJoins }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 9 }}>
      {[
        ['DEMAND', partnerDemandTotal],
        ['REACH', campaignPerformanceSummary.memberReach || 0],
        ['REFERRALS', referralJoins],
      ].map(([label, value]) => (
        <div key={label} style={{ borderRadius: 10, padding: 8, background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ margin: 0, color, fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{label}</p>
          <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 18, fontWeight: 900 }}>{value}</p>
        </div>
      ))}
    </div>
  );
}
