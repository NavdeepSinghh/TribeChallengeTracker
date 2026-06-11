export default function PublishedCreatorChallengeTemplateCatalogSection({
  publishedCreatorChallengeTemplates = [],
}) {
  return (
    <div style={{ borderRadius: 14, padding: 14, marginBottom: 12, background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.16)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <p style={{ margin: 0, color: '#34D399', fontSize: 12, fontWeight: 900 }}>PUBLISHED CREATOR TEMPLATE CATALOG</p>
        <span style={{ color: '#34D399', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>{publishedCreatorChallengeTemplates.length} LIVE</span>
      </div>
      <p style={{ margin: '7px 0 0', color: '#aaa', fontSize: 10, lineHeight: 1.4 }}>
        Public reusable creator challenge templates approved from creatorChallengeTemplateDrafts. These records stay free-first and do not create contracts, payouts, purchases, entitlements, revenue-share, tracking, or paid-hosting claims.
      </p>
      {publishedCreatorChallengeTemplates.length === 0 ? (
        <p style={{ margin: '10px 0 0', color: '#777', fontSize: 11, fontWeight: 800 }}>No published creator templates yet.</p>
      ) : (
        <div style={{ display: 'grid', gap: 8, marginTop: 10 }}>
          {publishedCreatorChallengeTemplates.slice(0, 5).map(template => (
            <div key={template.id} style={{ borderRadius: 12, padding: 10, background: 'rgba(0,0,0,0.22)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <span style={{ color: '#fff', fontSize: 12, fontWeight: 900 }}>{template.name || template.id}</span>
                <span style={{ color: '#34D399', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{template.duration || 7}D</span>
              </div>
              <p style={{ margin: '5px 0 0', color: '#aaa', fontSize: 10, lineHeight: 1.35 }}>
                {template.creatorName || template.creatorSpecialty || 'Creator template'} · {template.tagline || 'Reusable creator-led accountability challenge'}
              </p>
              <p style={{ margin: '6px 0 0', color: '#777', fontSize: 9, lineHeight: 1.35 }}>
                Source draft: {template.draftId || 'reviewed'} · status: {template.status || 'published'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
