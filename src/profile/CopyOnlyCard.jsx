export default function CopyOnlyCard({ accent, title, status, body, buttonLabel, copyText }) {
  return (
    <div style={{
      marginTop: 10, borderRadius: 12, padding: 11,
      background: 'rgba(14,165,233,0.075)', border: `1px solid ${accent}2e`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center' }}>
        <p style={{ margin: 0, color: accent, fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>{title}</p>
        <p style={{ margin: 0, color: status.color, fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
          {status.label}
        </p>
      </div>
      <p style={{ margin: '8px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
        {body}
      </p>
      <button
        onClick={() => navigator.clipboard?.writeText(copyText)}
        style={{
          marginTop: 9, width: '100%', borderRadius: 12, padding: '9px 10px',
          border: `1px solid ${accent}38`, background: `${accent}1a`,
          color: accent, fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
        }}
      >
        {buttonLabel}
      </button>
    </div>
  );
}
