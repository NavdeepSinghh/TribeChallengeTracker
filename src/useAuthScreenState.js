import { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { cleanFirebaseError, nativeGoogleSignIn } from './authHelpers';
import { getAuthEmailError, normalizeAuthEmail, requiresEmailVerification } from './authEmailValidation';
import { auth, googleProvider } from './firebase';
import { isNative } from './platformService';

const VERIFY_EMAIL_INFO = 'Check your inbox and verify your email before signing in.';

export default function useAuthScreenState() {
  const params = new URLSearchParams(window.location.search);
  const hasInvite = params.has('join') || params.has('ref');
  const [mode, setMode] = useState(hasInvite ? 'signup' : 'signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  const switchMode = (m) => { setMode(m); setError(''); setInfo(''); };

  const handleEmail = async () => {
    const normalizedEmail = normalizeAuthEmail(email);
    const emailError = getAuthEmailError(normalizedEmail);

    if (emailError) { setError(emailError); return; }
    if (!password) { setError('Enter your password.'); return; }

    setError(''); setInfo(''); setLoading(true);
    try {
      if (mode === 'signup') {
        const cred = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
        if (name.trim()) await updateProfile(cred.user, { displayName: name.trim() });
        await sendEmailVerification(cred.user);
        await signOut(auth);
        setInfo(VERIFY_EMAIL_INFO);
      } else {
        const cred = await signInWithEmailAndPassword(auth, normalizedEmail, password);
        if (requiresEmailVerification(cred.user)) {
          await sendEmailVerification(cred.user);
          await signOut(auth);
          setInfo(VERIFY_EMAIL_INFO);
        }
      }
    } catch (e) {
      setError(cleanFirebaseError(e.message));
      setInfo('');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(''); setInfo(''); setLoading(true);
    try {
      if (isNative) {
        await nativeGoogleSignIn();
      } else {
        await signInWithPopup(auth, googleProvider);
      }
    } catch (e) {
      if (e.code !== 'auth/popup-closed-by-user' && e.code !== 'auth/cancelled-popup-request') {
        setError(cleanFirebaseError(e.message));
      }
    }
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    const normalizedEmail = normalizeAuthEmail(email);
    const emailError = getAuthEmailError(normalizedEmail);

    if (emailError) { setError(emailError); return; }

    setError(''); setLoading(true);
    try {
      await sendPasswordResetEmail(auth, normalizedEmail);
      setInfo('Password reset email sent — check your inbox.');
    } catch (e) {
      setError(cleanFirebaseError(e.message));
    }
    setLoading(false);
  };

  return {
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
  };
}
