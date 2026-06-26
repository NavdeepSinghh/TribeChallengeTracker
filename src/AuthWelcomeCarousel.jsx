import { useMemo, useState } from 'react';

const slides = [
  {
    accent: '#FF6B35',
    glow: '#FFD700',
    title: 'Log workouts. Build consistency with your people.',
    mockup: 'log',
  },
  {
    accent: '#34D399',
    glow: '#60A5FA',
    title: 'Repeat your plans, tweak the sets, and track real progress.',
    mockup: 'training',
  },
  {
    accent: '#FFD700',
    glow: '#FF6B35',
    title: 'Stay accountable through challenges, streaks, and tribe activity.',
    mockup: 'tribe',
  },
  {
    accent: '#60A5FA',
    glow: '#A78BFA',
    title: 'Turn your effort into badges, share cards, and proof.',
    mockup: 'proof',
  },
];

function CarouselDots({ active, onSelect }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 18 }}>
      {slides.map((slide, index) => (
        <button
          aria-label={`Show slide ${index + 1}`}
          key={slide.title}
          onClick={() => onSelect(index)}
          style={{
            width: active === index ? 22 : 8,
            height: 8,
            borderRadius: 999,
            border: 0,
            background: active === index ? slide.accent : 'rgba(24,24,24,0.34)',
            cursor: 'pointer',
            transition: 'width .22s ease, background .22s ease',
          }}
        />
      ))}
    </div>
  );
}

