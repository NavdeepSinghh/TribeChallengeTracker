export default function ProfileAccountCard({
  displayNameDraft = '',
  displayNameMessage = '',
  isSavingDisplayName = false,
  onDisplayNameSave,
  onSignOut,
  profile,
  setDisplayNameDraft,
  theme,
  user,
}) {
  const palette = theme || {
    cardBg: 'rgba(255,255,255,0.03)',
    cardBorder: 'rgba(255,255,255,0.06)',
    divider: 'rgba(255,255,255,0.05)',
    muted: '#555',
    mutedStrong: '#888',
    textSoft: '#aaa',
  };
  const rows = [
    { label: 'EMAIL', value: user.email || '-' },
    { label: 'USER ID', value: (user.uid?.slice(0, 12) || '') + '...' },
  ];

  return (
    <>
      <p style={{ color: palette.mutedStrong, fontSize: 10, fontWeight: 700, letterSpacing: 2, fontFamily: 'monospace', margin: '0 0 12px' }}>ACCOUNT</p>
      <div style={{
        background: palette.cardBg, border: `1px solid ${palette.cardBorder}`,
        borderRadius: 16, padding: '0 16px 4px',
      }}>
        <div style={{ padding: '14px 0', borderBottom: `1px solid ${palette.divider}` }}>
          <span style={{ fontSize: 9, color: palette.mutedStrong, fontFamily: 'monospace', fontWeight: 700, letterSpacing: 1 }}>DISPLAY NAME</span>
          <input
            aria-label="Display name"
            maxLength={40}
            onChange={e => setDisplayNameDraft?.(e.target.value)}
            placeholder={profile?.displayName || user.displayName || 'Your public name'}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              marginTop: 8,
              border: `1px solid ${palette.cardBorder}`,
              borderRadius: 12,
              padding: '11px 12px',
              background: palette.cardBg,
              color: palette.textSoft,
              fontSize: 14,
              fontWeight: 700,
              outline: 'none',
            }}
            value={displayNameDraft}
          />
          <p style={{ color: palette.mutedStrong, fontSize: 11, lineHeight: 1.45, margin: '8px 0 10px' }}>
            This is the name other members see on challenge leaderboards and tribe activity.
          </p>
          <button
            disabled={isSavingDisplayName}
            onClick={onDisplayNameSave}
            style={{
              width: '100%',
              padding: '11px',
              borderRadius: 12,
              border: 'none',
              background: '#34D399',
              color: '#07110C',
              fontSize: 13,
              fontWeight: 900,
              cursor: isSavingDisplayName ? 'default' : 'pointer',
              opacity: isSavingDisplayName ? 0.65 : 1,
            }}
          >
            {isSavingDisplayName ? 'Saving...' : 'Save Display Name'}
          </button>
          {displayNameMessage && (
            <p style={{ color: displayNameMessage.includes('saved') ? '#34D399' : '#FF6B35', fontSize: 11, fontWeight: 700, margin: '8px 0 0' }}>
              {displayNameMessage}
            </p>
          )}
        </div>
        {rows.map((row, i) => (
          <div key={row.label} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '12px 0',
            borderBottom: i === 0 ? `1px solid ${palette.divider}` : 'none',
          }}>
            <span style={{ fontSize: 9, color: palette.mutedStrong, fontFamily: 'monospace', fontWeight: 700, letterSpacing: 1 }}>{row.label}</span>
            <span style={{ fontSize: 11, color: palette.textSoft, fontFamily: 'monospace' }}>{row.value}</span>
          </div>
        ))}
      </div>

      <button
        onClick={onSignOut}
        style={{
          width: '100%', marginTop: 24, padding: '14px', borderRadius: 14,
          border: `1px solid ${palette.cardBorder}`,
          background: palette.cardBg, color: palette.mutedStrong,
          fontSize: 14, fontWeight: 700, cursor: 'pointer',
          fontFamily: "'Space Grotesk', sans-serif", letterSpacing: 0.5,
          transition: 'all .2s',
        }}
      >
        Sign Out
      </button>
    </>
  );
}
