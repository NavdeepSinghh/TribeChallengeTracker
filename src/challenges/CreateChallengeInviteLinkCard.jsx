import { card } from './challengeTheme';

export default function CreateChallengeInviteLinkCard({
  copied,
  onCopy,
  shareLink,
}) {
  return (
    <div style={{ ...card, textAlign: 'left', marginBottom: 16 }}>
      <p style={{ color: '#555', fontSize: 10, fontWeight: 700, letterSpacing: 1, fontFamily: 'monospace', margin: '0 0 10px' }}>YOUR INVITE LINK</p>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <span style={{ flex: 1, fontSize: 11, color: '#666', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {shareLink}
        </span>
        <button onClick={onCopy} style={{
          background: copied ? 'rgba(52,211,153,0.15)' : 'rgba(255,255,255,0.06)',
          border: `1px solid ${copied ? '#34D399' : 'rgba(255,255,255,0.1)'}`,
          color: copied ? '#34D399' : '#888', borderRadius: 8,
          padding: '6px 12px', fontSize: 11, fontFamily: 'monospace', fontWeight: 700,
          cursor: 'pointer', flexShrink: 0, transition: 'all .2s',
        }}>
          {copied ? '✓ COPIED' : 'COPY'}
        </button>
      </div>
    </div>
  );
}
