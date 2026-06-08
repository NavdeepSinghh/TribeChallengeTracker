import { GOLD, FEATURE_CATEGORY_LABELS } from './profileConstants';

export default function FeaturedSubmissionCard({ submission }) {
  const handle = (submission.instagramHandle || '').replace(/^@+/, '');
  const label = FEATURE_CATEGORY_LABELS[submission.category] || submission.category || 'Tribe win';
  const copy = `${label}: ${submission.story}${handle ? `\n\nFollow @${handle}` : ''}\n\nTag @risewiththetribe and keep building with the tribe.`;

  return (
    <div style={{
      borderRadius: 14, padding: 12,
      background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(52,211,153,0.16)',
    }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        {submission.mediaImageData ? (
          <img src={`data:image/jpeg;base64,${submission.mediaImageData}`} alt="" style={{ width: 54, height: 54, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
        ) : (
          <div style={{
            width: 54, height: 54, borderRadius: 12, flexShrink: 0,
            display: 'grid', placeItems: 'center', background: submission.avatarColor || GOLD,
            color: '#111', fontSize: 24, fontWeight: 900,
          }}>
            {submission.avatarEmoji || '✨'}
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, color: '#34D399', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
            FEATURED · {label.toUpperCase()}
          </p>
          <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 12, fontWeight: 900 }}>
            {submission.displayName || (handle ? `@${handle}` : 'Tribe member')}
          </p>
          <p style={{ margin: '4px 0 0', color: '#888', fontSize: 11, lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
            {submission.story}
          </p>
        </div>
      </div>
      <button
        onClick={() => navigator.clipboard?.writeText(copy)}
        style={{
          marginTop: 10, width: '100%', border: '1px solid rgba(52,211,153,0.22)',
          borderRadius: 12, padding: '9px 10px', background: 'rgba(52,211,153,0.08)',
          color: '#34D399', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
        }}
      >
        COPY REPOST CAPTION
      </button>
    </div>
  );
}
