import { GOLD, STORE_CATALOG } from './profileConstants';

export default function StoreCheckoutButtons({
  checkoutProductId,
  onCheckout,
  isPackUnlocked,
  challengePackTitle,
}) {
  return (
    <>
      {STORE_CATALOG.filter(product => product.kind === 'subscription').map(product => (
        <button
          key={product.id}
          onClick={() => onCheckout(product.id)}
          disabled={checkoutProductId === product.id}
          style={{
            width: '100%', padding: '10px 12px', borderRadius: 12,
            border: '1px solid rgba(255,215,0,0.22)',
            background: 'rgba(255,215,0,0.08)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 12, cursor: checkoutProductId === product.id ? 'wait' : 'pointer',
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 900 }}>
            {product.cadence === 'yearly' ? 'Tribe Pro Yearly' : 'Tribe Pro Monthly'}
          </span>
          <span style={{ fontSize: 10, color: GOLD, fontFamily: 'monospace', fontWeight: 900 }}>
            {checkoutProductId === product.id ? 'STARTING' : 'CHECKOUT'}
          </span>
        </button>
      ))}
      {STORE_CATALOG.filter(product => product.kind === 'challengePack').map(product => {
        const unlocked = isPackUnlocked(product);
        return (
          <button
            key={product.id}
            onClick={() => !unlocked && onCheckout(product.id)}
            disabled={unlocked || checkoutProductId === product.id}
            style={{
              width: '100%', padding: '10px 12px', borderRadius: 12,
              border: `1px solid ${unlocked ? 'rgba(52,211,153,0.32)' : 'rgba(167,139,250,0.22)'}`,
              background: unlocked ? 'rgba(52,211,153,0.08)' : 'rgba(167,139,250,0.08)',
              color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: 12, cursor: unlocked ? 'default' : checkoutProductId === product.id ? 'wait' : 'pointer',
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 900 }}>{challengePackTitle(product)}</span>
            <span style={{ fontSize: 10, color: unlocked ? '#34D399' : '#A78BFA', fontFamily: 'monospace', fontWeight: 900 }}>
              {unlocked ? 'UNLOCKED' : checkoutProductId === product.id ? 'STARTING' : 'PACK'}
            </span>
          </button>
        );
      })}
    </>
  );
}
