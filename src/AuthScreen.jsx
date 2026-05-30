import { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';

const input = {
  width: '100%', padding: '13px 16px', borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.1)',
  background: 'rgba(255,255,255,0.05)', color: '#fff',
  fontSize: 14, fontFamily: "'Space Grotesk', sans-serif",
  boxSizing: 'border-box', outline: 'none', marginBottom: 12, display: 'block',
};

const socialBtn = {
  width: '100%', padding: '13px', borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.1)',
  background: 'rgba(255,255,255,0.05)', color: '#fff',
  fontSize: 14, fontWeight: 600, cursor: 'pointer',
  fontFamily: "'Space Grotesk', sans-serif",
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
  transition: 'all .2s',
};

function cleanFirebaseError(msg) {
  return msg.replace('Firebase: ', '').replace(/\s*\(auth\/[^)]*\)\.?/, '').trim();
}

export default function AuthScreen() {
  const [mode, setMode] = useState('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  const switchMode = (m) => { setMode(m); setError(''); setInfo(''); };

  const handleEmail = async () => {
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setError(''); setInfo(''); setLoading(true);
    try {
      if (mode === 'signup') {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        if (name.trim()) await updateProfile(cred.user, { displayName: name.trim() });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (e) {
      setError(cleanFirebaseError(e.message));
    }
    setLoading(false);
  };

  const handleSocial = async (provider) => {
    setError(''); setInfo(''); setLoading(true);
    try {
      await signInWithPopup(auth, provider);
    } catch (e) {
      if (e.code !== 'auth/popup-closed-by-user') {
        setError(cleanFirebaseError(e.message));
      }
    }
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!email) { setError('Enter your email above first.'); return; }
    setError(''); setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setInfo('Password reset email sent — check your inbox.');
    } catch (e) {
      setError(cleanFirebaseError(e.message));
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#080808',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: 'max(env(safe-area-inset-top), 40px) max(env(safe-area-inset-right), 20px) max(env(safe-area-inset-bottom), 40px) max(env(safe-area-inset-left), 20px)',
      fontFamily: "'Space Grotesk', sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Brand */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ fontSize: 42, marginBottom: 10, lineHeight: 1 }}>⚡</div>
        <h1 style={{
          margin: '0 0 6px', fontSize: 'clamp(18px, 7vw, 30px)', fontWeight: 900,
          fontFamily: "'Syne', sans-serif", lineHeight: 1.15,
          background: 'linear-gradient(90deg, #FF6B35, #FFD700)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          RISE WITH<br />THE TRIBE
        </h1>
        <p style={{ margin: 0, color: '#555', fontSize: 11, fontWeight: 700, letterSpacing: 2, fontFamily: 'monospace' }}>
          BUILD HABITS · TOGETHER
        </p>
      </div>

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: 400,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 24, padding: 28,
      }}>

        {/* Sign In / Sign Up toggle */}
        <div style={{
          display: 'flex', background: 'rgba(255,255,255,0.04)',
          borderRadius: 14, padding: 4, marginBottom: 26,
        }}>
          {['signin', 'signup'].map(m => (
            <button key={m} onClick={() => switchMode(m)} style={{
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

        {/* Social buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
          <button onClick={() => handleSocial(googleProvider)} disabled={loading} style={socialBtn}>
            <span style={{ fontSize: 16, fontWeight: 700, fontFamily: 'serif' }}>G</span>
            Continue with Google
          </button>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
          <span style={{ color: '#444', fontSize: 10, fontFamily: 'monospace', fontWeight: 700 }}>OR</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
        </div>

        {/* Form fields */}
        {mode === 'signup' && (
          <input
            value={name} onChange={e => setName(e.target.value)}
            placeholder="Full name" style={input}
          />
        )}
        <input
          value={email} onChange={e => setEmail(e.target.value)}
          placeholder="Email" type="email" style={input}
        />
        <input
          value={password} onChange={e => setPassword(e.target.value)}
          placeholder="Password" type="password" style={input}
        />

        {/* Forgot password */}
        {mode === 'signin' && (
          <button onClick={handleForgotPassword} style={{
            background: 'none', border: 'none', color: '#555', fontSize: 11,
            fontFamily: 'monospace', cursor: 'pointer', padding: '0 0 14px',
            fontWeight: 700, letterSpacing: 0.3,
          }}>
            Forgot password?
          </button>
        )}

        {/* Error / info */}
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

        {/* Submit */}
        <button onClick={handleEmail} disabled={loading} style={{
          width: '100%', padding: '14px', borderRadius: 14, border: 'none',
          background: 'linear-gradient(135deg, #FF6B35 0%, #FFD700 100%)',
          color: '#000', fontSize: 15, fontWeight: 800, cursor: 'pointer',
          fontFamily: "'Syne', sans-serif", letterSpacing: 0.5,
          boxShadow: '0 4px 20px rgba(255,107,53,0.35)',
          opacity: loading ? 0.7 : 1, transition: 'opacity .2s',
        }}>
          {loading ? '…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
        </button>
      </div>

      <p style={{ color: '#333', fontSize: 11, marginTop: 28, textAlign: 'center', fontFamily: 'monospace', lineHeight: 1.6 }}>
        By continuing you agree to the challenge rules<br />and community guidelines.
      </p>
    </div>
  );
}
