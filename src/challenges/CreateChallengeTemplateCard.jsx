import { canCreateChallengeTemplate, V1_PAID_FEATURES_ENABLED } from '../proFeatures';
import { card } from './challengeTheme';

export default function CreateChallengeTemplateCard({ onTemplateSelect, profile, template }) {
  const unlocked = canCreateChallengeTemplate(profile, template);

  return (
    <button
      onClick={() => onTemplateSelect(template)}
      style={{
        ...card, cursor: 'pointer', textAlign: 'left',
        border: `1px solid ${template.color}44`,
        display: 'flex', alignItems: 'center', gap: 16, padding: '16px 18px',
        transition: 'all .2s', opacity: !unlocked ? 0.72 : 1,
      }}
    >
      <div style={{ width: 48, height: 48, borderRadius: 14, background: `${template.color}18`, border: `1.5px solid ${template.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
        {template.emoji}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{template.name}</span>
          <span style={{ fontSize: 9, fontFamily: 'monospace', fontWeight: 700, color: template.color, background: `${template.color}15`, border: `1px solid ${template.color}33`, borderRadius: 5, padding: '2px 6px' }}>
            {template.difficulty.toUpperCase()}
          </span>
          {template.isPremium && (
            <span style={{ fontSize: 9, fontFamily: 'monospace', fontWeight: 900, color: '#A78BFA', background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.35)', borderRadius: 5, padding: '2px 6px' }}>
              {V1_PAID_FEATURES_ENABLED ? (unlocked ? template.packLabel?.toUpperCase() || 'PREMIUM' : 'LOCKED') : 'V1 INCLUDED'}
            </span>
          )}
          {template.source === 'creatorChallengeTemplates' && (
            <span style={{ fontSize: 9, fontFamily: 'monospace', fontWeight: 900, color: '#34D399', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.28)', borderRadius: 5, padding: '2px 6px' }}>
              CREATOR
            </span>
          )}
        </div>
        <div style={{ fontSize: 11, color: '#666' }}>{template.tagline}</div>
        {template.source === 'creatorChallengeTemplates' && (
          <div style={{ marginTop: 6, fontSize: 9, color: '#34D399', fontFamily: 'monospace', fontWeight: 800 }}>
            FREE-FIRST · REVIEWED TEMPLATE
          </div>
        )}
        {template.campaignLabel && (
          <div style={{ marginTop: 6, fontSize: 9, color: template.color, fontFamily: 'monospace', fontWeight: 800 }}>
            📣 {template.campaignLabel.toUpperCase()} {template.campaignHashtag ? `· ${template.campaignHashtag}` : ''}
          </div>
        )}
        {template.isPremium && (
          <div style={{ marginTop: 10, padding: '9px 10px', borderRadius: 10, background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.2)' }}>
            <div style={{ color: '#A78BFA', fontSize: 9, fontFamily: 'monospace', fontWeight: 900, marginBottom: 6 }}>
              PACK VALUE PREVIEW
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 6 }}>
              {[
                ['DAYS', template.duration],
                ['TASKS', template.tasks?.length || 0],
                ['PROMPTS', template.dailyPrompts?.length || 0],
              ].map(([label, value]) => (
                <div key={label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '6px 7px' }}>
                  <div style={{ color: '#777', fontSize: 8, fontFamily: 'monospace', fontWeight: 800 }}>{label}</div>
                  <div style={{ color: '#fff', fontSize: 12, fontWeight: 900 }}>{value}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 7, color: '#888', fontSize: 10, lineHeight: 1.35 }}>
              {!V1_PAID_FEATURES_ENABLED
                ? 'Included in V1 launch. Build the challenge and use the pack prompts every day.'
                : unlocked
                ? 'Unlocked for your account. Build the challenge and use the pack prompts every day.'
                : 'This structured challenge pack is planned for a later release.'}
            </div>
          </div>
        )}
      </div>
      <div style={{ fontSize: 12, color: '#555', fontFamily: 'monospace', flexShrink: 0 }}>
        {template.duration}d →
      </div>
    </button>
  );
}
