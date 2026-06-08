export default function ProValueCopyKitCard({
  title,
  subtitle,
  status,
  body,
  buttonLabel,
  accent,
  softText,
  subtitleColor,
  onCopy,
}) {
  return (
    <div style={{
      marginTop: 10, borderRadius: 10, padding: 10,
      background: `${accent}14`, border: `1px solid ${accent}2E`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center' }}>
        <div>
          <p style={{ margin: 0, color: accent, fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>{title}</p>
          <p style={{ margin: '4px 0 0', color: subtitleColor, fontSize: 9, fontFamily: 'monospace' }}>{subtitle}</p>
        </div>
        <span style={{ color: accent, fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{status}</span>
      </div>
      <p style={{ margin: '9px 0 0', color: softText, fontSize: 10, lineHeight: 1.45 }}>
        {body}
      </p>
      <button
        type="button"
        onClick={onCopy}
        style={{
          width: '100%', marginTop: 10, padding: '10px',
          borderRadius: 12, border: `1px solid ${accent}38`,
          background: `${accent}1A`, color: accent,
          fontWeight: 900, fontSize: 10, fontFamily: 'monospace',
        }}
      >
        {buttonLabel}
      </button>
    </div>
  );
}
