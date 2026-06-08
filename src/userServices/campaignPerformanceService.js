import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export async function getCampaignPerformanceSummary() {
  const counts = {
    total: 0,
    active: 0,
    public: 0,
    premium: 0,
    seasonal: 0,
    memberReach: 0,
  };
  const snap = await getDocs(collection(db, 'challenges'));
  snap.docs.forEach(challengeDoc => {
    const challenge = challengeDoc.data() || {};
    if (!challenge.campaignId && !challenge.campaignLabel && !challenge.campaignHashtag) return;
    counts.total += 1;
    if ((challenge.status || 'active') === 'active') counts.active += 1;
    if (challenge.isPublic) counts.public += 1;
    if (challenge.isPremium) counts.premium += 1;
    const campaignText = `${challenge.campaignId || ''} ${challenge.campaignLabel || ''}`.toLowerCase();
    if (campaignText.includes('seasonal') || campaignText.includes('summer') || campaignText.includes('winter')) counts.seasonal += 1;
    counts.memberReach += Math.max(0, Number(challenge.memberCount) || 0);
  });
  return counts;
}
