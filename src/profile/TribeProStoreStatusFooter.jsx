import { GOLD } from './profileConstants';

export default function TribeProStoreStatusFooter({
  checkoutMessage,
  entitlementRecoveryMessage,
  proSource,
}) {
  return (
    <>
      {checkoutMessage && (
        <p style={{ margin: '10px 0 0', color: checkoutMessage.includes('not configured') ? GOLD : '#34D399', fontSize: 11, fontWeight: 800 }}>
          {checkoutMessage}
        </p>
      )}
      {entitlementRecoveryMessage && (
        <p style={{ margin: '10px 0 0', color: entitlementRecoveryMessage.includes('sent') ? '#38BDF8' : '#ffb199', fontSize: 11, fontWeight: 800, lineHeight: 1.4 }}>
          {entitlementRecoveryMessage}
        </p>
      )}
      <p style={{ margin: '10px 0 0', color: '#777', fontSize: 10, lineHeight: 1.4 }}>
        Use this only if restore/sync does not match your App Store or Play purchase history. It opens an entitlementRecoveryRequests case for support review.
      </p>
      <p style={{ margin: '10px 0 0', color: '#666', fontSize: 9, fontFamily: 'monospace' }}>
        SOURCE: {String(proSource).toUpperCase()}
      </p>
    </>
  );
}