function AppMockup({ type, accent, glow }) {
  const rows = {
    log: [
      ['🏃', 'Run', '+30 pts'],
      ['💪', 'Gym', '+40 pts'],
      ['🧘', 'Yoga', '+20 pts'],
    ],
    training: [
      ['Pull Day', '6 moves', 'Ready'],
      ['Lat Pulldown', '4 x 8-10', '55 kg'],
      ['Rows', '4 x 8-12', '42 kg'],
    ],
    tribe: [
      ['🔥', 'Suvi logged Walk', '4m'],
      ['⚡', 'Navdeep joined 30-Day Tribe', '18m'],
      ['💪', 'Amrit logged Gym', '1h'],
    ],
    proof: [
      ['⭐', 'Elite', '610 XP'],
      ['🔥', '4 day streak', 'Live'],
      ['🏆', 'Challenge finished', 'Share'],
    ],
  };

  const title = {
    log: 'Today',
    training: 'Training',
    tribe: 'Tribe Activity',
    proof: 'Progress',
  }[type];

  return (
    <div style={{
      width: 'min(76vw, 310px)',
      aspectRatio: '0.62',
      borderRadius: 34,
      background: '#fff',
      border: '10px solid rgba(255,255,255,0.86)',
      boxShadow: `0 26px 80px ${accent}33, 0 10px 30px rgba(0,0,0,0.24)`,
      overflow: 'hidden',
    }}>
      <div style={{
        height: '100%',
        background: 'linear-gradient(180deg, #fff 0%, #f7f2eb 100%)',
        color: '#121212',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 18px 14px',
          borderBottom: '1px solid #ebe3d8',
        }}>
          <span style={{ fontSize: 22, fontWeight: 900 }}>+</span>
          <span style={{ fontWeight: 900 }}>{title}</span>
          <span style={{ fontSize: 20 }}>⚙</span>
        </div>

        <div style={{
          margin: 16,
          borderRadius: 22,
          minHeight: 148,
          background: `radial-gradient(circle at 20% 10%, ${glow}55, transparent 34%), linear-gradient(135deg, ${accent}22, ${glow}18)`,
          border: `1px solid ${accent}30`,
          padding: 16,
        }}>
          {type === 'training' ? (
            <>
              <p style={{ margin: 0, fontSize: 12, color: '#6a625a', fontWeight: 900, textTransform: 'uppercase' }}>Template</p>
              <h3 style={{ margin: '6px 0 12px', fontSize: 26, fontWeight: 900, letterSpacing: 0 }}>Pull Day</h3>
              <div style={{ height: 8, borderRadius: 999, background: '#e8ded2', overflow: 'hidden' }}>
                <div style={{ width: '64%', height: '100%', borderRadius: 999, background: accent }} />
              </div>
            </>
          ) : type === 'proof' ? (
            <>
              <p style={{ margin: 0, fontSize: 12, color: '#6a625a', fontWeight: 900, textTransform: 'uppercase' }}>Status</p>
              <h3 style={{ margin: '8px 0 4px', fontSize: 34, fontWeight: 900, letterSpacing: 0 }}>Elite</h3>
              <p style={{ margin: 0, color: '#6a625a', fontSize: 13, fontWeight: 800 }}>90 pts to Legend</p>
            </>
          ) : (
            <>
              <p style={{ margin: 0, fontSize: 12, color: '#6a625a', fontWeight: 900, textTransform: 'uppercase' }}>
                {type === 'log' ? 'Earns' : 'Live now'}
              </p>
              <h3 style={{ margin: '8px 0 0', fontSize: 34, fontWeight: 900, letterSpacing: 0 }}>
                {type === 'log' ? '+40 pts' : '5 logs'}
              </h3>
              <p style={{ margin: '6px 0 0', color: '#6a625a', fontSize: 13, fontWeight: 800 }}>
                {type === 'log' ? 'Your streak stays alive.' : 'from the tribe today'}
              </p>
            </>
          )}
        </div>

        <div style={{ display: 'grid', gap: 10, padding: '0 16px 18px' }}>
          {rows[type].map((row, index) => (
            <div key={`${row[0]}-${index}`} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '11px 12px',
              borderRadius: 16,
              background: '#fff',
              border: '1px solid #eee5dc',
              boxShadow: '0 8px 20px rgba(35,22,11,0.05)',
            }}>
              <span style={{ fontSize: type === 'training' ? 13 : 20, minWidth: 26, fontWeight: 900 }}>{row[0]}</span>
              <span style={{ flex: 1, fontSize: 13, fontWeight: 900, color: '#1f1f1f' }}>{row[1]}</span>
              <span style={{ color: accent, fontSize: 12, fontWeight: 900 }}>{row[2]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BackdropPeople({ accent, glow }) {
  return (
    <>
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(circle at 20% 22%, ${glow}70, transparent 25%), radial-gradient(circle at 80% 18%, ${accent}70, transparent 24%), linear-gradient(135deg, ${accent}, ${glow})`,
        opacity: 0.9,
      }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.38))' }} />
      {[0, 1, 2, 3].map((item) => (
        <div key={item} style={{
          position: 'absolute',
          bottom: -28,
          left: `${-2 + item * 28}%`,
          width: '30%',
          height: '52%',
          borderRadius: '999px 999px 18px 18px',
          background: 'rgba(255,255,255,0.20)',
          transform: `rotate(${item % 2 === 0 ? -8 : 8}deg)`,
          filter: 'blur(0.2px)',
        }} />
      ))}
    </>
  );
}

export default function AuthWelcomeCarousel({ onJoin, onLogin }) {
  const [active, setActive] = useState(0);
  const slide = slides[active];
  const nextSlide = useMemo(() => () => setActive((active + 1) % slides.length), [active]);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fff',
      color: '#121212',
      fontFamily: "'Space Grotesk', sans-serif",
      display: 'flex',
      flexDirection: 'column',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Space+Grotesk:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <div style={{
        position: 'relative',
        minHeight: 'min(64vh, 640px)',
        display: 'grid',
        placeItems: 'center',
        overflow: 'hidden',
      }}>
        <BackdropPeople accent={slide.accent} glow={slide.glow} />
        <button
          onClick={nextSlide}
          aria-label="Show next preview"
          style={{
            position: 'absolute',
            inset: 0,
            border: 0,
            background: 'transparent',
            cursor: 'pointer',
          }}
        />
        <div style={{ position: 'relative', zIndex: 1, display: 'grid', justifyItems: 'center', paddingTop: 34 }}>
          <h1 style={{
            margin: '0 0 28px',
            color: '#fff',
            fontFamily: "'Syne', sans-serif",
            fontSize: 'clamp(44px, 11vw, 82px)',
            lineHeight: 0.9,
            fontWeight: 900,
            textShadow: '0 10px 40px rgba(0,0,0,0.25)',
          }}>
            TRIBELOG
          </h1>
          <AppMockup type={slide.mockup} accent={slide.accent} glow={slide.glow} />
        </div>
      </div>

      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 22,
        padding: '34px max(env(safe-area-inset-right), 22px) max(env(safe-area-inset-bottom), 32px) max(env(safe-area-inset-left), 22px)',
      }}>
        <div style={{ width: '100%', maxWidth: 760, textAlign: 'center' }}>
          <p style={{
            minHeight: 76,
            margin: 0,
            color: '#121212',
            fontSize: 'clamp(30px, 6vw, 48px)',
            lineHeight: 1.12,
            fontWeight: 500,
          }}>
            {slide.title}
          </p>
          <CarouselDots active={active} onSelect={setActive} />
        </div>

        <div style={{ width: '100%', maxWidth: 760, display: 'grid', gap: 18 }}>
          <button
            onClick={onJoin}
            style={{
              width: '100%',
              border: 0,
              borderRadius: 999,
              padding: '19px 22px',
              background: '#FF4B00',
              color: '#fff',
              fontSize: 20,
              fontWeight: 900,
              fontFamily: "'Space Grotesk', sans-serif",
              cursor: 'pointer',
              boxShadow: '0 18px 44px rgba(255,75,0,0.28)',
            }}
          >
            Join for free
          </button>
          <button
            onClick={onLogin}
            style={{
              border: 0,
              background: 'transparent',
              color: '#FF4B00',
              fontSize: 20,
              fontWeight: 900,
              fontFamily: "'Space Grotesk', sans-serif",
              cursor: 'pointer',
              padding: '8px 0 0',
            }}
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );
}
