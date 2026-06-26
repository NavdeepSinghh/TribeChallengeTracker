import AuthBrandHeader from './AuthBrandHeader';
import AuthFormCard from './AuthFormCard';
import AuthWelcomeCarousel from './AuthWelcomeCarousel';
import useAuthScreenState from './useAuthScreenState';
import { useState } from 'react';

function getInviteCode() {
  const code = new URLSearchParams(window.location.search).get('join');
  return code?.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12) || '';
}

function InviteBanner({ code }) {
  if (!code) return null;
  return (
    <div style={{
      display: 'flex',
      gap: 12,
      alignItems: 'center',
      padding: '14px 16px',
      borderRadius: 16,
      background: 'rgba(52,211,153,0.09)',
      border: '1px solid rgba(52,211,153,0.24)',
      margin: '18px 0 22px',
    }}>
      <div style={{
        width: 38,
        height: 38,
        borderRadius: 13,
        display: 'grid',
        placeItems: 'center',
        background: 'rgba(52,211,153,0.14)',
        color: '#34D399',
        fontWeight: 900,
      }}>
        +
      </div>
      <div>
        <p style={{ margin: '0 0 3px', color: '#fff', fontSize: 14, fontWeight: 900 }}>
          Challenge invite ready
        </p>
        <p style={{ margin: 0, color: '#8fd9b7', fontSize: 12, fontWeight: 700 }}>
          Code {code} will open after you sign in.
        </p>
      </div>
    </div>
  );
}

function LandingStep({ number, title, body }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <div style={{
        minWidth: 28,
        height: 28,
        borderRadius: 10,
        display: 'grid',
        placeItems: 'center',
        background: 'rgba(255,255,255,0.08)',
        color: '#FFD700',
        fontSize: 12,
        fontWeight: 900,
        fontFamily: 'monospace',
      }}>
        {number}
      </div>
      <div>
        <p style={{ margin: '0 0 3px', color: '#f5f5f5', fontSize: 14, fontWeight: 900 }}>
          {title}
        </p>
        <p style={{ margin: 0, color: '#777', fontSize: 13, lineHeight: 1.45 }}>
          {body}
        </p>
      </div>
    </div>
  );
}

export default function AuthScreen() {
  const {
    email,
    error,
    handleEmail,
    handleForgotPassword,
    handleGoogle,
    info,
    loading,
    mode,
    name,
    password,
    setEmail,
    setName,
    setPassword,
    switchMode,
  } = useAuthScreenState();
  const inviteCode = getInviteCode();
  const [showWelcomeCarousel, setShowWelcomeCarousel] = useState(() => {
    if (inviteCode) return false;
    return window.localStorage.getItem('tribelog.authWelcomeSeen') !== '1';
  });

  const openAuth = (nextMode) => {
    window.localStorage.setItem('tribelog.authWelcomeSeen', '1');
    switchMode(nextMode);
    setShowWelcomeCarousel(false);
  };

  if (showWelcomeCarousel) {
    return (
      <AuthWelcomeCarousel
        onJoin={() => openAuth('signup')}
        onLogin={() => openAuth('signin')}
      />
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at 18% 10%, rgba(255,107,53,0.18), transparent 32%), radial-gradient(circle at 92% 12%, rgba(52,211,153,0.12), transparent 28%), #080808',
      padding: 'max(env(safe-area-inset-top), 28px) max(env(safe-area-inset-right), 20px) max(env(safe-area-inset-bottom), 28px) max(env(safe-area-inset-left), 20px)',
      fontFamily: "'Space Grotesk', sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <main style={{
        width: '100%',
        maxWidth: 1060,
        minHeight: 'calc(100vh - 56px)',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
        gap: 32,
        alignItems: 'center',
      }}>
        <section>
          <AuthBrandHeader />
          <InviteBanner code={inviteCode} />
          <div style={{
            display: 'grid',
            gap: 16,
            maxWidth: 520,
            paddingTop: inviteCode ? 0 : 8,
          }}>
            <LandingStep number="1" title="Join or create a challenge" body="Start with a simple target and a visible finish line." />
            <LandingStep number="2" title="Log one honest activity" body="Run, walk, lift, stretch, or recover. The log keeps momentum visible." />
            <LandingStep number="3" title="Stay accountable together" body="Track streaks, points, and tribe activity without guessing what to do next." />
          </div>
        </section>

        <section>
          <AuthFormCard
            email={email}
            error={error}
            info={info}
            loading={loading}
            mode={mode}
            name={name}
            onEmail={handleEmail}
            onForgotPassword={handleForgotPassword}
            onGoogle={handleGoogle}
            onSwitchMode={switchMode}
            password={password}
            setEmail={setEmail}
            setName={setName}
            setPassword={setPassword}
          />

          <button
            onClick={() => setShowWelcomeCarousel(true)}
            style={{
              width: '100%',
              marginTop: 14,
              padding: '13px 14px',
              borderRadius: 14,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.06)',
              color: '#cfcfcf',
              fontSize: 13,
              fontWeight: 800,
              cursor: 'pointer',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            See how TribeLog works
          </button>

          <p style={{ color: '#555', fontSize: 11, margin: '18px 4px 0', textAlign: 'center', lineHeight: 1.55 }}>
            By continuing, you agree to keep challenge logs honest and community-first.
          </p>
        </section>
      </main>
    </div>
  );
}
