export default function CreateChallengeShareActions({
  created,
  createdCampaignShareText,
  onLaunchCardShare,
  shareLink,
}) {
  return (
    <>
      <button onClick={onLaunchCardShare} style={{
        width: '100%', padding: '12px', borderRadius: 12, marginBottom: 12,
        border: `1px solid ${created.color}66`, background: `${created.color}18`,
        color: '#fff', fontSize: 12, fontWeight: 900, cursor: 'pointer',
        fontFamily: "'Syne', sans-serif",
      }}>
        Share Launch Card
      </button>

      <div style={{ display: 'flex', gap: 10 }}>
        {['WhatsApp', 'Instagram', 'Messages'].map(app => (
          <button key={app} onClick={() => navigator.clipboard.writeText(createdCampaignShareText || shareLink).catch(() => {})} style={{
            flex: 1, padding: '10px 6px', borderRadius: 10, cursor: 'pointer',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            color: '#666', fontSize: 10, fontFamily: 'monospace', fontWeight: 700,
          }}>
            {app}
          </button>
        ))}
      </div>
    </>
  );
}
