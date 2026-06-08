import {
  GoogleAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import { auth } from './firebase';

export function cleanFirebaseError(msg) {
  return msg.replace('Firebase: ', '').replace(/\s*\(auth\/[^)]*\)\.?/, '').trim();
}

export async function nativeGoogleSignIn() {
  const { registerPlugin } = await import('@capacitor/core');
  const GoogleSignInPlugin = registerPlugin('GoogleSignInPlugin');
  const { idToken, accessToken } = await GoogleSignInPlugin.signIn();
  const credential = GoogleAuthProvider.credential(idToken, accessToken);
  return signInWithCredential(auth, credential);
}
