export default function ProfileTopBar({ onClose, theme, title = 'YOUR PROFILE' }) {
  const palette = theme || {
    navBg: 'rgba(8,8,8,0.9)',
    divider: 'rgba(255,255,255,0.05)',
    mutedStrong: '#888',
    cardBgStrong: 'rgba(255,255,255,0.06)',
    cardBorderStrong: 'rgba(255,255,255,0.1)',
  };

  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 10,
      background: palette.navBg, backdropFilter: 'blur(20px)',
      padding: '48px 24px 14px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      borderBottom: `1px solid ${palette.divider}`,
    }}>
      <p style={{ margin: 0, fontSize: 10, color: palette.mutedStrong, fontFamily: 'monospace', fontWeight: 700, letterSpacing: 2 }}>{title}</p>
      <button onClick={onClose} style={{
        background: palette.cardBgStrong, border: `1px solid ${palette.cardBorderStrong}`,
        color: palette.mutedStrong, borderRadius: 20, width: 32, height: 32,
        fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>×</button>
    </div>
  );
}
