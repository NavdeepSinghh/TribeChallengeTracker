import { collection, doc, getDocs, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export async function saveCreatorProfile(uid, { enabled, specialty, bio, ctaUrl, revenueShareInterest }) {
  const cleanSpecialty = (specialty || '').trim().slice(0, 60);
  const cleanBio = (bio || '').trim().slice(0, 240);
  const cleanCtaUrl = (ctaUrl || '').trim().slice(0, 160);
  const payload = {
    creatorProfile: {
      enabled: Boolean(enabled),
      specialty: cleanSpecialty,
      bio: cleanBio,
      ctaUrl: cleanCtaUrl,
      revenueShareInterest: Boolean(revenueShareInterest),
      updatedAt: serverTimestamp(),
    },
  };
  await setDoc(doc(db, 'users', uid), payload, { merge: true });
  return payload.creatorProfile;
}

export async function getCreatorRevenueShareSummary() {
  const snap = await getDocs(collection(db, 'users'));
  const counts = { enabled: 0, revenueShareInterest: 0, branded: 0 };
  snap.docs.forEach(userDoc => {
    const creatorProfile = userDoc.data()?.creatorProfile || {};
    if (creatorProfile.enabled) counts.enabled += 1;
    if (creatorProfile.revenueShareInterest) counts.revenueShareInterest += 1;
    if ((creatorProfile.specialty || '').trim() || (creatorProfile.bio || '').trim()) counts.branded += 1;
  });
  return counts;
}
