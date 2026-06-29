export default function OnboardingQuestionHeader({ question }) {
  return (
    <>
      {question.icon && (
        <div style={{
          width: 46,
          height: 46,
          borderRadius: 18,
          background: '#f0eee9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24,
          marginBottom: 24,
        }}>
          {question.icon}
        </div>
      )}

      <h2 style={{
        margin: '0 0 14px',
        fontSize: 36,
        fontWeight: 900,
        fontFamily: "'Syne', sans-serif",
        color: '#050505',
        lineHeight: 1.08,
        letterSpacing: 0,
      }}>
        {question.question}
      </h2>
      <p style={{
        color: '#55514a',
        fontSize: 18,
        lineHeight: 1.38,
        margin: '0 0 30px',
        fontWeight: 500,
      }}>
        {question.subtitle}
      </p>
    </>
  );
}
