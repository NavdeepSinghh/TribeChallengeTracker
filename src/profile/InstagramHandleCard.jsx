import { ACCENT } from './profileConstants';

export default function InstagramHandleCard({
  handleSocialSave,
  instagramHandle,
  isSavingSocial,
  profile,
  setInstagramHandle,
  socialMessage,
}) {
  return (
    <div style={{
      borderRadius: 16, padding: 16, marginBottom: 20,
      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
        <div>
          <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Instagram</p>
          <p style={{ margin: '3px 0 0', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
            Used for shares and future Tribe features.
          </p>
        </div>
        {profile?.instagramHandle && (
          <span style={{ color: ACCENT, fontSize: 11, fontWeight: 800, fontFamily: 'monospace' }}>
            @{profile.instagramHandle}
          </span>
        )}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', gap: 4,
          borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(0,0,0,0.22)', padding: '0 12px',
        }}>
          <span style={{ color: '#777', fontSize: 13, fontWeight: 800 }}>@</span>
          <input
            value={instagramHandle}
            onChange={e => setInstagramHandle(e.target.value.replace(/^@+/, '').replace(/[^a-zA-Z0-9._]/g, '').slice(0, 30))}
            placeholder="yourhandle"
            style={{
              flex: 1, minWidth: 0, height: 42, border: 'none', outline: 'none',
              background: 'transparent', color: '#fff', fontSize: 13, fontWeight: 700,
            }}
          />
        </div>
        <button
          onClick={handleSocialSave}
          disabled={isSavingSocial}
          style={{
            minWidth: 78, border: 'none', borderRadius: 12,
            background: isSavingSocial ? 'rgba(255,255,255,0.08)' : ACCENT,
            color: isSavingSocial ? '#777' : '#111', fontSize: 12, fontWeight: 900,
            cursor: isSavingSocial ? 'default' : 'pointer',
          }}
        >
          {isSavingSocial ? 'Saving' : 'Save'}
        </button>
      </div>
      {socialMessage && (
        <p style={{ margin: '8px 0 0', color: socialMessage.includes('Could not') ? '#ffb199' : '#777', fontSize: 10, fontFamily: 'monospace' }}>
          {socialMessage}
        </p>
      )}
    </div>
  );
}
