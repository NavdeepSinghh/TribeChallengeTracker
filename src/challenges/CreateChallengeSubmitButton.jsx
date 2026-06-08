import { ACCENT, GOLD } from './challengeTheme';

export default function CreateChallengeSubmitButton({
  customName,
  handleCreate,
  loading,
  template,
}) {
  const canSubmit = customName.trim();

  return (
    <button onClick={handleCreate} disabled={loading || !canSubmit} style={{
      width: '100%', padding: '15px', borderRadius: 14, border: 'none',
      background: canSubmit ? `linear-gradient(135deg, ${ACCENT}, ${GOLD})` : 'rgba(255,255,255,0.06)',
      color: canSubmit ? '#000' : '#444', fontSize: 15, fontWeight: 800,
      cursor: canSubmit ? 'pointer' : 'default',
      fontFamily: "'Syne', sans-serif", letterSpacing: 0.5,
      boxShadow: canSubmit ? `0 4px 20px rgba(255,107,53,0.35)` : 'none',
      opacity: loading ? 0.7 : 1,
    }}>
      {loading ? '…' : `Create ${template.emoji} Challenge`}
    </button>
  );
}
