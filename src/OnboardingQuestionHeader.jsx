export default function OnboardingQuestionHeader({ question }) {
  return (
    <>
      <div style={{ fontSize: 50, marginBottom: 20 }}>{question.emoji}</div>

      <h2 style={{
        margin: '0 0 6px', fontSize: 26, fontWeight: 900,
        fontFamily: "'Syne', sans-serif", color: '#fff', lineHeight: 1.2,
      }}>
        {question.question}
      </h2>
      <p style={{ color: '#555', fontSize: 13, margin: '0 0 26px', fontWeight: 500 }}>
        {question.subtitle}
      </p>
    </>
  );
}
