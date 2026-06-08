import { GOLD } from './profileConstants';

export default function WeeklyCampaignLaunchCardSection({
  weeklyCampaignPrompt,
  weeklyCampaignLaunchCardCopy,
}) {
  return (
    <div style={{
      borderRadius: 16, padding: 16, marginBottom: 20,
      background: 'rgba(96,165,250,0.05)',
      border: '1px solid rgba(96,165,250,0.16)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Weekly Campaign Launch Card Kit</p>
          <p style={{ margin: '4px 0 0', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
            Shareable campaign card brief
          </p>
        </div>
        <span style={{ color: '#60A5FA', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
          CARD COPY
        </span>
      </div>
      <div style={{
        borderRadius: 14, padding: 14, marginBottom: 10,
        background: 'linear-gradient(135deg, rgba(96,165,250,0.22), rgba(52,211,153,0.12))',
        border: '1px solid rgba(255,255,255,0.08)',
      }}>
        <p style={{ margin: 0, color: '#60A5FA', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
          WEEK {weeklyCampaignPrompt.week} · {weeklyCampaignPrompt.label.toUpperCase()}
        </p>
        <p style={{ margin: '7px 0 0', color: '#fff', fontSize: 20, fontWeight: 900 }}>{weeklyCampaignPrompt.name}</p>
        <p style={{ margin: '7px 0 0', color: '#ddd', fontSize: 12, lineHeight: 1.35 }}>{weeklyCampaignPrompt.cta}</p>
        <p style={{ margin: '10px 0 0', color: GOLD, fontSize: 11, fontWeight: 900, fontFamily: 'monospace' }}>{weeklyCampaignPrompt.hashtag}</p>
      </div>
      <p style={{ margin: 0, color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
        Copy the launch-card headline, caption, design notes, hashtag, and consent-safe posting guardrails for Stories, Reels covers, and challenge invites.
      </p>
      <button
        onClick={() => navigator.clipboard?.writeText(weeklyCampaignLaunchCardCopy)}
        style={{
          marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
          border: '1px solid rgba(96,165,250,0.22)', background: 'rgba(96,165,250,0.10)',
          color: '#60A5FA', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
        }}
      >
        COPY LAUNCH CARD KIT
      </button>
    </div>
  );
}
