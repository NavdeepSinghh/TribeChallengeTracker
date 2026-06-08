import AuthBrandHeader from './AuthBrandHeader';
import AuthFormCard from './AuthFormCard';
import useAuthScreenState from './useAuthScreenState';

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

  return (
    <div style={{
      minHeight: '100vh', background: '#080808',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: 'max(env(safe-area-inset-top), 40px) max(env(safe-area-inset-right), 20px) max(env(safe-area-inset-bottom), 40px) max(env(safe-area-inset-left), 20px)',
      fontFamily: "'Space Grotesk', sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <AuthBrandHeader />
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

      <p style={{ color: '#333', fontSize: 11, marginTop: 28, textAlign: 'center', fontFamily: 'monospace', lineHeight: 1.6 }}>
        By continuing you agree to the challenge rules<br />and community guidelines.
      </p>
    </div>
  );
}
