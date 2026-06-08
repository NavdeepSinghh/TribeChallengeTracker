import { todayStr } from './challengeTheme';

const inputStyle = {
  width: '100%',
  padding: '13px 16px',
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.1)',
  background: 'rgba(255,255,255,0.05)',
  color: '#fff',
  fontSize: 14,
  fontFamily: "'Space Grotesk', sans-serif",
  boxSizing: 'border-box',
  outline: 'none',
};

function FieldLabel({ children }) {
  return (
    <label style={{ color: '#555', fontSize: 10, fontFamily: 'monospace', fontWeight: 700, letterSpacing: 1, display: 'block', marginBottom: 6 }}>
      {children}
    </label>
  );
}

export default function CreateChallengeFormFields({
  customName,
  setCustomName,
  setStartDate,
  startDate,
}) {
  return (
    <>
      <div style={{ marginBottom: 14 }}>
        <FieldLabel>CHALLENGE NAME</FieldLabel>
        <input value={customName} onChange={e => setCustomName(e.target.value)} style={inputStyle} />
      </div>

      <div style={{ marginBottom: 14 }}>
        <FieldLabel>START DATE</FieldLabel>
        <input
          type="date"
          value={startDate}
          min={todayStr()}
          onChange={e => setStartDate(e.target.value)}
          style={{ ...inputStyle, colorScheme: 'dark' }}
        />
      </div>
    </>
  );
}
