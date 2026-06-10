const BRANDED_PAGE_STATUSES = [
  ['published', 'PUBLISH'],
  ['waiting', 'WAIT'],
  ['not_ready', 'NOT READY'],
  ['declined', 'DECLINE'],
];

export default function CreatorBrandedPageReviewSection({
  creatorBrandedPageReviewNotes,
  creatorBrandedPageReviewQueue = [],
  handleCreatorBrandedPageReview,
  reviewingCreatorBrandedPageId,
  setCreatorBrandedPageReviewNotes,
}) {
  return (
    <div style={{ padding: 16, borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', marginBottom: 14 }}>
      <div style={{ color: '#60A5FA', fontSize: 10, fontFamily: 'monospace', fontWeight: 900 }}>CREATOR BRANDED PAGE REVIEW QUEUE</div>
      <p style={{ margin: '8px 0 12px', color: '#aaa', fontSize: 12, lineHeight: 1.45 }}>
        Admin-only queue for creatorBrandedPages. Publish reviewed Coach Host profile blocks only; do not add tracking pixels, export private member activity, create contracts, collect payments, create purchases, write entitlements, start revenue-share, or imply paid hosting is live.
      </p>
      {creatorBrandedPageReviewQueue.length === 0 ? (
        <p style={{ margin: 0, color: '#777', fontSize: 11, fontWeight: 800 }}>No open creator branded page drafts.</p>
      ) : (
        <div style={{ display: 'grid', gap: 10 }}>
          {creatorBrandedPageReviewQueue.map(page => (
            <div key={page.id} style={{ borderRadius: 10, padding: 10, background: 'rgba(0,0,0,0.22)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                <span style={{ color: '#fff', fontSize: 12, fontWeight: 900 }}>{page.displayName || page.email || page.uid}</span>
                <span style={{ color: '#60A5FA', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{page.activeHostedChallengeCount || 0} ACTIVE</span>
              </div>
              <div style={{ color: '#aaa', fontSize: 11, lineHeight: 1.35, marginTop: 6 }}>
                {page.creatorSpecialty || 'Creator page'} · CTA: {page.creatorCtaUrl || 'app-first hosted challenge invite'}
              </div>
              <div style={{ color: '#777', fontSize: 10, lineHeight: 1.35, marginTop: 4 }}>
                Featured: {page.featuredChallengeName || 'No hosted challenge yet'} · reach: {page.memberReach || 0} · status: {page.status || 'open'}
              </div>
              <textarea
                value={creatorBrandedPageReviewNotes[page.id] || ''}
                onChange={event => setCreatorBrandedPageReviewNotes(notes => ({ ...notes, [page.id]: event.target.value }))}
                placeholder="Manual branded page review note: truthful profile, app-first CTA, no tracking or paid-hosting claims..."
                style={{ width: '100%', minHeight: 54, marginTop: 10, borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(0,0,0,0.22)', color: '#fff', padding: 8, fontSize: 11 }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 6, marginTop: 8 }}>
                {BRANDED_PAGE_STATUSES.map(([status, label]) => (
                  <button
                    key={status}
                    onClick={() => handleCreatorBrandedPageReview(page, status)}
                    disabled={reviewingCreatorBrandedPageId === page.id}
                    style={{ border: 0, borderRadius: 8, padding: '8px 6px', background: status === 'published' ? '#60A5FA' : 'rgba(255,255,255,0.08)', color: status === 'published' ? '#06111f' : '#fff', fontSize: 9, fontWeight: 900, cursor: 'pointer' }}
                  >
                    {reviewingCreatorBrandedPageId === page.id ? '...' : label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
