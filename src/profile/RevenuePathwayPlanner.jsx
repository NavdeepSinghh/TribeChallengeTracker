export default function RevenuePathwayPlanner({
  recommendedRevenuePath,
  revenuePathwayPlannerCopy,
  revenuePathways,
}) {
  return (
    <div style={{
      borderRadius: 16, padding: 16, marginBottom: 20,
      background: 'rgba(16,185,129,0.05)',
      border: '1px solid rgba(16,185,129,0.16)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>REVENUE PATHWAY PLANNER</p>
          <p style={{ margin: '4px 0 0', color: '#34D399', fontSize: 10, fontFamily: 'monospace' }}>
            Manual next revenue move from first-party signals
          </p>
        </div>
        <span style={{ color: '#34D399', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
          {recommendedRevenuePath.label.toUpperCase()}
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8 }}>
        {revenuePathways.map(pathway => (
          <div key={pathway.id} style={{
            borderRadius: 10, padding: 10,
            background: 'rgba(0,0,0,0.18)',
            border: `1px solid ${pathway.id === recommendedRevenuePath.id ? 'rgba(52,211,153,0.42)' : 'rgba(255,255,255,0.06)'}`,
          }}>
            <p style={{ margin: 0, color: '#34D399', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
              SIGNAL {pathway.signal}
            </p>
            <p style={{ margin: '5px 0 0', color: '#fff', fontSize: 12, fontWeight: 900 }}>{pathway.label}</p>
            <p style={{ margin: '4px 0 0', color: '#888', fontSize: 9, lineHeight: 1.35 }}>{pathway.action}</p>
          </div>
        ))}
      </div>
      <p style={{ margin: '10px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
        Recommended: {recommendedRevenuePath.action}
      </p>
      <button
        onClick={() => navigator.clipboard?.writeText(revenuePathwayPlannerCopy)}
        style={{
          marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
          border: '1px solid rgba(16,185,129,0.22)', background: 'rgba(16,185,129,0.10)',
          color: '#34D399', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
        }}
      >
        COPY REVENUE PATHWAY PLAN
      </button>
    </div>
  );
}
