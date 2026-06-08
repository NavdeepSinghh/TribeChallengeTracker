export default function StoreMemberRecoveryActions({
  checkoutProductId,
  onSyncPurchases,
  onEntitlementRecoveryRequest,
  isRequestingEntitlementRecovery,
}) {
  return (
    <>
      <button
        onClick={onSyncPurchases}
        disabled={checkoutProductId === 'sync'}
        style={{
          width: '100%', padding: '10px 12px', borderRadius: 12,
          border: '1px solid rgba(52,211,153,0.24)',
          background: 'rgba(52,211,153,0.08)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 12, cursor: checkoutProductId === 'sync' ? 'wait' : 'pointer',
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 900 }}>Sync previous purchases</span>
        <span style={{ fontSize: 10, color: '#34D399', fontFamily: 'monospace', fontWeight: 900 }}>
          {checkoutProductId === 'sync' ? 'SYNCING' : 'SYNC'}
        </span>
      </button>
      <button
        onClick={onEntitlementRecoveryRequest}
        disabled={isRequestingEntitlementRecovery}
        style={{
          width: '100%', padding: '10px 12px', borderRadius: 12,
          border: '1px solid rgba(56,189,248,0.24)',
          background: 'rgba(56,189,248,0.08)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 12, cursor: isRequestingEntitlementRecovery ? 'wait' : 'pointer',
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 900 }}>Request entitlement review</span>
        <span style={{ fontSize: 10, color: '#38BDF8', fontFamily: 'monospace', fontWeight: 900 }}>
          {isRequestingEntitlementRecovery ? 'SENDING' : 'REVIEW'}
        </span>
      </button>
    </>
  );
}
