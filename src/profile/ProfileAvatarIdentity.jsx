export default function ProfileAvatarIdentity({ memberYear, rank, user }) {
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <h2 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {user.displayName || user.email?.split('@')[0] || 'Tribe Member'}
      </h2>
      <span style={{
        fontSize: 10, fontFamily: 'monospace', fontWeight: 700,
        color: rank.color, background: `${rank.color}18`,
        border: `1px solid ${rank.color}33`, borderRadius: 6, padding: '3px 8px',
      }}>
        {rank.icon} {rank.label}
      </span>
      <p style={{ margin: '6px 0 0', fontSize: 10, color: '#444', fontFamily: 'monospace' }}>
        Member since {memberYear}
      </p>
    </div>
  );
}
