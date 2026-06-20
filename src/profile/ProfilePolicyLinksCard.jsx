import { POLICY_LINKS } from './profileConstants';

export default function ProfilePolicyLinksCard({ theme }) {
  const palette = theme || {
    cardBg: 'rgba(20,184,166,0.04)',
    cardBorder: 'rgba(20,184,166,0.12)',
    mutedStrong: '#888',
    textSoft: '#aaa',
  };

  return (
    <>
      <p style={{ color: palette.mutedStrong, fontSize: 10, fontWeight: 700, letterSpacing: 2, fontFamily: 'monospace', margin: '0 0 12px' }}>POLICY & SUPPORT</p>
      <div style={{
        background: palette.cardBg, border: `1px solid ${palette.cardBorder}`,
        borderRadius: 16, padding: 14, marginBottom: 20,
      }}>
        <p style={{ margin: '0 0 10px', color: palette.textSoft, fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
          Review privacy, terms, support, and account/data deletion resources for store release and member help.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {POLICY_LINKS.map(link => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              style={{
                borderRadius: 12, padding: '10px 8px',
                border: '1px solid rgba(20,184,166,0.18)',
                background: 'rgba(20,184,166,0.08)',
                color: '#14B8A6', textDecoration: 'none',
                fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
                textAlign: 'center',
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
