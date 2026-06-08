export default function CreateChallengeBackButton({ onBack, setStep, step }) {
  return (
    <button
      onClick={step === 1 ? onBack : () => setStep(s => s - 1)}
      style={{
        background: 'none',
        border: 'none',
        color: '#555',
        cursor: 'pointer',
        fontSize: 13,
        fontFamily: 'monospace',
        fontWeight: 700,
        padding: '0 0 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}
    >
      ← {step === 1 ? 'BACK' : 'PREVIOUS'}
    </button>
  );
}
