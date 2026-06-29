const CONFETTI_COLORS = ['#FF6B35', '#FFD23C', '#34D399', '#60A5FA', '#F472B6', '#111111'];

export default function OnboardingCompletionConfetti({ active }) {
  if (!active) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 4,
      }}
    >
      <style>
        {`
          @keyframes onboarding-confetti-fall {
            0% {
              opacity: 0;
              transform: translate3d(0, -18px, 0) rotate(0deg) scale(0.85);
            }
            12% {
              opacity: 1;
            }
            100% {
              opacity: 0;
              transform: translate3d(var(--x-drift), 640px, 0) rotate(var(--spin)) scale(1);
            }
          }
        `}
      </style>
      {Array.from({ length: 34 }).map((_, index) => {
        const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length];
        const left = 4 + ((index * 17) % 92);
        const drift = (index % 2 === 0 ? 1 : -1) * (18 + (index % 7) * 7);
        const width = 7 + (index % 4) * 2;
        const height = index % 3 === 0 ? 14 : 8;

        return (
          <span
            key={index}
            style={{
              '--x-drift': `${drift}px`,
              '--spin': `${220 + (index % 8) * 55}deg`,
              position: 'absolute',
              top: -24,
              left: `${left}%`,
              width,
              height,
              borderRadius: index % 3 === 0 ? 999 : 2,
              background: color,
              opacity: 0,
              animation: `onboarding-confetti-fall ${1.9 + (index % 6) * 0.18}s ease-out ${(index % 10) * 0.045}s both`,
              boxShadow: '0 5px 12px rgba(17,17,17,0.08)',
            }}
          />
        );
      })}
    </div>
  );
}
