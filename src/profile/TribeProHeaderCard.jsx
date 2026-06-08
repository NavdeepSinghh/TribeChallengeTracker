import { GOLD, PRO_BENEFITS } from './profileConstants';

export default function TribeProHeaderCard({ proActive }) {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Tribe Pro</p>
          <p style={{ margin: '4px 0 0', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
            Subscription entitlement foundation
          </p>
        </div>
        <span style={{
          color: proActive ? GOLD : '#777', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
          border: `1px solid ${proActive ? 'rgba(255,215,0,0.45)' : 'rgba(255,255,255,0.08)'}`,
          borderRadius: 999, padding: '4px 8px',
        }}>
          {proActive ? 'ACTIVE' : 'NOT ACTIVE'}
        </span>
      </div>
      <p style={{ margin: '0 0 10px', color: '#aaa', fontSize: 11, lineHeight: 1.45 }}>
        Checkout uses shared product IDs. Pro unlock still requires backend receipt validation and entitlement sync.
      </p>
      <div style={{ display: 'grid', gap: 7 }}>
        {PRO_BENEFITS.map(benefit => (
          <div key={benefit} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: proActive ? GOLD : '#555', fontSize: 12 }}>{proActive ? '✓' : '•'}</span>
            <span style={{ color: proActive ? '#fff' : '#888', fontSize: 11, fontWeight: 700 }}>{benefit}</span>
          </div>
        ))}
      </div>
    </>
  );
}
