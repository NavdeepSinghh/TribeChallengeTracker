import { ACCENT } from './challengeTheme';
import { V1_PAID_FEATURES_ENABLED } from '../proFeatures';

export default function CreateChallengeVisibilitySelector({
  canCreatePrivate,
  isPublic,
  proMessage,
  setIsPublic,
  setProMessage,
}) {
  return (
    <div style={{ marginBottom: 22 }}>
      <label style={{ color: '#555', fontSize: 10, fontFamily: 'monospace', fontWeight: 700, letterSpacing: 1, display: 'block', marginBottom: 8 }}>VISIBILITY</label>
      <div style={{ display: 'flex', gap: 10 }}>
        {[
          { val: true,  icon: '🌐', label: 'Public', desc: 'Discoverable by anyone' },
          { val: false, icon: '🔒', label: 'Private', desc: canCreatePrivate ? 'Invite link only' : (V1_PAID_FEATURES_ENABLED ? 'Tribe Pro benefit' : 'Later release') },
        ].map(opt => (
          <button key={String(opt.val)} onClick={() => {
            if (opt.val === false && !canCreatePrivate) {
              setIsPublic(true);
              setProMessage(V1_PAID_FEATURES_ENABLED
                ? 'Private challenges are a Tribe Pro feature. Public challenges are still available.'
                : 'Private challenges are planned after the free V1 launch. Public challenges are available now.');
              return;
            }
            setProMessage('');
            setIsPublic(opt.val);
          }} style={{
            flex: 1, padding: '12px 10px', borderRadius: 14, cursor: 'pointer', textAlign: 'center',
            border: `1.5px solid ${isPublic === opt.val ? ACCENT : 'rgba(255,255,255,0.08)'}`,
            background: isPublic === opt.val ? 'rgba(255,107,53,0.1)' : opt.val === false && !canCreatePrivate ? 'rgba(167,139,250,0.06)' : 'rgba(255,255,255,0.03)',
            transition: 'all .2s',
          }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{opt.icon}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: isPublic === opt.val ? '#fff' : '#666' }}>{opt.label}</div>
            <div style={{ fontSize: 9, color: '#555', fontFamily: 'monospace', marginTop: 2 }}>{opt.desc}</div>
          </button>
        ))}
      </div>
      {proMessage && (
        <p style={{ margin: '8px 0 0', color: '#A78BFA', fontSize: 10, fontFamily: 'monospace', lineHeight: 1.35 }}>
          {proMessage}
        </p>
      )}
    </div>
  );
}
