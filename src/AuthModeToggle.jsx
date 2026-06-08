export default function AuthModeToggle({ mode, onSwitchMode }) {
  return (
    <div style={{
      display: 'flex', background: 'rgba(255,255,255,0.04)',
      borderRadius: 14, padding: 4, marginBottom: 26,
    }}>
      {['signin', 'signup'].map(m => (
        <button key={m} onClick={() => onSwitchMode(m)} style={{
          flex: 1, padding: '10px', borderRadius: 10, border: 'none',
          background: mode === m ? 'rgba(255,255,255,0.1)' : 'transparent',
          color: mode === m ? '#fff' : '#555',
          cursor: 'pointer', fontSize: 13, fontWeight: 700,
          fontFamily: "'Space Grotesk', sans-serif", transition: 'all .2s',
        }}>
          {m === 'signin' ? 'Sign In' : 'Sign Up'}
        </button>
      ))}
    </div>
  );
}
