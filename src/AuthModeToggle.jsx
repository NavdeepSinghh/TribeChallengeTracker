export default function AuthModeToggle({ mode, onSwitchMode }) {
  return (
    <div style={{
      display: 'flex', background: 'rgba(255,255,255,0.04)',
      borderRadius: 12, padding: 4, marginBottom: 18,
      border: '1px solid rgba(255,255,255,0.06)',
    }}>
      {['signin', 'signup'].map(m => (
        <button key={m} onClick={() => onSwitchMode(m)} style={{
          flex: 1, padding: '10px', borderRadius: 9, border: 'none',
          background: mode === m ? '#fff' : 'transparent',
          color: mode === m ? '#080808' : '#777',
          cursor: 'pointer', fontSize: 13, fontWeight: 700,
          fontFamily: "'Space Grotesk', sans-serif", transition: 'all .2s',
        }}>
          {m === 'signin' ? 'Sign In' : 'Sign Up'}
        </button>
      ))}
    </div>
  );
}
