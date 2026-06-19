import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { disableNetwork, enableNetwork } from 'firebase/firestore';
import { auth } from './firebase';
import { db } from './firebase';
import { createUserIfNew } from './userService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined = still loading

  useEffect(() => {
    let resolved = false;
    const fallback = setTimeout(() => {
      if (!resolved) {
        setUser(null);
      }
    }, 2500);

    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      resolved = true;
      clearTimeout(fallback);
      if (firebaseUser) {
        // Re-enable Firestore network (may have been disabled on previous sign-out)
        enableNetwork(db).catch(() => {});
        await createUserIfNew(firebaseUser);
        setUser(firebaseUser);
      } else {
        // Disable Firestore network BEFORE clearing user so in-flight
        // watch streams don't fire "Missing or insufficient permissions"
        disableNetwork(db).catch(() => {});
        setUser(null);
      }
    }, () => {
      resolved = true;
      clearTimeout(fallback);
      setUser(null);
    });

    return () => {
      clearTimeout(fallback);
      unsub();
    };
  }, []);

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
