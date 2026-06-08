export default function WeeklyCampaignCopyKitCard({
  title,
  subtitle,
  status,
  accent,
  body,
  buttonLabel,
  copyText,
}) {
  return (
    <div style={{
      borderRadius: 16, padding: 16, marginBottom: 20,
      background: `${accent}0D`,
      border: `1px solid ${accent}29`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>{title}</p>
          <p style={{ margin: '4px 0 0', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
            {subtitle}
          </p>
        </div>
        <span style={{ color: accent, fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
          {status}
        </span>
      </div>
      <p style={{ margin: 0, color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
        {body}
      </p>
      <button
        onClick={() => navigator.clipboard?.writeText(copyText)}
        style={{
          marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
          border: `1px solid ${accent}38`, background: `${accent}1A`,
          color: accent, fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
        }}
      >
        {buttonLabel}
      </button>
    </div>
  );
}
