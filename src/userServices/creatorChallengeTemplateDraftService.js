import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import { getUserProfile, sortByCreatedAtDesc } from './firestoreServiceUtils';

const CREATOR_TEMPLATE_DEFAULT_RULES = [
  'Complete the creator-defined proof habit each day',
  'Log activity in the app before bed',
  'Share progress only when consent and safety boundaries are clear',
];

const CREATOR_TEMPLATE_DEFAULT_TASKS = [
  { id: 'proof_habit', label: 'Creator proof habit completed', emoji: '✅' },
  { id: 'logged', label: 'Logged in app', emoji: '📱' },
  { id: 'support', label: 'Encouraged the tribe', emoji: '📣' },
];

function buildPublishedCreatorTemplatePayload(draft, draftId, reviewer = {}) {
  const templateId = `creator_${draftId}`.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 120);
  const cleanName = String(draft?.candidateChallengeName || draft?.specialty || 'Creator hosted challenge').trim().slice(0, 80);
  const cleanSpecialty = String(draft?.specialty || '').trim().slice(0, 60);
  const cleanBio = String(draft?.bio || '').trim().slice(0, 240);
  return {
    id: templateId,
    draftId,
    uid: draft?.uid || '',
    creatorName: draft?.displayName || '',
    creatorSpecialty: cleanSpecialty,
    creatorBio: cleanBio,
    creatorCtaUrl: String(draft?.ctaUrl || '').trim().slice(0, 160),
    name: cleanName || 'Creator hosted challenge',
    emoji: '🌟',
    color: '#10B981',
    duration: 7,
    difficulty: 'creator-led',
    tagline: cleanBio || cleanSpecialty || 'A reusable creator-led accountability challenge',
    rules: CREATOR_TEMPLATE_DEFAULT_RULES,
    tasks: CREATOR_TEMPLATE_DEFAULT_TASKS,
    dailyPrompts: [
      'What proof habit will make today count?',
      'Who can you encourage before you log off?',
      'What did this challenge teach you today?',
    ],
    disclaimer: 'This creator challenge template is for accountability and general habit formation. It is not medical advice. Adjust intensity to your needs.',
    source: 'creator_template_draft',
    status: 'published',
    isPublic: true,
    isPremium: false,
    publishedBy: reviewer.reviewedBy || '',
    publishedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
}

export async function submitCreatorChallengeTemplateDraft(uid, {
  activeHostedCount = 0,
  candidateChallengeName = '',
  hostedCount = 0,
  memberReach = 0,
  revenueReadyCount = 0,
} = {}) {
  const profile = await getUserProfile(uid);
  const creatorProfile = profile?.creatorProfile || {};
  const cleanSpecialty = (creatorProfile.specialty || '').trim().slice(0, 60);
  const cleanBio = (creatorProfile.bio || '').trim().slice(0, 240);
  const cleanCandidate = String(candidateChallengeName || '').trim().slice(0, 80);
  if (!creatorProfile.enabled) {
    throw new Error('Enable Creator / Coach Mode before saving a template draft.');
  }
  if (!cleanSpecialty && !cleanBio && !cleanCandidate) {
    throw new Error('Add creator specialty, bio, or choose a hosted challenge before saving a template draft.');
  }
  const draftId = `${uid}_${Date.now()}`;
  const payload = {
    uid,
    email: profile?.email || '',
    displayName: profile?.displayName || '',
    specialty: cleanSpecialty,
    bio: cleanBio,
    ctaUrl: (creatorProfile.ctaUrl || '').trim().slice(0, 160),
    candidateChallengeName: cleanCandidate || 'Hosted challenge template draft',
    hostedCount: Number(hostedCount) || 0,
    activeHostedCount: Number(activeHostedCount) || 0,
    memberReach: Number(memberReach) || 0,
    revenueReadyCount: Number(revenueReadyCount) || 0,
    status: 'open',
    source: 'web',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await setDoc(doc(db, 'creatorChallengeTemplateDrafts', draftId), payload);
  return { id: draftId, ...payload };
}

export async function getCreatorChallengeTemplateDraftReviewQueue() {
  const snap = await getDocs(query(collection(db, 'creatorChallengeTemplateDrafts'), where('status', '==', 'open')));
  return sortByCreatedAtDesc(snap.docs.map(draftDoc => ({
    id: draftDoc.id,
    ...draftDoc.data(),
  })));
}

export async function getPublishedCreatorChallengeTemplates() {
  const snap = await getDocs(query(collection(db, 'creatorChallengeTemplates'), where('status', '==', 'published')));
  return sortByCreatedAtDesc(snap.docs.map(templateDoc => ({
    id: templateDoc.id,
    ...templateDoc.data(),
  })));
}

export async function reviewCreatorChallengeTemplateDraft(draftId, {
  status = 'open',
  reviewNote = '',
  reviewedBy = '',
} = {}) {
  const cleanDraftId = String(draftId || '').trim();
  const cleanStatus = String(status || '').trim();
  const allowedStatuses = new Set(['open', 'approved', 'published', 'waiting', 'not_ready', 'declined']);
  if (!cleanDraftId || !allowedStatuses.has(cleanStatus)) {
    throw new Error('Choose a valid creator template draft status.');
  }
  const draftSnap = cleanStatus === 'published' ? await getDoc(doc(db, 'creatorChallengeTemplateDrafts', cleanDraftId)) : null;
  const draft = draftSnap?.exists() ? draftSnap.data() : null;
  const payload = {
    status: cleanStatus,
    reviewNote: String(reviewNote || '').trim().slice(0, 500),
    reviewedBy: String(reviewedBy || '').trim().slice(0, 120),
    reviewedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  if (cleanStatus === 'published') {
    if (!draft) throw new Error('Creator template draft not found.');
    const publishedTemplate = buildPublishedCreatorTemplatePayload(draft, cleanDraftId, payload);
    await setDoc(doc(db, 'creatorChallengeTemplates', publishedTemplate.id), publishedTemplate);
    payload.publishedTemplateId = publishedTemplate.id;
  }
  await updateDoc(doc(db, 'creatorChallengeTemplateDrafts', cleanDraftId), payload);
  return payload;
}
