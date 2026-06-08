import { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { cleanFirebaseError, nativeGoogleSignIn } from './authHelpers';
import { auth, googleProvider } from './firebase';
import { isNative } from './platformService';

export default function useAuthScreenState() {
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
