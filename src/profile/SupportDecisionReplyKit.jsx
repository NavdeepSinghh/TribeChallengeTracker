export default function SupportDecisionReplyKit({
  copyText,
  supportDecisionReplyCopy,
}) {
  return (
    <div style={{
      background: 'rgba(96,165,250,0.08)',
      border: '1px solid rgba(96,165,250,0.18)',
      borderRadius: 14,
      padding: 12,
      margin: '-6px 0 20px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center' }}>
        <div>
          <p style={{ margin: 0, color: '#93C5FD', fontSize: 11, fontWeight: 900, fontFamily: 'monospace' }}>SUPPORT DECISION REPLY KIT</p>
          <p style={{ margin: '4px 0 0', color: '#aaa', fontSize: 10, fontWeight: 800 }}>Manual support-reviewed status replies</p>
        </div>
        <button
          type="button"
          onClick={() => copyText(supportDecisionReplyCopy, 'Support decision replies copied')}
          style={{
            border: 0,
            borderRadius: 10,
            padding: '8px 10px',
            background: '#60A5FA',
            color: '#111',
            fontSize: 9,
            fontWeight: 900,
            fontFamily: 'monospace',
          }}
        >
          COPY SUPPORT DECISION REPLIES
        </button>
      </div>
    </div>
  );
}
