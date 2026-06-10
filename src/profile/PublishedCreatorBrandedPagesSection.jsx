export default function PublishedCreatorBrandedPagesSection({
  publishedCreatorBrandedPages = [],
}) {
  return (
    <div style={{ padding: 16, borderRadius: 12, background: 'rgba(96,165,250,0.06)', border: '1px solid rgba(96,165,250,0.16)', marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ color: '#60A5FA', fontSize: 10, fontFamily: 'monospace', fontWeight: 900 }}>PUBLISHED CREATOR BRANDED PAGES</div>
        <span style={{ color: '#60A5FA', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{publishedCreatorBrandedPages.length} LIVE</span>
      </div>
      <p style={{ margin: '8px 0 12px', color: '#aaa', fontSize: 12, lineHeight: 1.45 }}>
        Reviewed Coach Host profile blocks from creatorBrandedPages. They stay app-first and do not add tracking, payments, purchases, entitlements, revenue-share, private exports, or paid-hosting claims.
      </p>
      {publishedCreatorBrandedPages.length === 0 ? (
        <p style={{ margin: 0, color: '#777', fontSize: 11, fontWeight: 800 }}>No published creator branded pages yet.</p>
      ) : (
        <div style={{ display: 'grid', gap: 8 }}>
          {publishedCreatorBrandedPages.slice(0, 5).map(page => (
            <div key={page.id} style={{ borderRadius: 10, padding: 10, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ color: '#fff', fontSize: 12, fontWeight: 900 }}>{page.displayName || page.creatorSpecialty || page.uid}</div>
              <div style={{ color: '#aaa', fontSize: 11, lineHeight: 1.35, marginTop: 4 }}>
                {page.creatorSpecialty || 'Creator page'} · {page.featuredChallengeName || 'Hosted challenge'} · {page.featuredChallengeMemberCount || 0} members
              </div>
              <div style={{ color: '#777', fontSize: 10, lineHeight: 1.35, marginTop: 4 }}>
                Reach: {page.memberReach || 0} · CTA: {page.creatorCtaUrl || 'app invite'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
