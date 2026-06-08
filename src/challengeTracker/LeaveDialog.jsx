import buildLeaveDialogCopy from './buildLeaveDialogCopy';

export default function LeaveDialog({ challenge, memberData, onConfirm, onCancel, leaving }) {
  const { title, body, confirmLabel, confirmColor } = buildLeaveDialogCopy({ challenge, memberData });

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.85)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      padding: '0 0 0',
    }}>
      <div style={{
        width: '100%', maxWidth: 430,
        background: '#161616', borderRadius: '24px 24px 0 0',
        border: '1px solid rgba(255,255,255,0.08)', borderBottom: 'none',
        padding: '28px 24px 44px',
      }}>
        <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.12)', margin: '0 auto 24px' }} />

        <h3 style={{ margin: '0 0 12px', fontSize: 20, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: '#fff' }}>
          {title}
        </h3>
        <p style={{ margin: '0 0 28px', fontSize: 13, color: '#888', lineHeight: 1.6 }}>
          {body}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={onConfirm}
            disabled={leaving}
            style={{
              width: '100%', padding: '14px', borderRadius: 14, border: 'none',
              background: leaving ? 'rgba(255,255,255,0.07)' : confirmColor,
              color: '#fff', fontSize: 15, fontWeight: 800, cursor: leaving ? 'default' : 'pointer',
              fontFamily: "'Syne', sans-serif", letterSpacing: 0.3,
              opacity: leaving ? 0.7 : 1, transition: 'all .2s',
            }}
          >
            {leaving ? '…' : confirmLabel}
          </button>
          <button
            onClick={onCancel}
            disabled={leaving}
            style={{
              width: '100%', padding: '13px', borderRadius: 14,
              border: '1px solid rgba(255,255,255,0.09)', background: 'none',
              color: '#888', fontSize: 14, fontWeight: 700, cursor: 'pointer',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
