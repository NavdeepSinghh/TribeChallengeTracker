export default function CreatorDemandSummaryCard({
  creatorRevenueSharePitchCopy,
  creatorRevenueShareSummary,
  creatorRevenueShareTotal,
}) {
  return (
    <div style={{
      borderRadius: 12, padding: 12, marginBottom: 10,
      background: 'rgba(52,211,153,0.08)',
      border: '1px solid rgba(52,211,153,0.18)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center', marginBottom: 8 }}>
        <p style={{ margin: 0, color: '#34D399', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>CREATOR DEMAND SUMMARY</p>
        <p style={{ margin: 0, color: creatorRevenueShareTotal ? '#34D399' : '#777', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
          {creatorRevenueShareTotal ? 'BETA INTEREST' : 'GATHERING'}
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {[
          ['ENABLED', creatorRevenueShareSummary.enabled || 0],
          ['BETA', creatorRevenueShareSummary.revenueShareInterest || 0],
          ['BRANDED', creatorRevenueShareSummary.branded || 0],
        ].map(([label, value]) => (
          <div key={label} style={{
            borderRadius: 10, padding: 8,
            background: 'rgba(0,0,0,0.18)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <p style={{ margin: 0, color: '#34D399', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{label}</p>
            <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 18, fontWeight: 900 }}>{value}</p>
          </div>
        ))}
      </div>
      <p style={{ margin: '9px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
        {creatorRevenueSharePitchCopy}
      </p>
      <button
        onClick={() => navigator.clipboard?.writeText(creatorRevenueSharePitchCopy)}
        style={{
          marginTop: 9, width: '100%', borderRadius: 12, padding: '9px 10px',
          border: '1px solid rgba(52,211,153,0.22)', background: 'rgba(52,211,153,0.10)',
          color: '#34D399', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
        }}
      >
        COPY CREATOR BETA COPY
      </button>
    </div>
  );
}
