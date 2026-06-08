export default function CommunityHighlightCopyKitCard({
  accent,
  body,
  buttonLabel,
  copyText,
  copyToast,
  count,
  copyTextAction,
  subtitle,
  title,
}) {
  return (
    <div style={{
      marginTop: 12, padding: 12, borderRadius: 12,
      background: `${accent}0E`, border: `1px solid ${accent}29`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start' }}>
        <div>
          <p style={{ margin: 0, color: '#fff', fontSize: 11, fontWeight: 900, fontFamily: 'monospace' }}>{title}</p>
          <p style={{ margin: '5px 0 0', color: accent, fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
            {subtitle}
          </p>
        </div>
        <span style={{ color: accent, fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
          {count}
        </span>
      </div>
      <p style={{ margin: '10px 0 0', color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
        {body}
      </p>
      <button
        type="button"
        onClick={() => copyTextAction(copyText, copyToast)}
        style={{
          marginTop: 10, width: '100%', border: `1px solid ${accent}38`,
          borderRadius: 12, padding: '10px 10px', background: `${accent}14`,
          color: accent, fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
        }}
      >
        {buttonLabel}
      </button>
    </div>
  );
}
