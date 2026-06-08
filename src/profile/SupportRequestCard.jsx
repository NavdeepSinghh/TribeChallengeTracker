export default function SupportRequestCard({
  isSubmittingSupport,
  onSupportRequest,
  setSupportCategory,
  setSupportMessage,
  supportCategory,
  supportMessage,
  supportStatusMessage,
}) {
  return (
    <>
      <p style={{ color: '#555', fontSize: 10, fontWeight: 700, letterSpacing: 2, fontFamily: 'monospace', margin: '0 0 12px' }}>SUPPORT REQUEST</p>
      <div style={{
        background: 'rgba(96,165,250,0.04)', border: '1px solid rgba(96,165,250,0.12)',
        borderRadius: 16, padding: 14, marginBottom: 20,
      }}>
        <p style={{ margin: '0 0 10px', color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
          Send an account, billing, bug, safety, or general supportRequests note. This does not process refunds, cancel subscriptions, or change entitlements.
        </p>
        <select
          value={supportCategory}
          onChange={e => setSupportCategory(e.target.value)}
          style={{ width: '100%', marginBottom: 8, borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)', background: '#111', color: '#fff', padding: '10px 12px', fontSize: 12, fontWeight: 800 }}
        >
          <option value="general">General</option>
          <option value="account">Account</option>
          <option value="billing">Billing</option>
          <option value="bug">Bug</option>
          <option value="safety">Safety</option>
        </select>
        <textarea
          value={supportMessage}
          onChange={e => setSupportMessage(e.target.value)}
          placeholder="What do you need help with?"
          rows={4}
          maxLength={1200}
          style={{ width: '100%', boxSizing: 'border-box', marginBottom: 10, borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)', background: '#111', color: '#fff', padding: 12, fontSize: 12, lineHeight: 1.4, resize: 'vertical' }}
        />
        <button
          type="button"
          onClick={onSupportRequest}
          disabled={isSubmittingSupport}
          style={{ width: '100%', border: 0, borderRadius: 12, padding: '12px 10px', background: '#60A5FA', color: '#111', fontSize: 10, fontWeight: 900, fontFamily: 'monospace', letterSpacing: 1 }}
        >
          {isSubmittingSupport ? 'SENDING SUPPORT REQUEST...' : 'SEND SUPPORT REQUEST'}
        </button>
        {supportStatusMessage && (
          <div style={{ marginTop: 10, color: supportStatusMessage.includes('sent') ? '#34D399' : '#ffb199', fontSize: 11, fontWeight: 800 }}>
            {supportStatusMessage}
          </div>
        )}
      </div>
    </>
  );
}
