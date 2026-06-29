export default function OnboardingBackButton({ onBack, style }) {
  return (
    <button
      aria-label="Go back to previous onboarding card"
      onClick={onBack}
      style={{
        width: 46,
        height: 46,
        borderRadius: 999,
        border: '1px solid #efece5',
        background: '#f0eee9',
        color: '#050505',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        WebkitTapHighlightColor: 'transparent',
        ...style,
      }}
      type="button"
    >
      <span
        aria-hidden="true"
        style={{
          width: 12,
          height: 12,
          borderLeft: '3px solid currentColor',
          borderBottom: '3px solid currentColor',
          transform: 'rotate(45deg)',
          marginLeft: 4,
        }}
      />
    </button>
  );
}
