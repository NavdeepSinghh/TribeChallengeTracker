const ACCENT = '#FF6B35';
const GOLD = '#FFD700';

export default function OnboardingFloatingNextButton({ canContinue, onContinue }) {
  return (
    <button
      aria-label="Go to next onboarding card"
      disabled={!canContinue}
      onClick={onContinue}
      style={{
        position: 'fixed',
        right: 'max(18px, calc((100vw - 430px) / 2 + 18px))',
        bottom: 96,
        zIndex: 20,
        width: 58,
        height: 58,
        borderRadius: 999,
        border: '1px solid rgba(255,255,255,0.78)',
        background: canContinue
          ? `linear-gradient(135deg, ${ACCENT}, ${GOLD})`
          : '#dedad1',
        color: '#090909',
        cursor: canContinue ? 'pointer' : 'default',
        boxShadow: canContinue
          ? '0 18px 34px rgba(255,107,53,0.32)'
          : '0 10px 22px rgba(0,0,0,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: canContinue ? 1 : 0.62,
        transition: 'transform .2s ease, opacity .2s ease, box-shadow .2s ease',
        WebkitTapHighlightColor: 'transparent',
      }}
      type="button"
    >
      <span
        aria-hidden="true"
        style={{
          width: 14,
          height: 14,
          borderRight: '3px solid currentColor',
          borderBottom: '3px solid currentColor',
          transform: 'rotate(-45deg)',
          marginLeft: -3,
        }}
      />
    </button>
  );
}
