export default function OnboardingCompletionHero({ name }) {
  const welcomeName = name?.trim();
  const headline = welcomeName ? `Welcome, ${welcomeName}!` : 'Welcome!';
  const compactHeadline = headline.length > 24;

  return (
    <>
      <div style={{
        width: '100%',
        height: 230,
        borderRadius: 28,
        marginBottom: 28,
        background: 'linear-gradient(145deg, #fff 0%, #fff3ec 100%)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 18px 40px rgba(17,17,17,0.08)',
      }}>
        <div style={{
          position: 'absolute',
          width: 390,
          height: 92,
          background: '#ff4d00',
          borderRadius: 999,
          transform: 'rotate(-18deg)',
          left: -78,
          top: 62,
        }} />
        <div style={{
          position: 'absolute',
          width: 330,
          height: 78,
          background: '#ffd23c',
          borderRadius: 999,
          transform: 'rotate(-18deg)',
          left: 124,
          top: 132,
          opacity: 0.96,
        }} />
        <div style={{
          position: 'absolute',
          inset: 22,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: 54, alignSelf: 'flex-end' }}>🔥</span>
          <div>
            <div style={{ fontSize: 42, fontWeight: 900, lineHeight: 1 }}>Ready</div>
            <div style={{ color: '#55514a', fontSize: 16, fontWeight: 700, marginTop: 6 }}>
              Your first challenge starts with one log.
            </div>
          </div>
        </div>
      </div>
      <h2 style={{
        margin: '0 0 10px',
        fontSize: compactHeadline ? 30 : 34,
        fontWeight: 900,
        fontFamily: "'Syne', sans-serif",
        textAlign: 'center',
        color: '#050505',
        lineHeight: 1.08,
        overflowWrap: 'anywhere',
      }}>
        {headline}
      </h2>
      <p style={{ color: '#55514a', fontSize: 18, lineHeight: 1.38, textAlign: 'center', margin: '0 0 28px' }}>
        You are ready to log activities, join challenges, build streaks, and move with the tribe.
      </p>
    </>
  );
}
