import AuthModeToggle from './AuthModeToggle';
import GoogleAuthButton from './GoogleAuthButton';
import { authInputStyle } from './authScreenStyles';

export default function AuthFormCard({
  email,
  error,
  info,
  loading,
  mode,
  name,
  onEmail,
  onForgotPassword,
  onGoogle,
  onSwitchMode,
  password,
  setEmail,
  setName,
  setPassword,
}) {
  return (
    <div style={{
      width: '100%',
      background: 'rgba(255,255,255,0.045)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 18,
      padding: 22,
      boxShadow: '0 24px 80px rgba(0,0,0,0.36)',
    }}>
      <div style={{ marginBottom: 18 }}>
        <p style={{ margin: '0 0 6px', color: '#fff', fontSize: 20, fontWeight: 900, fontFamily: "'Syne', sans-serif" }}>
          {mode === 'signin' ? 'Welcome back' : 'Start your first challenge'}
        </p>
        <p style={{ margin: 0, color: '#777', fontSize: 13, lineHeight: 1.45 }}>
          {mode === 'signin'
            ? 'Sign in to log today, check your streak, and open invites.'
            : 'Create your account, join the invite, and log your first activity.'}
        </p>
      </div>
      <AuthModeToggle mode={mode} onSwitchMode={onSwitchMode} />
      <GoogleAuthButton loading={loading} onGoogle={onGoogle} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
        <span style={{ color: '#444', fontSize: 10, fontFamily: 'monospace', fontWeight: 700 }}>OR</span>
        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
      </div>

      {mode === 'signup' && (
        <input
          value={name} onChange={e => setName(e.target.value)}
          placeholder="Name" style={authInputStyle}
        />
      )}
      <input
        value={email} onChange={e => setEmail(e.target.value)}
        placeholder="Email" type="email" style={authInputStyle}
      />
      <input
        value={password} onChange={e => setPassword(e.target.value)}
        placeholder="Password" type="password" style={authInputStyle}
      />

      {mode === 'signin' && (
        <button onClick={onForgotPassword} style={{
          background: 'none', border: 'none', color: '#555', fontSize: 11,
          fontFamily: 'monospace', cursor: 'pointer', padding: '0 0 14px',
          fontWeight: 700, letterSpacing: 0.3,
        }}>
          Forgot password?
        </button>
      )}

      {error && (
        <p style={{ color: '#FF6B35', fontSize: 12, margin: '0 0 14px', fontFamily: 'monospace', lineHeight: 1.5 }}>
          {error}
        </p>
      )}
      {info && (
        <p style={{ color: '#34D399', fontSize: 12, margin: '0 0 14px', fontFamily: 'monospace', lineHeight: 1.5 }}>
          {info}
        </p>
      )}

      <button onClick={onEmail} disabled={loading} style={{
        width: '100%', padding: '14px', borderRadius: 14, border: 'none',
        background: 'linear-gradient(135deg, #FF6B35 0%, #FFD700 100%)',
        color: '#000', fontSize: 15, fontWeight: 800, cursor: 'pointer',
        fontFamily: "'Syne', sans-serif", letterSpacing: 0.5,
        boxShadow: '0 4px 20px rgba(255,107,53,0.35)',
        opacity: loading ? 0.7 : 1, transition: 'opacity .2s',
      }}>
        {loading ? '…' : mode === 'signin' ? 'Sign in' : 'Create account'}
      </button>
    </div>
  );
}
