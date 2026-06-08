import { ACCENT, FEATURE_CATEGORY_LABELS, FEATURE_STATUS_STYLES } from './profileConstants';

export default function FeatureSubmissionHistory({ featureSubmissions }) {
  if (!featureSubmissions.length) return null;

  return (
    <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <p style={{ margin: '0 0 8px', color: '#555', fontSize: 10, fontFamily: 'monospace', fontWeight: 800 }}>YOUR SUBMISSIONS</p>
      {featureSubmissions.slice(0, 3).map(sub => {
        const [label, color] = FEATURE_STATUS_STYLES[sub.status] || [sub.status || 'Pending', '#888'];
        return (
          <div key={sub.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '9px 0', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: '0 0 3px', color: '#ddd', fontSize: 12, fontWeight: 800 }}>
                {FEATURE_CATEGORY_LABELS[sub.category] || sub.category || 'Submission'}
              </p>
              <p style={{ margin: 0, color: '#666', fontSize: 10, lineHeight: 1.35, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {sub.story}
              </p>
              {sub.mediaImageData && (
                <p style={{ margin: '3px 0 0', color: ACCENT, fontSize: 9, fontFamily: 'monospace', fontWeight: 900 }}>
                  PHOTO ATTACHED
                </p>
              )}
            </div>
            <span style={{ color, border: `1px solid ${color}44`, background: `${color}12`, borderRadius: 999, padding: '3px 7px', fontSize: 9, fontFamily: 'monospace', fontWeight: 900 }}>
              {label.toUpperCase()}
            </span>
          </div>
        );
      })}
    </div>
  );
}
