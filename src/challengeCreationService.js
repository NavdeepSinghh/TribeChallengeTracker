import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  increment,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import { canCreateChallengeTemplate } from './proFeatures';
import { buildChallengeMemberRecord } from './challengeMembershipJoinHelpers';

const genInviteCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

export async function createChallenge(uid, template, customName, startDateStr, isPublic = true) {
  const ref = doc(collection(db, 'challenges'));
  const end = new Date(startDateStr);
  end.setDate(end.getDate() + template.duration);

  const creatorSnap = await getDoc(doc(db, 'users', uid));
  const creator = creatorSnap.data() || {};
  const canCreatePrivate = creator?.entitlements?.pro?.active === true;
  if (!canCreateChallengeTemplate(creator, template)) {
    throw new Error('This challenge pack requires Tribe Pro or an active pack purchase.');
  }
  const effectiveIsPublic = isPublic || !canCreatePrivate;
  const creatorBrandingEnabled = canCreatePrivate && creator?.creatorProfile?.enabled === true;

  const data = {
    id: ref.id,
    templateId: template.id,
    name: customName.trim() || template.name,
    emoji: template.emoji,
    color: template.color,
    duration: template.duration,
    tagline: template.tagline,
    difficulty: template.difficulty,
    rules: template.rules,
    tasks: template.tasks,
    dailyPrompts: template.dailyPrompts || [],
    disclaimer: template.disclaimer,
    campaignId: template.campaignId || '',
    campaignLabel: template.campaignLabel || '',
    campaignHashtag: template.campaignHashtag || '',
    campaignCta: template.campaignCta || '',
    sponsorName: template.sponsorName || '',
    sponsorLabel: template.sponsorLabel || '',
    sponsorPerk: template.sponsorPerk || '',
    sponsorUrl: template.sponsorUrl || '',
    isPremium: !!template.isPremium,
    packId: template.packId || '',
    packLabel: template.packLabel || '',
    templateSource: template.source || '',
    creatorTemplateId: template.creatorTemplateId || '',
    creatorTemplateDraftId: template.creatorTemplateDraftId || '',
    creatorTemplateOwnerUid: template.creatorTemplateOwnerUid || '',
    creatorTemplateOwnerName: template.creatorTemplateOwnerName || '',
    createdBy: uid,
    creatorName: creator.displayName || '',
    creatorEmail: creator.email || '',
    creatorSpecialty: creatorBrandingEnabled ? (creator.creatorProfile?.specialty || '') : '',
    creatorBio: creatorBrandingEnabled ? (creator.creatorProfile?.bio || '') : '',
    creatorCtaUrl: creatorBrandingEnabled ? (creator.creatorProfile?.ctaUrl || '') : '',
    createdAt: serverTimestamp(),
    startDate: startDateStr,
    endDate: end.toISOString().split('T')[0],
    inviteCode: genInviteCode(),
    memberCount: 1,
    isPublic: effectiveIsPublic,
    status: 'active',
  };

  await setDoc(ref, data);
  await setDoc(doc(db, 'challenges', ref.id, 'members', uid), buildChallengeMemberRecord({
    uid,
    role: 'admin',
    userData: creator,
  }));
  await updateDoc(doc(db, 'users', uid), {
    joinedChallengeIds: arrayUnion(ref.id),
    'stats.challengesJoined': increment(1),
    'stats.challengesOwned': increment(1),
  });

  return data;
}
