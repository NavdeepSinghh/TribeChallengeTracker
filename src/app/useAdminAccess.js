import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";

export default function useAdminAccess(user) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsAdmin(false);

    if (!user?.uid) return undefined;

    getDoc(doc(db, "admins", user.uid))
      .then(snapshot => {
        if (!cancelled) setIsAdmin(snapshot.exists());
      })
      .catch(() => {
        if (!cancelled) setIsAdmin(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user?.uid]);

  return isAdmin;
}
