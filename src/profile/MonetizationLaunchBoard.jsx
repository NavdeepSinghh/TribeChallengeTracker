import { MetricCard } from './MonetizationKitCards';

export default function MonetizationLaunchBoard({
  creatorRevenueShareTotal,
  monetizationLaunchCopy,
  monetizationSignalTotal,
  partnerDemandTotal,
  proTrialDemandTotal,
}) {
  return (
    <div style={{
      borderRadius: 16, padding: 16, marginBottom: 20,
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Monetization Launch Board</p>
          <p style={{ margin: '4px 0 0', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
            Admin-only first-party demand signals
          </p>
        </div>
        <span style={{ color: monetizationSignalTotal ? '#34D399' : '#777', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
          {monetizationSignalTotal ? 'SIGNALS LIVE' : 'GATHERING'}
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {[
          { label: 'TOTAL', value: monetizationSignalTotal, color: '#FFD166' },
          { label: 'PRO TRIAL', value: proTrialDemandTotal, color: '#A78BFA' },
          { label: 'CREATOR', value: creatorRevenueShareTotal, color: '#34D399' },
          { label: 'PARTNER', value: partnerDemandTotal, color: '#60A5FA' },
        ].map(metric => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>
      <p style={{ margin: '10px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
        {monetizationLaunchCopy}
      </p>
      <button
        onClick={() => navigator.clipboard?.writeText(monetizationLaunchCopy)}
        style={{
          marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
          border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.05)',
          color: '#fff', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
        }}
      >
        COPY LAUNCH BOARD COPY
      </button>
    </div>
  );
}
