export default function CreatorProfileFields({
  creatorBio,
  creatorCtaUrl,
  creatorSpecialty,
  proActive,
  setCreatorBio,
  setCreatorCtaUrl,
  setCreatorSpecialty,
}) {
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <input
        value={creatorSpecialty}
        disabled={!proActive}
        placeholder="Specialty, e.g. Strength coach"
        onChange={e => setCreatorSpecialty(e.target.value.slice(0, 60))}
        style={{
          width: '100%', boxSizing: 'border-box', borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.24)',
          color: proActive ? '#fff' : '#777', padding: '11px 12px', fontWeight: 800,
        }}
      />
      <textarea
        value={creatorBio}
        disabled={!proActive}
        placeholder="Short coaching bio or challenge promise"
        onChange={e => setCreatorBio(e.target.value.slice(0, 240))}
        rows={3}
        style={{
          width: '100%', boxSizing: 'border-box', borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.24)',
          color: proActive ? '#fff' : '#777', padding: '11px 12px', fontWeight: 700,
          resize: 'vertical',
        }}
      />
      <input
        value={creatorCtaUrl}
        disabled={!proActive}
        placeholder="CTA URL for future branded pages"
        onChange={e => setCreatorCtaUrl(e.target.value.slice(0, 160))}
        style={{
          width: '100%', boxSizing: 'border-box', borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.24)',
          color: proActive ? '#fff' : '#777', padding: '11px 12px', fontWeight: 800,
        }}
      />
    </div>
  );
}
