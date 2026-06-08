import { PARTNER_PERKS } from '../partnerPerks';

export default function PartnerDemandGrid({ partnerPerkSummary }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
      {PARTNER_PERKS.map(perk => (
        <div key={perk.id} style={{
          borderRadius: 10, padding: 8,
          background: 'rgba(0,0,0,0.18)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <p style={{ margin: 0, color: perk.color, fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{perk.label.toUpperCase()}</p>
          <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 18, fontWeight: 900 }}>{partnerPerkSummary[perk.id] || 0}</p>
        </div>
      ))}
    </div>
  );
}
