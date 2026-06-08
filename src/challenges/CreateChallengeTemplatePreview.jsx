import { card } from './challengeTheme';

export default function CreateChallengeTemplatePreview({ template }) {
  return (
    <>
      {template.rules.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <p style={{ color: '#555', fontSize: 10, fontWeight: 700, letterSpacing: 1, fontFamily: 'monospace', margin: '0 0 10px' }}>RULES YOUR MEMBERS WILL SEE</p>
          <div style={{ ...card, padding: '6px 18px' }}>
            {template.rules.map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: i < template.rules.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', alignItems: 'flex-start' }}>
                <span style={{ color: template.color, fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{i + 1}.</span>
                <span style={{ fontSize: 12, color: '#888', lineHeight: 1.5 }}>{r}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {template.campaignCta && (
        <div style={{ ...card, marginBottom: 16, border: `1px solid ${template.color}33`, background: `${template.color}0d` }}>
          <p style={{ margin: '0 0 6px', fontSize: 10, color: template.color, fontFamily: 'monospace', fontWeight: 800, letterSpacing: 1 }}>
            CAMPAIGN CTA {template.campaignHashtag ? `· ${template.campaignHashtag}` : ''}
          </p>
          <p style={{ margin: 0, fontSize: 12, color: '#aaa', lineHeight: 1.5 }}>{template.campaignCta}</p>
        </div>
      )}

      {template.sponsorName && (
        <div style={{ ...card, marginBottom: 16, border: '1px solid rgba(96,165,250,0.28)', background: 'rgba(96,165,250,0.07)' }}>
          <p style={{ margin: '0 0 6px', fontSize: 10, color: '#60A5FA', fontFamily: 'monospace', fontWeight: 800, letterSpacing: 1 }}>
            {template.sponsorLabel || 'PARTNER PERK'}
          </p>
          <p style={{ margin: '0 0 4px', fontSize: 13, color: '#fff', fontWeight: 900 }}>{template.sponsorName}</p>
          <p style={{ margin: 0, fontSize: 12, color: '#aaa', lineHeight: 1.5 }}>{template.sponsorPerk}</p>
        </div>
      )}

      <div style={{ ...card, marginBottom: 22, border: '1px solid rgba(255,165,0,0.2)', background: 'rgba(255,165,0,0.05)', padding: '14px 18px' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
          <p style={{ margin: 0, fontSize: 11, color: '#888', lineHeight: 1.6, fontFamily: 'monospace' }}>
            {template.disclaimer}
          </p>
        </div>
      </div>
    </>
  );
}
