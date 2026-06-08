export default function ComebackChallengeInviteCard({
  comebackChallengeInviteCopy,
  copyText,
  weeklyCampaignPrompt,
}) {
  return (
    <div style={{
      borderRadius: 16, padding: 16, marginBottom: 20,
      background: 'rgba(244,114,182,0.05)', border: '1px solid rgba(244,114,182,0.16)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
        <div>
          <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>COMEBACK CHALLENGE INVITE KIT</p>
          <p style={{ margin: '4px 0 0', color: '#FBCFE8', fontSize: 10, fontFamily: 'monospace' }}>
            Restart invite for this week's campaign
          </p>
        </div>
        <span style={{ color: '#F472B6', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
          {weeklyCampaignPrompt.hashtag}
        </span>
      </div>
      <p style={{ margin: '12px 0 0', color: '#FCE7F3', fontSize: 12, lineHeight: 1.45 }}>
        Copy a comeback invite that turns a missed day into a return-to-challenge prompt for this week's campaign.
      </p>
      <button
        type="button"
        onClick={() => copyText(comebackChallengeInviteCopy, 'Comeback challenge invite copied')}
        style={{
          width: '100%', marginTop: 12, padding: '12px',
          borderRadius: 14, border: '1px solid rgba(244,114,182,0.22)',
          background: 'rgba(244,114,182,0.10)', color: '#F472B6',
          fontWeight: 900, fontSize: 11, fontFamily: 'monospace',
        }}
      >
        COPY COMEBACK CHALLENGE INVITE
      </button>
    </div>
  );
}
