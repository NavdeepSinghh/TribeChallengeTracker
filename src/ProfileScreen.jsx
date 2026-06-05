import { useState, useEffect, useRef } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
import { BADGES, calcBadgeXP, getTribeRank } from './badgeService';
import { getUserProfile, getUserChallengePoints, requestAccountDeletion, getAccountDeletionReviewQueue, reviewAccountDeletionRequest, submitSupportRequest, getSupportReviewQueue, reviewSupportRequest, requestEntitlementRecovery, getEntitlementRecoveryReviewQueue, reviewEntitlementRecoveryRequest, recordStoreTestPurchaseEvidence, getStoreTestPurchaseEvidenceLog, reviewStoreTestPurchaseEvidence, claimReferralReward, getReferralRewardReviewQueue, reviewReferralRewardClaim, saveProfileAppearance, saveProfileCosmetics, saveSocialProfile, saveCustomGoals, saveStreakRecovery, saveCreatorProfile, submitCreatorHostingApplication, getCreatorHostingApplicationReviewQueue, reviewCreatorHostingApplication, submitPartnerCampaignApplication, getPartnerCampaignApplicationReviewQueue, reviewPartnerCampaignApplication, claimPartnerPerk, getPartnerPerkClaimReviewQueue, getPartnerPerkClaims, reviewPartnerPerkClaim, savePartnerPerkInterest, saveProTrialInterest, getProTrialInterestSummary, getCreatorRevenueShareSummary, getCampaignPerformanceSummary, getPartnerPerkInterestSummary, submitFeatureSubmission, getFeatureSubmissions, getFeaturedSubmissions, getFeatureReviewQueue, reviewFeatureSubmission } from './userService';
import { cancelDailyReminder, getDailyReminderLabel, setDailyReminder } from './reminderService';
import { hasActiveChallengePack, hasActivePro } from './proFeatures';
import { beginWebCheckout, getPurchaseValidationReadiness, getStoreProductCatalog, syncWebPurchases } from './purchaseService';
import { PARTNER_PERKS, getPartnerPerkProgress } from './partnerPerks';
import { buildMonthlyReport, buildWeeklyReport } from './weeklyReport';
import { getUserChallenges, getWeeklyCampaignPrompt } from './challengeService';

const ACCENT = '#FF6B35';
const GOLD   = '#FFD700';
const POLICY_LINKS = [
  { id: 'privacy', label: 'Privacy Policy', url: 'https://risewiththetribe.app/privacy.html' },
  { id: 'terms', label: 'Terms of Use', url: 'https://risewiththetribe.app/terms.html' },
  { id: 'support', label: 'Support', url: 'https://risewiththetribe.app/support.html' },
  { id: 'data_deletion', label: 'Data Deletion', url: 'https://risewiththetribe.app/data-deletion.html' },
];

const GOAL_LABELS = {
  lose_weight: 'Lose Weight 🔥', build_muscle: 'Build Muscle 💪',
  endurance: 'Endurance 🏃', stress: 'Reduce Stress 🧘', energy: 'Boost Energy ⚡',
};
const LEVEL_LABELS = {
  beginner: 'Just Starting 🌱', moderate: 'Somewhat Active 🚶',
  fit: 'Pretty Fit 🏃', athlete: 'Very Athletic 🦅',
};
const FREQ_LABELS = {
  '2_3': '2–3× / week', '4_5': '4–5× / week', daily: 'Every day 🔥', flexible: 'Flexible 🎯',
};

const AVATAR_OPTIONS = [
  ['🔥', '#FF6B35'], ['⚡', '#FFD700'], ['💪', '#F59E0B'], ['🌱', '#34D399'],
  ['🏃', '#34D399'], ['🧘', '#A78BFA'], ['🚴', '#60A5FA'], ['🏊', '#38BDF8'],
  ['👑', '#C084FC'], ['💎', '#38BDF8'], ['🌈', '#C084FC'], ['✨', '#FFD700'],
];

const PROFILE_FRAMES = [
  { id: 'none', label: 'Clean', colors: ['rgba(255,255,255,0.18)', 'rgba(255,255,255,0.08)'] },
  { id: 'ember', label: 'Ember', colors: ['#FF6B35', '#FFD700'] },
  { id: 'gold', label: 'Gold', colors: ['#FFD700', '#F59E0B'] },
  { id: 'neon', label: 'Neon', colors: ['#34D399', '#60A5FA'] },
];

const STORE_CATALOG = getStoreProductCatalog();
const STORE_READINESS_ITEMS = [
  'Create matching App Store Connect and Play Console products',
  'Configure server receipt-validation credentials',
  'Run sandbox/test purchases on iOS and Android',
  'Confirm entitlement writes before enabling paid access',
];
const STORE_CREDENTIAL_SETUP_ITEMS = [
  'App Store Connect: subscription group, challenge-pack products, shared secret / App Store Server API keys',
  'Play Console: subscriptions, one-time pack products, service account JSON, package access',
  'Firebase Functions: store validation secrets configured for App Store and Play Billing',
  'QA: sandbox/test users complete purchase + restore, then verify Firestore entitlements',
];
const SUPPORT_REFUND_READINESS_ITEMS = [
  'Publish clear support contact and response-time expectations',
  'Document restore purchase and entitlement recovery steps',
  'Prepare App Store and Play refund guidance without handling refunds in-app',
  'Escalate duplicate charge, missing entitlement, and account mismatch cases',
];
const SUBSCRIPTION_MANAGEMENT_GUIDANCE_ITEMS = [
  'Tell iOS members to manage or cancel subscriptions from Apple ID subscriptions in iOS Settings or the App Store',
  'Tell Android members to manage or cancel subscriptions from Google Play subscriptions for the signed-in Play account',
  'Ask members to restore or sync purchases before opening support for missing entitlements',
  'Route refunds, cancellations, billing disputes, and failed renewals through marketplace support first',
];
const BILLING_SUPPORT_ESCALATION_ITEMS = [
  'Confirm platform, store account, product ID, purchase date, and latest restore/sync result before escalating',
  'Separate wrong-account, failed renewal, duplicate charge, cancellation confusion, and missing-entitlement cases',
  'Attach store evidence, validation status, entitlement recovery request, and support review notes to the handoff',
  'Escalate marketplace refunds, cancellations, charge disputes, and payment failures to App Store or Google Play support',
];
const RENEWAL_RECOVERY_ITEMS = [
  'Confirm whether the member is lapsed, cancelled, in grace period, or using the wrong store account',
  'Ask the member to update payment details and manage renewal inside App Store or Google Play subscriptions',
  'Invite the member to restore/sync purchases after renewal, then open entitlement recovery if access stays missing',
  'Use first-party support notes only; keep payment, refund, chargeback, and cancellation decisions with the marketplace',
];
const CANCELLATION_FEEDBACK_ITEMS = [
  'Ask what felt unclear, unused, too expensive, or not valuable enough before the member leaves',
  'Route cancellation steps to App Store or Google Play subscriptions without obstructing the marketplace flow',
  'Capture optional support notes for product learning without storing payment details or marketplace account data',
  'Review cancellation themes against first-party Pro interest, pack interest, creator demand, and support readiness',
];
const LAPSED_MEMBER_WINBACK_ITEMS = [
  'Lead with a free comeback challenge, not a discount or payment ask',
  'Use current weekly campaign copy, streak rescue prompts, and referral momentum as the return path',
  'Invite the member to log one activity before asking about Pro, packs, creator tools, or partner perks',
  'Review first-party re-engagement signals only: app logs, challenge joins, referrals, support notes, and saved interest',
];
const SANDBOX_PURCHASE_TEST_ITEMS = [
  'iOS sandbox: buy Pro monthly, restore, then verify verifyPurchase writes entitlements.pro.active',
  'iOS sandbox: buy each challenge pack, restore, then verify the matching entitlements.packs entry',
  'Android license test: buy Pro monthly, restore owned purchases, then verify entitlements.pro.active',
  'Android license test: buy each challenge pack, restore owned purchases, then verify the matching entitlements.packs entry',
  'Negative QA: cancellation, duplicate restore, wrong account, and failed receipt validation must not unlock access',
];
const STORE_TEST_EVIDENCE_CASES = [
  { id: 'ios_pro_sandbox', platform: 'ios', productKind: 'subscription', testCase: 'sandbox_purchase', label: 'iOS Pro sandbox purchase' },
  { id: 'ios_pack_restore', platform: 'ios', productKind: 'challengePack', testCase: 'restore_sync', label: 'iOS pack restore sync' },
  { id: 'android_pro_license', platform: 'android', productKind: 'subscription', testCase: 'sandbox_purchase', label: 'Android Pro license test' },
  { id: 'android_negative_validation', platform: 'android', productKind: 'challengePack', testCase: 'negative_validation', label: 'Android negative validation' },
];

const DM_KEYWORD_PROMPTS = [
  {
    keyword: 'TRIBE',
    label: 'Weekly challenge invite',
    reply: 'Send this when someone wants the current weekly challenge link.',
  },
  {
    keyword: 'COMEBACK',
    label: 'Restart support',
    reply: 'Send this when someone says they fell off and needs a small restart.',
  },
  {
    keyword: 'PRO',
    label: 'Future paid access',
    reply: 'Send this when someone asks about reports, private challenges, or challenge packs.',
  },
  {
    keyword: 'FEATURE',
    label: 'UGC/highlight flow',
    reply: 'Send this when someone wants to be reposted by @risewiththetribe.',
  },
];

const FEATURE_CATEGORIES = [
  ['streak_win', 'Streak win'],
  ['challenge_completion', 'Challenge completion'],
  ['comeback', 'Comeback story'],
  ['beginner_win', 'Beginner win'],
  ['transformation', 'Transformation'],
];
const FEATURE_CATEGORY_LABELS = Object.fromEntries(FEATURE_CATEGORIES);
const FEATURE_STATUS_STYLES = {
  pending: ['Pending', '#F59E0B'],
  approved: ['Approved', '#60A5FA'],
  featured: ['Featured', '#34D399'],
  declined: ['Declined', '#F87171'],
};

const REFERRAL_TIERS = [
  { target: 1, label: 'Connector', reward: 'Referral badge unlock', color: '#34D399' },
  { target: 5, label: 'Tribe Builder', reward: 'Builder badge + featured queue priority', color: ACCENT },
  { target: 10, label: 'Community Captain', reward: 'Captain badge + leaderboard shoutout', color: GOLD },
  { target: 25, label: 'Founder Circle', reward: 'Future Pro trial / founder perk candidate', color: '#A78BFA' },
];

const PRO_BENEFITS = [
  'Advanced progress analytics',
  'Weekly/monthly performance reports',
  'Custom weekly and streak goals',
  'Premium profile frames',
  'Streak recovery credits',
  'Private challenges',
  'Premium badges and share templates',
];

const PRO_TRIAL_REASONS = [
  { id: 'reports', label: 'Reports', detail: 'Weekly/monthly insights and custom goals' },
  { id: 'challenge_packs', label: 'Challenge packs', detail: 'Structured premium programs and prompts' },
  { id: 'creator_tools', label: 'Creator tools', detail: 'Launch kit, hosted analytics, and future revenue-share' },
];

const INSTAGRAM_WEEKLY_PROMPTS = [
  { label: 'SUNDAY COUNTDOWN', title: 'Set the tone for next week', hook: 'Next week starts now. I am choosing consistency before motivation shows up.' },
  { label: 'WEEKLY CHALLENGE LAUNCH', title: 'Invite the tribe in', hook: 'New week, new challenge energy. Pick one action and bring someone with you.' },
  { label: 'CONSISTENCY LESSON', title: 'Teach one useful habit', hook: 'Small repeatable habits beat dramatic restarts. Here is the one I am protecting today.' },
  { label: 'COMMUNITY WIN', title: 'Celebrate a visible win', hook: 'A win worth sharing: I showed up again, and that counts.' },
  { label: 'ACCOUNTABILITY HOOK', title: 'Call in the next log', hook: 'This is your sign to log the session before the day gets away from you.' },
  { label: 'LEADERBOARD RECAP', title: 'Share proof of effort', hook: 'Proof over promises. The points, streak, and active days are moving.' },
  { label: 'FOUNDER NOTE', title: 'Share the behind-the-scenes', hook: 'Building the tribe one check-in at a time. The goal is consistency people can feel.' },
];

const referralTierState = (count = 0) => {
  const achieved = [...REFERRAL_TIERS].reverse().find(tier => count >= tier.target) || null;
  const next = REFERRAL_TIERS.find(tier => count < tier.target) || null;
  const previousTarget = achieved?.target || 0;
  const progressBase = next ? next.target - previousTarget : 1;
  const progressValue = next ? count - previousTarget : 1;
  return {
    achieved,
    next,
    earnedCount: REFERRAL_TIERS.filter(tier => count >= tier.target).length,
    remainingToNext: next ? Math.max(0, next.target - count) : 0,
    ladderPct: Math.min(100, Math.max(0, (count / REFERRAL_TIERS[REFERRAL_TIERS.length - 1].target) * 100)),
    pct: next ? Math.min(100, Math.max(0, (progressValue / progressBase) * 100)) : 100,
  };
};

const reminderButtonStyle = (background, color) => ({
  border: 'none',
  borderRadius: 12,
  background,
  color,
  fontSize: 12,
  fontWeight: 800,
  padding: '10px 8px',
  cursor: 'pointer',
});

async function resizeImageToBase64(file, maxDimension = 384, quality = 0.68) {
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const image = await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });

  const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(image.width * scale);
  canvas.height = Math.round(image.height * scale);
  canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
  let currentQuality = quality;
  let base64 = canvas.toDataURL('image/jpeg', currentQuality).split(',')[1];
  while (base64.length > 700000 && currentQuality > 0.35) {
    currentQuality -= 0.1;
    base64 = canvas.toDataURL('image/jpeg', currentQuality).split(',')[1];
  }
  return base64;
}

const drawRoundedRect = (ctx, x, y, width, height, radius) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
};

const makeWinCardBlob = ({ displayName, totalPoints, streak, daysActive, rank, referralJoins, instagramHandle }) => new Promise(resolve => {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#080808');
  gradient.addColorStop(0.56, '#15110c');
  gradient.addColorStop(1, '#0a1510');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'rgba(255,107,53,0.20)';
  ctx.beginPath();
  ctx.arc(920, 180, 280, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(52,211,153,0.14)';
  ctx.beginPath();
  ctx.arc(120, 1660, 330, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 58px Arial';
  ctx.fillText('RISE WITH THE TRIBE', 92, 180);
  ctx.fillStyle = '#FF6B35';
  ctx.font = '800 32px Arial';
  ctx.fillText('@risewiththetribe', 92, 232);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 104px Arial';
  ctx.fillText('WIN CARD', 92, 420);
  ctx.fillStyle = 'rgba(255,255,255,0.72)';
  ctx.font = '700 34px Arial';
  ctx.fillText((displayName || 'Tribe Member').slice(0, 28), 96, 482);
  if (instagramHandle) {
    ctx.fillStyle = '#FFD700';
    ctx.fillText(`@${instagramHandle.replace(/^@+/, '')}`.slice(0, 30), 96, 530);
  }

  const stats = [
    ['POINTS', `${totalPoints}`, '#FFD700'],
    ['STREAK', `${streak}d`, '#FF6B35'],
    ['DAYS ACTIVE', `${daysActive}`, '#34D399'],
    ['REFERRAL JOINS', `${referralJoins}`, '#60A5FA'],
  ];
  stats.forEach(([label, value, color], index) => {
    const y = 670 + index * 210;
    ctx.fillStyle = 'rgba(255,255,255,0.07)';
    drawRoundedRect(ctx, 92, y, 896, 160, 28);
    ctx.fill();
    ctx.fillStyle = color;
    ctx.font = '900 28px Arial';
    ctx.fillText(label, 136, y + 54);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 64px Arial';
    ctx.fillText(value, 136, y + 125);
  });

  ctx.fillStyle = rank?.color || '#FFD700';
  ctx.font = '900 48px Arial';
  ctx.fillText(`${rank?.icon || '✨'} ${rank?.label || 'Tribe Member'}`, 92, 1550);
  ctx.fillStyle = 'rgba(255,255,255,0.72)';
  ctx.font = '700 34px Arial';
  ctx.fillText('Built one log at a time.', 92, 1622);
  ctx.fillStyle = '#FF6B35';
  ctx.font = '900 34px Arial';
  ctx.fillText('Tag @risewiththetribe', 92, 1694);
  ctx.fillStyle = '#FFD700';
  ctx.font = '900 40px Arial';
  ctx.fillText('risewiththetribe.app', 92, 1760);

  canvas.toBlob(resolve, 'image/png', 0.94);
});

export default function ProfileScreen({ user, earnedBadges, myHistory, challengeStats, onProfileUpdated, onHistoryUpdated, onClose }) {
  const [profile, setProfile]                 = useState(null);
  const [visible, setVisible]                 = useState(false);
  const [challengePoints, setChallengePoints] = useState([]);
  const [profileChallenges, setProfileChallenges] = useState([]);
  const [showBreakdown, setShowBreakdown]     = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [isSavingAppearance, setIsSavingAppearance] = useState(false);
  const [appearanceError, setAppearanceError] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');
  const [isSavingSocial, setIsSavingSocial] = useState(false);
  const [socialMessage, setSocialMessage] = useState('');
  const [featureCategory, setFeatureCategory] = useState('streak_win');
  const [featureStory, setFeatureStory] = useState('');
  const [featureMediaData, setFeatureMediaData] = useState('');
  const [featureConsent, setFeatureConsent] = useState(false);
  const [isSubmittingFeature, setIsSubmittingFeature] = useState(false);
  const [featureMessage, setFeatureMessage] = useState('');
  const [featureSubmissions, setFeatureSubmissions] = useState([]);
  const [featuredSubmissions, setFeaturedSubmissions] = useState([]);
  const [featureReviewQueue, setFeatureReviewQueue] = useState([]);
  const [featureReviewNotes, setFeatureReviewNotes] = useState({});
  const [accountDeletionReviewQueue, setAccountDeletionReviewQueue] = useState([]);
  const [accountDeletionReviewNotes, setAccountDeletionReviewNotes] = useState({});
  const [reviewingAccountDeletionRequestId, setReviewingAccountDeletionRequestId] = useState('');
  const [supportReviewQueue, setSupportReviewQueue] = useState([]);
  const [supportReviewNotes, setSupportReviewNotes] = useState({});
  const [reviewingSupportRequestId, setReviewingSupportRequestId] = useState('');
  const [referralRewardReviewQueue, setReferralRewardReviewQueue] = useState([]);
  const [referralRewardReviewNotes, setReferralRewardReviewNotes] = useState({});
  const [reviewingReferralRewardClaimId, setReviewingReferralRewardClaimId] = useState('');
  const [reviewMessage, setReviewMessage] = useState('');
  const [winCardMessage, setWinCardMessage] = useState('');
  const [reminderLabel, setReminderLabel] = useState(getDailyReminderLabel());
  const [reminderError, setReminderError] = useState('');
  const [goalActiveDays, setGoalActiveDays] = useState(5);
  const [goalPoints, setGoalPoints] = useState(250);
  const [goalStreak, setGoalStreak] = useState(30);
  const [goalsMessage, setGoalsMessage] = useState('');
  const [isSavingGoals, setIsSavingGoals] = useState(false);
  const [selectedFrameId, setSelectedFrameId] = useState('none');
  const [cosmeticsMessage, setCosmeticsMessage] = useState('');
  const [isSavingCosmetics, setIsSavingCosmetics] = useState(false);
  const [recoveryMessage, setRecoveryMessage] = useState('');
  const [isSavingRecovery, setIsSavingRecovery] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState('');
  const [checkoutProductId, setCheckoutProductId] = useState('');
  const [entitlementRecoveryMessage, setEntitlementRecoveryMessage] = useState('');
  const [isRequestingEntitlementRecovery, setIsRequestingEntitlementRecovery] = useState(false);
  const [entitlementRecoveryReviewQueue, setEntitlementRecoveryReviewQueue] = useState([]);
  const [entitlementRecoveryReviewNotes, setEntitlementRecoveryReviewNotes] = useState({});
  const [reviewingEntitlementRecoveryRequestId, setReviewingEntitlementRecoveryRequestId] = useState('');
  const [storeTestEvidenceLog, setStoreTestEvidenceLog] = useState([]);
  const [storeTestEvidenceMessage, setStoreTestEvidenceMessage] = useState('');
  const [recordingStoreTestEvidenceId, setRecordingStoreTestEvidenceId] = useState('');
  const [storeTestEvidenceReviewNotes, setStoreTestEvidenceReviewNotes] = useState({});
  const [reviewingStoreTestEvidenceId, setReviewingStoreTestEvidenceId] = useState('');
  const [validationReadinessMessage, setValidationReadinessMessage] = useState('');
  const [isCheckingValidationReadiness, setIsCheckingValidationReadiness] = useState(false);
  const [creatorEnabled, setCreatorEnabled] = useState(false);
  const [creatorSpecialty, setCreatorSpecialty] = useState('');
  const [creatorBio, setCreatorBio] = useState('');
  const [creatorCtaUrl, setCreatorCtaUrl] = useState('');
  const [creatorRevenueShareInterest, setCreatorRevenueShareInterest] = useState(false);
  const [creatorMessage, setCreatorMessage] = useState('');
  const [isSavingCreator, setIsSavingCreator] = useState(false);
  const [creatorRevenueShareSummary, setCreatorRevenueShareSummary] = useState({});
  const [campaignPerformanceSummary, setCampaignPerformanceSummary] = useState({});
  const [selectedPartnerPerkIds, setSelectedPartnerPerkIds] = useState([]);
  const [partnerPerkMessage, setPartnerPerkMessage] = useState('');
  const [isSavingPartnerPerks, setIsSavingPartnerPerks] = useState(false);
  const [partnerPerkSummary, setPartnerPerkSummary] = useState({});
  const [creatorHostingApplicationReviewQueue, setCreatorHostingApplicationReviewQueue] = useState([]);
  const [creatorHostingApplicationMessage, setCreatorHostingApplicationMessage] = useState('');
  const [isSubmittingCreatorHostingApplication, setIsSubmittingCreatorHostingApplication] = useState(false);
  const [creatorHostingApplicationReviewNotes, setCreatorHostingApplicationReviewNotes] = useState({});
  const [reviewingCreatorHostingApplicationId, setReviewingCreatorHostingApplicationId] = useState('');
  const [partnerCampaignApplicationReviewQueue, setPartnerCampaignApplicationReviewQueue] = useState([]);
  const [partnerCampaignApplicationMessage, setPartnerCampaignApplicationMessage] = useState('');
  const [isSubmittingPartnerCampaignApplication, setIsSubmittingPartnerCampaignApplication] = useState(false);
  const [partnerCampaignApplicationReviewNotes, setPartnerCampaignApplicationReviewNotes] = useState({});
  const [reviewingPartnerCampaignApplicationId, setReviewingPartnerCampaignApplicationId] = useState('');
  const [partnerPerkClaimReviewQueue, setPartnerPerkClaimReviewQueue] = useState([]);
  const [partnerPerkClaims, setPartnerPerkClaims] = useState([]);
  const [partnerPerkClaimMessage, setPartnerPerkClaimMessage] = useState('');
  const [claimingPartnerPerkId, setClaimingPartnerPerkId] = useState('');
  const [partnerPerkReviewNotes, setPartnerPerkReviewNotes] = useState({});
  const [reviewingPartnerPerkClaimId, setReviewingPartnerPerkClaimId] = useState('');
  const [selectedProTrialReasonIds, setSelectedProTrialReasonIds] = useState([]);
  const [proTrialMessage, setProTrialMessage] = useState('');
  const [isSavingProTrialInterest, setIsSavingProTrialInterest] = useState(false);
  const [proTrialSummary, setProTrialSummary] = useState({});
  const [deletionRequestMessage, setDeletionRequestMessage] = useState('');
  const [isRequestingDeletion, setIsRequestingDeletion] = useState(false);
  const [supportCategory, setSupportCategory] = useState('general');
  const [supportMessage, setSupportMessage] = useState('');
  const [supportStatusMessage, setSupportStatusMessage] = useState('');
  const [isSubmittingSupport, setIsSubmittingSupport] = useState(false);
  const [referralRewardClaimMessage, setReferralRewardClaimMessage] = useState('');
  const [isClaimingReferralReward, setIsClaimingReferralReward] = useState(false);
  const fileInputRef = useRef(`profile-photo-${user.uid}`);
  const featureFileInputRef = useRef(`feature-photo-${user.uid}`);

  useEffect(() => {
    getUserProfile(user.uid).then(p => {
      setProfile(p);
      setInstagramHandle(p?.instagramHandle || '');
      setGoalActiveDays(p?.goals?.weeklyActiveDaysTarget || 5);
      setGoalPoints(p?.goals?.weeklyPointsTarget || 250);
      setGoalStreak(p?.goals?.streakTarget || 30);
      setSelectedFrameId(p?.cosmetics?.profileFrameId || 'none');
      setCreatorEnabled(p?.creatorProfile?.enabled || false);
      setCreatorSpecialty(p?.creatorProfile?.specialty || '');
      setCreatorBio(p?.creatorProfile?.bio || '');
      setCreatorCtaUrl(p?.creatorProfile?.ctaUrl || '');
      setCreatorRevenueShareInterest(p?.creatorProfile?.revenueShareInterest || false);
      setSelectedPartnerPerkIds(p?.partnerPerkInterest?.selectedIds || []);
      setSelectedProTrialReasonIds(p?.proTrialInterest?.selectedIds || []);
      const ids = p?.joinedChallengeIds || [];
      if (ids.length) {
        getUserChallengePoints(user.uid, ids).then(setChallengePoints);
        getUserChallenges(ids).then(setProfileChallenges).catch(() => setProfileChallenges([]));
      }
      if (p?.isAdmin || p?.role === 'admin') {
        getFeatureReviewQueue().then(setFeatureReviewQueue).catch(() => setFeatureReviewQueue([]));
        getAccountDeletionReviewQueue().then(setAccountDeletionReviewQueue).catch(() => setAccountDeletionReviewQueue([]));
        getSupportReviewQueue().then(setSupportReviewQueue).catch(() => setSupportReviewQueue([]));
        getEntitlementRecoveryReviewQueue().then(setEntitlementRecoveryReviewQueue).catch(() => setEntitlementRecoveryReviewQueue([]));
        getStoreTestPurchaseEvidenceLog().then(setStoreTestEvidenceLog).catch(() => setStoreTestEvidenceLog([]));
        getReferralRewardReviewQueue().then(setReferralRewardReviewQueue).catch(() => setReferralRewardReviewQueue([]));
        getPartnerPerkInterestSummary().then(setPartnerPerkSummary).catch(() => setPartnerPerkSummary({}));
        getProTrialInterestSummary().then(setProTrialSummary).catch(() => setProTrialSummary({}));
        getCreatorRevenueShareSummary().then(setCreatorRevenueShareSummary).catch(() => setCreatorRevenueShareSummary({}));
        getCreatorHostingApplicationReviewQueue().then(setCreatorHostingApplicationReviewQueue).catch(() => setCreatorHostingApplicationReviewQueue([]));
        getPartnerCampaignApplicationReviewQueue().then(setPartnerCampaignApplicationReviewQueue).catch(() => setPartnerCampaignApplicationReviewQueue([]));
        getPartnerPerkClaimReviewQueue().then(setPartnerPerkClaimReviewQueue).catch(() => setPartnerPerkClaimReviewQueue([]));
        getCampaignPerformanceSummary().then(setCampaignPerformanceSummary).catch(() => setCampaignPerformanceSummary({}));
      }
    });
    getFeatureSubmissions(user.uid).then(setFeatureSubmissions).catch(() => setFeatureSubmissions([]));
    getFeaturedSubmissions().then(setFeaturedSubmissions).catch(() => setFeaturedSubmissions([]));
    getPartnerPerkClaims(user.uid).then(setPartnerPerkClaims).catch(() => setPartnerPerkClaims([]));
    setTimeout(() => setVisible(true), 40);
  }, [user.uid]);

  const badgeXP    = calcBadgeXP(earnedBadges);
  const rank       = getTribeRank(badgeXP);
  // Count days that have at least one activity (handles both old single-entry and new activities-array format)
  const daysActive = Object.values(myHistory).filter(e =>
    e?.activities ? e.activities.length > 0 : !!e?.type
  ).length;
  const onb        = profile?.onboarding;

  const totalChallengePoints = challengePoints.reduce((s, c) => s + (c.totalPoints || 0), 0);
  const activityPoints = Object.values(myHistory).reduce((sum, entry) => sum + (entry?.totalPoints || 0), 0);
  const totalWinPoints = activityPoints + totalChallengePoints;
  const allActivities = Object.values(myHistory).flatMap(entry => entry?.activities || (entry?.type ? [entry] : []));
  const weeklyRecap = (() => {
    const keys = new Set();
    for (let i = 0; i < 7; i += 1) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      keys.add(d.toISOString().split('T')[0]);
    }
    const entries = Object.entries(myHistory).filter(([date]) => keys.has(date));
    const sessions = entries.reduce((sum, [, entry]) => sum + (entry?.activities?.length || (entry?.type ? 1 : 0)), 0);
    const points = entries.reduce((sum, [, entry]) => sum + (entry?.totalPoints || entry?.points || 0), 0);
    const activeDays = entries.filter(([, entry]) => entry?.activities?.length || entry?.type).length;
    return { activeDays, sessions, points };
  })();
  const monthlyRecap = (() => {
    const keys = new Set();
    for (let i = 0; i < 30; i += 1) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      keys.add(d.toISOString().split('T')[0]);
    }
    const entries = Object.entries(myHistory).filter(([date]) => keys.has(date));
    const sessions = entries.reduce((sum, [, entry]) => sum + (entry?.activities?.length || (entry?.type ? 1 : 0)), 0);
    const points = entries.reduce((sum, [, entry]) => sum + (entry?.totalPoints || entry?.points || 0), 0);
    const activeDays = entries.filter(([, entry]) => entry?.activities?.length || entry?.type).length;
    return { activeDays, sessions, points };
  })();
  const proAnalytics = (() => {
    const counts = allActivities.reduce((acc, activity) => {
      const key = activity.activityId || activity.type || 'activity';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    const bestType = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    const avgPoints = daysActive ? Math.round(totalWinPoints / daysActive) : 0;
    const consistency = Math.round((weeklyRecap.activeDays / 7) * 100);
    const report = weeklyRecap.activeDays >= 5
      ? 'Strong consistency week. Keep the streak protected.'
      : weeklyRecap.activeDays >= 3
        ? 'Solid base. Aim for five active days next week.'
        : 'Rebuild momentum with two simple logs this week.';
    return {
      consistency,
      avgPoints,
      bestType: bestType ? `${String(bestType[0]).replace(/_/g, ' ').toUpperCase()} · ${bestType[1]} session${bestType[1] === 1 ? '' : 's'}` : 'No activity yet',
      report,
    };
  })();
  const currentStreak = (() => {
    let streak = 0;
    const d = new Date();
    while (true) {
      const key = d.toISOString().split('T')[0];
      const entry = myHistory[key];
      const hasActivity = entry?.activities ? entry.activities.length > 0 : !!entry?.type;
      if (!hasActivity) break;
      streak += 1;
      d.setDate(d.getDate() - 1);
    }
    return streak;
  })();
  const instagramWeeklyPrompt = INSTAGRAM_WEEKLY_PROMPTS[new Date().getDay()];
  const weeklyReport = buildWeeklyReport({
    weeklyRecap,
    goals: {
      weeklyActiveDaysTarget: goalActiveDays,
      weeklyPointsTarget: goalPoints,
      streakTarget: goalStreak,
    },
    currentStreak,
    totalChallengePoints,
    bestType: proAnalytics.bestType,
  });
  const monthlyReport = buildMonthlyReport({
    monthlyRecap,
    goals: {
      weeklyActiveDaysTarget: goalActiveDays,
      weeklyPointsTarget: goalPoints,
      streakTarget: goalStreak,
    },
    currentStreak,
    totalChallengePoints,
    bestType: proAnalytics.bestType,
  });

  const rankedPct = rank.next
    ? Math.min(100, ((badgeXP - rank.min) / (rank.next.min - rank.min)) * 100)
    : 100;

  const memberYear = profile?.createdAt?.toDate?.()?.getFullYear?.() || new Date().getFullYear();
  const accountDeletionRequested = profile?.accountDeletionRequest?.status === 'requested';
  const avatarEmoji = profile?.avatarEmoji || rank.icon;
  const avatarColor = profile?.avatarColor || rank.color;
  const activeFrameId = selectedFrameId || profile?.cosmetics?.profileFrameId || 'none';
  const activeFrame = PROFILE_FRAMES.find(frame => frame.id === activeFrameId) || PROFILE_FRAMES[0];
  const frameGradient = activeFrame.id === 'none'
    ? `${avatarColor}55`
    : `linear-gradient(135deg, ${activeFrame.colors[0]}, ${activeFrame.colors[1]})`;
  const profileImageSrc = profile?.profileImageData ? `data:image/jpeg;base64,${profile.profileImageData}` : null;
  const referralJoins = profile?.stats?.referralJoins || 0;
  const referralState = referralTierState(referralJoins);
  const unlockedReferralRewardTier = [...REFERRAL_TIERS].reverse().find(tier => referralJoins >= tier.target) || null;
  const referralLaunchCopy = referralState.next
    ? `Rise With The Tribe referral push:\nI am ${referralState.remainingToNext} challenge join${referralState.remainingToNext === 1 ? '' : 's'} away from ${referralState.next.label}. Join a challenge with me, log your first session, and tag @risewiththetribe when you start.\n\nCurrent tribe momentum: ${totalWinPoints} pts · ${currentStreak}d streak · ${daysActive} days active.`
    : `Rise With The Tribe referral push:\nAll current referral tiers are unlocked, but the tribe still grows one invite at a time. Join a challenge with me, bring one accountability partner, and tag @risewiththetribe when you start.\n\nCurrent tribe momentum: ${totalWinPoints} pts · ${currentStreak}d streak · ${daysActive} days active.`;
  const referralStorySprintCopy = referralState.next
    ? `Rise With The Tribe Referral Story Sprint Kit:\n\nNext tier: ${referralState.next.label}\nReferral progress: ${referralJoins}/${referralState.next.target} challenge joins\nRemaining: ${referralState.remainingToNext}\nMomentum: ${totalWinPoints} pts · ${currentStreak}d streak · ${daysActive} days active\n\nStory sprint:\n[ ] Frame 1: \"I am ${referralState.remainingToNext} challenge join${referralState.remainingToNext === 1 ? '' : 's'} away from ${referralState.next.label}.\"\n[ ] Frame 2: show today's logged session, challenge card, or streak proof\n[ ] Frame 3: invite one accountability partner to join a challenge and log their first session\n[ ] Frame 4: tag @risewiththetribe and ask them to start today\n\nReel hook: \"Bring one person with you. The tribe gets stronger when we log together.\"\n\nThis is a manual referral story sprint only. Do not count link opens, grant rewards, write referral state, create payouts, create affiliate rewards, unlock entitlements, imply paid access is live, promise outcomes, or imply medical results.`
    : `Rise With The Tribe Referral Story Sprint Kit:\n\nAll current referral tiers are unlocked.\nReferral progress: ${referralJoins} challenge joins\nMomentum: ${totalWinPoints} pts · ${currentStreak}d streak · ${daysActive} days active\n\nStory sprint:\n[ ] Frame 1: celebrate the current referral ladder being complete\n[ ] Frame 2: show today's logged session, challenge card, or streak proof\n[ ] Frame 3: invite one accountability partner to join a challenge and log their first session\n[ ] Frame 4: tag @risewiththetribe and ask them to start today\n\nReel hook: \"Bring one person with you. The tribe gets stronger when we log together.\"\n\nThis is a manual referral story sprint only. Do not count link opens, grant rewards, write referral state, create payouts, create affiliate rewards, unlock entitlements, imply paid access is live, promise outcomes, or imply medical results.`;
  const referralRewardSocialProofCopy = unlockedReferralRewardTier
    ? `Rise With The Tribe Referral Reward Social Proof Kit:\n\nUnlocked tier: ${unlockedReferralRewardTier.label}\nReferral progress: ${referralJoins} attributed challenge joins\nRecognition angle: ${unlockedReferralRewardTier.reward}\nMomentum: ${totalWinPoints} pts · ${currentStreak}d streak · ${daysActive} days active\n\nStory caption:\nI unlocked ${unlockedReferralRewardTier.label} by bringing people into the challenge loop with me. If you need accountability, join a challenge, log your first session, and tag @risewiththetribe when you start.\n\nCarousel beats:\n[ ] Slide 1: referral tier unlocked\n[ ] Slide 2: show challenge/streak proof from the app\n[ ] Slide 3: thank the accountability partners who joined\n[ ] Slide 4: invite one new person into the next challenge\n\nThis is manual social proof copy only. Do not grant rewards, write referral state, create payouts, create affiliate rewards, unlock entitlements, imply paid access is live, promise outcomes, imply medical results, or claim fulfillment before admin review.`
    : `Rise With The Tribe Referral Reward Social Proof Kit:\n\nNo referral reward tier is unlocked yet.\nReferral progress: ${referralJoins} attributed challenge joins\nNext tier: ${referralState.next?.label || 'Referral tier'} at ${referralState.next?.target || 1} join${(referralState.next?.target || 1) === 1 ? '' : 's'}\nMomentum: ${totalWinPoints} pts · ${currentStreak}d streak · ${daysActive} days active\n\nStory caption:\nI am building consistency with Rise With The Tribe and inviting one accountability partner into the challenge loop. Join a challenge, log your first session, and tag @risewiththetribe when you start.\n\nCarousel beats:\n[ ] Slide 1: next referral tier target\n[ ] Slide 2: show challenge/streak proof from the app\n[ ] Slide 3: invite one accountability partner\n[ ] Slide 4: point them back to the next challenge\n\nThis is manual social proof copy only. Do not grant rewards, write referral state, create payouts, create affiliate rewards, unlock entitlements, imply paid access is live, promise outcomes, imply medical results, or claim fulfillment before admin review.`;
  const communityHighlightRoundupItems = featuredSubmissions.slice(0, 4);
  const communityHighlightRoundupCopy = communityHighlightRoundupItems.length > 0
    ? `Rise With The Tribe Community Highlight Roundup Kit:\n\nFeatured wins this week:\n${communityHighlightRoundupItems.map((sub, index) => {
      const handle = (sub.instagramHandle || '').replace(/^@+/, '');
      const label = FEATURE_CATEGORY_LABELS[sub.category] || sub.category || 'Tribe win';
      const name = sub.displayName || (handle ? `@${handle}` : 'Tribe member');
      return `${index + 1}. ${label} - ${name}: ${sub.story}`;
    }).join('\n')}\n\nRoundup caption:\nThese wins are why the tribe works: real members, real challenge proof, and consistency worth celebrating. Tag @risewiththetribe, celebrate the featured members, and invite one person into the next challenge.\n\nThis is a manual community highlight roundup only. Use featured submissions with consent only. Do not auto-post, schedule posts, scrape DMs, export per-user activity, share unreviewed submissions, imply paid access is live, promise outcomes, or imply medical results.`
    : `Rise With The Tribe Community Highlight Roundup Kit:\n\nNo featured submissions are ready yet.\n\nRoundup prep:\n[ ] Review pending Feature Me submissions\n[ ] Confirm consent before featuring any member story\n[ ] Pick up to four wins for the weekly roundup\n[ ] Copy repost captions only after submissions are marked featured\n\nThis is a manual community highlight roundup only. Use featured submissions with consent only. Do not auto-post, schedule posts, scrape DMs, export per-user activity, share unreviewed submissions, imply paid access is live, promise outcomes, or imply medical results.`;
  const ugcConsentReminderCopy = `Rise With The Tribe UGC Consent Reminder Kit:\n\nFeatured submissions ready: ${communityHighlightRoundupItems.length}\nPending review submissions: ${featureReviewQueue.length}\nThis week's campaign: ${weeklyCampaignPrompt.name} · ${weeklyCampaignPrompt.hashtag}\n\nBefore reposting:\n[ ] Confirm the submission is marked featured in the app review queue\n[ ] Confirm the member opted in through the Feature Me consent gate\n[ ] Use the submitted display name or Instagram handle only as provided\n[ ] Keep the repost caption truthful to the submitted story\n[ ] Avoid before/after, medical, weight-loss, or guaranteed outcome claims\n[ ] Remove any private details before copying the caption\n[ ] Credit @risewiththetribe and the member handle only when it was submitted\n\nThis is a manual UGC consent reminder only. Do not auto-post, schedule posts, scrape DMs, store inbound DMs, export private history, share unreviewed submissions, override consent, edit member claims into outcomes, imply paid access is live, promise outcomes, imply medical results, or pressure users.`;
  const partnerPerkStats = {
    activeDays: daysActive,
    challengeDays: challengePoints.reduce((sum, challenge) => sum + (challenge.daysCompleted || 0), 0),
    referralJoins,
  };
  const topPartnerPerk = PARTNER_PERKS
    .map(perk => ({ ...perk, demand: partnerPerkSummary[perk.id] || 0 }))
    .sort((a, b) => b.demand - a.demand)[0];
  const partnerDemandTotal = PARTNER_PERKS.reduce((sum, perk) => sum + (partnerPerkSummary[perk.id] || 0), 0);
  const applicationPartnerPerk = topPartnerPerk && (topPartnerPerk.demand || selectedPartnerPerkIds.includes(topPartnerPerk.id))
    ? topPartnerPerk
    : PARTNER_PERKS.find(perk => selectedPartnerPerkIds.includes(perk.id));
  const applicationPartnerSignalCount = Math.max(
    applicationPartnerPerk?.demand || 0,
    applicationPartnerPerk && selectedPartnerPerkIds.includes(applicationPartnerPerk.id) ? 1 : 0,
  );
  const partnerCampaignApplicationSignalTotal = Math.max(partnerDemandTotal, selectedPartnerPerkIds.length);
  const partnerPitchCopy = topPartnerPerk && partnerDemandTotal
    ? `Rise With The Tribe partner pitch: ${partnerDemandTotal} first-party member perk signals captured so far. Top demand is ${topPartnerPerk.label} with ${topPartnerPerk.demand} interested member${topPartnerPerk.demand === 1 ? '' : 's'}. We can attach aligned partner value to challenge campaigns without random ads or third-party tracking.`
    : 'Rise With The Tribe partner pitch: member perk demand is being collected from first-party profile interest. Keep growing challenge participation before pitching aligned partners.';
  const partnerActivationCopy = `Rise With The Tribe Partner Campaign Activation Kit:\n\nPilot theme: ${topPartnerPerk?.title || 'Aligned member perk'}\nTop demand: ${topPartnerPerk?.label || 'Gathering'} (${topPartnerPerk?.demand || 0})\nTotal first-party perk signals: ${partnerDemandTotal}\nCampaign member reach: ${campaignPerformanceSummary.memberReach || 0}\nReferral joins: ${referralJoins}\n\nPilot plan: attach one aligned sponsor value to a weekly or seasonal challenge, ask members to save perk interest, and review challenge joins plus feature submissions after the push.\n\nThis is a manual planning brief only. Do not add partner links, tracking pixels, ad targeting, purchases, entitlements, or paid-access claims until partner terms, privacy review, and store/entitlement QA are complete.`;
  const partnerTermsReadinessCopy = `Rise With The Tribe Partner Terms Readiness Kit:\n\nPilot theme: ${topPartnerPerk?.title || 'Aligned member perk'}\nTop demand: ${topPartnerPerk?.label || 'Gathering'} (${topPartnerPerk?.demand || 0})\nTotal first-party perk signals: ${partnerDemandTotal}\nCampaign member reach: ${campaignPerformanceSummary.memberReach || 0}\nReferral joins: ${referralJoins}\n\nTerms checklist:\n- Partner fit: aligned with fitness accountability, recovery, nutrition, gear, studio, or wearable value without medical or guaranteed outcome claims\n- Disclosure copy: sponsored challenge labels, perk status, and coming-soon language are clear before any member-facing promotion\n- Data boundaries: use aggregate first-party demand counts only; no per-user interest export, tracking pixels, ad targeting, or third-party data sharing\n- Destination review: partner links stay empty or inactive until destination safety, privacy, support, and store-policy review are complete\n- Reporting readiness: campaign results should use aggregate challenge joins, member reach, referral joins, and feature submissions only\n- Support handoff: define support ownership, refund boundaries, complaint handling, and data deletion/privacy escalation before launch\n\nThis is a partner terms readiness brief only. Do not add partner links, tracking pixels, ad targeting, affiliate payouts, commissions, revenue-share, purchases, entitlements, discounts, coupons, third-party data sharing, medical claims, guaranteed outcomes, or paid-access claims until partner terms, privacy review, support handoff, and store/entitlement QA are complete.`;
  const partnerContractReadinessCopy = `Rise With The Tribe Partner Contract Readiness Kit:\n\nPilot theme: ${topPartnerPerk?.title || 'Aligned member perk'}\nTop demand: ${topPartnerPerk?.label || 'Gathering'} (${topPartnerPerk?.demand || 0})\nTotal first-party perk signals: ${partnerDemandTotal}\nCampaign member reach: ${campaignPerformanceSummary.memberReach || 0}\nReferral joins: ${referralJoins}\n\nContract checklist:\n- Partner identity, offer owner, support owner, and escalation contact are known before any member-facing promise\n- Written terms define disclosure wording, fulfillment scope, complaint handling, refund boundaries, and data deletion/privacy escalation\n- Reporting uses aggregate first-party demand, challenge joins, member reach, referral joins, and feature submissions only\n- Destination, coupon, discount, affiliate, and partner-link behavior stays off until legal, privacy, store, and support review pass\n- No third-party data sharing, ad targeting, tracking pixels, commissions, payouts, discounts, coupons, purchases, or entitlement changes are created from this app surface\n\nThis is a partner contract readiness brief only. Do not create partner links, tracking pixels, ad targeting, affiliate payouts, commissions, revenue-share, purchases, entitlements, discounts, coupons, third-party data sharing, medical claims, guaranteed outcomes, paid-access claims, or fulfillment promises.`;
  const partnerPerkFulfillmentReadinessCopy = `Rise With The Tribe Partner Perk Fulfillment Readiness Kit:\n\nOpen perk claims: ${partnerPerkClaimReviewQueue.length}\nTop demand: ${topPartnerPerk?.label || 'Gathering'} (${topPartnerPerk?.demand || 0})\nCampaign member reach: ${campaignPerformanceSummary.memberReach || 0}\nReferral joins: ${referralJoins}\n\nManual readiness checks:\n[ ] Verify the claim was written from first-party eligibility progress only\n[ ] Confirm partner fit, disclosure wording, support owner, and privacy boundaries\n[ ] Confirm destination safety before any partner link exists\n[ ] Define complaint/refund/escalation ownership before fulfillment\n[ ] Review aggregate demand only; do not export per-user interest lists\n[ ] Keep StoreKit, Play Billing, and entitlement behavior unchanged\n\nThis is a manual partner perk fulfillment readiness kit only. Do not create coupons, partner links, payouts, discounts, purchases, entitlements, affiliate rewards, tracking pixels, ad targeting, third-party data exports, paid-access claims, outcome promises, medical implications, or fulfillment promises before partner terms, privacy review, destination review, and support handoff are complete.`;
  const partnerPerkDecisionReplyCopy = `Rise With The Tribe Partner Perk Admin Decision Reply Kit:\n\nOpen perk claims: ${partnerPerkClaimReviewQueue.length}\nTop demand: ${topPartnerPerk?.label || 'Gathering'} (${topPartnerPerk?.demand || 0})\nCampaign member reach: ${campaignPerformanceSummary.memberReach || 0}\nReferral joins: ${referralJoins}\n\nManual decision replies:\nAPPROVED FOR MANUAL FOLLOW-UP: Your partner perk request is eligible for manual follow-up. We are checking partner fit, disclosure wording, support ownership, privacy boundaries, and destination safety before anything is fulfilled.\n\nWAITING ON PARTNER TERMS: Your request is eligible, but the partner terms and support path are not ready yet. We will keep it in review until terms, privacy, destination safety, and support ownership are clear.\n\nNOT READY YET: Your request is still in review because the claim needs clearer first-party eligibility proof or fulfillment readiness. Keep logging honestly and watch your claim status in profile.\n\nDECLINED FOR NOW: We cannot move this request forward right now. This may be because partner fit, eligibility proof, support ownership, privacy, destination safety, or fulfillment readiness is not strong enough yet.\n\nThis is a manual partner perk decision reply kit only. Do not create coupons, partner links, payouts, discounts, purchases, entitlements, affiliate rewards, tracking pixels, ad targeting, third-party data exports, paid-access claims, outcome promises, medical implications, or fulfillment promises.`;
  const partnerCampaignObjectionReplyCopy = `Rise With The Tribe Partner Campaign Objection Reply Kit:\n\nPilot theme: ${topPartnerPerk?.title || 'Aligned member perk'}\nTop demand: ${topPartnerPerk?.label || 'Gathering'} (${topPartnerPerk?.demand || 0})\nTotal first-party perk signals: ${partnerDemandTotal}\nCampaign member reach: ${campaignPerformanceSummary.memberReach || 0}\nReferral joins: ${referralJoins}\n\nManual replies:\nQ: Are partner perks or sponsor campaigns live yet?\nA: Not yet. We are collecting first-party member demand and reviewing partner fit before any sponsor pilot goes live. Partner links, tracking, payouts, purchases, and entitlements stay off until terms, privacy, support, and store QA are complete.\n\nQ: What kind of partner would fit the tribe?\nA: A useful partner should support fitness accountability, recovery, nutrition, gear, studio access, or wearable value without medical claims, guaranteed outcomes, random ads, or third-party data sharing.\n\nQ: What should members do now?\nA: Save the perk interest that would actually help you stay consistent, join the weekly challenge, invite one accountability partner, and submit wins with consent so we can prove value before pitching sponsors.\n\nThis is a manual partner campaign objection reply kit only. Do not claim partner campaigns are live, add partner links, add tracking pixels, use ad targeting, collect payments, create purchases, create affiliate payouts, create commissions, start revenue-share, write entitlements, offer discounts, share third-party data, promise outcomes, imply medical results, scrape DMs, store inbound DMs, or pressure users.`;
  const topProTrialReason = PRO_TRIAL_REASONS
    .map(reason => ({ ...reason, demand: proTrialSummary[reason.id] || 0 }))
    .sort((a, b) => b.demand - a.demand)[0];
  const proTrialDemandTotal = PRO_TRIAL_REASONS.reduce((sum, reason) => sum + (proTrialSummary[reason.id] || 0), 0);
  const proTrialPitchCopy = topProTrialReason && proTrialDemandTotal
    ? `Rise With The Tribe Pro trial signal: ${proTrialDemandTotal} first-party Pro trial reasons captured so far. Top demand is ${topProTrialReason.label} with ${topProTrialReason.demand} interested member${topProTrialReason.demand === 1 ? '' : 's'}. Use this to prioritize store trial setup, onboarding copy, and launch messaging without granting entitlements early.`
    : 'Rise With The Tribe Pro trial signal: demand is being collected from first-party profile interest before store-backed trials go live.';
  const proTrialObjectionReplyCopy = `Rise With The Tribe Pro Trial Objection Reply Kit:\n\nDemand signals: ${proTrialDemandTotal} first-party Pro trial reasons captured\nTop interest: ${topProTrialReason?.label || 'gathering demand'}\nThis week's campaign: ${weeklyCampaignPrompt.name} · ${weeklyCampaignPrompt.hashtag}\n\nManual replies:\nQ: Is Pro live yet?\nA: Tribe Pro is being shaped from first-party interest inside the app. Save your Pro Trial Interest so we know whether reports, challenge packs, or creator tools should launch first.\n\nQ: Why would I try Pro?\nA: The free challenge loop is staying useful. Pro is being explored for deeper accountability: clearer reports, structured packs, private challenge tools, and creator support. Tell us which of those would actually help you stay consistent.\n\nQ: What should I do now?\nA: Join this week's challenge, log one honest session, and save your Pro Trial Interest in profile. We are validating value before switching on paid access.\n\nThis is a manual objection reply kit only. Do not claim a store-backed trial is live, quote unconfigured prices, collect payments, create purchases, grant Pro, write entitlements, offer discounts, promise founder pricing, imply guaranteed outcomes, imply medical results, scrape DMs, store inbound DMs, add tracking pixels, or pressure users.`;
  const creatorRevenueShareTotal = creatorRevenueShareSummary.revenueShareInterest || 0;
  const creatorRevenueSharePitchCopy = creatorRevenueShareTotal
    ? `Rise With The Tribe creator beta signal: ${creatorRevenueShareTotal} creator${creatorRevenueShareTotal === 1 ? '' : 's'} opted into future revenue-share. ${creatorRevenueShareSummary.enabled || 0} creator profiles are enabled and ${creatorRevenueShareSummary.branded || 0} have branding ready. Prioritize paid hosting policy, payout ops, and creator launch support before taking payments.`
    : 'Rise With The Tribe creator beta signal: creator revenue-share interest is being collected from first-party profile opt-ins before paid hosting or payout operations go live.';
  const monetizationSignalTotal = proTrialDemandTotal + creatorRevenueShareTotal + partnerDemandTotal;
  const monetizationLaunchCopy = monetizationSignalTotal
    ? `Rise With The Tribe launch board: ${monetizationSignalTotal} first-party monetization signals captured. Pro trial reasons: ${proTrialDemandTotal}. Creator beta opt-ins: ${creatorRevenueShareTotal}. Partner perk signals: ${partnerDemandTotal}. Next step is to validate store products, payout policy, and partner offer terms before activating paid access.`
    : 'Rise With The Tribe launch board: first-party monetization signals are being collected across Pro trials, creator beta, and partner perks before paid access goes live.';
  const storeSubscriptionCount = STORE_CATALOG.filter(product => product.kind === 'subscription').length;
  const storePackCount = STORE_CATALOG.filter(product => product.kind === 'challengePack').length;
  const storeReadinessCopy = `Rise With The Tribe store launch readiness: ${STORE_CATALOG.length} shared product IDs are in code (${storeSubscriptionCount} subscriptions, ${storePackCount} challenge packs). Before paid access goes live: create matching App Store/Play products, configure server receipt-validation credentials, run sandbox/test purchases, and confirm entitlement writes for Pro plus packs.`;
  const storeCredentialSetupCopy = `Rise With The Tribe Store Credential Setup Kit:\n\n${STORE_CREDENTIAL_SETUP_ITEMS.map((item, index) => `${index + 1}. ${item}`).join('\n')}\n\nDo not promote paid access as live until App Store and Play test purchases validate through the Firebase verifyPurchase callable and write the shared Firestore entitlement fields for Pro and challenge packs.`;
  const supportRefundReadinessCopy = `Rise With The Tribe Support and Refund Readiness Kit:\n\n${SUPPORT_REFUND_READINESS_ITEMS.map((item, index) => `${index + 1}. ${item}`).join('\n')}\n\nLaunch status: ${STORE_CATALOG.length} shared product IDs, ${storeSubscriptionCount} subscriptions, ${storePackCount} challenge packs, and ${monetizationSignalTotal} first-party monetization signals.\n\nUse this before paid access goes live so members know how to restore purchases, request marketplace refunds, recover missing entitlements, and contact support without confusion.\n\nThis is a support-readiness brief only. Do not process refunds in-app, override App Store or Play refund policy, write entitlements manually, promise outcomes, imply medical results, or promote paid access as live until support operations, receipt validation, store products, and release QA are complete.`;
  const subscriptionManagementGuidanceCopy = `Rise With The Tribe Subscription Management Guidance Kit:\n\n${SUBSCRIPTION_MANAGEMENT_GUIDANCE_ITEMS.map((item, index) => `${index + 1}. ${item}`).join('\n')}\n\nMember-facing guidance:\n- iOS: open Settings > Apple ID > Subscriptions, or App Store account subscriptions, then choose Rise With The Tribe if a subscription exists.\n- Android: open Google Play > Payments & subscriptions > Subscriptions, then choose Rise With The Tribe if a subscription exists.\n- Restore/sync in the app after any store account change so server-side verification can refresh entitlements.\n- Contact support with store account context, product ID, renewal/cancellation state, and restore result if access still looks wrong.\n\nThis is subscription-management guidance only. Do not cancel subscriptions in-app, process refunds, create purchases, write entitlements, bypass App Store or Play policy, collect payment details, promise outcomes, imply medical results, or claim paid access is live until store products, receipt validation, restore QA, and support operations are complete.`;
  const revenuePathways = [
    {
      id: 'pro',
      label: 'Tribe Pro',
      signal: proTrialDemandTotal + Math.min(3, campaignPerformanceSummary.memberReach || 0),
      action: 'Prioritize store trial setup, Pro report previews, and upgrade copy around deeper accountability.',
    },
    {
      id: 'packs',
      label: 'Paid Packs',
      signal: storePackCount + Math.min(3, campaignPerformanceSummary.premium || 0),
      action: 'Tease the next structured pack, validate store products, and keep free challenge participation warm.',
    },
    {
      id: 'creator',
      label: 'Creator Hosting',
      signal: creatorRevenueShareTotal + (creatorRevenueShareSummary.branded || 0),
      action: 'Prepare creator terms, hosted challenge support, and payout operations before paid hosting.',
    },
    {
      id: 'partner',
      label: 'Partner Campaign',
      signal: partnerDemandTotal + Math.min(3, referralJoins),
      action: 'Pilot one sponsor-backed challenge perk using first-party demand and campaign reach only.',
    },
  ];
  const recommendedRevenuePath = [...revenuePathways].sort((a, b) => {
    const aReady = a.signal > 0 ? 1 : 0;
    const bReady = b.signal > 0 ? 1 : 0;
    return bReady - aReady || b.signal - a.signal;
  })[0];
  const validationReadinessConfirmed = Boolean(validationReadinessMessage && !validationReadinessMessage.includes('Could not') && !validationReadinessMessage.includes('No entitlements were changed'));
  const storeTestEvidenceSummary = storeTestEvidenceLog.reduce((summary, item) => {
    const platform = item.platform === 'android' ? 'android' : 'ios';
    const result = ['passed', 'failed', 'needs_review'].includes(item.result) ? item.result : 'needs_review';
    summary.total += 1;
    summary[platform] += 1;
    summary[result] += 1;
    return summary;
  }, { total: 0, ios: 0, android: 0, passed: 0, needs_review: 0, failed: 0 });
  const storeTestEvidenceReady = storeTestEvidenceSummary.ios > 0 && storeTestEvidenceSummary.android > 0 && storeTestEvidenceSummary.failed === 0;
  const paidLaunchDecisionItems = [
    { label: 'Product IDs in code', ready: STORE_CATALOG.length > 0 },
    { label: 'First-party demand captured', ready: monetizationSignalTotal > 0 },
    { label: 'Support and refund handoff drafted', ready: true },
    { label: 'Receipt-validation credentials confirmed', ready: validationReadinessConfirmed },
    { label: 'Store test evidence recorded', ready: storeTestEvidenceReady },
    { label: 'Entitlement QA passed', ready: false },
  ];
  const paidLaunchReadyCount = paidLaunchDecisionItems.filter(item => item.ready).length;
  const paidLaunchDecisionStatus = paidLaunchDecisionItems.every(item => item.ready) ? 'READY TO LAUNCH' : 'HOLD FOR STORE TESTS';
  const paidLaunchDecisionCopy = `Rise With The Tribe Paid Launch Decision Gate:\n\nDecision: ${paidLaunchDecisionStatus}\nReady checks: ${paidLaunchReadyCount}/${paidLaunchDecisionItems.length}\nRecommended path: ${recommendedRevenuePath.label}\nFirst-party monetization signals: ${monetizationSignalTotal}\nStore test evidence: ${storeTestEvidenceSummary.total} records (${storeTestEvidenceSummary.ios} iOS, ${storeTestEvidenceSummary.android} Android, ${storeTestEvidenceSummary.needs_review} needs review, ${storeTestEvidenceSummary.failed} failed)\n\n${paidLaunchDecisionItems.map(item => `${item.ready ? '[x]' : '[ ]'} ${item.label}`).join('\n')}\n\nUse this gate before promoting paid access. Launch only after App Store and Play products exist, receipt-validation credentials are confirmed, sandbox purchases pass on iOS and Android, entitlement writes are verified, and support/refund handoff is ready.\n\nThis is a decision-support brief only. Do not flip paid access live, write entitlements, process payments, process refunds, bypass marketplace policy, promise outcomes, imply medical results, or announce launch readiness until all launch gate checks are complete.`;
  const billingSupportEscalationCopy = `Rise With The Tribe Billing Support Escalation Kit:\n\n${BILLING_SUPPORT_ESCALATION_ITEMS.map((item, index) => `${index + 1}. ${item}`).join('\n')}\n\nEscalation summary:\n- Products in scope: ${STORE_CATALOG.length} shared IDs (${storeSubscriptionCount} subscriptions, ${storePackCount} challenge packs)\n- Store test evidence: ${storeTestEvidenceSummary.total} records (${storeTestEvidenceSummary.ios} iOS, ${storeTestEvidenceSummary.android} Android, ${storeTestEvidenceSummary.failed} failed)\n- Entitlement recovery queue: ${entitlementRecoveryReviewQueue.length} open support case${entitlementRecoveryReviewQueue.length === 1 ? '' : 's'}\n- Validation readiness: ${validationReadinessConfirmed ? 'provider credentials detected' : 'credentials or sandbox/license-test proof still pending'}\n\nManual support handoff:\n[ ] Confirm the member is signed into the same Apple ID or Google Play account that made the purchase\n[ ] Ask the member to restore/sync purchases before entitlement recovery review\n[ ] Capture product ID, transaction/order reference if provided, platform, renewal/cancellation state, and restore result\n[ ] Check store validation response and entitlement recovery request before changing any backend state\n[ ] Route refund, cancellation, duplicate charge, chargeback, and payment-failure questions to marketplace support\n\nThis is a billing support escalation brief only. Do not cancel subscriptions in-app, process refunds, create purchases, write entitlements, override marketplace decisions, collect payment details, promise outcomes, imply medical results, or mark paid access live until store products, receipt validation, sandbox/license-test evidence, entitlement QA, and support operations are complete.`;
  const renewalRecoveryCopy = `Rise With The Tribe Renewal Recovery Kit:\n\n${RENEWAL_RECOVERY_ITEMS.map((item, index) => `${index + 1}. ${item}`).join('\n')}\n\nRecovery summary:\n- Active Pro: ${proActive ? 'yes' : 'no'}\n- Active packs: ${activeChallengePackCount}/${challengePackProducts.length}\n- Entitlement recovery queue: ${entitlementRecoveryReviewQueue.length} open support case${entitlementRecoveryReviewQueue.length === 1 ? '' : 's'}\n- Store test evidence: ${storeTestEvidenceSummary.total} records (${storeTestEvidenceSummary.failed} failed)\n- Validation readiness: ${validationReadinessConfirmed ? 'provider credentials detected' : 'credentials or sandbox/license-test proof still pending'}\n\nMember reply checklist:\n[ ] Confirm the store account that owns the original purchase\n[ ] Ask the member to check App Store or Google Play renewal/payment status\n[ ] Ask the member to restore/sync purchases in the app after marketplace renewal is fixed\n[ ] If access is still missing, open entitlement recovery and attach support notes before backend review\n[ ] Keep failed-renewal, grace-period, chargeback, refund, cancellation, and payment-method questions with marketplace support\n\nThis is a renewal recovery brief only. Do not retry charges in-app, collect payment details, cancel subscriptions, process refunds, create purchases, write entitlements, override marketplace renewal status, promise restored access, imply medical results, or mark paid access live until store products, receipt validation, restore QA, entitlement QA, and support operations are complete.`;
  const cancellationFeedbackCopy = `Rise With The Tribe Cancellation Feedback Kit:\n\n${CANCELLATION_FEEDBACK_ITEMS.map((item, index) => `${index + 1}. ${item}`).join('\n')}\n\nFeedback summary:\n- Recommended revenue path: ${recommendedRevenuePath.label}\n- First-party monetization signals: ${monetizationSignalTotal}\n- Pro trial interest: ${proTrialDemandTotal}\n- Pack products planned: ${challengePackProducts.length}\n- Support readiness: ${validationReadinessConfirmed ? 'credential readiness acknowledged' : 'store validation still pending'}\n\nMember-safe prompts:\n[ ] What were you hoping Tribe Pro or challenge packs would help with?\n[ ] What felt missing, confusing, too expensive, or not worth renewing?\n[ ] Which free challenge/accountability feature should stay easiest to use?\n[ ] Would reports, private challenges, structured packs, creator challenges, or partner perks make the value clearer later?\n[ ] Remind the member that cancellation, refunds, renewal status, and billing changes happen in App Store or Google Play subscriptions.\n\nThis is a cancellation feedback brief only. Do not block cancellation, retry charges in-app, collect payment details, offer unconfigured discounts, process refunds, create purchases, write entitlements, override marketplace subscription state, promise future pricing, imply medical results, pressure the member to stay, or mark paid access live until store products, receipt validation, entitlement QA, support operations, and approved offer policy are complete.`;
  const lapsedMemberWinbackCopy = `Rise With The Tribe Lapsed Member Winback Kit:\n\n${LAPSED_MEMBER_WINBACK_ITEMS.map((item, index) => `${index + 1}. ${item}`).join('\n')}\n\nWinback summary:\n- Weekly campaign: ${weeklyCampaignPrompt.name} (${weeklyCampaignPrompt.hashtag})\n- Comeback CTA: ${weeklyCampaignPrompt.cta}\n- Current streak: ${currentStreak} day${currentStreak === 1 ? '' : 's'}\n- Referral joins: ${referralJoins}\n- First-party monetization signals: ${monetizationSignalTotal}\n\nManual winback copy:\n[ ] Story angle: You can come back with one honest log. Join ${weeklyCampaignPrompt.name}, save the session, and use ${weeklyCampaignPrompt.hashtag} only if you choose to share it.\n[ ] DM/comment reply: No pressure to restart perfectly. Open Rise With The Tribe, log one small activity, and invite one accountability partner if that makes today easier.\n[ ] App-first next step: join the current challenge, log today, review streak rescue copy, then decide whether Pro, packs, creator challenges, or partner perks are actually useful.\n[ ] Review note: measure winback using first-party app logs, challenge joins, referrals, feature submissions, support notes, and saved interest only.\n\nThis is a manual lapsed-member winback brief only. Do not auto-message users, scrape DMs, store inbound replies, add tracking pixels, create attribution records, offer unconfigured discounts, retry charges, collect payment details, create purchases, write entitlements, imply paid access is live, promise outcomes, imply medical results, or pressure members to return.`;
  const sandboxPurchaseTestPlanCopy = `Rise With The Tribe Sandbox Purchase Test Plan:\n\nProducts under test:\n${STORE_CATALOG.map(product => `- ${product.id} (${product.kind})`).join('\n')}\n\nTest cases:\n${SANDBOX_PURCHASE_TEST_ITEMS.map((item, index) => `${index + 1}. ${item}`).join('\n')}\n\nBefore paid access is promoted: complete App Store sandbox purchases, Play license test purchases, restore flows, backend verifyPurchase validation, Firestore entitlement QA, and support escalation review.\n\nThis is a manual sandbox QA plan only. Do not run live charges, bypass marketplace policy, unlock entitlements from profile UI, write fake purchases, process refunds, promise outcomes, imply medical results, or claim paid access is live until real store test purchases validate end to end.`;
  const storeListingCopy = `Rise With The Tribe Store Listing Copy Kit:\n\nApp name: Rise With The Tribe\nSubtitle: Fitness challenges, streaks, and accountability\nShort description: Join weekly fitness challenges, log progress, build streaks, earn badges, and share wins with the tribe.\n\nValue points:\n- Track daily activity, points, streaks, and days active\n- Join weekly, seasonal, private, creator, and challenge-pack experiences\n- Share progress cards and challenge recaps with @risewiththetribe\n- Save first-party interest for future Tribe Pro, challenge packs, creator tools, and partner perks\n\nLaunch positioning: Lead with the free challenge loop, community accountability, progress proof, badges, calendar history, and social sharing. Mention Tribe Pro and challenge packs only as future or configured store-backed experiences until paid launch is approved.\n\nCurrent decision gate: ${paidLaunchDecisionStatus} (${paidLaunchReadyCount}/${paidLaunchDecisionItems.length} checks ready)\nRecommended revenue path: ${recommendedRevenuePath.label}\n\nThis is store-listing planning copy only. Do not claim paid access is live, advertise unconfigured prices, promise outcomes, imply medical results, mention refunds outside marketplace policy, unlock entitlements, or submit store copy that conflicts with App Store / Play policy until product setup, receipt validation, sandbox purchases, support readiness, and release QA are complete.`;
  const storeReviewSubmissionCopy = `Rise With The Tribe Store Review Submission Kit:\n\nReviewer notes draft:\nRise With The Tribe is a fitness challenge and accountability app. Users can create or join challenges, log activity, build streaks, earn badges, review calendar history, share progress, submit optional stories for manual community review, and save first-party interest in future Pro, challenge-pack, creator, and partner features.\n\nDemo account checklist:\n- Provide a test account with onboarding completed\n- Include at least one joined challenge, activity history, badges, and profile avatar/photo state\n- Keep paid access disabled unless App Store / Play products, receipt validation, sandbox purchases, restore flow, and entitlement QA are complete\n\nPermission explanations:\n- Photos/camera are used only when a user uploads a profile picture or optional feature-submission media\n- Notifications are used for reminders and challenge accountability prompts\n- HealthKit on iOS and Health Connect on Android are optional sync sources for workout/activity logging\n- In-app purchases are verified server-side before shared Firestore entitlements unlock Pro or challenge packs\n\nSupport and privacy notes: reviewers should be pointed to support, privacy policy, terms, and account/data deletion resources before submission.\n\nThis is store-review planning copy only. Do not submit inaccurate permission claims, provide personal user data in reviewer notes, bypass marketplace purchase review, claim medical or guaranteed fitness outcomes, unlock paid access from client code, or mark the app ready for review until store products, policies, support links, privacy/data deletion flows, and entitlement QA are verified.`;
  const storeReviewEvidencePackCopy = `Rise With The Tribe Store Review Evidence Pack:\n\nDecision gate: ${paidLaunchDecisionStatus} (${paidLaunchReadyCount}/${paidLaunchDecisionItems.length} checks ready)\nStore test evidence: ${storeTestEvidenceSummary.total} records (${storeTestEvidenceSummary.ios} iOS, ${storeTestEvidenceSummary.android} Android, ${storeTestEvidenceSummary.needs_review} needs review, ${storeTestEvidenceSummary.failed} failed)\nRecommended revenue path: ${recommendedRevenuePath.label}\nValidation readiness: ${validationReadinessConfirmed ? 'Credential readiness acknowledged' : 'Credential readiness still pending'}\n\nProducts under review:\n${STORE_CATALOG.map(product => `- ${product.id} (${product.kind})`).join('\n')}\n\nPolicy and support links:\n${POLICY_LINKS.map(link => `- ${link.label}: ${link.url}`).join('\n')}\n\nReviewer evidence notes: include demo account context, optional HealthKit / Health Connect explanations, media/photo permission explanations, notification purpose, restore flow status, sandbox/license-test evidence status, and support/privacy/data deletion links in the store submission notes.\n\nThis is a reviewer evidence pack only. Do not submit store review, expose personal user data, unlock paid access, write entitlements, create purchases, process refunds, bypass marketplace policy, mark paid access live, or claim review readiness until evidence, products, credentials, policies, support links, restore flow, and entitlement QA are verified.`;
  const dataSafetyDisclosureCopy = `Rise With The Tribe Data Safety Disclosure Kit:\n\nData categories used by the app:\n- Account identifiers: Firebase Authentication user id, email, and display name for sign-in and account support\n- Profile content: profile photo/avatar, Instagram handle, goals, creator profile, partner/pro interest, cosmetics, and share preferences\n- Fitness/activity data: user-entered activity logs, challenge progress, points, streaks, badges, and optional HealthKit / Health Connect imports after permission\n- User-generated content: optional feature-submission story and media, reviewed manually before any community highlight\n- Purchases: product ids, purchase verification payload metadata, server-side entitlement status, and audit-safe purchase records\n- Notifications: local reminder settings for accountability prompts\n\nDisclosure positioning: data is used for app functionality, account management, analytics derived from first-party app usage, optional health sync, purchase verification, support, and fraud/entitlement protection. The app does not sell personal data, does not use random ad tracking, does not provide medical diagnosis/treatment, and does not share feature submissions publicly without consent and manual review.\n\nStore links: Privacy Policy ${POLICY_LINKS[0].url}, Terms ${POLICY_LINKS[1].url}, Support ${POLICY_LINKS[2].url}, Data Deletion ${POLICY_LINKS[3].url}.\n\nThis is data-safety planning copy only. Do not submit store privacy labels that conflict with current permissions, hide optional health/media collection, imply medical or guaranteed fitness outcomes, claim third-party ad tracking exists, omit purchase verification data, or collect new data without updating privacy, data safety, feature parity docs, and release QA.`;
  const revenuePathwayPlannerCopy = `Rise With The Tribe Revenue Pathway Planner:\n\nRecommended path: ${recommendedRevenuePath.label}\nSignal: ${recommendedRevenuePath.signal}\nNext move: ${recommendedRevenuePath.action}\n\nPath signals:\n${revenuePathways.map(pathway => `- ${pathway.label}: ${pathway.signal}`).join('\n')}\n\nUse this as a manual planning brief from first-party app signals only. Do not add tracking pixels, paid-access claims, purchases, entitlements, partner links, or payout promises until store validation, partner terms, creator terms, and release QA are complete.`;
  const pricingTestProducts = STORE_CATALOG.map(product => ({
    ...product,
    label: product.kind === 'subscription'
      ? `Tribe Pro ${product.cadence || 'subscription'}`
      : (product.packId || product.id).replace(/_/g, ' '),
  }));
  const pricingTestKitCopy = `Rise With The Tribe Pricing Test Kit:\n\nRecommended path: ${recommendedRevenuePath.label}\nTest message: Would ${recommendedRevenuePath.label} help you stay more consistent if it added clearer accountability, deeper progress proof, and community momentum beyond the free app?\n\nProducts to configure before paid launch:\n${pricingTestProducts.map(product => `- ${product.label}: ${product.id}`).join('\n')}\n\nUse this to validate pricing language manually with your audience. Do not quote unconfigured prices, collect payments outside approved store flows, grant purchases, write entitlements, offer discounts, or claim paid access is live until App Store, Play Billing, receipt validation, and release QA are complete.`;
  const founderMemberOfferCopy = `Rise With The Tribe Founder Member Offer Kit:\n\nOffer angle: early tribe accountability access\nRecommended path: ${recommendedRevenuePath.label}\nFirst-party monetization signals: ${monetizationSignalTotal}\nCampaign member reach: ${campaignPerformanceSummary.memberReach || 0}\nReferral joins: ${referralJoins}\n\nInvite committed early members into the free challenge loop, ask them to save Pro Trial Interest, partner perk interest, or creator beta interest, and use their feedback to validate paid value before charging.\n\nThis is not a sale, coupon, lifetime deal, purchase, entitlement, discount, or paid-access promise. Do not collect payment or promise founder pricing until App Store, Play Billing, receipt validation, legal copy, and release QA are complete.`;
  const communityAmbassadorCopy = `Rise With The Tribe Community Ambassador Kit:\n\nAmbassador focus: invite one accountability partner, submit visible wins, and keep weekly challenge momentum alive.\nReferral joins: ${referralJoins}\nCampaign member reach: ${campaignPerformanceSummary.memberReach || 0}\nFounder offer path: ${recommendedRevenuePath.label}\nFirst-party monetization signals: ${monetizationSignalTotal}\n\nRecruit ambassadors from members who already refer friends, complete challenges, submit feature stories, or consistently share progress. Give them copy prompts, recognition, and challenge leadership moments inside the free community loop first.\n\nThis is a community-recognition brief only. Do not create commissions, payouts, paid roles, affiliate links, partner tracking, purchases, entitlements, discounts, or revenue-share promises until creator terms, payout operations, partner review, and release QA are complete.`;
  const customerValueChecklistCopy = `Rise With The Tribe Customer Value Delivery Checklist:\n\nRecommended path: ${recommendedRevenuePath.label}\nFree loop proof: ${daysActive} active days, ${referralJoins} referral joins, ${campaignPerformanceSummary.memberReach || 0} campaign member reach\nPaid value signal: ${monetizationSignalTotal} first-party monetization signals\nCommunity proof: weekly campaigns, public challenge wins, ambassador recognition, and shareable progress stories\nSupport proof: store readiness, credential setup, release QA, refund/support copy, and entitlement checks before launch\n\nUse this checklist before charging: the free challenge loop must create visible consistency, the paid offer must add measurable accountability or structure, and the user should feel the app saves more effort than it asks for.\n\nThis is a value-readiness brief only. Do not charge users, unlock paid access, promise outcomes, imply medical results, run discounts, write entitlements, or promote paid features as live until store products, support operations, receipt validation, and release QA are complete.`;
  const campaignPerformanceCopy = (campaignPerformanceSummary.total || 0)
    ? `Rise With The Tribe campaign board: ${campaignPerformanceSummary.total || 0} campaign-backed challenges are live in the system with ${campaignPerformanceSummary.memberReach || 0} total member joins. ${campaignPerformanceSummary.active || 0} are active, ${campaignPerformanceSummary.public || 0} are public, ${campaignPerformanceSummary.premium || 0} are premium, and ${campaignPerformanceSummary.seasonal || 0} are seasonal drops. Use this to decide the next weekly Instagram push and creator challenge prompt.`
    : 'Rise With The Tribe campaign board: campaign-backed challenges will appear here once weekly, seasonal, or creator campaigns are created.';
  const weeklyCampaignPrompt = getWeeklyCampaignPrompt();
  const campaignSchedulerCopy = `Rise With The Tribe weekly campaign scheduler: Week ${weeklyCampaignPrompt.week} is ${weeklyCampaignPrompt.name} (${weeklyCampaignPrompt.label}). ${weeklyCampaignPrompt.cta}\n\nUse ${weeklyCampaignPrompt.hashtag}, tag @risewiththetribe, and invite one accountability partner to join the ${weeklyCampaignPrompt.duration}-day challenge.`;
  const weeklyCampaignLaunchCardCopy = `Rise With The Tribe Weekly Campaign Launch Card Kit:\n\nCard headline: ${weeklyCampaignPrompt.name}\nCard label: Week ${weeklyCampaignPrompt.week} - ${weeklyCampaignPrompt.label}\nCard CTA: ${weeklyCampaignPrompt.cta}\nHashtag: ${weeklyCampaignPrompt.hashtag}\nDuration: ${weeklyCampaignPrompt.duration} days\n\nDesign notes: use a clear challenge-title lockup, one progress-forward CTA, @risewiththetribe, and the weekly hashtag. Keep the card readable on Instagram Stories and Reels covers.\n\nCaption draft:\nThis week's Rise With The Tribe prompt is ${weeklyCampaignPrompt.name}. ${weeklyCampaignPrompt.cta}\n\nUse ${weeklyCampaignPrompt.hashtag}, tag @risewiththetribe, and invite one accountability partner to join the ${weeklyCampaignPrompt.duration}-day challenge.\n\nThis is a manual campaign launch card brief only. Do not auto-post to Instagram, scrape DMs, add tracking pixels, imply paid access is live, promise outcomes, imply medical results, or share user activity without consent.`;
  const weeklyCampaignPreflightCopy = `Rise With The Tribe Weekly Campaign Preflight Checklist:\n\nCampaign: ${weeklyCampaignPrompt.name}\nWeek: ${weeklyCampaignPrompt.week} (${weeklyCampaignPrompt.label})\nHashtag: ${weeklyCampaignPrompt.hashtag}\nCampaign member reach: ${campaignPerformanceSummary.memberReach || 0}\nReferral joins: ${referralJoins}\nPending feature submissions: ${featureReviewQueue.length}\n\nPreflight checks:\n[ ] Launch card headline, caption draft, hashtag, and design notes are ready\n[ ] DM keyword replies for TRIBE, COMEBACK, PRO, and FEATURE are ready for manual use\n[ ] Seven-day content calendar is aligned to the weekly campaign prompt\n[ ] Invite/referral copy points members back into the app challenge loop\n[ ] Feature submissions and user activity are shared only with consent and manual review\n[ ] Post-launch review will use first-party challenge joins, referral movement, feature submissions, and share-card usage only\n\nThis is a manual weekly campaign preflight checklist only. Do not schedule posts, auto-post to Instagram, scrape DMs, store inbound DMs, add tracking pixels, export per-user activity, share user content without consent, imply paid access is live, promise outcomes, or imply medical results.`;
  const weeklyCampaignReviewCopy = `Rise With The Tribe Weekly Campaign Review Kit:\n\nCampaign: ${weeklyCampaignPrompt.name}\nWeek: ${weeklyCampaignPrompt.week} (${weeklyCampaignPrompt.label})\nHashtag: ${weeklyCampaignPrompt.hashtag}\nCampaign member reach: ${campaignPerformanceSummary.memberReach || 0}\nReferral joins: ${referralJoins}\nPending feature submissions: ${featureReviewQueue.length}\nShare-card usage: review in native share/activity surfaces only when first-party logs exist\n\nReview notes:\n[ ] Which post, story, or challenge invite drove the clearest app challenge joins?\n[ ] Which DM keyword reply needs clearer manual copy next week?\n[ ] Which feature submissions are consent-cleared for Instagram review?\n[ ] Which referral prompt should be repeated or retired?\n[ ] What should change in next week's launch card, content calendar, and challenge CTA?\n\nThis is a manual weekly campaign review brief only. Do not create attribution records, add tracking pixels, scrape or store Instagram DMs, export per-user activity, share user content without consent, imply paid access is live, promise outcomes, or imply medical results.`;
  const weeklyCampaignStoryboardCopy = `Rise With The Tribe Weekly Campaign Storyboard Kit:\n\nCampaign: ${weeklyCampaignPrompt.name}\nWeek: ${weeklyCampaignPrompt.week} (${weeklyCampaignPrompt.label})\nCTA: ${weeklyCampaignPrompt.cta}\nHashtag: ${weeklyCampaignPrompt.hashtag}\nDuration: ${weeklyCampaignPrompt.duration} days\n\nReel storyboard:\n1. Hook: \"Your next ${weeklyCampaignPrompt.duration}-day reset starts with one logged session.\"\n2. Proof beat: show app streak, points, challenge card, or consent-cleared member win.\n3. Action beat: ask followers to join the weekly challenge in the app and tag @risewiththetribe.\n4. CTA: use ${weeklyCampaignPrompt.hashtag} and invite one accountability partner.\n\nStory frames:\n[ ] Frame 1: campaign name and today's simple action\n[ ] Frame 2: poll or question sticker about showing up today\n[ ] Frame 3: app challenge invite and hashtag\n[ ] Frame 4: repost consent-cleared UGC or a founder accountability note\n\nCarousel outline:\nSlide 1: ${weeklyCampaignPrompt.name}\nSlide 2: why this challenge matters this week\nSlide 3: how to log the first session\nSlide 4: how to invite one accountability partner\nSlide 5: weekly hashtag and app CTA\n\nThis is a manual content storyboard only. Do not auto-post to Instagram, schedule posts from the app, scrape DMs, store inbound DMs, add tracking pixels, export per-user activity, share user content without consent, imply paid access is live, promise outcomes, or imply medical results.`;
  const launchExperiments = [
    {
      id: 'pro_trial',
      label: 'Pro Trial CTA',
      signal: proTrialDemandTotal,
      action: 'Post a Pro report preview and ask followers to save Pro Trial Interest in the app.',
    },
    {
      id: 'pack_drop',
      label: 'Pack Drop Tease',
      signal: storePackCount,
      action: 'Tease the next paid challenge pack, then route members to the free challenge loop until store tests pass.',
    },
    {
      id: 'referral_sprint',
      label: 'Referral Sprint',
      signal: referralJoins,
      action: 'Run a 48-hour invite push around the next referral tier and ask members to bring one accountability partner.',
    },
    {
      id: 'partner_perk',
      label: 'Partner Perk Poll',
      signal: partnerDemandTotal,
      action: 'Ask the audience which aligned perk would help them stay consistent, then capture interest inside profile perks.',
    },
  ];
  const recommendedLaunchExperiment = [...launchExperiments].sort((a, b) => {
    const aReady = a.signal > 0 ? 1 : 0;
    const bReady = b.signal > 0 ? 1 : 0;
    return bReady - aReady || b.signal - a.signal;
  })[0];
  const weeklyCampaignExperimentBriefCopy = `Rise With The Tribe Weekly Campaign Experiment Brief Kit:\n\nCampaign: ${weeklyCampaignPrompt.name}\nWeek: ${weeklyCampaignPrompt.week} (${weeklyCampaignPrompt.label})\nHashtag: ${weeklyCampaignPrompt.hashtag}\nRecommended experiment: ${recommendedLaunchExperiment.label}\nSignal: ${recommendedLaunchExperiment.signal}\nAction: ${recommendedLaunchExperiment.action}\n\nExperiment brief:\n[ ] Anchor the experiment to this week's campaign CTA: ${weeklyCampaignPrompt.cta}\n[ ] Use the launch card, storyboard, content calendar, and DM keyword kit as manual copy inputs\n[ ] Measure only first-party app movement: challenge joins, referral joins, feature submissions, share-card usage, and saved interest signals\n[ ] Review the result with the Weekly Campaign Review Kit before repeating or retiring the experiment\n\nThis is a manual weekly campaign experiment brief only. Do not create experiment records, schedule posts, auto-post to Instagram, add tracking pixels, scrape or store Instagram DMs, export per-user activity, share user content without consent, imply paid access is live, promise outcomes, or imply medical results.`;
  const launchExperimentCopy = `Rise With The Tribe Launch Experiment Kit:\n\nRecommended test: ${recommendedLaunchExperiment.label}\nSignal: ${recommendedLaunchExperiment.signal}\nAction: ${recommendedLaunchExperiment.action}\n\nThis is a manual Instagram/app experiment. Use first-party app signals only, do not add tracking pixels, and do not promote paid access as live until store validation and entitlement QA are complete.\n\nThis week's campaign hook: ${weeklyCampaignPrompt.name} - ${weeklyCampaignPrompt.cta} ${weeklyCampaignPrompt.hashtag}`;
  const experimentScorecard = {
    demandSignal: monetizationSignalTotal + referralJoins,
    campaignReach: campaignPerformanceSummary.memberReach || 0,
    communityLoop: referralJoins + (campaignPerformanceSummary.memberReach || 0),
    risk: 'LOW',
  };
  const experimentScore = Math.min(100, Math.round(
    Math.min(40, experimentScorecard.demandSignal * 8)
    + Math.min(35, experimentScorecard.campaignReach * 2)
    + Math.min(25, experimentScorecard.communityLoop * 3)
  ));
  const experimentScoreLabel = experimentScore >= 70 ? 'READY' : experimentScore >= 35 ? 'BUILD' : 'SEED';
  const launchExperimentScorecardCopy = `Rise With The Tribe Launch Experiment Scorecard:\n\nRecommended test: ${recommendedLaunchExperiment.label}\nScore: ${experimentScore}/100 (${experimentScoreLabel})\nDemand signal: ${experimentScorecard.demandSignal}\nCampaign reach: ${experimentScorecard.campaignReach}\nCommunity loop: ${experimentScorecard.communityLoop}\nRisk: ${experimentScorecard.risk}\n\nUse this as a manual planning score only. It uses first-party app signals, does not add tracking pixels, and does not grant or imply paid access.`;
  const launchQaChecklist = [
    ['PRODUCT IDS', `${STORE_CATALOG.length} shared IDs in code`, true],
    ['STORE TESTS', 'Sandbox and Play test purchases pending', false],
    ['ENTITLEMENTS', 'Verify Pro and pack Firestore writes', false],
    ['SOCIAL SHARE', 'Retest launch cards and copy flows', true],
  ];
  const launchQaChecklistCopy = `Rise With The Tribe Release QA Checklist:\n\n${launchQaChecklist.map(([label, status, ready]) => `${ready ? '[x]' : '[ ]'} ${label}: ${status}`).join('\n')}\n\nBefore a monetization or social launch: confirm store products, receipt-validation credentials, entitlement writes, feature parity docs, and native/web share flows across Web, iOS, and Android.`;
  const launchRetrospectiveCopy = `Rise With The Tribe Launch Retrospective Kit:\n\nExperiment reviewed: ${recommendedLaunchExperiment.label}\nPlanning score: ${experimentScore}/100 (${experimentScoreLabel})\nDemand signal: ${experimentScorecard.demandSignal}\nCampaign reach: ${experimentScorecard.campaignReach}\nReferral joins: ${referralJoins}\nCommunity loop: ${experimentScorecard.communityLoop}\n\nReview manually after the push: challenge joins, referral movement, feature submissions, share-card usage, and entitlement validation. This is a first-party review prompt only; it does not add tracking pixels, automated attribution, or paid-access changes.`;
  const dmKeywordReplies = {
    TRIBE: `DM keyword TRIBE reply:\nYou are in. This week's Rise With The Tribe prompt is ${weeklyCampaignPrompt.name}. ${weeklyCampaignPrompt.cta}\nStart in the app, tag @risewiththetribe, and use ${weeklyCampaignPrompt.hashtag}.`,
    COMEBACK: `DM keyword COMEBACK reply:\nNo shame, just the next log. Open Rise With The Tribe, pick one small session today, and rebuild from a visible win. Tag @risewiththetribe when you are back in motion.`,
    PRO: `DM keyword PRO reply:\nTribe Pro is being shaped around deeper reports, private challenges, premium packs, and creator tools. Save your Pro Trial Interest in the app so we know what to launch first.`,
    FEATURE: `DM keyword FEATURE reply:\nWant to be featured by @risewiththetribe? Submit your streak win, comeback, transformation, or challenge completion inside the app with consent and a clear story.`,
  };
  const dmKeywordCopy = DM_KEYWORD_PROMPTS.map(prompt => dmKeywordReplies[prompt.keyword]).join('\n\n');
  const weeklyCampaignCommentReplyCopy = `Rise With The Tribe Weekly Campaign Comment Reply Kit:\n\nCampaign: ${weeklyCampaignPrompt.name}\nWeek: ${weeklyCampaignPrompt.week} (${weeklyCampaignPrompt.label})\nHashtag: ${weeklyCampaignPrompt.hashtag}\nCTA: ${weeklyCampaignPrompt.cta}\nRecommended experiment: ${recommendedLaunchExperiment.label}\n\nManual public replies:\nQ: How do I join?\nA: Pick this week's Rise With The Tribe challenge in the app, log your first honest session, and use ${weeklyCampaignPrompt.hashtag} when you share your start.\n\nQ: I missed a day. Should I restart?\nA: Come back today. The goal is return speed, not perfect weeks. Log one session, rebuild the streak, and tag @risewiththetribe when you are back in motion.\n\nQ: Is Pro or a paid pack live?\nA: Not yet. We are validating value through the free challenge loop, Pro Trial Interest, and first-party campaign signals before paid access is promoted.\n\nQ: Can I be featured?\nA: Yes. Submit your win through Feature Me in the app with consent, a clear story, and an optional Instagram handle so it can be reviewed manually.\n\nThis is a manual public comment reply kit only. Do not auto-reply, scrape comments, scrape DMs, store inbound comments, store inbound DMs, add tracking pixels, create attribution records, export per-user activity, share user content without consent, imply paid access is live, promise outcomes, imply medical results, or pressure users.`;
  const weeklyCampaignCountdownStoryCopy = `Rise With The Tribe Weekly Campaign Countdown Story Kit:\n\nCampaign: ${weeklyCampaignPrompt.name}\nWeek: ${weeklyCampaignPrompt.week} (${weeklyCampaignPrompt.label})\nHashtag: ${weeklyCampaignPrompt.hashtag}\nCTA: ${weeklyCampaignPrompt.cta}\nRecommended experiment: ${recommendedLaunchExperiment.label}\n\nManual Story sequence:\nFrame 1: Countdown sticker - ${weeklyCampaignPrompt.name} starts soon.\nFrame 2: Why it matters - One honest session can restart momentum.\nFrame 3: Join CTA - Open Rise With The Tribe and join this week's challenge before the first log.\nFrame 4: Accountability prompt - Tag one person who should start with you.\nFrame 5: Start-day reminder - Log your first session in the app and use ${weeklyCampaignPrompt.hashtag} if you share.\n\nSticker text:\nCountdown: ${weeklyCampaignPrompt.name}\nQuestion: What would make you show up on day one?\nPoll: Starting with us? / Need a nudge\n\nReview note:\nUse visible Story engagement as directional content feedback only. Confirm launch momentum with first-party app joins, logs, referrals, Feature Me submissions, saved Pro interest, saved creator interest, or saved partner interest.\n\nThis is a manual countdown Story kit only. Do not auto-post, schedule Stories, scrape Story responses, scrape comments, scrape DMs, store Instagram identities, store inbound replies, create attribution records, add tracking pixels, export per-user activity, treat Story interactions as app consent, share private responses, imply paid access is live, promise outcomes, imply medical results, or pressure users.`;
  const weeklyCampaignStartDayStoryCopy = `Rise With The Tribe Weekly Campaign Start-Day Story Kit:\n\nCampaign: ${weeklyCampaignPrompt.name}\nWeek: ${weeklyCampaignPrompt.week} (${weeklyCampaignPrompt.label})\nHashtag: ${weeklyCampaignPrompt.hashtag}\nCTA: ${weeklyCampaignPrompt.cta}\nRecommended experiment: ${recommendedLaunchExperiment.label}\n\nManual Story sequence:\nFrame 1: It starts today - ${weeklyCampaignPrompt.name} is open inside Rise With The Tribe.\nFrame 2: First action - Pick one honest session and log it before the day ends.\nFrame 3: Accountability - Invite one person or tag @risewiththetribe if you share your start.\nFrame 4: Proof - Your streak, points, badges, referrals, and challenge progress move only when the app log is saved.\nFrame 5: Close - Join, log, and use ${weeklyCampaignPrompt.hashtag} when your first session is done.\n\nSticker text:\nPoll: Logged yet? / Starting soon\nQuestion: What are you logging first today?\nCTA sticker: Open Rise With The Tribe\n\nReview note:\nUse Story reactions as directional content feedback only. Confirm start-day momentum with first-party challenge joins, saved activity logs, referrals, Feature Me submissions, saved Pro interest, saved creator interest, or saved partner interest.\n\nThis is a manual start-day Story kit only. Do not auto-post, schedule Stories, scrape Story responses, scrape comments, scrape DMs, store Instagram identities, store inbound replies, create attribution records, add tracking pixels, export per-user activity, treat Story reactions as app consent, share private responses, imply paid access is live, promise outcomes, imply medical results, or pressure users.`;
  const weeklyCampaignMidweekCheckInStoryCopy = `Rise With The Tribe Weekly Campaign Midweek Check-In Story Kit:\n\nCampaign: ${weeklyCampaignPrompt.name}\nWeek: ${weeklyCampaignPrompt.week} (${weeklyCampaignPrompt.label})\nHashtag: ${weeklyCampaignPrompt.hashtag}\nCTA: ${weeklyCampaignPrompt.cta}\nRecommended experiment: ${recommendedLaunchExperiment.label}\n\nManual Story sequence:\nFrame 1: Midweek check-in - Are you still in ${weeklyCampaignPrompt.name}?\nFrame 2: Comeback lane - If you missed a day, log one honest session today.\nFrame 3: Momentum lane - If you are on track, invite one accountability partner before the weekend.\nFrame 4: App-first proof - Streaks, badges, referrals, and challenge progress move when the app log is saved.\nFrame 5: CTA - Open Rise With The Tribe, log today, and use ${weeklyCampaignPrompt.hashtag} if you share the comeback.\n\nSticker text:\nPoll: Still in? / Coming back today\nQuestion: What would make the next log easier?\nCTA sticker: Log today's session\n\nReview note:\nUse visible midweek reactions as directional content feedback only. Confirm re-engagement with first-party saved activity logs, challenge progress, referral joins, Feature Me submissions, saved Pro interest, saved creator interest, or saved partner interest.\n\nThis is a manual midweek check-in Story kit only. Do not auto-post, schedule Stories, scrape Story responses, scrape comments, scrape DMs, store Instagram identities, store inbound replies, create attribution records, add tracking pixels, export per-user activity, treat Story reactions as app consent, share private responses, imply paid access is live, promise outcomes, imply medical results, or pressure users.`;
  const weeklyCampaignWeekendPushStoryCopy = `Rise With The Tribe Weekly Campaign Weekend Push Story Kit:\n\nCampaign: ${weeklyCampaignPrompt.name}\nWeek: ${weeklyCampaignPrompt.week} (${weeklyCampaignPrompt.label})\nHashtag: ${weeklyCampaignPrompt.hashtag}\nCTA: ${weeklyCampaignPrompt.cta}\nRecommended experiment: ${recommendedLaunchExperiment.label}\n\nManual Story sequence:\nFrame 1: Weekend push - ${weeklyCampaignPrompt.name} is still open.\nFrame 2: Finish-line action - Log one session before the weekend gets away from you.\nFrame 3: Accountability - Invite one person who needs a reset before Monday.\nFrame 4: Community proof - Submit Feature Me only if you want your win reviewed with consent.\nFrame 5: CTA - Open Rise With The Tribe, save the log, and use ${weeklyCampaignPrompt.hashtag} if you share the finish.\n\nSticker text:\nPoll: Weekend log done? / Doing it today\nQuestion: What is your finish-line session?\nCTA sticker: Save the weekend log\n\nReview note:\nUse visible weekend reactions as directional content feedback only. Confirm finish-line momentum with first-party saved activity logs, challenge completion progress, referral joins, Feature Me submissions, saved Pro interest, saved creator interest, or saved partner interest.\n\nThis is a manual weekend push Story kit only. Do not auto-post, schedule Stories, scrape Story responses, scrape comments, scrape DMs, store Instagram identities, store inbound replies, create attribution records, add tracking pixels, export per-user activity, treat Story reactions as app consent, share private responses, imply paid access is live, promise outcomes, imply medical results, or pressure users.`;
  const weeklyCampaignCompletionRecapStoryCopy = `Rise With The Tribe Weekly Campaign Completion Recap Story Kit:\n\nCampaign reviewed: ${weeklyCampaignPrompt.name}\nWeek: ${weeklyCampaignPrompt.week} (${weeklyCampaignPrompt.label})\nHashtag: ${weeklyCampaignPrompt.hashtag}\nRecommended experiment: ${recommendedLaunchExperiment.label}\n\nManual Story sequence:\nFrame 1: Weekly recap - ${weeklyCampaignPrompt.name} helped the tribe choose one honest session at a time.\nFrame 2: Celebrate effort - Show aggregate wins only: logs saved, comeback stories submitted, referrals joined, or challenge progress improved.\nFrame 3: Feature Me CTA - Got a win? Submit Feature Me inside the app so consent and context are reviewed first.\nFrame 4: Next step - Invite one accountability partner into the next weekly challenge.\nFrame 5: Close - Open Rise With The Tribe, review your history, and use ${weeklyCampaignPrompt.hashtag} only if you choose to share.\n\nSticker text:\nPoll: Finished strong? / Coming back next week\nQuestion: What should next week's challenge help with?\nCTA sticker: Submit Feature Me in the app\n\nReview note:\nUse completion reactions as directional content feedback only. Confirm weekly recap lessons with first-party saved activity logs, challenge completions, referral joins, Feature Me submissions, saved Pro interest, saved creator interest, or saved partner interest.\n\nThis is a manual completion recap Story kit only. Do not auto-post, schedule Stories, scrape Story responses, scrape comments, scrape DMs, store Instagram identities, store inbound replies, create attribution records, add tracking pixels, export per-user activity, treat Story reactions as app consent, share private responses, share user wins without Feature Me consent, imply paid access is live, promise outcomes, imply medical results, or pressure users.`;
  const weeklyCampaignNextWeekTeaserStoryCopy = `Rise With The Tribe Weekly Campaign Next-Week Teaser Story Kit:\n\nCampaign closing: ${weeklyCampaignPrompt.name}\nCurrent week: ${weeklyCampaignPrompt.week} (${weeklyCampaignPrompt.label})\nHashtag: ${weeklyCampaignPrompt.hashtag}\nRecommended experiment: ${recommendedLaunchExperiment.label}\n\nManual Story sequence:\nFrame 1: Next week is coming - The next Rise With The Tribe challenge is being shaped now.\nFrame 2: Choose the lane - Ask the audience which consistency obstacle should become the next prompt.\nFrame 3: App-first CTA - Open Rise With The Tribe and join the current challenge or invite one accountability partner before the next one drops.\nFrame 4: Signal check - Use app joins, logs, referrals, Feature Me submissions, and saved interest to choose the next launch angle.\nFrame 5: Close - Watch for the next weekly challenge, and use ${weeklyCampaignPrompt.hashtag} only if you choose to share your current progress.\n\nSticker text:\nPoll: Next challenge? Comeback / Discipline\nQuestion: What should next week's challenge help you solve?\nCTA sticker: Join inside the app\n\nReview note:\nUse teaser reactions as directional content feedback only. Confirm next-week direction with first-party saved activity logs, challenge joins, referral joins, Feature Me submissions, saved Pro interest, saved creator interest, or saved partner interest.\n\nThis is a manual next-week teaser Story kit only. Do not auto-post, schedule Stories, scrape Story responses, scrape comments, scrape DMs, store Instagram identities, store inbound replies, create attribution records, add tracking pixels, export per-user activity, treat Story reactions as app consent, share private responses, imply paid access is live, promise outcomes, imply medical results, or pressure users.`;
  const weeklyCampaignPartnerPerkTeaserStoryCopy = `Rise With The Tribe Weekly Campaign Partner Perk Teaser Story Kit:\n\nCampaign context: ${weeklyCampaignPrompt.name}\nWeek: ${weeklyCampaignPrompt.week} (${weeklyCampaignPrompt.label})\nHashtag: ${weeklyCampaignPrompt.hashtag}\nRecommended experiment: Partner Perk Poll\n\nManual Story sequence:\nFrame 1: Partner perk check - What kind of aligned reward would help the tribe stay consistent?\nFrame 2: Perk lanes - Recovery, apparel, gym/studio, meal prep, wearable, or accountability support.\nFrame 3: App-first CTA - Save partner interest inside Rise With The Tribe so demand is reviewed first-party.\nFrame 4: Review boundary - Use only aggregate saved interest and app movement before contacting any partner.\nFrame 5: Close - Keep logging ${weeklyCampaignPrompt.name}; perks should support consistency, not distract from the challenge.\n\nSticker text:\nPoll: Partner perk? Recovery / Gear\nQuestion: What perk would genuinely help consistency?\nCTA sticker: Save partner interest in the app\n\nReview note:\nUse visible perk reactions as directional content feedback only. Confirm partner direction with first-party saved partner interest, saved activity logs, challenge joins, referrals, Feature Me submissions, saved Pro interest, or saved creator interest.\n\nThis is a manual partner perk teaser Story kit only. Do not auto-post, schedule Stories, scrape Story responses, scrape comments, scrape DMs, store Instagram identities, store inbound replies, create attribution records, create affiliate links, create partner payouts, contact partners as if demand is validated, add tracking pixels, export per-user activity, treat Story reactions as app consent, share private responses, imply paid access or perks are live, promise outcomes, imply medical results, or pressure users.`;
  const weeklyCampaignStoryPollCopy = `Rise With The Tribe Weekly Campaign Story Poll Kit:\n\nCampaign: ${weeklyCampaignPrompt.name}\nWeek: ${weeklyCampaignPrompt.week} (${weeklyCampaignPrompt.label})\nHashtag: ${weeklyCampaignPrompt.hashtag}\nRecommended experiment: ${recommendedLaunchExperiment.label}\nCTA: ${weeklyCampaignPrompt.cta}\n\nStory sticker prompts:\nPoll 1: Are you joining this week's challenge?\nOptions: I'm in / Need a comeback\n\nPoll 2: What would help you show up today?\nOptions: Accountability / Clear plan\n\nQuiz: What should we build next for the tribe?\nOptions: Pro reports / Challenge packs / Creator challenges / Partner perks\n\nQuestion sticker: What is one thing making consistency hard this week?\n\nFollow-up CTA:\nVote on the Story, then join the challenge inside Rise With The Tribe so your progress, referrals, badges, and feature submissions are tracked first-party in the app.\n\nThis is a manual Story poll kit only. Do not auto-post, scrape Story responses, scrape comments, scrape DMs, store inbound replies, add tracking pixels, create attribution records, export per-user activity, treat Instagram votes as app consent, imply paid access is live, promise outcomes, imply medical results, or pressure users.`;
  const weeklyCampaignPollReviewCopy = `Rise With The Tribe Weekly Campaign Poll Review Kit:\n\nCampaign: ${weeklyCampaignPrompt.name}\nWeek: ${weeklyCampaignPrompt.week} (${weeklyCampaignPrompt.label})\nHashtag: ${weeklyCampaignPrompt.hashtag}\nRecommended experiment: ${recommendedLaunchExperiment.label}\nFirst-party follow-up CTA: ${weeklyCampaignPrompt.cta}\n\nManual review prompts:\n[ ] What Story option got the strongest visible response?\n[ ] Did voters ask for accountability, a clearer plan, Pro reports, challenge packs, creator challenges, or partner perks?\n[ ] Which response should become the next Reel hook, carousel topic, or app challenge CTA?\n[ ] Which first-party app signal should confirm the reaction: challenge joins, referral joins, feature submissions, saved Pro interest, saved partner interest, or share-card usage?\n[ ] What should be posted next without exposing individual voters?\n\nDecision note:\nUse Instagram poll reactions as directional creator feedback only. Confirm product and monetization decisions with first-party app movement before changing paid copy, entitlements, products, partner offers, or roadmap priority.\n\nThis is a manual poll review kit only. Do not scrape Story responses, store Instagram voter identities, store inbound replies, create attribution records, add tracking pixels, export per-user activity, treat Instagram votes as app consent, share private responses, imply paid access is live, promise outcomes, imply medical results, or pressure users.`;
  const weeklyCampaignLiveQaCopy = `Rise With The Tribe Weekly Campaign Live Q&A Kit:\n\nCampaign: ${weeklyCampaignPrompt.name}\nWeek: ${weeklyCampaignPrompt.week} (${weeklyCampaignPrompt.label})\nHashtag: ${weeklyCampaignPrompt.hashtag}\nCTA: ${weeklyCampaignPrompt.cta}\nRecommended experiment: ${recommendedLaunchExperiment.label}\n\nLive setup:\n[ ] Open with one honest lesson from this week's challenge.\n[ ] Invite viewers to join the app challenge, log one session, and use ${weeklyCampaignPrompt.hashtag} if they share.\n[ ] Answer questions with app-first actions: join a challenge, log progress, invite one partner, submit Feature Me with consent, or save Pro/creator/partner interest.\n[ ] Turn repeated questions into the next Reel hook, carousel, Caption Bank angle, or Comment Reply Kit update.\n\nQuestion lanes:\nQ: How do I start?\nA: Pick this week's challenge in Rise With The Tribe and log one honest session today.\n\nQ: What if I missed days?\nA: Come back with the next log. The app rewards return speed, streak rebuilds, and visible consistency.\n\nQ: Are paid packs, Pro, or creator hosting live?\nA: Not yet. We are validating value through first-party app signals before paid access, creator hosting, or partner campaigns are promoted.\n\nClose:\nDrop your next session in the app, tag @risewiththetribe if you share it, and bring one accountability partner into ${weeklyCampaignPrompt.name}.\n\nThis is a manual Live Q&A kit only. Do not auto-host, record private replies, scrape comments, scrape DMs, store Instagram identities, store inbound replies, create attribution records, add tracking pixels, export per-user activity, treat Live questions as app consent, share private responses, imply paid access is live, promise outcomes, imply medical results, or pressure users.`;
  const weeklyCampaignLiveRecapCopy = `Rise With The Tribe Weekly Campaign Live Recap Kit:\n\nCampaign reviewed: ${weeklyCampaignPrompt.name}\nWeek: ${weeklyCampaignPrompt.week} (${weeklyCampaignPrompt.label})\nHashtag: ${weeklyCampaignPrompt.hashtag}\nRecommended experiment: ${recommendedLaunchExperiment.label}\n\nManual recap prompts:\n[ ] What question came up more than once?\n[ ] Which app-first action answered it best: join a challenge, log one session, invite a partner, submit Feature Me with consent, save Pro interest, save creator interest, or save partner interest?\n[ ] Which first-party signal should confirm momentum after the Live: challenge joins, referral joins, feature submissions, saved interest, or share-card usage?\n[ ] What should become the next Reel hook, carousel slide, Story poll, Caption Bank angle, or Comment Reply Kit update?\n[ ] What should not be repeated because it implied paid access, medical outcomes, pressure, or private-user detail?\n\nPublic recap copy:\nTonight's Live came back to one simple idea: consistency gets easier when the next action is visible. Join ${weeklyCampaignPrompt.name}, log one honest session in Rise With The Tribe, and use ${weeklyCampaignPrompt.hashtag} if you share your start.\n\nDecision note:\nUse the Live as directional content feedback only. Confirm product, creator, partner, and paid-feature decisions with first-party app movement before changing roadmap priority or launch copy.\n\nThis is a manual Live recap kit only. Do not auto-post, record private replies, scrape comments, scrape DMs, store Instagram identities, store inbound replies, create attribution records, add tracking pixels, export per-user activity, treat Live questions as app consent, share private responses, imply paid access is live, promise outcomes, imply medical results, or pressure users.`;
  const weeklyCampaignFaqCarouselCopy = `Rise With The Tribe Weekly Campaign FAQ Carousel Kit:\n\nCampaign: ${weeklyCampaignPrompt.name}\nWeek: ${weeklyCampaignPrompt.week} (${weeklyCampaignPrompt.label})\nHashtag: ${weeklyCampaignPrompt.hashtag}\nCTA: ${weeklyCampaignPrompt.cta}\n\nCarousel outline:\nSlide 1: ${weeklyCampaignPrompt.name} - the simple way to start\nSlide 2: Q: How do I join? A: Open Rise With The Tribe, pick this week's challenge, and log one honest session.\nSlide 3: Q: What if I missed days? A: Come back with today's log. Return speed matters more than a perfect streak.\nSlide 4: Q: Can I bring someone? A: Yes. Invite one accountability partner and make the start visible together.\nSlide 5: Q: Can I be featured? A: Submit Feature Me in the app with consent and a clear story.\nSlide 6: Q: Are Pro, paid packs, or creator hosting live? A: Not yet. Save interest in the app while paid features stay behind validation.\nSlide 7: CTA: Join ${weeklyCampaignPrompt.name}, log your first session, and use ${weeklyCampaignPrompt.hashtag} if you share.\n\nCaption:\nThe same questions keep coming up, so here is the simple start. Swipe, pick one action, and put your first log into Rise With The Tribe today.\n\nReview note:\nUse repeated questions as directional content input only. Confirm roadmap, paid-feature, creator, and partner decisions with first-party app movement before changing launch copy.\n\nThis is a manual FAQ carousel kit only. Do not auto-post, schedule posts, scrape comments, scrape DMs, store Instagram identities, store inbound replies, create attribution records, add tracking pixels, export per-user activity, treat Instagram questions as app consent, share private responses, imply paid access is live, promise outcomes, imply medical results, or pressure users.`;
  const weeklyCampaignCaptionBankCopy = `Rise With The Tribe Weekly Campaign Caption Bank Kit:\n\nCampaign: ${weeklyCampaignPrompt.name}\nWeek: ${weeklyCampaignPrompt.week} (${weeklyCampaignPrompt.label})\nHashtag: ${weeklyCampaignPrompt.hashtag}\nRecommended experiment: ${recommendedLaunchExperiment.label}\nCTA: ${weeklyCampaignPrompt.cta}\n\nReel caption:\nYour next reset does not need a perfect week. It needs one honest log today. Join ${weeklyCampaignPrompt.name} inside Rise With The Tribe, tag @risewiththetribe, and use ${weeklyCampaignPrompt.hashtag} when you start.\n\nCarousel caption:\nConsistency gets easier when the next action is visible. Swipe through the prompt, pick today's session, and log it in the app so your streak, points, referrals, and badges move with you.\n\nStory caption:\nVote, then move. Join this week's challenge in the app and bring one accountability partner with you.\n\nPinned comment:\nJoining? Open Rise With The Tribe, start ${weeklyCampaignPrompt.name}, log your first session, and use ${weeklyCampaignPrompt.hashtag} so we can cheer you on.\n\nCreator note:\nUse the Story Poll Kit and Poll Review Kit to choose the angle, then confirm momentum through first-party app movement before repeating the caption.\n\nThis is a manual caption bank only. Do not auto-post, schedule posts, scrape comments, scrape DMs, store inbound replies, create attribution records, add tracking pixels, export per-user activity, share private responses, imply paid access is live, promise outcomes, imply medical results, or pressure users.`;
  const weeklyCampaignCollabInviteCopy = `Rise With The Tribe Weekly Campaign Collab Invite Kit:\n\nCampaign: ${weeklyCampaignPrompt.name}\nWeek: ${weeklyCampaignPrompt.week} (${weeklyCampaignPrompt.label})\nHashtag: ${weeklyCampaignPrompt.hashtag}\nRecommended experiment: ${recommendedLaunchExperiment.label}\nCTA: ${weeklyCampaignPrompt.cta}\n\nManual creator invite:\nHey, I am running this week's Rise With The Tribe challenge: ${weeklyCampaignPrompt.name}. The ask is simple: join in the app, log one honest session, and invite your audience to start with ${weeklyCampaignPrompt.hashtag}. Would you be open to a no-pressure collab post or Story mention this week?\n\nCollab post angle:\nTwo communities, one simple challenge: log the session, bring one accountability partner, and make consistency visible.\n\nStory mention angle:\nI am joining ${weeklyCampaignPrompt.name} with @risewiththetribe. Vote, start, and log your first session in the app.\n\nFollow-up note:\nIf they are interested in deeper creator hosting, route them to Creator / Coach Mode and the creator review flow in the app before discussing paid hosting, revenue-share, or branded challenges.\n\nThis is a manual collab invite kit only. Do not auto-message, scrape DMs, store inbound replies, create contracts, create payouts, promise revenue-share, create affiliate links, add tracking pixels, export per-user activity, share private responses, imply paid access is live, promise outcomes, imply medical results, or pressure creators.`;
  const weeklyCampaignCollabFollowUpCopy = `Rise With The Tribe Weekly Campaign Collab Follow-Up Kit:\n\nCampaign: ${weeklyCampaignPrompt.name}\nWeek: ${weeklyCampaignPrompt.week} (${weeklyCampaignPrompt.label})\nHashtag: ${weeklyCampaignPrompt.hashtag}\nRecommended experiment: ${recommendedLaunchExperiment.label}\nCreator path: Creator / Coach Mode review before paid hosting\n\nIf they say yes:\nAmazing. Let us keep it simple for this week: join ${weeklyCampaignPrompt.name}, post the challenge prompt in your own voice, and invite people to log their first session in Rise With The Tribe with ${weeklyCampaignPrompt.hashtag}. After the post, we will review only first-party app movement like challenge joins, referrals, feature submissions, and saved creator interest.\n\nIf they ask what to post:\nUse the Caption Bank Kit for the Reel, Story, carousel, or pinned comment, then add your own accountability angle.\n\nIf they ask about paid hosting:\nPaid creator hosting is not live yet. Please enable Creator / Coach Mode and submit for review in the app so we can evaluate fit, moderation, support, payout readiness, and marketplace alignment before any paid terms are discussed.\n\nIf they are not ready:\nNo pressure. You can still join the weekly challenge as a member, log a session, and revisit creator hosting later.\n\nThis is a manual collab follow-up kit only. Do not auto-message, scrape DMs, store inbound replies, create contracts, create payouts, promise revenue-share, create affiliate links, add tracking pixels, export per-user activity, share private responses, imply paid access is live, promise outcomes, imply medical results, or pressure creators.`;
  const weeklyCampaignCollabSafetyCopy = `Rise With The Tribe Weekly Campaign Collab Safety Checklist:\n\nCampaign: ${weeklyCampaignPrompt.name}\nWeek: ${weeklyCampaignPrompt.week} (${weeklyCampaignPrompt.label})\nHashtag: ${weeklyCampaignPrompt.hashtag}\nCreator path: Creator / Coach Mode review before paid hosting\n\nBefore posting:\n[ ] Creator understands this is a no-pressure community collab, not paid hosting.\n[ ] Creator can use their own voice and does not need to share private member data.\n[ ] Creator agrees to point people into the app challenge loop for first-party consent and tracking.\n[ ] Creator knows featured member stories require Feature Me consent before reposting.\n[ ] Creator will avoid medical, transformation, guaranteed outcome, or shame-based claims.\n\nIf deeper hosting comes up:\n[ ] Ask them to enable Creator / Coach Mode.\n[ ] Review fit, moderation readiness, audience safety, payout readiness, and marketplace alignment before any paid terms.\n[ ] Keep private replies, screenshots, Story voters, and member activity out of shared collab notes.\n\nThis is a manual collab safety checklist only. Do not auto-message, scrape DMs, store inbound replies, create contracts, create payouts, promise revenue-share, create affiliate links, add tracking pixels, export per-user activity, share private responses, imply paid access is live, promise outcomes, imply medical results, or pressure creators.`;
  const weeklyCampaignCollabRecapCopy = `Rise With The Tribe Weekly Campaign Collab Recap Kit:\n\nCampaign: ${weeklyCampaignPrompt.name}\nWeek: ${weeklyCampaignPrompt.week} (${weeklyCampaignPrompt.label})\nHashtag: ${weeklyCampaignPrompt.hashtag}\nRecommended experiment: ${recommendedLaunchExperiment.label}\n\nManual recap prompts:\n[ ] What did the creator post or mention?\n[ ] Which app signal moved after the post: challenge joins, referral joins, feature submissions, saved Pro interest, saved creator interest, or share-card usage?\n[ ] What lesson should become the next Story, Reel hook, carousel, or challenge CTA?\n[ ] Did any audience questions need the Comment Reply Kit, DM Keyword Kit, or Creator / Coach Mode review?\n[ ] Should this creator be invited to another no-pressure collab, or paused until fit is clearer?\n\nPublic thank-you copy:\nThank you for joining ${weeklyCampaignPrompt.name} with the tribe. The win is simple: more people chose one honest session and made consistency visible with ${weeklyCampaignPrompt.hashtag}.\n\nDecision note:\nUse only first-party app movement and consent-cleared submissions to decide the next step. Instagram reactions can guide content ideas, but they should not become attribution, payment, or private user records.\n\nThis is a manual collab recap kit only. Do not scrape posts, scrape comments, scrape DMs, store Instagram identities, store inbound replies, create attribution records, create contracts, create payouts, promise revenue-share, create affiliate links, add tracking pixels, export per-user activity, share private responses, imply paid access is live, promise outcomes, imply medical results, or pressure creators.`;
  const weeklyCampaignCollabRenewalCopy = `Rise With The Tribe Weekly Campaign Collab Renewal Kit:\n\nCampaign reviewed: ${weeklyCampaignPrompt.name}\nHashtag: ${weeklyCampaignPrompt.hashtag}\nRecommended experiment: ${recommendedLaunchExperiment.label}\nCreator path: Creator / Coach Mode review before paid hosting\n\nRepeat this collab if:\n[ ] First-party app movement improved after the post.\n[ ] The creator used pressure-safe language and respected consent boundaries.\n[ ] Audience questions can be answered with existing Comment Reply, DM Keyword, Feature Me, or challenge flows.\n[ ] The next weekly prompt has a clear audience fit.\n\nPause this collab if:\n[ ] The creator needs paid terms before the creator review path exists.\n[ ] The post created medical, transformation, shame-based, or guaranteed outcome claims.\n[ ] The audience asks require support, moderation, or data sharing we cannot safely provide yet.\n\nManual renewal reply:\nThank you for helping people start ${weeklyCampaignPrompt.name}. We are keeping the next step simple: if the next weekly prompt fits your audience, we can do another no-pressure collab. If you want deeper hosting later, please use Creator / Coach Mode so we can review fit, moderation readiness, support needs, and payout readiness before paid terms.\n\nThis is a manual collab renewal kit only. Do not auto-message, scrape posts, scrape comments, scrape DMs, store Instagram identities, store inbound replies, create attribution records, create contracts, create payouts, promise revenue-share, create affiliate links, add tracking pixels, export per-user activity, share private responses, imply paid access is live, promise outcomes, imply medical results, or pressure creators.`;
  const proActive = hasActivePro(profile);
  const proSource = profile?.entitlements?.pro?.source || 'not configured';
  const proValueFocus = (() => {
    if (creatorAnalytics.hosted > 0) return 'Creator launch + hosted analytics';
    if (weeklyReport.weeklyScore < 60) return 'Custom goals + weekly report';
    if (currentStreak >= 5) return 'Streak recovery + premium badges';
    if (totalChallengePoints > 0) return 'Private challenges + pack recaps';
    return 'Premium analytics + share templates';
  })();
  const proValueNextAction = proActive
    ? 'Use your Pro report, custom goals, and launch tools to keep the next week intentional.'
    : `Best fit: ${proValueFocus}. Upgrade when you want deeper accountability beyond the free habit loop.`;
  const valueProofStoryCopy = `Rise With The Tribe Value Proof Story Kit:\n\nVisible proof: ${totalWinPoints} pts · ${currentStreak}d streak · ${daysActive} days active\nWeekly report: ${weeklyReport.weeklyScore}% (${weeklyReport.status})\nMonthly report: ${monthlyRecap.score}% (${monthlyRecap.status})\nChallenge points: ${totalChallengePoints}\nThis week's campaign: ${weeklyCampaignPrompt.name} · ${weeklyCampaignPrompt.hashtag}\nValue focus: ${proValueFocus}\n\nStory caption:\nThe app is helping me keep the promise visible: log the session, protect the streak, review the week, and come back faster when life gets messy. If you want accountability, join this week's Rise With The Tribe challenge and tag @risewiththetribe when you start.\n\nFrame plan:\n[ ] Frame 1: show points, streak, or weekly score from the app\n[ ] Frame 2: share one honest lesson from this week\n[ ] Frame 3: invite one accountability partner into the weekly challenge\n[ ] Frame 4: point people back to the app and ${weeklyCampaignPrompt.hashtag}\n\nThis is manual value proof copy only. Do not auto-post, scrape DMs, add tracking pixels, export private history, create purchases, grant Pro, write entitlements, imply paid access is live, promise outcomes, imply medical results, or pressure users.`;
  const storyPostingChecklistCopy = `Rise With The Tribe Story Posting Checklist Kit:\n\nCampaign: ${weeklyCampaignPrompt.name} · ${weeklyCampaignPrompt.hashtag}\nProof asset: ${totalWinPoints} pts · ${currentStreak}d streak · ${weeklyReport.weeklyScore}% weekly score\nComeback angle: ${currentStreak > 0 ? 'active streak proof' : 'honest restart prompt'}\nReferral progress: ${referralJoins} challenge join${referralJoins === 1 ? '' : 's'}\nFeatured submissions ready: ${communityHighlightRoundupItems.length}\n\nPosting checklist:\n[ ] Start with the weekly campaign CTA: ${weeklyCampaignPrompt.cta}\n[ ] Add one app proof frame from the Value Proof Story Kit\n[ ] Add one comeback or accountability prompt if the week needs a restart\n[ ] Repost only consent-cleared featured submissions\n[ ] End with one clear app action: join the challenge, log a session, or invite an accountability partner\n[ ] Review comments/DMs manually and use approved keyword replies only\n\nThis is a manual Story posting checklist only. Do not auto-post, schedule posts, scrape DMs, store inbound DMs, add tracking pixels, export private history, share unreviewed submissions, create challenge joins, write referral state, imply paid access is live, promise outcomes, imply medical results, or pressure users.`;
  const instagramPromptCopy = `${instagramWeeklyPrompt.hook}\n\nToday inside Rise With The Tribe: ${totalWinPoints} pts · ${currentStreak}d streak · ${daysActive} days active.\n\nTag @risewiththetribe and use the app to keep the promise visible.`;
  const instagramContentCalendarCopy = `Rise With The Tribe Instagram Content Calendar:\n\n${INSTAGRAM_WEEKLY_PROMPTS.map((prompt, index) => `${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][index]} · ${prompt.label}\n${prompt.title}: ${prompt.hook}`).join('\n\n')}\n\nUse the weekly campaign, tag @risewiththetribe, and invite the audience back into the app challenge loop.`;
  const isPackUnlocked = product => proActive || hasActiveChallengePack(profile, product.packId);
  const challengePackTitle = product => ({
    '21_day_reset': '21-Day Reset Pack',
    summer_shred: '28-Day Summer Shred',
  }[product.packId] || product.packId || product.id);
  const subscriptionProducts = STORE_CATALOG.filter(product => product.kind === 'subscription');
  const challengePackProducts = STORE_CATALOG.filter(product => product.kind === 'challengePack');
  const activeChallengePackCount = challengePackProducts.filter(isPackUnlocked).length;
  const storeTestEvidenceCases = STORE_TEST_EVIDENCE_CASES.map(test => {
    const product = test.productKind === 'subscription' ? subscriptionProducts[0] : challengePackProducts[0];
    return { ...test, productId: product?.id || '' };
  });
  const challengePackLaunchCopy = `Rise With The Tribe Challenge Pack Launch Kit:\n\n${challengePackProducts.map(product => `${challengePackTitle(product)}\nProduct ID: ${product.id}\nLaunch angle: structured accountability, daily prompts, and a finishable challenge outcome.`).join('\n\n')}\n\nStore credentials and test purchases must be completed before paid access is promoted as live. Until then, use this copy to tease demand, explain the pack value, and send members to the free challenge loop or Pro Trial Interest capture.`;
  const challengePackObjectionReplyCopy = `Rise With The Tribe Challenge Pack Objection Reply Kit:\n\nPack signals: ${challengePackProducts.length} planned challenge pack product IDs\nUnlocked packs on this account: ${activeChallengePackCount}/${challengePackProducts.length}\nCurrent launch gate: ${paidLaunchDecisionStatus}\nRecommended revenue path: ${recommendedRevenuePath.label}\n\nManual replies:\nQ: Are challenge packs live yet?\nA: Challenge packs are being prepared, but store credentials, receipt validation, and test purchases need to pass before paid pack access is promoted as live. For now, join the free challenge loop and save Pro Trial Interest so we know which packs deserve priority.\n\nQ: What makes a pack different from a normal challenge?\nA: Packs are designed as structured accountability programs with a clear outcome, daily prompts, and a finishable plan. The free challenges stay useful; packs are for members who want a tighter guided run.\n\nQ: Can I buy the 21-Day Reset or Summer Shred now?\nA: Not yet. The shared product IDs are ready in code, but we will only launch once App Store/Play setup, receipt validation, restore flow, support readiness, and entitlement QA are complete.\n\nThis is a manual challenge pack objection reply kit only. Do not claim challenge packs are live, quote unconfigured prices, collect payments, create purchases, unlock packs, grant Pro, write entitlements, offer discounts, bypass marketplace policy, promise outcomes, imply medical results, scrape DMs, store inbound DMs, add tracking pixels, or pressure users.`;
  const yesterdayKey = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  })();
  const yesterdayRecovered = (myHistory[yesterdayKey]?.activities || []).some(activity => activity.activityId === 'streak_recovery' || activity.type === 'streak_recovery');
  const streakRescuePromptCopy = `Rise With The Tribe Streak Rescue Prompt Kit:\n\nCurrent streak: ${currentStreak} day${currentStreak === 1 ? '' : 's'}\nStreak goal: ${goalStreak} day${goalStreak === 1 ? '' : 's'}\nYesterday recovery: ${yesterdayRecovered ? 'already protected' : (proActive ? 'available as a zero-point Pro credit' : 'Pro-only recovery preview')}\nMomentum: ${totalWinPoints} pts · ${daysActive} days active\n\nRescue prompt:\nMissed yesterday? Do not make it a lost week. Open Rise With The Tribe, log one honest session today, and use recovery only if it applies. The point is to return to the challenge loop, not fake the effort.\n\nStory caption:\nConsistency is not never missing. It is coming back before the gap becomes your identity. Tag @risewiththetribe when you restart today.\n\nThis is manual streak rescue copy only. Do not award points, create activity logs, spend recovery credits, write entitlements, unlock Pro, imply paid access is live, promise outcomes, imply medical results, or pressure users after missed days.`;
  const comebackChallengeInviteCopy = `Rise With The Tribe Comeback Challenge Invite Kit:\n\nThis week's campaign: ${weeklyCampaignPrompt.name}\nCampaign CTA: ${weeklyCampaignPrompt.cta}\nHashtag: ${weeklyCampaignPrompt.hashtag}\nCurrent streak: ${currentStreak} day${currentStreak === 1 ? '' : 's'}\nRecovery status: ${yesterdayRecovered ? 'yesterday protected' : 'restart with an honest log'}\n\nInvite copy:\nMissed a day? Come back with me. Pick this week's Rise With The Tribe challenge, log one honest session, and tag @risewiththetribe when you restart. We are not chasing perfect weeks. We are building return speed.\n\nDM version:\nYou in for a comeback check-in today? The prompt is ${weeklyCampaignPrompt.name}: ${weeklyCampaignPrompt.cta} Start in the app, use ${weeklyCampaignPrompt.hashtag}, and bring one accountability partner.\n\nThis is manual comeback challenge invite copy only. Do not auto-message users, scrape DMs, create challenge joins, create activity logs, spend recovery credits, write referral state, write entitlements, imply paid access is live, promise outcomes, imply medical results, or pressure users after missed days.`;

  const persistAppearance = async ({ profileImageData = profile?.profileImageData, avatarEmoji: emoji = avatarEmoji, avatarColor: color = avatarColor }) => {
    setIsSavingAppearance(true);
    setAppearanceError('');
    try {
      await saveProfileAppearance(user.uid, { profileImageData, avatarEmoji: emoji, avatarColor: color });
      const nextProfile = {
        ...(profile || {}),
        profileImageData: profileImageData || null,
        avatarEmoji: emoji,
        avatarColor: color,
      };
      setProfile(p => ({
        ...(p || {}),
        profileImageData: profileImageData || null,
        avatarEmoji: emoji,
        avatarColor: color,
      }));
      onProfileUpdated?.(nextProfile);
    } catch (err) {
      setAppearanceError(err?.message || 'Could not save profile appearance.');
    } finally {
      setIsSavingAppearance(false);
    }
  };

  const handlePhotoUpload = async e => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setIsSavingAppearance(true);
    setAppearanceError('');
    try {
      const profileImageData = await resizeImageToBase64(file);
      if (profileImageData.length > 900000) {
        throw new Error('Photo is too large. Try a smaller image.');
      }
      await saveProfileAppearance(user.uid, {
        profileImageData,
        avatarEmoji,
        avatarColor,
      });
      setProfile(p => ({ ...(p || {}), profileImageData, avatarEmoji, avatarColor }));
      onProfileUpdated?.({ ...(profile || {}), profileImageData, avatarEmoji, avatarColor });
    } catch (err) {
      setAppearanceError(err?.message || 'Could not upload that photo.');
    } finally {
      setIsSavingAppearance(false);
    }
  };

  const handleFeatureMediaUpload = async e => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setFeatureMessage('');
    try {
      const mediaImageData = await resizeImageToBase64(file, 720, 0.7);
      if (mediaImageData.length > 900000) {
        throw new Error('Feature image is too large. Try a smaller photo.');
      }
      setFeatureMediaData(mediaImageData);
    } catch (err) {
      setFeatureMessage(err?.message || 'Could not attach that image.');
    }
  };

  const handleSocialSave = async () => {
    setIsSavingSocial(true);
    setSocialMessage('');
    try {
      const normalized = await saveSocialProfile(user.uid, { instagramHandle });
      const nextProfile = { ...(profile || {}), instagramHandle: normalized };
      setInstagramHandle(normalized);
      setProfile(nextProfile);
      onProfileUpdated?.(nextProfile);
      setSocialMessage(normalized ? 'Instagram handle saved.' : 'Instagram handle removed.');
    } catch (err) {
      setSocialMessage(err?.message || 'Could not save Instagram handle.');
    } finally {
      setIsSavingSocial(false);
    }
  };

  const handleFeatureSubmit = async () => {
    setIsSubmittingFeature(true);
    setFeatureMessage('');
    try {
      if (!featureConsent) throw new Error('Please confirm consent before submitting.');
      await submitFeatureSubmission(user.uid, { category: featureCategory, story: featureStory, mediaImageData: featureMediaData });
      const submissions = await getFeatureSubmissions(user.uid);
      setFeatureSubmissions(submissions);
      setFeatureStory('');
      setFeatureMediaData('');
      setFeatureConsent(false);
      setFeatureMessage('Submitted for review. We may feature it on @risewiththetribe.');
    } catch (err) {
      setFeatureMessage(err?.message || 'Could not submit your story.');
    } finally {
      setIsSubmittingFeature(false);
    }
  };

  const handleWinCardShare = async () => {
    const instagram = profile?.instagramHandle || instagramHandle;
    const text = `My Rise With The Tribe win card: ${totalWinPoints} pts · ${currentStreak}-day streak · ${daysActive} days active${instagram ? ` @${instagram}` : ''}\nTag @risewiththetribe and build your next win.`;
    setWinCardMessage('');
    try {
      const blob = await makeWinCardBlob({
        displayName: profile?.displayName || user.displayName || user.email?.split('@')[0],
        totalPoints: totalWinPoints,
        streak: currentStreak,
        daysActive,
        rank,
        referralJoins: profile?.stats?.referralJoins || 0,
        instagramHandle: instagram,
      });
      const file = blob ? new File([blob], 'rise-with-the-tribe-win-card.png', { type: 'image/png' }) : null;
      if (navigator.share && file && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title: 'Rise With The Tribe Win Card', text, files: [file] });
        setWinCardMessage('Win card ready to share.');
        return;
      }
      await navigator.clipboard?.writeText(text);
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'rise-with-the-tribe-win-card.png';
        a.click();
        URL.revokeObjectURL(url);
      }
      setWinCardMessage('Win card downloaded and copy saved.');
    } catch (err) {
      setWinCardMessage(err?.message || 'Could not create win card.');
    }
  };

  const handleWeeklyRecapShare = async () => {
    const instagram = profile?.instagramHandle || instagramHandle;
    const text = `My 7-day Rise With The Tribe recap: ${weeklyRecap.points} pts · ${weeklyRecap.sessions} sessions · ${weeklyRecap.activeDays}/7 days active${instagram ? ` @${instagram}` : ''}\nTag @risewiththetribe and start your next week strong.`;
    setWinCardMessage('');
    try {
      const blob = await makeWinCardBlob({
        displayName: '7-Day Recap',
        totalPoints: weeklyRecap.points,
        streak: currentStreak,
        daysActive: weeklyRecap.activeDays,
        rank,
        referralJoins: profile?.stats?.referralJoins || 0,
        instagramHandle: instagram,
      });
      const file = blob ? new File([blob], 'rise-with-the-tribe-weekly-recap.png', { type: 'image/png' }) : null;
      if (navigator.share && file && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title: 'Rise With The Tribe Weekly Recap', text, files: [file] });
        setWinCardMessage('Weekly recap ready to share.');
        return;
      }
      await navigator.clipboard?.writeText(text);
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'rise-with-the-tribe-weekly-recap.png';
        a.click();
        URL.revokeObjectURL(url);
      }
      setWinCardMessage('Weekly recap downloaded and copy saved.');
    } catch (err) {
      setWinCardMessage(err?.message || 'Could not create weekly recap.');
    }
  };

  const handleMonthlyRecapShare = async () => {
    const instagram = profile?.instagramHandle || instagramHandle;
    const text = `My 30-day Rise With The Tribe recap: ${monthlyReport.monthlyPoints} pts · ${monthlyReport.sessions} sessions · ${monthlyReport.activeDays}/30 days active · ${monthlyReport.monthlyScore}% score${instagram ? ` @${instagram}` : ''}\nTag @risewiththetribe and build your next month with the tribe.`;
    setWinCardMessage('');
    try {
      const blob = await makeWinCardBlob({
        displayName: '30-Day Recap',
        totalPoints: monthlyReport.monthlyPoints,
        streak: currentStreak,
        daysActive: monthlyReport.activeDays,
        rank,
        referralJoins: profile?.stats?.referralJoins || 0,
        instagramHandle: instagram,
      });
      const file = blob ? new File([blob], 'rise-with-the-tribe-monthly-recap.png', { type: 'image/png' }) : null;
      if (navigator.share && file && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title: 'Rise With The Tribe 30-Day Recap', text, files: [file] });
        setWinCardMessage('Monthly recap ready to share.');
        return;
      }
      await navigator.clipboard?.writeText(text);
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'rise-with-the-tribe-monthly-recap.png';
        a.click();
        URL.revokeObjectURL(url);
      }
      setWinCardMessage('Monthly recap downloaded and copy saved.');
    } catch (err) {
      setWinCardMessage(err?.message || 'Could not create monthly recap.');
    }
  };

  const statsGrid = [
    { label: 'CHALLENGES JOINED',  value: profile?.stats?.challengesJoined ?? challengeStats.joined, icon: '🎯', color: ACCENT },
    { label: 'CHALLENGES STARTED', value: profile?.stats?.challengesOwned  ?? challengeStats.owned,  icon: '🏆', color: GOLD },
    { label: 'REFERRAL JOINS',      value: referralJoins, icon: '🤝', color: '#34D399' },
    { label: 'BADGES EARNED',      value: earnedBadges.size, icon: '⭐', color: '#A78BFA' },
    { label: 'TOTAL XP',           value: badgeXP,           icon: rank.icon, color: rank.color },
    {
      label: 'CHALLENGE PTS', value: totalChallengePoints, icon: '🏅', color: '#34D399',
      onClick: () => setShowBreakdown(true),
    },
    { label: 'DAYS ACTIVE', value: daysActive, icon: '📅', color: '#60A5FA' },
  ];

  const prefRows = [
    onb?.goal       && { label: 'GOAL',      value: GOAL_LABELS[onb.goal]      || onb.goal },
    onb?.level      && { label: 'LEVEL',     value: LEVEL_LABELS[onb.level]    || onb.level },
    onb?.frequency  && { label: 'FREQUENCY', value: FREQ_LABELS[onb.frequency] || onb.frequency },
    onb?.motivation && { label: 'DRIVEN BY', value: onb.motivation.replace('_', ' ').toUpperCase() },
  ].filter(Boolean);

  const earnedList = BADGES.filter(b => earnedBadges.has(b.id));
  const isAdmin = profile?.isAdmin || profile?.role === 'admin';
  const creatorOwnedChallenges = profileChallenges.filter(challenge => challenge.createdBy === user.uid);
  const creatorAnalytics = {
    hosted: creatorOwnedChallenges.length,
    members: creatorOwnedChallenges.reduce((sum, challenge) => sum + (challenge.memberCount || 0), 0),
    active: creatorOwnedChallenges.filter(challenge => !challenge.endDate || new Date(challenge.endDate) >= new Date()).length,
    private: creatorOwnedChallenges.filter(challenge => challenge.isPublic === false).length,
    paidPacks: creatorOwnedChallenges.filter(challenge => challenge.isPremium || challenge.packId).length,
    revenueReady: creatorOwnedChallenges.filter(challenge => challenge.isPremium || challenge.packId || (challenge.memberCount || 0) >= 5).length,
  };
  const creatorLaunchChallenge = creatorOwnedChallenges
    .filter(challenge => !challenge.endDate || new Date(challenge.endDate) >= new Date())
    .sort((a, b) => (a.startDate || '').localeCompare(b.startDate || ''))[0] || creatorOwnedChallenges[0];
  const creatorLaunchLink = creatorLaunchChallenge?.inviteCode ? `https://risewiththetribe.app?join=${creatorLaunchChallenge.inviteCode}&ref=${user.uid}` : '';
  const creatorLaunchCopy = creatorLaunchChallenge
    ? [
        `I am hosting ${creatorLaunchChallenge.name} inside Rise With The Tribe.`,
        creatorSpecialty ? `Focus: ${creatorSpecialty}.` : '',
        creatorBio || creatorLaunchChallenge.tagline || 'Come build consistency with us.',
        creatorLaunchLink ? `Join here: ${creatorLaunchLink}` : '',
        'Tag @risewiththetribe when you join and bring someone with you.',
      ].filter(Boolean).join('\n\n')
    : 'Create your first hosted challenge, then copy a launch post here for Instagram and your community.';
  const creatorHostingOfferCopy = [
    'Rise With The Tribe Creator Hosting Offer Kit:',
    '',
    `Creator focus: ${creatorSpecialty || 'Accountability challenge host'}`,
    `Hosted challenges: ${creatorAnalytics.hosted}`,
    `Member reach: ${creatorAnalytics.members}`,
    `Revenue-ready signals: ${creatorAnalytics.revenueReady}`,
    `Creator beta interest: ${creatorRevenueShareInterest ? 'opted in' : 'not opted in yet'}`,
    creatorLaunchChallenge ? `Candidate challenge: ${creatorLaunchChallenge.name}` : 'Candidate challenge: create or choose a hosted challenge first',
    '',
    'Draft offer angle: run a structured hosted challenge with clear daily accountability, community proof, and a manual launch plan.',
    'Before taking payments: confirm paid-hosting policy, creator terms, payout operations, store product validation, and Firestore entitlement QA.',
    'This is a planning brief only; it does not create a contract, payout, purchase, entitlement, or paid-access claim.',
  ].join('\n');
  const creatorTermsReadinessCopy = [
    'Rise With The Tribe Creator Terms Readiness Kit:',
    '',
    `Creator focus: ${creatorSpecialty || 'Accountability challenge host'}`,
    `Hosted challenges: ${creatorAnalytics.hosted}`,
    `Member reach: ${creatorAnalytics.members}`,
    `Revenue-ready signals: ${creatorAnalytics.revenueReady}`,
    `Creator beta interest: ${creatorRevenueShareInterest ? 'opted in' : 'not opted in yet'}`,
    '',
    'Terms checklist:',
    '- Creator responsibilities: truthful challenge descriptions, safe community conduct, no medical claims, and no guaranteed fitness outcomes',
    '- Content moderation: hosted challenges and feature submissions remain subject to manual review and removal',
    '- Payout readiness: payout provider, tax collection, identity verification, refund handling, and support escalation must be approved before any creator revenue-share',
    '- Marketplace alignment: paid access must use configured App Store / Play products, receipt validation, restore flow, and entitlement QA',
    '- Support handoff: users need clear support, privacy, terms, and data deletion resources before hosted paid access is promoted',
    '',
    'This is a creator terms readiness brief only. Do not create contracts, collect payout details, collect tax details, start revenue-share, process payments, create purchases, write entitlements, process refunds, bypass marketplace policy, promise outcomes, imply medical results, or claim paid creator hosting is live.',
  ].join('\n');
  const creatorPayoutReadinessCopy = [
    'Rise With The Tribe Creator Payout Readiness Kit:',
    '',
    `Creator focus: ${creatorSpecialty || 'Accountability challenge host'}`,
    `Hosted challenges: ${creatorAnalytics.hosted}`,
    `Member reach: ${creatorAnalytics.members}`,
    `Revenue-ready signals: ${creatorAnalytics.revenueReady}`,
    `Creator beta interest: ${creatorRevenueShareInterest ? 'opted in' : 'not opted in yet'}`,
    creatorLaunchChallenge ? `Candidate challenge: ${creatorLaunchChallenge.name}` : 'Candidate challenge: create or choose a hosted challenge first',
    '',
    'Payout readiness checklist:',
    '- Select and approve a payout provider before collecting payout details',
    '- Define creator eligibility, revenue-share terms, refund responsibility, tax collection, and identity verification',
    '- Confirm App Store / Play paid-access flow, receipt validation, restore, and entitlement QA before any creator payout promise',
    '- Keep hosted challenge support, moderation, refunds, account deletion, and safety escalation owned by the app team',
    '- Review creator content for truthful claims, no medical outcomes, and no guaranteed fitness results',
    '',
    'This is a creator payout readiness brief only. Do not create payouts, collect payout details, collect tax details, create contracts, start revenue-share, process payments, create purchases, write entitlements, process refunds, bypass marketplace policy, promise outcomes, imply medical results, or claim paid creator hosting is live.',
  ].join('\n');
  const creatorHostingObjectionReplyCopy = [
    'Rise With The Tribe Creator Hosting Objection Reply Kit:',
    '',
    `Creator focus: ${creatorSpecialty || 'Accountability challenge host'}`,
    `Hosted challenges: ${creatorAnalytics.hosted}`,
    `Member reach: ${creatorAnalytics.members}`,
    `Revenue-ready signals: ${creatorAnalytics.revenueReady}`,
    `Creator beta interest: ${creatorRevenueShareInterest ? 'opted in' : 'not opted in yet'}`,
    creatorLaunchChallenge ? `Candidate challenge: ${creatorLaunchChallenge.name}` : 'Candidate challenge: create or choose a hosted challenge first',
    '',
    'Manual replies:',
    'Q: Can creators earn money from hosted challenges yet?',
    'A: Creator hosting is being prepared, but paid hosting, payout operations, creator terms, store validation, and entitlement QA need to be complete before revenue-share is promoted as live.',
    '',
    'Q: What should a creator do now?',
    'A: Enable Creator / Coach Mode, host a useful free challenge, build member reach, save revenue-share beta interest, and apply for hosted review when the profile and challenge plan are ready.',
    '',
    'Q: What makes a hosted challenge worth reviewing?',
    'A: A clear challenge promise, truthful coaching focus, safe community conduct, visible member reach, and a launch plan that sends people into the app challenge loop without medical claims or guaranteed outcomes.',
    '',
    'This is a manual creator hosting objection reply kit only. Do not claim paid creator hosting is live, quote unconfigured prices, collect payments, create purchases, create contracts, collect payout details, collect tax details, start revenue-share, write entitlements, process refunds, bypass marketplace policy, promise outcomes, imply medical results, scrape DMs, store inbound DMs, add tracking pixels, or pressure creators.',
  ].join('\n');
  const goalProgress = {
    activeDays: Math.min(100, Math.round((weeklyRecap.activeDays / Math.max(1, goalActiveDays)) * 100)),
    points: Math.min(100, Math.round((weeklyRecap.points / Math.max(1, goalPoints)) * 100)),
    streak: Math.min(100, Math.round((currentStreak / Math.max(1, goalStreak)) * 100)),
  };

  const handleCustomGoalsSave = async () => {
    if (!proActive) {
      setGoalsMessage('Custom goals unlock with Tribe Pro.');
      return;
    }
    setIsSavingGoals(true);
    setGoalsMessage('');
    try {
      const goals = await saveCustomGoals(user.uid, {
        weeklyActiveDaysTarget: goalActiveDays,
        weeklyPointsTarget: goalPoints,
        streakTarget: goalStreak,
      });
      setProfile(p => ({ ...(p || {}), goals }));
      setGoalsMessage('Custom goals saved.');
    } catch (err) {
      setGoalsMessage(err?.message || 'Could not save custom goals.');
    } finally {
      setIsSavingGoals(false);
    }
  };

  const handleFrameSave = async () => {
    if (!proActive) {
      setCosmeticsMessage('Premium profile frames unlock with Tribe Pro.');
      return;
    }
    setIsSavingCosmetics(true);
    setCosmeticsMessage('');
    try {
      const cosmetics = await saveProfileCosmetics(user.uid, { profileFrameId: selectedFrameId });
      setProfile(p => ({ ...(p || {}), cosmetics }));
      onProfileUpdated?.({ ...(profile || {}), cosmetics });
      setCosmeticsMessage('Profile frame saved.');
    } catch (err) {
      setCosmeticsMessage(err?.message || 'Could not save profile frame.');
    } finally {
      setIsSavingCosmetics(false);
    }
  };

  const handleStreakRecovery = async () => {
    if (!proActive) {
      setRecoveryMessage('Streak recovery credits unlock with Tribe Pro.');
      return;
    }
    setIsSavingRecovery(true);
    setRecoveryMessage('');
    try {
      const dayEntry = await saveStreakRecovery(user.uid, yesterdayKey);
      onHistoryUpdated?.({ ...myHistory, [yesterdayKey]: dayEntry });
      setRecoveryMessage(yesterdayRecovered ? 'Yesterday already has a recovery credit.' : 'Yesterday recovered. Your streak is protected.');
    } catch (err) {
      setRecoveryMessage(err?.message || 'Could not recover that streak day.');
    } finally {
      setIsSavingRecovery(false);
    }
  };

  const handleCheckout = async productId => {
    setCheckoutProductId(productId);
    setCheckoutMessage('');
    try {
      await beginWebCheckout(productId);
      setCheckoutMessage('Checkout started.');
    } catch (err) {
      setCheckoutMessage(err?.message || 'Checkout is not configured yet.');
    } finally {
      setCheckoutProductId('');
    }
  };

  const handleSyncPurchases = async () => {
    setCheckoutProductId('sync');
    setCheckoutMessage('');
    try {
      await syncWebPurchases();
      setCheckoutMessage('Purchases synced.');
    } catch (err) {
      setCheckoutMessage(err?.message || 'Purchase sync is not configured yet.');
    } finally {
      setCheckoutProductId('');
    }
  };

  const handleEntitlementRecoveryRequest = async () => {
    if (isRequestingEntitlementRecovery) return;
    setIsRequestingEntitlementRecovery(true);
    setEntitlementRecoveryMessage('');
    try {
      await requestEntitlementRecovery(user.uid, {
        productCount: STORE_CATALOG.length,
        proActive,
        packCount: challengePackProducts.length,
        activePackCount: activeChallengePackCount,
        reason: proActive || activeChallengePackCount > 0 ? 'billing_question' : 'restore_sync_failed',
      });
      setEntitlementRecoveryMessage('Entitlement recovery request sent for manual review. This does not write entitlements, process refunds, cancel subscriptions, create purchases, or bypass marketplace policy.');
      if (isAdmin) {
        getEntitlementRecoveryReviewQueue().then(setEntitlementRecoveryReviewQueue).catch(() => setEntitlementRecoveryReviewQueue([]));
      }
    } catch (err) {
      setEntitlementRecoveryMessage(err?.message || 'Could not send entitlement recovery request.');
    } finally {
      setIsRequestingEntitlementRecovery(false);
    }
  };

  const handleEntitlementRecoveryReview = async (requestId, status) => {
    if (reviewingEntitlementRecoveryRequestId) return;
    setReviewingEntitlementRecoveryRequestId(requestId);
    try {
      await reviewEntitlementRecoveryRequest(requestId, {
        status,
        reviewNote: entitlementRecoveryReviewNotes[requestId] || '',
        reviewedBy: profile?.displayName || profile?.email || 'admin',
      });
      setEntitlementRecoveryMessage(`Entitlement recovery request marked ${status}. Manual review note saved without writing entitlements, processing refunds, cancelling subscriptions, creating purchases, or bypassing marketplace policy.`);
      getEntitlementRecoveryReviewQueue().then(setEntitlementRecoveryReviewQueue).catch(() => setEntitlementRecoveryReviewQueue([]));
    } catch (err) {
      setEntitlementRecoveryMessage(err?.message || 'Could not update entitlement recovery review.');
    } finally {
      setReviewingEntitlementRecoveryRequestId('');
    }
  };

  const handleValidationReadinessCheck = async () => {
    setIsCheckingValidationReadiness(true);
    setValidationReadinessMessage('');
    try {
      const readiness = await getPurchaseValidationReadiness();
      const platforms = readiness?.platforms || {};
      const summary = ['ios', 'android'].map(platform => {
        const platformReadiness = platforms[platform] || {};
        const missingCount = platformReadiness.missingConfigKeys?.length || 0;
        return `${platform.toUpperCase()}: ${platformReadiness.validationConfigured ? 'configured' : `${missingCount} missing`}`;
      }).join(' · ');
      setValidationReadinessMessage(`${summary}. No entitlements were changed.`);
    } catch (err) {
      setValidationReadinessMessage(err?.message || 'Could not check purchase validation readiness.');
    } finally {
      setIsCheckingValidationReadiness(false);
    }
  };

  const handleRecordStoreTestEvidence = async test => {
    if (!isAdmin || recordingStoreTestEvidenceId || !test?.productId) return;
    setRecordingStoreTestEvidenceId(test.id);
    setStoreTestEvidenceMessage('');
    try {
      await recordStoreTestPurchaseEvidence(user.uid, {
        platform: test.platform,
        productId: test.productId,
        testCase: test.testCase,
        result: 'needs_review',
        evidenceNote: `${test.label} evidence captured manually; verify screenshot, tester account, receipt validation log, and entitlement outcome before launch approval.`,
      });
      setStoreTestEvidenceMessage('Store test purchase evidence recorded for admin review. This does not write entitlements, create purchases, process refunds, or mark paid access live.');
      getStoreTestPurchaseEvidenceLog().then(setStoreTestEvidenceLog).catch(() => setStoreTestEvidenceLog([]));
    } catch (err) {
      setStoreTestEvidenceMessage(err?.message || 'Could not record store test purchase evidence.');
    } finally {
      setRecordingStoreTestEvidenceId('');
    }
  };

  const handleReviewStoreTestEvidence = async (evidenceId, result, status = 'reviewed') => {
    if (!isAdmin || reviewingStoreTestEvidenceId) return;
    setReviewingStoreTestEvidenceId(evidenceId);
    setStoreTestEvidenceMessage('');
    try {
      await reviewStoreTestPurchaseEvidence(evidenceId, {
        result,
        status,
        reviewNote: storeTestEvidenceReviewNotes[evidenceId] || '',
        reviewedBy: profile?.displayName || user.email || 'admin',
      });
      setStoreTestEvidenceMessage(`Store test purchase evidence marked ${result}. Review note saved without writing entitlements, creating purchases, processing refunds, bypassing marketplace policy, or marking paid access live.`);
      getStoreTestPurchaseEvidenceLog().then(setStoreTestEvidenceLog).catch(() => setStoreTestEvidenceLog([]));
    } catch (err) {
      setStoreTestEvidenceMessage(err?.message || 'Could not review store test purchase evidence.');
    } finally {
      setReviewingStoreTestEvidenceId('');
    }
  };

  const handleCreatorSave = async () => {
    if (!proActive) {
      setCreatorMessage('Creator / Coach Mode unlocks with Tribe Pro.');
      return;
    }
    setIsSavingCreator(true);
    setCreatorMessage('');
    try {
      const creatorProfile = await saveCreatorProfile(user.uid, {
        enabled: creatorEnabled,
        specialty: creatorSpecialty,
        bio: creatorBio,
        ctaUrl: creatorCtaUrl,
        revenueShareInterest: creatorRevenueShareInterest,
      });
      setProfile(p => ({ ...(p || {}), creatorProfile }));
      onProfileUpdated?.({ ...(profile || {}), creatorProfile });
      setCreatorMessage(creatorProfile.enabled ? 'Creator profile saved.' : 'Creator profile disabled.');
    } catch (err) {
      setCreatorMessage(err?.message || 'Could not save creator profile.');
    } finally {
      setIsSavingCreator(false);
    }
  };

  const handleCreatorHostingApplication = async () => {
    if (isSubmittingCreatorHostingApplication) return;
    setCreatorHostingApplicationMessage('');
    if (!proActive || !creatorEnabled) {
      setCreatorHostingApplicationMessage('Enable Pro Creator / Coach Mode before applying for hosted review.');
      return;
    }
    setIsSubmittingCreatorHostingApplication(true);
    try {
      await submitCreatorHostingApplication(user.uid, {
        hostedCount: creatorAnalytics.hosted,
        memberReach: creatorAnalytics.members,
        revenueReadyCount: creatorAnalytics.revenueReady,
        revenueShareInterest: creatorRevenueShareInterest,
      });
      setCreatorHostingApplicationMessage('Creator hosting application sent for admin review. This does not create contracts, payouts, purchases, entitlements, or paid-access claims.');
      if (isAdmin) {
        getCreatorHostingApplicationReviewQueue().then(setCreatorHostingApplicationReviewQueue).catch(() => setCreatorHostingApplicationReviewQueue([]));
      }
    } catch (err) {
      setCreatorHostingApplicationMessage(err?.message || 'Could not send creator hosting application.');
    } finally {
      setIsSubmittingCreatorHostingApplication(false);
    }
  };

  const handleCreatorHostingApplicationReview = async (applicationId, status) => {
    if (reviewingCreatorHostingApplicationId) return;
    setReviewingCreatorHostingApplicationId(applicationId);
    try {
      await reviewCreatorHostingApplication(applicationId, {
        status,
        reviewNote: creatorHostingApplicationReviewNotes[applicationId] || '',
        reviewedBy: profile?.displayName || user?.email || user?.uid || 'admin',
      });
      setCreatorHostingApplicationMessage(`Creator hosting application marked ${status}. Manual review note saved without creating contracts, payouts, purchases, entitlements, revenue-share, or paid-access claims.`);
      getCreatorHostingApplicationReviewQueue().then(setCreatorHostingApplicationReviewQueue).catch(() => setCreatorHostingApplicationReviewQueue([]));
    } catch (err) {
      setCreatorHostingApplicationMessage(err?.message || 'Could not update creator hosting application review.');
    } finally {
      setReviewingCreatorHostingApplicationId('');
    }
  };

  const handlePartnerPerkToggle = async perkId => {
    const nextSelectedIds = selectedPartnerPerkIds.includes(perkId)
      ? selectedPartnerPerkIds.filter(id => id !== perkId)
      : [...selectedPartnerPerkIds, perkId];
    setSelectedPartnerPerkIds(nextSelectedIds);
    setIsSavingPartnerPerks(true);
    setPartnerPerkMessage('');
    try {
      const partnerPerkInterest = await savePartnerPerkInterest(user.uid, nextSelectedIds);
      setSelectedPartnerPerkIds(partnerPerkInterest.selectedIds || []);
      setProfile(p => ({ ...(p || {}), partnerPerkInterest }));
      onProfileUpdated?.({ ...(profile || {}), partnerPerkInterest });
      setPartnerPerkMessage(partnerPerkInterest.selectedIds?.length ? 'Perk interest saved.' : 'Perk interest cleared.');
    } catch (err) {
      setPartnerPerkMessage(err?.message || 'Could not save perk interest.');
    } finally {
      setIsSavingPartnerPerks(false);
    }
  };

  const handlePartnerCampaignApplication = async () => {
    if (isSubmittingPartnerCampaignApplication) return;
    setPartnerCampaignApplicationMessage('');
    const demand = applicationPartnerSignalCount;
    if (!applicationPartnerPerk || !demand) {
      setPartnerCampaignApplicationMessage('Save at least one partner perk signal before applying for a partner pilot review.');
      return;
    }
    setIsSubmittingPartnerCampaignApplication(true);
    try {
      await submitPartnerCampaignApplication(user.uid, {
        topPerkId: applicationPartnerPerk.id,
        topPerkLabel: applicationPartnerPerk.label,
        demandCount: demand,
        totalDemand: partnerCampaignApplicationSignalTotal,
        campaignReach: campaignPerformanceSummary.memberReach || 0,
        referralJoins,
      });
      setPartnerCampaignApplicationMessage('Partner campaign pilot application sent for manual review. This does not add partner links, tracking pixels, ad targeting, affiliate payouts, purchases, entitlements, or paid-access claims.');
      if (isAdmin) {
        getPartnerCampaignApplicationReviewQueue().then(setPartnerCampaignApplicationReviewQueue).catch(() => setPartnerCampaignApplicationReviewQueue([]));
      }
    } catch (err) {
      setPartnerCampaignApplicationMessage(err?.message || 'Could not send partner campaign pilot application.');
    } finally {
      setIsSubmittingPartnerCampaignApplication(false);
    }
  };

  const handlePartnerCampaignApplicationReview = async (applicationId, status) => {
    if (reviewingPartnerCampaignApplicationId) return;
    setReviewingPartnerCampaignApplicationId(applicationId);
    try {
      await reviewPartnerCampaignApplication(applicationId, {
        status,
        reviewNote: partnerCampaignApplicationReviewNotes[applicationId] || '',
        reviewedBy: profile?.displayName || user?.email || user?.uid || 'admin',
      });
      setPartnerCampaignApplicationMessage(`Partner campaign application marked ${status}. Manual review note saved without adding partner links, tracking pixels, ad targeting, affiliate payouts, purchases, entitlements, revenue-share, or paid-access claims.`);
      getPartnerCampaignApplicationReviewQueue().then(setPartnerCampaignApplicationReviewQueue).catch(() => setPartnerCampaignApplicationReviewQueue([]));
    } catch (err) {
      setPartnerCampaignApplicationMessage(err?.message || 'Could not update partner campaign application review.');
    } finally {
      setReviewingPartnerCampaignApplicationId('');
    }
  };

  const handlePartnerPerkClaim = async (perk, progress) => {
    if (claimingPartnerPerkId) return;
    setPartnerPerkClaimMessage('');
    if (!progress?.eligible) {
      setPartnerPerkClaimMessage('This partner perk is not eligible yet.');
      return;
    }
    setClaimingPartnerPerkId(perk.id);
    try {
      await claimPartnerPerk(user.uid, {
        perkId: perk.id,
        perkLabel: perk.label,
        perkTitle: perk.title,
        current: progress.current,
        target: progress.target,
        requirement: perk.requirement,
      });
      setPartnerPerkClaimMessage('Partner perk claim sent for manual review. This does not create coupons, partner links, payouts, discounts, purchases, entitlements, or paid-access claims.');
      getPartnerPerkClaims(user.uid).then(setPartnerPerkClaims).catch(() => setPartnerPerkClaims([]));
      if (isAdmin) {
        getPartnerPerkClaimReviewQueue().then(setPartnerPerkClaimReviewQueue).catch(() => setPartnerPerkClaimReviewQueue([]));
      }
    } catch (err) {
      setPartnerPerkClaimMessage(err?.message || 'Could not request partner perk review.');
    } finally {
      setClaimingPartnerPerkId('');
    }
  };

  const handlePartnerPerkClaimReview = async (claimId, status) => {
    if (reviewingPartnerPerkClaimId) return;
    setReviewingPartnerPerkClaimId(claimId);
    try {
      await reviewPartnerPerkClaim(claimId, {
        status,
        reviewNote: partnerPerkReviewNotes[claimId] || '',
        reviewedBy: profile?.displayName || user?.email || user?.uid || 'admin',
      });
      setPartnerPerkClaimMessage(`Partner perk claim marked ${status}. Manual review note saved without creating coupons, partner links, payouts, discounts, purchases, entitlements, or paid-access claims.`);
      getPartnerPerkClaimReviewQueue().then(setPartnerPerkClaimReviewQueue).catch(() => setPartnerPerkClaimReviewQueue([]));
      if (user?.uid) {
        getPartnerPerkClaims(user.uid).then(setPartnerPerkClaims).catch(() => setPartnerPerkClaims([]));
      }
    } catch (err) {
      setPartnerPerkClaimMessage(err?.message || 'Could not update partner perk claim review.');
    } finally {
      setReviewingPartnerPerkClaimId('');
    }
  };

  const handleProTrialReasonToggle = async reasonId => {
    const nextSelectedIds = selectedProTrialReasonIds.includes(reasonId)
      ? selectedProTrialReasonIds.filter(id => id !== reasonId)
      : [...selectedProTrialReasonIds, reasonId];
    setSelectedProTrialReasonIds(nextSelectedIds);
    setIsSavingProTrialInterest(true);
    setProTrialMessage('');
    try {
      const proTrialInterest = await saveProTrialInterest(user.uid, nextSelectedIds);
      setSelectedProTrialReasonIds(proTrialInterest.selectedIds || []);
      setProfile(p => ({ ...(p || {}), proTrialInterest }));
      onProfileUpdated?.({ ...(profile || {}), proTrialInterest });
      setProTrialMessage(proTrialInterest.selectedIds?.length ? 'Pro trial interest saved.' : 'Pro trial interest cleared.');
    } catch (err) {
      setSelectedProTrialReasonIds(selectedProTrialReasonIds);
      setProTrialMessage(err?.message || 'Could not save Pro trial interest.');
    } finally {
      setIsSavingProTrialInterest(false);
    }
  };

  const handleReviewSubmission = async (submissionId, status) => {
    setReviewMessage('');
    try {
      await reviewFeatureSubmission(submissionId, status, user.uid, featureReviewNotes[submissionId] || '');
      const queue = await getFeatureReviewQueue();
      setFeatureReviewQueue(queue);
      setReviewMessage(`Submission marked ${status}. Review note saved for manual UGC consent/content review.`);
    } catch (err) {
      setReviewMessage(err?.message || 'Could not update submission.');
    }
  };

  const handleReminder = async (hour, minute) => {
    setReminderError('');
    try {
      const label = await setDailyReminder(hour, minute);
      setReminderLabel(label);
    } catch (err) {
      setReminderError(err?.message || 'Could not set reminder.');
    }
  };

  const disableReminder = () => {
    cancelDailyReminder();
    setReminderLabel(getDailyReminderLabel());
    setReminderError('');
  };

  const handleAccountDeletionRequest = async () => {
    if (isRequestingDeletion || accountDeletionRequested) return;
    setDeletionRequestMessage('');
    setIsRequestingDeletion(true);
    try {
      const accountDeletionRequest = await requestAccountDeletion(user.uid);
      setProfile(p => ({ ...(p || {}), accountDeletionRequest }));
      onProfileUpdated?.({ ...(profile || {}), accountDeletionRequest });
      setDeletionRequestMessage('Deletion request recorded. Support will follow up before account data is removed.');
    } catch (err) {
      setDeletionRequestMessage(err?.message || 'Could not record deletion request.');
    } finally {
      setIsRequestingDeletion(false);
    }
  };

  const handleAccountDeletionReview = async (uid, status) => {
    if (reviewingAccountDeletionRequestId) return;
    setReviewingAccountDeletionRequestId(uid);
    try {
      await reviewAccountDeletionRequest(uid, {
        status,
        reviewNote: accountDeletionReviewNotes[uid] || '',
        reviewedBy: profile?.displayName || user.email || 'admin',
      });
      setReviewMessage(`Account deletion request marked ${status}. Review note saved without deleting the account, erasing data, cancelling purchases, processing refunds, or bypassing marketplace policy.`);
      const queue = await getAccountDeletionReviewQueue();
      setAccountDeletionReviewQueue(queue);
    } catch (err) {
      setReviewMessage(err?.message || 'Could not review account deletion request.');
    } finally {
      setReviewingAccountDeletionRequestId('');
    }
  };

  const handleSupportRequest = async () => {
    if (isSubmittingSupport) return;
    setSupportStatusMessage('');
    setIsSubmittingSupport(true);
    try {
      await submitSupportRequest(user.uid, { category: supportCategory, message: supportMessage });
      setSupportMessage('');
      setSupportStatusMessage('Support request sent. We will follow up using your account email.');
      if (isAdmin) {
        getSupportReviewQueue().then(setSupportReviewQueue).catch(() => setSupportReviewQueue([]));
      }
    } catch (err) {
      setSupportStatusMessage(err?.message || 'Could not send support request.');
    } finally {
      setIsSubmittingSupport(false);
    }
  };

  const handleSupportRequestReview = async (requestId, status) => {
    if (reviewingSupportRequestId) return;
    setReviewingSupportRequestId(requestId);
    try {
      await reviewSupportRequest(requestId, {
        status,
        reviewNote: supportReviewNotes[requestId] || '',
        reviewedBy: profile?.displayName || profile?.email || 'admin',
      });
      setSupportStatusMessage(`Support request marked ${status}. Manual review note saved without resolving refunds, subscriptions, purchases, or entitlements.`);
      getSupportReviewQueue().then(setSupportReviewQueue).catch(() => setSupportReviewQueue([]));
    } catch (err) {
      setSupportStatusMessage(err?.message || 'Could not update support request review.');
    } finally {
      setReviewingSupportRequestId('');
    }
  };

  const handleReferralRewardClaim = async () => {
    if (isClaimingReferralReward) return;
    setReferralRewardClaimMessage('');
    if (!unlockedReferralRewardTier) {
      setReferralRewardClaimMessage('Invite one challenge member to unlock your first referral reward claim.');
      return;
    }
    setIsClaimingReferralReward(true);
    try {
      await claimReferralReward(user.uid, {
        tierTarget: unlockedReferralRewardTier.target,
        referralJoins,
      });
      setReferralRewardClaimMessage(`Referral reward claim sent for ${unlockedReferralRewardTier.label}. Admins will verify meaningful challenge joins before fulfillment.`);
      if (isAdmin) {
        getReferralRewardReviewQueue().then(setReferralRewardReviewQueue).catch(() => setReferralRewardReviewQueue([]));
      }
    } catch (err) {
      setReferralRewardClaimMessage(err?.message || 'Could not send referral reward claim.');
    } finally {
      setIsClaimingReferralReward(false);
    }
  };

  const handleReferralRewardClaimReview = async (claimId, status) => {
    if (reviewingReferralRewardClaimId) return;
    setReviewingReferralRewardClaimId(claimId);
    try {
      await reviewReferralRewardClaim(claimId, {
        status,
        reviewNote: referralRewardReviewNotes[claimId] || '',
        reviewedBy: profile?.displayName || profile?.email || 'admin',
      });
      setReferralRewardClaimMessage(`Referral reward claim marked ${status}. Manual review note saved without granting Pro, entitlements, discounts, payouts, purchases, or affiliate rewards.`);
      getReferralRewardReviewQueue().then(setReferralRewardReviewQueue).catch(() => setReferralRewardReviewQueue([]));
    } catch (err) {
      setReferralRewardClaimMessage(err?.message || 'Could not update referral reward review.');
    } finally {
      setReviewingReferralRewardClaimId('');
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 250,
      background: '#080808',
      overflowY: 'auto',
      maxWidth: 430, margin: '0 auto',
      fontFamily: "'Space Grotesk', sans-serif",
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(30px)',
      transition: 'opacity .3s ease, transform .3s ease',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Top bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'rgba(8,8,8,0.9)', backdropFilter: 'blur(20px)',
        padding: '48px 24px 14px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <p style={{ margin: 0, fontSize: 10, color: '#555', fontFamily: 'monospace', fontWeight: 700, letterSpacing: 2 }}>YOUR PROFILE</p>
        <button onClick={onClose} style={{
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
          color: '#888', borderRadius: 20, width: 32, height: 32,
          fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>×</button>
      </div>

      <div style={{ padding: '24px 24px 60px' }}>

        {/* Identity card */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20,
          padding: '20px', borderRadius: 20,
          background: `linear-gradient(135deg, ${rank.color}12, rgba(255,255,255,0.02))`,
          border: `1px solid ${rank.color}33`,
        }}>
          <input
            id={fileInputRef.current}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 1, height: 1 }}
          />
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <button
              onClick={() => setShowAvatarPicker(true)}
              title="Edit profile picture"
              style={{
                width: 68, height: 68, borderRadius: 20,
                background: `${avatarColor}22`, border: `2px solid transparent`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34,
                boxShadow: activeFrame.id === 'none' ? `0 0 24px ${avatarColor}22` : `0 0 28px ${activeFrame.colors[0]}33`,
                overflow: 'hidden', cursor: 'pointer', padding: 0,
                backgroundImage: `linear-gradient(#111,#111), ${frameGradient}`,
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
              }}
            >
              {profileImageSrc ? (
                <img src={profileImageSrc} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : avatarEmoji}
            </button>
            <label
              htmlFor={fileInputRef.current}
              title="Upload photo"
              style={{
                position: 'absolute', right: -5, bottom: -5,
                width: 26, height: 26, borderRadius: 999,
                border: '1px solid rgba(0,0,0,0.25)', background: ACCENT,
                color: '#111', fontSize: 12, fontWeight: 900,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              📷
            </label>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.displayName || user.email?.split('@')[0] || 'Tribe Member'}
            </h2>
            <span style={{
              fontSize: 10, fontFamily: 'monospace', fontWeight: 700,
              color: rank.color, background: `${rank.color}18`,
              border: `1px solid ${rank.color}33`, borderRadius: 6, padding: '3px 8px',
            }}>
              {rank.icon} {rank.label}
            </span>
            <p style={{ margin: '6px 0 0', fontSize: 10, color: '#444', fontFamily: 'monospace' }}>
              Member since {memberYear}
            </p>
          </div>
          {isSavingAppearance && (
            <div style={{
              width: 18, height: 18, borderRadius: '50%',
              border: `2px solid ${ACCENT}55`, borderTopColor: ACCENT,
              animation: 'spin .8s linear infinite',
            }} />
          )}
        </div>
        {appearanceError && (
          <div style={{
            margin: '-8px 0 18px', padding: '10px 12px',
            borderRadius: 12, border: '1px solid rgba(255,107,53,0.28)',
            background: 'rgba(255,107,53,0.08)', color: '#ffb199',
            fontSize: 12, fontWeight: 700,
          }}>
            {appearanceError}
          </div>
        )}

        <div style={{
          borderRadius: 16, padding: 16, marginBottom: 20,
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
              <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Profile frame</p>
              <p style={{ margin: '4px 0 0', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
                Premium identity cosmetic
              </p>
            </div>
            <span style={{ color: proActive ? '#34D399' : GOLD, fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
              {proActive ? 'PRO ACTIVE' : 'PRO'}
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {PROFILE_FRAMES.map(frame => {
              const selected = selectedFrameId === frame.id;
              const fill = frame.id === 'none' ? 'rgba(255,255,255,0.06)' : `linear-gradient(135deg, ${frame.colors[0]}, ${frame.colors[1]})`;
              return (
                <button
                  key={frame.id}
                  onClick={() => setSelectedFrameId(frame.id)}
                  style={{
                    minHeight: 66, borderRadius: 14, padding: 8,
                    border: selected ? `2px solid ${ACCENT}` : '1px solid rgba(255,255,255,0.08)',
                    background: selected ? 'rgba(255,107,53,0.08)' : 'rgba(255,255,255,0.03)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    gap: 7, cursor: 'pointer',
                  }}
                >
                  <span style={{
                    width: 26, height: 26, borderRadius: 999,
                    background: fill, border: '1px solid rgba(255,255,255,0.18)',
                  }} />
                  <span style={{ color: '#ddd', fontSize: 10, fontWeight: 900 }}>{frame.label}</span>
                </button>
              );
            })}
          </div>
          <button
            onClick={handleFrameSave}
            disabled={isSavingCosmetics}
            style={{
              width: '100%', marginTop: 12, padding: '12px',
              borderRadius: 14, border: 'none',
              background: proActive ? ACCENT : 'rgba(255,255,255,0.08)',
              color: proActive ? '#111' : '#aaa',
              fontWeight: 900, cursor: isSavingCosmetics ? 'wait' : 'pointer',
            }}
          >
            {proActive ? (isSavingCosmetics ? 'Saving Frame' : 'Save Profile Frame') : 'Unlock with Tribe Pro'}
          </button>
          {cosmeticsMessage && (
            <p style={{ margin: '10px 0 0', color: proActive ? '#34D399' : GOLD, fontSize: 11, fontWeight: 800 }}>
              {cosmeticsMessage}
            </p>
          )}
        </div>

        {isAdmin && (
          <div style={{
            borderRadius: 16, padding: 16, marginBottom: 20,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Monetization Launch Board</p>
                <p style={{ margin: '4px 0 0', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
                  Admin-only first-party demand signals
                </p>
              </div>
              <span style={{ color: monetizationSignalTotal ? '#34D399' : '#777', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                {monetizationSignalTotal ? 'SIGNALS LIVE' : 'GATHERING'}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {[
                ['TOTAL', monetizationSignalTotal, GOLD],
                ['PRO TRIAL', proTrialDemandTotal, '#A78BFA'],
                ['CREATOR', creatorRevenueShareTotal, '#34D399'],
                ['PARTNER', partnerDemandTotal, '#60A5FA'],
              ].map(([label, value, color]) => (
                <div key={label} style={{
                  borderRadius: 10, padding: 9,
                  background: 'rgba(0,0,0,0.18)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <p style={{ margin: 0, color, fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{label}</p>
                  <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 18, fontWeight: 900 }}>{value}</p>
                </div>
              ))}
            </div>
            <p style={{ margin: '10px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
              {monetizationLaunchCopy}
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(monetizationLaunchCopy)}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.05)',
                color: '#fff', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
              }}
            >
              COPY LAUNCH BOARD COPY
            </button>
          </div>
        )}

        {(isAdmin || creatorEnabled) && (
          <div style={{
            borderRadius: 16, padding: 16, marginBottom: 20,
            background: 'rgba(16,185,129,0.05)',
            border: '1px solid rgba(16,185,129,0.16)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>REVENUE PATHWAY PLANNER</p>
                <p style={{ margin: '4px 0 0', color: '#34D399', fontSize: 10, fontFamily: 'monospace' }}>
                  Manual next revenue move from first-party signals
                </p>
              </div>
              <span style={{ color: '#34D399', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                {recommendedRevenuePath.label.toUpperCase()}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8 }}>
              {revenuePathways.map(pathway => (
                <div key={pathway.id} style={{
                  borderRadius: 10, padding: 10,
                  background: 'rgba(0,0,0,0.18)',
                  border: `1px solid ${pathway.id === recommendedRevenuePath.id ? 'rgba(52,211,153,0.42)' : 'rgba(255,255,255,0.06)'}`,
                }}>
                  <p style={{ margin: 0, color: '#34D399', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
                    SIGNAL {pathway.signal}
                  </p>
                  <p style={{ margin: '5px 0 0', color: '#fff', fontSize: 12, fontWeight: 900 }}>{pathway.label}</p>
                  <p style={{ margin: '4px 0 0', color: '#888', fontSize: 9, lineHeight: 1.35 }}>{pathway.action}</p>
                </div>
              ))}
            </div>
            <p style={{ margin: '10px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
              Recommended: {recommendedRevenuePath.action}
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(revenuePathwayPlannerCopy)}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(16,185,129,0.22)', background: 'rgba(16,185,129,0.10)',
                color: '#34D399', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
              }}
            >
              COPY REVENUE PATHWAY PLAN
            </button>
          </div>
        )}

        {(isAdmin || creatorEnabled) && (
          <div style={{
            borderRadius: 16, padding: 16, marginBottom: 20,
            background: 'rgba(245,158,11,0.05)',
            border: '1px solid rgba(245,158,11,0.16)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>PRICING TEST KIT</p>
                <p style={{ margin: '4px 0 0', color: '#F59E0B', fontSize: 10, fontFamily: 'monospace' }}>
                  Manual pricing language before store launch
                </p>
              </div>
              <span style={{ color: '#F59E0B', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                {STORE_CATALOG.length} IDS
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8 }}>
              {[
                ['SUBSCRIPTIONS', storeSubscriptionCount],
                ['PACKS', storePackCount],
                ['PATH', recommendedRevenuePath.label],
                ['SIGNAL', recommendedRevenuePath.signal],
              ].map(([label, value]) => (
                <div key={label} style={{ borderRadius: 10, padding: 9, background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ margin: 0, color: '#F59E0B', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{label}</p>
                  <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 14, fontWeight: 900 }}>{value}</p>
                </div>
              ))}
            </div>
            <p style={{ margin: '10px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
              Validate pricing language manually with your audience before store products, receipt validation, and entitlement QA are complete.
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(pricingTestKitCopy)}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(245,158,11,0.22)', background: 'rgba(245,158,11,0.10)',
                color: '#F59E0B', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
              }}
            >
              COPY PRICING TEST KIT
            </button>
          </div>
        )}

        {(isAdmin || creatorEnabled) && (
          <div style={{
            borderRadius: 16, padding: 16, marginBottom: 20,
            background: 'rgba(236,72,153,0.05)',
            border: '1px solid rgba(236,72,153,0.16)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>FOUNDER MEMBER OFFER KIT</p>
                <p style={{ margin: '4px 0 0', color: '#F472B6', fontSize: 10, fontFamily: 'monospace' }}>
                  Early-member value validation before paid access
                </p>
              </div>
              <span style={{ color: '#F472B6', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                NO SALE
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {[
                ['DEMAND', monetizationSignalTotal],
                ['REACH', campaignPerformanceSummary.memberReach || 0],
                ['REFERRALS', referralJoins],
                ['PATH', recommendedRevenuePath.label],
              ].map(([label, value]) => (
                <div key={label} style={{ borderRadius: 10, padding: 9, background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ margin: 0, color: '#F472B6', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{label}</p>
                  <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 14, fontWeight: 900 }}>{value}</p>
                </div>
              ))}
            </div>
            <p style={{ margin: '10px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
              Invite early members into the free challenge loop and collect first-party interest before any founder pricing, purchase, or entitlement exists.
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(founderMemberOfferCopy)}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(236,72,153,0.22)', background: 'rgba(236,72,153,0.10)',
                color: '#F472B6', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
              }}
            >
              COPY FOUNDER OFFER KIT
            </button>
          </div>
        )}

        {(isAdmin || creatorEnabled) && (
          <div style={{
            borderRadius: 16, padding: 16, marginBottom: 20,
            background: 'rgba(59,130,246,0.05)',
            border: '1px solid rgba(59,130,246,0.16)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>COMMUNITY AMBASSADOR KIT</p>
                <p style={{ margin: '4px 0 0', color: '#60A5FA', fontSize: 10, fontFamily: 'monospace' }}>
                  Recognition-led referral and challenge leadership
                </p>
              </div>
              <span style={{ color: '#60A5FA', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                NO PAYOUTS
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {[
                ['REFERRALS', referralJoins],
                ['REACH', campaignPerformanceSummary.memberReach || 0],
                ['DEMAND', monetizationSignalTotal],
                ['PATH', recommendedRevenuePath.label],
              ].map(([label, value]) => (
                <div key={label} style={{ borderRadius: 10, padding: 9, background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ margin: 0, color: '#60A5FA', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{label}</p>
                  <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 14, fontWeight: 900 }}>{value}</p>
                </div>
              ))}
            </div>
            <p style={{ margin: '10px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
              Recruit ambassadors through recognition, challenge leadership, and copy prompts before any paid role, affiliate, or revenue-share model exists.
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(communityAmbassadorCopy)}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(59,130,246,0.22)', background: 'rgba(59,130,246,0.10)',
                color: '#60A5FA', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
              }}
            >
              COPY AMBASSADOR KIT
            </button>
          </div>
        )}

        {(isAdmin || creatorEnabled) && (
          <div style={{
            borderRadius: 16, padding: 16, marginBottom: 20,
            background: 'rgba(20,184,166,0.05)',
            border: '1px solid rgba(20,184,166,0.16)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>CUSTOMER VALUE CHECKLIST</p>
                <p style={{ margin: '4px 0 0', color: '#2DD4BF', fontSize: 10, fontFamily: 'monospace' }}>
                  Charge only after value is visible
                </p>
              </div>
              <span style={{ color: '#2DD4BF', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                PRE-LAUNCH
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {[
                ['FREE LOOP', daysActive],
                ['PAID SIGNAL', monetizationSignalTotal],
                ['REACH', campaignPerformanceSummary.memberReach || 0],
                ['PATH', recommendedRevenuePath.label],
              ].map(([label, value]) => (
                <div key={label} style={{ borderRadius: 10, padding: 9, background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ margin: 0, color: '#2DD4BF', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{label}</p>
                  <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 14, fontWeight: 900 }}>{value}</p>
                </div>
              ))}
            </div>
            <p style={{ margin: '10px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
              Validate the free challenge loop, paid accountability value, community proof, and support readiness before charging users.
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(customerValueChecklistCopy)}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(20,184,166,0.22)', background: 'rgba(20,184,166,0.10)',
                color: '#2DD4BF', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
              }}
            >
              COPY VALUE CHECKLIST
            </button>
          </div>
        )}

        {(isAdmin || creatorEnabled) && (
          <div style={{
            borderRadius: 16, padding: 16, marginBottom: 20,
            background: 'rgba(168,85,247,0.05)',
            border: '1px solid rgba(168,85,247,0.16)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>LAUNCH EXPERIMENT KIT</p>
                <p style={{ margin: '4px 0 0', color: '#C084FC', fontSize: 10, fontFamily: 'monospace' }}>
                  Manual Instagram and app growth tests
                </p>
              </div>
              <span style={{ color: '#C084FC', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                {recommendedLaunchExperiment.label.toUpperCase()}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8 }}>
              {launchExperiments.map(experiment => (
                <div key={experiment.id} style={{ borderRadius: 10, padding: 10, background: 'rgba(0,0,0,0.18)', border: `1px solid ${experiment.id === recommendedLaunchExperiment.id ? 'rgba(192,132,252,0.42)' : 'rgba(255,255,255,0.06)'}` }}>
                  <p style={{ margin: 0, color: '#C084FC', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
                    SIGNAL {experiment.signal}
                  </p>
                  <p style={{ margin: '5px 0 0', color: '#fff', fontSize: 12, fontWeight: 900 }}>{experiment.label}</p>
                  <p style={{ margin: '4px 0 0', color: '#888', fontSize: 9, lineHeight: 1.35 }}>{experiment.action}</p>
                </div>
              ))}
            </div>
            <p style={{ margin: '10px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
              Recommended: {recommendedLaunchExperiment.action}
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(launchExperimentCopy)}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(168,85,247,0.22)', background: 'rgba(168,85,247,0.10)',
                color: '#C084FC', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
              }}
            >
              COPY EXPERIMENT BRIEF
            </button>
          </div>
        )}

        {(isAdmin || creatorEnabled) && (
          <div style={{
            borderRadius: 16, padding: 16, marginBottom: 20,
            background: 'rgba(14,165,233,0.05)',
            border: '1px solid rgba(14,165,233,0.16)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>LAUNCH EXPERIMENT SCORECARD</p>
                <p style={{ margin: '4px 0 0', color: '#38BDF8', fontSize: 10, fontFamily: 'monospace' }}>
                  First-party signal readout for the next test
                </p>
              </div>
              <span style={{ color: '#38BDF8', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                {experimentScoreLabel}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {[
                ['SCORE', `${experimentScore}/100`],
                ['DEMAND', experimentScorecard.demandSignal],
                ['REACH', experimentScorecard.campaignReach],
                ['LOOP', experimentScorecard.communityLoop],
              ].map(([label, value]) => (
                <div key={label} style={{ borderRadius: 10, padding: 9, background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ margin: 0, color: '#38BDF8', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{label}</p>
                  <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 16, fontWeight: 900 }}>{value}</p>
                </div>
              ))}
            </div>
            <p style={{ margin: '10px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
              Recommended test: {recommendedLaunchExperiment.label}. This is a manual planning score from first-party signals only.
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(launchExperimentScorecardCopy)}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(14,165,233,0.22)', background: 'rgba(14,165,233,0.10)',
                color: '#38BDF8', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
              }}
            >
              COPY EXPERIMENT SCORECARD
            </button>
          </div>
        )}

        {(isAdmin || creatorEnabled) && (
          <div style={{
            borderRadius: 16, padding: 16, marginBottom: 20,
            background: 'rgba(20,184,166,0.05)',
            border: '1px solid rgba(20,184,166,0.16)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>RELEASE QA CHECKLIST</p>
                <p style={{ margin: '4px 0 0', color: '#2DD4BF', fontSize: 10, fontFamily: 'monospace' }}>
                  Manual cross-platform guardrails before launch
                </p>
              </div>
              <span style={{ color: '#2DD4BF', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                WEB IOS ANDROID
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8 }}>
              {launchQaChecklist.map(([label, status, ready]) => (
                <div key={label} style={{ borderRadius: 10, padding: 10, background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ margin: 0, color: ready ? '#34D399' : '#FBBF24', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
                    {ready ? 'READY' : 'CHECK'}
                  </p>
                  <p style={{ margin: '5px 0 0', color: '#fff', fontSize: 12, fontWeight: 900 }}>{label}</p>
                  <p style={{ margin: '4px 0 0', color: '#888', fontSize: 9, lineHeight: 1.35 }}>{status}</p>
                </div>
              ))}
            </div>
            <p style={{ margin: '10px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
              Use this before promoting monetization, launch experiments, or Instagram-led challenge pushes.
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(launchQaChecklistCopy)}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(20,184,166,0.22)', background: 'rgba(20,184,166,0.10)',
                color: '#2DD4BF', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
              }}
            >
              COPY RELEASE QA CHECKLIST
            </button>
          </div>
        )}

        {(isAdmin || creatorEnabled) && (
          <div style={{
            borderRadius: 16, padding: 16, marginBottom: 20,
            background: 'rgba(244,114,182,0.05)',
            border: '1px solid rgba(244,114,182,0.16)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>LAUNCH RETROSPECTIVE KIT</p>
                <p style={{ margin: '4px 0 0', color: '#F472B6', fontSize: 10, fontFamily: 'monospace' }}>
                  Manual first-party review after a campaign push
                </p>
              </div>
              <span style={{ color: '#F472B6', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                REVIEW
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {[
                ['SCORE', `${experimentScore}/100`],
                ['DEMAND', experimentScorecard.demandSignal],
                ['REFERRALS', referralJoins],
                ['LOOP', experimentScorecard.communityLoop],
              ].map(([label, value]) => (
                <div key={label} style={{ borderRadius: 10, padding: 9, background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ margin: 0, color: '#F472B6', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{label}</p>
                  <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 16, fontWeight: 900 }}>{value}</p>
                </div>
              ))}
            </div>
            <p style={{ margin: '10px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
              Review challenge joins, referral movement, feature submissions, share-card usage, and entitlement validation after the push.
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(launchRetrospectiveCopy)}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(244,114,182,0.22)', background: 'rgba(244,114,182,0.10)',
                color: '#F472B6', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
              }}
            >
              COPY RETROSPECTIVE KIT
            </button>
          </div>
        )}

        {isAdmin && (
          <div style={{
            borderRadius: 16, padding: 16, marginBottom: 20,
            background: 'rgba(52,211,153,0.05)',
            border: '1px solid rgba(52,211,153,0.16)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>LAPSED MEMBER WINBACK KIT</p>
                <p style={{ margin: '4px 0 0', color: '#34D399', fontSize: 10, fontFamily: 'monospace' }}>
                  Free comeback challenge and app-first return copy
                </p>
              </div>
              <span style={{ color: '#34D399', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                FREE FIRST
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 10 }}>
              {[
                ['STREAK', currentStreak],
                ['REFERRALS', referralJoins],
                ['SIGNALS', monetizationSignalTotal],
                ['WEEK', weeklyCampaignPrompt.week],
              ].map(([label, value]) => (
                <div key={label} style={{ borderRadius: 10, padding: 9, background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ margin: 0, color: '#34D399', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{label}</p>
                  <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 15, fontWeight: 900 }}>{value}</p>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gap: 6 }}>
              {LAPSED_MEMBER_WINBACK_ITEMS.map((item, index) => (
                <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ color: '#34D399', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>{index + 1}</span>
                  <span style={{ color: '#aaa', fontSize: 10, fontWeight: 800, lineHeight: 1.35 }}>{item}</span>
                </div>
              ))}
            </div>
            <p style={{ margin: '10px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
              Copy a free-first comeback prompt for lapsed members without automated messaging, discounts, purchases, entitlements, or pressure.
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(lapsedMemberWinbackCopy)}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(52,211,153,0.22)', background: 'rgba(52,211,153,0.10)',
                color: '#34D399', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
              }}
            >
              COPY LAPSED WINBACK
            </button>
          </div>
        )}

        {isAdmin && (
          <div style={{
            borderRadius: 16, padding: 16, marginBottom: 20,
            background: 'rgba(244,114,182,0.05)',
            border: '1px solid rgba(244,114,182,0.16)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>CANCELLATION FEEDBACK KIT</p>
                <p style={{ margin: '4px 0 0', color: '#F472B6', fontSize: 10, fontFamily: 'monospace' }}>
                  Marketplace-safe churn learning prompts
                </p>
              </div>
              <span style={{ color: '#F472B6', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                LEARN ONLY
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 10 }}>
              {[
                ['SIGNALS', monetizationSignalTotal],
                ['PRO TRIAL', proTrialDemandTotal],
                ['PACKS', challengePackProducts.length],
                ['PATH', recommendedRevenuePath.label],
              ].map(([label, value]) => (
                <div key={label} style={{ borderRadius: 10, padding: 9, background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ margin: 0, color: '#F472B6', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{label}</p>
                  <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 14, fontWeight: 900, overflowWrap: 'anywhere' }}>{value}</p>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gap: 6 }}>
              {CANCELLATION_FEEDBACK_ITEMS.map((item, index) => (
                <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ color: '#F472B6', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>{index + 1}</span>
                  <span style={{ color: '#aaa', fontSize: 10, fontWeight: 800, lineHeight: 1.35 }}>{item}</span>
                </div>
              ))}
            </div>
            <p style={{ margin: '10px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
              Copy optional churn-learning prompts without blocking cancellation, discounting, charging, refunding, or changing entitlements.
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(cancellationFeedbackCopy)}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(244,114,182,0.22)', background: 'rgba(244,114,182,0.10)',
                color: '#F472B6', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
              }}
            >
              COPY CANCELLATION FEEDBACK
            </button>
          </div>
        )}

        {isAdmin && (
          <div style={{
            borderRadius: 16, padding: 16, marginBottom: 20,
            background: 'rgba(167,139,250,0.05)',
            border: '1px solid rgba(167,139,250,0.16)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>RENEWAL RECOVERY KIT</p>
                <p style={{ margin: '4px 0 0', color: '#A78BFA', fontSize: 10, fontFamily: 'monospace' }}>
                  Failed-renewal and lapsed-access support copy
                </p>
              </div>
              <span style={{ color: '#A78BFA', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                RESTORE FIRST
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 10 }}>
              {[
                ['PRO', proActive ? 'ACTIVE' : 'LAPSED'],
                ['PACKS', `${activeChallengePackCount}/${challengePackProducts.length}`],
                ['RECOVERY', entitlementRecoveryReviewQueue.length],
                ['FAILED', storeTestEvidenceSummary.failed],
              ].map(([label, value]) => (
                <div key={label} style={{ borderRadius: 10, padding: 9, background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ margin: 0, color: '#A78BFA', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{label}</p>
                  <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 14, fontWeight: 900 }}>{value}</p>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gap: 6 }}>
              {RENEWAL_RECOVERY_ITEMS.map((item, index) => (
                <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ color: '#A78BFA', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>{index + 1}</span>
                  <span style={{ color: '#aaa', fontSize: 10, fontWeight: 800, lineHeight: 1.35 }}>{item}</span>
                </div>
              ))}
            </div>
            <p style={{ margin: '10px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
              Copy failed-renewal and lapsed-access guidance without retrying charges, collecting payment details, or changing entitlements from profile UI.
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(renewalRecoveryCopy)}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(167,139,250,0.22)', background: 'rgba(167,139,250,0.10)',
                color: '#A78BFA', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
              }}
            >
              COPY RENEWAL RECOVERY
            </button>
          </div>
        )}

        {isAdmin && (
          <div style={{
            borderRadius: 16, padding: 16, marginBottom: 20,
            background: 'rgba(56,189,248,0.05)',
            border: '1px solid rgba(56,189,248,0.16)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>STORE TEST PURCHASE EVIDENCE LOG</p>
                <p style={{ margin: '4px 0 0', color: '#38BDF8', fontSize: 10, fontFamily: 'monospace' }}>
                  Sandbox and license-test proof before paid launch
                </p>
              </div>
              <span style={{ color: '#38BDF8', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                {storeTestEvidenceLog.length} RECORDS
              </span>
            </div>
            <p style={{ margin: '0 0 10px', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
              Record storeTestPurchaseEvidence after manual App Store sandbox or Play license testing. Evidence records are admin-only and must not write entitlements, create purchases, process refunds, bypass marketplace policy, or mark paid access live.
            </p>
            <div style={{ display: 'grid', gap: 8 }}>
              {storeTestEvidenceCases.map(test => (
                <button
                  key={test.id}
                  onClick={() => handleRecordStoreTestEvidence(test)}
                  disabled={!!recordingStoreTestEvidenceId || !test.productId}
                  style={{
                    width: '100%', borderRadius: 12, padding: '10px 12px',
                    border: '1px solid rgba(56,189,248,0.18)',
                    background: 'rgba(0,0,0,0.18)', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                    cursor: recordingStoreTestEvidenceId ? 'wait' : 'pointer',
                  }}
                >
                  <span style={{ textAlign: 'left' }}>
                    <span style={{ display: 'block', fontSize: 11, fontWeight: 900 }}>{test.label}</span>
                    <span style={{ display: 'block', marginTop: 3, color: '#777', fontSize: 9, fontFamily: 'monospace' }}>{test.productId || 'PRODUCT MISSING'}</span>
                  </span>
                  <span style={{ color: '#38BDF8', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
                    {recordingStoreTestEvidenceId === test.id ? 'RECORDING' : 'RECORD'}
                  </span>
                </button>
              ))}
            </div>
            {storeTestEvidenceMessage && (
              <p style={{ margin: '10px 0 0', color: storeTestEvidenceMessage.includes('recorded') ? '#38BDF8' : '#ffb199', fontSize: 10, fontWeight: 800, lineHeight: 1.4 }}>
                {storeTestEvidenceMessage}
              </p>
            )}
            <div style={{ marginTop: 12, display: 'grid', gap: 8 }}>
              {storeTestEvidenceLog.length === 0 ? (
                <p style={{ margin: 0, color: '#666', fontSize: 10, fontFamily: 'monospace' }}>No store test purchase evidence recorded yet.</p>
              ) : storeTestEvidenceLog.slice(0, 5).map(item => (
                <div key={item.id} style={{ borderRadius: 12, padding: 10, background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ margin: 0, color: '#fff', fontSize: 11, fontWeight: 900 }}>{String(item.platform || '').toUpperCase()} · {String(item.testCase || '').replace(/_/g, ' ')}</p>
                  <p style={{ margin: '4px 0 0', color: '#aaa', fontSize: 10, lineHeight: 1.35 }}>
                    {item.productId} · {String(item.result || 'needs_review').replace(/_/g, ' ')}
                  </p>
                  <textarea
                    value={storeTestEvidenceReviewNotes[item.id] || ''}
                    onChange={(event) => setStoreTestEvidenceReviewNotes(notes => ({ ...notes, [item.id]: event.target.value }))}
                    placeholder="Manual store test evidence review note: screenshot, tester account, receipt validation log, restore outcome..."
                    rows={2}
                    style={{
                      width: '100%',
                      marginTop: 8,
                      padding: 8,
                      borderRadius: 10,
                      border: '1px solid rgba(255,255,255,0.08)',
                      background: 'rgba(0,0,0,0.2)',
                      color: '#ddd',
                      fontSize: 10,
                      fontWeight: 700,
                      fontFamily: "'Space Grotesk', sans-serif",
                      resize: 'vertical',
                      boxSizing: 'border-box',
                    }}
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 6, marginTop: 8 }}>
                    {[
                      ['verified', 'VERIFIED', 'reviewed'],
                      ['needs_review', 'NEEDS REVIEW', 'recorded'],
                      ['failed', 'FAILED', 'reviewed'],
                      ['needs_review', 'ARCHIVE', 'archived'],
                    ].map(([result, label, status]) => (
                      <button
                        key={`${item.id}-${label}`}
                        onClick={() => handleReviewStoreTestEvidence(item.id, result, status)}
                        disabled={reviewingStoreTestEvidenceId === item.id}
                        style={{
                          border: '1px solid rgba(56,189,248,0.2)',
                          background: 'rgba(56,189,248,0.08)',
                          color: '#7DD3FC',
                          borderRadius: 10,
                          padding: '8px 4px',
                          fontSize: 8,
                          fontWeight: 900,
                          cursor: reviewingStoreTestEvidenceId === item.id ? 'default' : 'pointer',
                        }}
                      >
                        {reviewingStoreTestEvidenceId === item.id ? '...' : label}
                      </button>
                    ))}
                  </div>
                  <p style={{ margin: '6px 0 0', color: '#777', fontSize: 9, fontWeight: 800, lineHeight: 1.35 }}>
                    Manual store test evidence review only; this must not write entitlements, create purchases, process refunds, bypass marketplace policy, or mark paid access live.
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {isAdmin && (
          <div style={{
            borderRadius: 16, padding: 16, marginBottom: 20,
            background: 'rgba(45,212,191,0.05)',
            border: '1px solid rgba(45,212,191,0.16)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>SUBSCRIPTION MANAGEMENT GUIDANCE KIT</p>
                <p style={{ margin: '4px 0 0', color: '#2DD4BF', fontSize: 10, fontFamily: 'monospace' }}>
                  App Store and Play cancellation/support boundaries
                </p>
              </div>
              <span style={{ color: '#2DD4BF', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                MARKETPLACE FIRST
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 10 }}>
              {[
                ['PRODUCTS', STORE_CATALOG.length],
                ['SUBS', storeSubscriptionCount],
                ['PACKS', storePackCount],
                ['SIGNALS', monetizationSignalTotal],
              ].map(([label, value]) => (
                <div key={label} style={{ borderRadius: 10, padding: 9, background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ margin: 0, color: '#2DD4BF', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{label}</p>
                  <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 16, fontWeight: 900 }}>{value}</p>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gap: 6 }}>
              {SUBSCRIPTION_MANAGEMENT_GUIDANCE_ITEMS.map((item, index) => (
                <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ color: '#2DD4BF', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>{index + 1}</span>
                  <span style={{ color: '#aaa', fontSize: 10, fontWeight: 800, lineHeight: 1.35 }}>{item}</span>
                </div>
              ))}
            </div>
            <p style={{ margin: '10px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
              Copy marketplace-first subscription guidance without cancelling, refunding, or changing entitlements from profile UI.
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(subscriptionManagementGuidanceCopy)}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(45,212,191,0.22)', background: 'rgba(45,212,191,0.10)',
                color: '#2DD4BF', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
              }}
            >
              COPY SUBSCRIPTION GUIDANCE
            </button>
          </div>
        )}

        {isAdmin && (
          <div style={{
            borderRadius: 16, padding: 16, marginBottom: 20,
            background: 'rgba(251,191,36,0.05)',
            border: '1px solid rgba(251,191,36,0.16)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>BILLING SUPPORT ESCALATION KIT</p>
                <p style={{ margin: '4px 0 0', color: '#FBBF24', fontSize: 10, fontFamily: 'monospace' }}>
                  Wrong-account, renewal, charge, and entitlement triage
                </p>
              </div>
              <span style={{ color: '#FBBF24', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                HANDOFF
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 10 }}>
              {[
                ['PRODUCTS', STORE_CATALOG.length],
                ['EVIDENCE', storeTestEvidenceSummary.total],
                ['RECOVERY', entitlementRecoveryReviewQueue.length],
                ['FAILED', storeTestEvidenceSummary.failed],
              ].map(([label, value]) => (
                <div key={label} style={{ borderRadius: 10, padding: 9, background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ margin: 0, color: '#FBBF24', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{label}</p>
                  <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 16, fontWeight: 900 }}>{value}</p>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gap: 6 }}>
              {BILLING_SUPPORT_ESCALATION_ITEMS.map((item, index) => (
                <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ color: '#FBBF24', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>{index + 1}</span>
                  <span style={{ color: '#aaa', fontSize: 10, fontWeight: 800, lineHeight: 1.35 }}>{item}</span>
                </div>
              ))}
            </div>
            <p style={{ margin: '10px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
              Copy a marketplace-first billing escalation handoff without refunding, cancelling, or changing entitlements from profile UI.
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(billingSupportEscalationCopy)}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(251,191,36,0.22)', background: 'rgba(251,191,36,0.10)',
                color: '#FBBF24', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
              }}
            >
              COPY BILLING ESCALATION
            </button>
          </div>
        )}

        {isAdmin && (
          <div style={{
            borderRadius: 16, padding: 16, marginBottom: 20,
            background: 'rgba(56,189,248,0.05)',
            border: '1px solid rgba(56,189,248,0.16)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>ENTITLEMENT RECOVERY REVIEW QUEUE</p>
                <p style={{ margin: '4px 0 0', color: '#38BDF8', fontSize: 10, fontFamily: 'monospace' }}>
                  Missing purchase support cases
                </p>
              </div>
              <span style={{ color: '#38BDF8', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                {entitlementRecoveryReviewQueue.length} OPEN
              </span>
            </div>
            <p style={{ margin: '0 0 10px', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
              Admin-only queue for open entitlementRecoveryRequests. Review store account, restore logs, receipt validation, and support notes; do not write entitlements, process refunds, cancel subscriptions, create purchases, or bypass marketplace policy from profile UI.
            </p>
            {entitlementRecoveryReviewQueue.length === 0 ? (
              <p style={{ margin: 0, color: '#666', fontSize: 10, fontFamily: 'monospace' }}>No open entitlement recovery requests.</p>
            ) : entitlementRecoveryReviewQueue.slice(0, 5).map(req => (
              <div key={req.id || req.uid} style={{ borderRadius: 12, padding: 10, marginBottom: 8, background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p style={{ margin: 0, color: '#fff', fontSize: 11, fontWeight: 900 }}>{req.displayName || req.email || req.uid}</p>
                <p style={{ margin: '4px 0 0', color: '#aaa', fontSize: 10, lineHeight: 1.35 }}>
                  Reason: {String(req.reason || 'restore_sync_failed').replace(/_/g, ' ')} · Pro: {req.proActive ? 'active' : 'inactive'} · Packs: {req.activePackCount || 0}/{req.packCount || 0}
                </p>
                <textarea
                  value={entitlementRecoveryReviewNotes[req.id] || ''}
                  onChange={event => setEntitlementRecoveryReviewNotes(notes => ({ ...notes, [req.id]: event.target.value.slice(0, 500) }))}
                  placeholder="Manual entitlement recovery review note: store account, restore logs, receipt validation, support handoff..."
                  rows={2}
                  style={{
                    width: '100%', marginTop: 8, border: '1px solid rgba(56,189,248,0.18)',
                    borderRadius: 10, background: 'rgba(0,0,0,0.20)', color: '#fff', padding: 8,
                    fontSize: 11, lineHeight: 1.35, resize: 'vertical', boxSizing: 'border-box',
                  }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 6, marginTop: 8 }}>
                  {[
                    ['waiting', 'WAIT'],
                    ['resolved', 'RESOLVE'],
                    ['closed', 'CLOSE'],
                  ].map(([status, label]) => (
                    <button
                      key={status}
                      onClick={() => handleEntitlementRecoveryReview(req.id, status)}
                      disabled={reviewingEntitlementRecoveryRequestId === req.id}
                      style={{
                        border: 0, borderRadius: 8, padding: '7px 6px',
                        background: 'rgba(56,189,248,0.14)', color: '#38BDF8',
                        fontSize: 9, fontWeight: 900, fontFamily: 'monospace',
                        cursor: reviewingEntitlementRecoveryRequestId === req.id ? 'wait' : 'pointer',
                      }}
                    >
                      {reviewingEntitlementRecoveryRequestId === req.id ? 'SAVING' : label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {isAdmin && (
          <div style={{
            borderRadius: 16, padding: 16, marginBottom: 20,
            background: 'rgba(255,215,0,0.05)',
            border: '1px solid rgba(255,215,0,0.16)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Store Launch Readiness</p>
                <p style={{ margin: '4px 0 0', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
                  Admin-only product and receipt validation checklist
                </p>
              </div>
              <span style={{ color: GOLD, fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                CREDENTIALS PENDING
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 10 }}>
              {[
                ['PRODUCT IDS', STORE_CATALOG.length],
                ['SUBS', storeSubscriptionCount],
                ['PACKS', storePackCount],
              ].map(([label, value]) => (
                <div key={label} style={{ borderRadius: 10, padding: 9, background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ margin: 0, color: GOLD, fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{label}</p>
                  <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 18, fontWeight: 900 }}>{value}</p>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gap: 6 }}>
              {STORE_READINESS_ITEMS.map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: GOLD, fontSize: 11 }}>•</span>
                  <span style={{ color: '#aaa', fontSize: 10, fontWeight: 800 }}>{item}</span>
                </div>
              ))}
            </div>
            <p style={{ margin: '10px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
              {storeReadinessCopy}
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(storeReadinessCopy)}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(255,215,0,0.22)', background: 'rgba(255,215,0,0.10)',
                color: GOLD, fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
              }}
            >
              COPY STORE LAUNCH CHECKLIST
            </button>
          </div>
        )}

        {isAdmin && (
          <div style={{
            borderRadius: 16, padding: 16, marginBottom: 20,
            background: 'rgba(56,189,248,0.05)',
            border: '1px solid rgba(56,189,248,0.16)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>STORE REVIEW EVIDENCE PACK</p>
                <p style={{ margin: '4px 0 0', color: '#38BDF8', fontSize: 10, fontFamily: 'monospace' }}>
                  Reviewer proof package from release checks
                </p>
              </div>
              <span style={{ color: '#38BDF8', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                COPY ONLY
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 10 }}>
              {[
                ['EVIDENCE', `${storeTestEvidenceSummary.ios}/${storeTestEvidenceSummary.android}`],
                ['CHECKS', `${paidLaunchReadyCount}/${paidLaunchDecisionItems.length}`],
                ['LINKS', POLICY_LINKS.length],
                ['STATUS', paidLaunchDecisionStatus],
              ].map(([label, value]) => (
                <div key={label} style={{ borderRadius: 10, padding: 9, background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ margin: 0, color: '#38BDF8', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{label}</p>
                  <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 13, fontWeight: 900 }}>{value}</p>
                </div>
              ))}
            </div>
            <p style={{ margin: 0, color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
              Compile store-test evidence, product IDs, support links, policy links, permission notes, and launch gate status into a reviewer-safe proof brief.
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(storeReviewEvidencePackCopy)}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(56,189,248,0.22)', background: 'rgba(56,189,248,0.10)',
                color: '#38BDF8', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
              }}
            >
              COPY REVIEW EVIDENCE PACK
            </button>
          </div>
        )}

        {isAdmin && (
          <div style={{
            borderRadius: 16, padding: 16, marginBottom: 20,
            background: 'rgba(52,211,153,0.05)',
            border: '1px solid rgba(52,211,153,0.16)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>STORE CREDENTIAL SETUP KIT</p>
                <p style={{ margin: '4px 0 0', color: '#34D399', fontSize: 10, fontFamily: 'monospace' }}>
                  App Store, Play Billing, and Firebase validation handoff
                </p>
              </div>
              <span style={{ color: '#34D399', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                TEST FIRST
              </span>
            </div>
            <div style={{ display: 'grid', gap: 6 }}>
              {STORE_CREDENTIAL_SETUP_ITEMS.map((item, index) => (
                <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ color: '#34D399', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                    {index + 1}
                  </span>
                  <span style={{ color: '#aaa', fontSize: 10, fontWeight: 800, lineHeight: 1.35 }}>{item}</span>
                </div>
              ))}
            </div>
            <p style={{ margin: '10px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
              Use this handoff when store console products exist. Paid access still unlocks only after backend receipt validation writes shared entitlements.
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(storeCredentialSetupCopy)}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(52,211,153,0.22)', background: 'rgba(52,211,153,0.10)',
                color: '#34D399', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
              }}
            >
              COPY CREDENTIAL SETUP KIT
            </button>
            <button
              onClick={handleValidationReadinessCheck}
              disabled={isCheckingValidationReadiness}
              style={{
                marginTop: 8, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.05)',
                color: '#fff', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
                cursor: isCheckingValidationReadiness ? 'wait' : 'pointer',
              }}
            >
              {isCheckingValidationReadiness ? 'CHECKING VALIDATION' : 'CHECK VALIDATION READINESS'}
            </button>
            {validationReadinessMessage && (
              <p style={{ margin: '8px 0 0', color: validationReadinessMessage.includes('Could not') ? '#F87171' : '#34D399', fontSize: 10, fontWeight: 800, lineHeight: 1.45 }}>
                {validationReadinessMessage}
              </p>
            )}
          </div>
        )}

        {isAdmin && (
          <div style={{
            borderRadius: 16, padding: 16, marginBottom: 20,
            background: 'rgba(14,165,233,0.05)',
            border: '1px solid rgba(14,165,233,0.16)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>SANDBOX PURCHASE TEST PLAN</p>
                <p style={{ margin: '4px 0 0', color: '#38BDF8', fontSize: 10, fontFamily: 'monospace' }}>
                  App Store sandbox, Play license tests, restore, and entitlement QA
                </p>
              </div>
              <span style={{ color: '#38BDF8', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                MANUAL QA
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 10 }}>
              {[
                ['PRODUCTS', STORE_CATALOG.length],
                ['SUBS', storeSubscriptionCount],
                ['PACKS', storePackCount],
              ].map(([label, value]) => (
                <div key={label} style={{ borderRadius: 10, padding: 9, background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ margin: 0, color: '#38BDF8', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{label}</p>
                  <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 16, fontWeight: 900 }}>{value}</p>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gap: 6 }}>
              {SANDBOX_PURCHASE_TEST_ITEMS.map((item, index) => (
                <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ color: '#38BDF8', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>{index + 1}</span>
                  <span style={{ color: '#aaa', fontSize: 10, fontWeight: 800, lineHeight: 1.35 }}>{item}</span>
                </div>
              ))}
            </div>
            <p style={{ margin: '10px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
              Copy a manual sandbox QA plan for App Store and Play test purchases before paid access is promoted.
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(sandboxPurchaseTestPlanCopy)}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(56,189,248,0.22)', background: 'rgba(56,189,248,0.10)',
                color: '#38BDF8', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
              }}
            >
              COPY SANDBOX TEST PLAN
            </button>
          </div>
        )}

        {isAdmin && (
          <div style={{
            borderRadius: 16, padding: 16, marginBottom: 20,
            background: 'rgba(56,189,248,0.05)',
            border: '1px solid rgba(56,189,248,0.16)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>SUPPORT REFUND READINESS KIT</p>
                <p style={{ margin: '4px 0 0', color: '#38BDF8', fontSize: 10, fontFamily: 'monospace' }}>
                  Restore, refund, and entitlement support handoff
                </p>
              </div>
              <span style={{ color: '#38BDF8', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                SUPPORT FIRST
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 10 }}>
              {[
                ['PRODUCTS', STORE_CATALOG.length],
                ['SUBS', storeSubscriptionCount],
                ['PACKS', storePackCount],
                ['SIGNALS', monetizationSignalTotal],
              ].map(([label, value]) => (
                <div key={label} style={{ borderRadius: 10, padding: 9, background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ margin: 0, color: '#38BDF8', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{label}</p>
                  <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 16, fontWeight: 900 }}>{value}</p>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gap: 6 }}>
              {SUPPORT_REFUND_READINESS_ITEMS.map((item, index) => (
                <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ color: '#38BDF8', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>{index + 1}</span>
                  <span style={{ color: '#aaa', fontSize: 10, fontWeight: 800, lineHeight: 1.35 }}>{item}</span>
                </div>
              ))}
            </div>
            <p style={{ margin: '10px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
              Prepare restore, marketplace refund guidance, entitlement recovery, and support escalation before paid access is promoted.
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(supportRefundReadinessCopy)}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(56,189,248,0.22)', background: 'rgba(56,189,248,0.10)',
                color: '#38BDF8', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
              }}
            >
              COPY SUPPORT KIT
            </button>
          </div>
        )}

        {isAdmin && (
          <div style={{
            borderRadius: 16, padding: 16, marginBottom: 20,
            background: 'rgba(248,113,113,0.05)',
            border: '1px solid rgba(248,113,113,0.16)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>PAID LAUNCH DECISION GATE</p>
                <p style={{ margin: '4px 0 0', color: '#F87171', fontSize: 10, fontFamily: 'monospace' }}>
                  Go/no-go checks before paid access is promoted
                </p>
              </div>
              <span style={{ color: '#F87171', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                {paidLaunchDecisionStatus}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 10 }}>
              {[
                ['READY', `${paidLaunchReadyCount}/${paidLaunchDecisionItems.length}`],
                ['PRODUCTS', STORE_CATALOG.length],
                ['EVIDENCE', `${storeTestEvidenceSummary.ios}/${storeTestEvidenceSummary.android}`],
                ['SIGNALS', monetizationSignalTotal],
              ].map(([label, value]) => (
                <div key={label} style={{ borderRadius: 10, padding: 9, background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ margin: 0, color: '#F87171', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{label}</p>
                  <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 15, fontWeight: 900 }}>{value}</p>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gap: 6 }}>
              {paidLaunchDecisionItems.map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ color: item.ready ? '#34D399' : '#F87171', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                    {item.ready ? '✓' : '•'}
                  </span>
                  <span style={{ color: '#aaa', fontSize: 10, fontWeight: 800, lineHeight: 1.35 }}>{item.label}</span>
                </div>
              ))}
            </div>
            <p style={{ margin: '10px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
              Hold paid launch until receipt validation, sandbox purchases, entitlement writes, and support/refund operations are all verified.
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(paidLaunchDecisionCopy)}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(248,113,113,0.22)', background: 'rgba(248,113,113,0.10)',
                color: '#F87171', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
              }}
            >
              COPY LAUNCH DECISION
            </button>
          </div>
        )}

        {isAdmin && (
          <div style={{
            borderRadius: 16, padding: 16, marginBottom: 20,
            background: 'rgba(129,140,248,0.05)',
            border: '1px solid rgba(129,140,248,0.16)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>STORE LISTING COPY KIT</p>
                <p style={{ margin: '4px 0 0', color: '#818CF8', fontSize: 10, fontFamily: 'monospace' }}>
                  App Store and Play listing draft
                </p>
              </div>
              <span style={{ color: '#818CF8', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                POLICY REVIEW
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 10 }}>
              {[
                ['NAME', 'Rise'],
                ['PATH', recommendedRevenuePath.label],
                ['STATUS', paidLaunchDecisionStatus],
                ['CHECKS', `${paidLaunchReadyCount}/${paidLaunchDecisionItems.length}`],
              ].map(([label, value]) => (
                <div key={label} style={{ borderRadius: 10, padding: 9, background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ margin: 0, color: '#818CF8', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{label}</p>
                  <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 13, fontWeight: 900 }}>{value}</p>
                </div>
              ))}
            </div>
            <p style={{ margin: 0, color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
              Lead with free challenges, streaks, badges, calendar history, community accountability, and shareable progress while paid features remain store-backed and policy-reviewed.
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(storeListingCopy)}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(129,140,248,0.22)', background: 'rgba(129,140,248,0.10)',
                color: '#818CF8', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
              }}
            >
              COPY STORE LISTING
            </button>
          </div>
        )}

        {isAdmin && (
          <div style={{
            borderRadius: 16, padding: 16, marginBottom: 20,
            background: 'rgba(20,184,166,0.05)',
            border: '1px solid rgba(20,184,166,0.16)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>STORE REVIEW SUBMISSION KIT</p>
                <p style={{ margin: '4px 0 0', color: '#14B8A6', fontSize: 10, fontFamily: 'monospace' }}>
                  Reviewer notes and permission checklist
                </p>
              </div>
              <span style={{ color: '#14B8A6', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                REVIEW READY
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 10 }}>
              {[
                ['ACCOUNT', 'Demo'],
                ['PERMS', 'Health/Media'],
                ['IAP', paidLaunchDecisionStatus],
                ['QA', `${paidLaunchReadyCount}/${paidLaunchDecisionItems.length}`],
              ].map(([label, value]) => (
                <div key={label} style={{ borderRadius: 10, padding: 9, background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ margin: 0, color: '#14B8A6', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{label}</p>
                  <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 13, fontWeight: 900 }}>{value}</p>
                </div>
              ))}
            </div>
            <p style={{ margin: 0, color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
              Prepare App Review and Play review notes for demo access, optional HealthKit/Health Connect sync, media permissions, notifications, support links, privacy policy, and data deletion.
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(storeReviewSubmissionCopy)}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(20,184,166,0.22)', background: 'rgba(20,184,166,0.10)',
                color: '#14B8A6', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
              }}
            >
              COPY REVIEW NOTES
            </button>
          </div>
        )}

        {isAdmin && (
          <div style={{
            borderRadius: 16, padding: 16, marginBottom: 20,
            background: 'rgba(52,211,153,0.05)',
            border: '1px solid rgba(52,211,153,0.16)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>DATA SAFETY DISCLOSURE KIT</p>
                <p style={{ margin: '4px 0 0', color: '#34D399', fontSize: 10, fontFamily: 'monospace' }}>
                  App Privacy and Play Data Safety draft
                </p>
              </div>
              <span style={{ color: '#34D399', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                PRIVACY REVIEW
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 10 }}>
              {[
                ['AUTH', 'Firebase'],
                ['HEALTH', 'Optional'],
                ['UGC', 'Consent'],
                ['IAP', 'Server'],
              ].map(([label, value]) => (
                <div key={label} style={{ borderRadius: 10, padding: 9, background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ margin: 0, color: '#34D399', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{label}</p>
                  <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 13, fontWeight: 900 }}>{value}</p>
                </div>
              ))}
            </div>
            <p style={{ margin: 0, color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
              Prepare Play Data Safety and App Privacy answers for auth, profile content, activity/health data, optional UGC, notifications, purchase verification, support, and data deletion.
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(dataSafetyDisclosureCopy)}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(52,211,153,0.22)', background: 'rgba(52,211,153,0.10)',
                color: '#34D399', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
              }}
            >
              COPY DATA SAFETY
            </button>
          </div>
        )}

        {(isAdmin || creatorEnabled) && (
          <div style={{
            borderRadius: 16, padding: 16, marginBottom: 20,
            background: 'rgba(245,158,11,0.05)',
            border: '1px solid rgba(245,158,11,0.16)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>CHALLENGE PACK LAUNCH KIT</p>
                <p style={{ margin: '4px 0 0', color: '#FBBF24', fontSize: 10, fontFamily: 'monospace' }}>
                  Copy for paid-pack demand before store launch
                </p>
              </div>
              <span style={{ color: '#F59E0B', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                {challengePackProducts.length} PACKS
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8 }}>
              {challengePackProducts.map(product => (
                <div key={product.id} style={{ borderRadius: 10, padding: 10, background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ margin: 0, color: '#F59E0B', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
                    {product.packId?.replace(/_/g, ' ').toUpperCase()}
                  </p>
                  <p style={{ margin: '5px 0 0', color: '#fff', fontSize: 12, fontWeight: 900 }}>{challengePackTitle(product)}</p>
                  <p style={{ margin: '4px 0 0', color: '#777', fontSize: 9, lineHeight: 1.35, wordBreak: 'break-word' }}>{product.id}</p>
                </div>
              ))}
            </div>
            <p style={{ margin: '10px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
              Store credentials and test purchases are still required before promoting paid pack access as live.
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(challengePackLaunchCopy)}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(245,158,11,0.22)', background: 'rgba(245,158,11,0.10)',
                color: '#F59E0B', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
              }}
            >
              COPY PACK LAUNCH COPY
            </button>
            <div style={{ marginTop: 10, padding: 12, borderRadius: 12, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.16)' }}>
              <p style={{ margin: 0, color: '#fff', fontSize: 11, fontWeight: 900, fontFamily: 'monospace' }}>
                CHALLENGE PACK OBJECTION REPLY KIT
              </p>
              <p style={{ margin: '6px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
                Manual replies for pack questions before marketplace validation is complete.
              </p>
              <button
                onClick={() => navigator.clipboard?.writeText(challengePackObjectionReplyCopy)}
                style={{
                  marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                  border: '1px solid rgba(245,158,11,0.22)', background: 'rgba(245,158,11,0.10)',
                  color: '#F59E0B', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
                }}
              >
                COPY PACK REPLIES
              </button>
            </div>
          </div>
        )}

        {isAdmin && (
          <div style={{
            borderRadius: 16, padding: 16, marginBottom: 20,
            background: 'rgba(96,165,250,0.05)',
            border: '1px solid rgba(96,165,250,0.16)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Campaign Performance Board</p>
                <p style={{ margin: '4px 0 0', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
                  Admin-only weekly campaign engine summary
                </p>
              </div>
              <span style={{ color: (campaignPerformanceSummary.total || 0) ? '#60A5FA' : '#777', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                {(campaignPerformanceSummary.total || 0) ? 'CAMPAIGNS LIVE' : 'GATHERING'}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 8 }}>
              {[
                ['CAMPAIGNS', campaignPerformanceSummary.total || 0],
                ['ACTIVE', campaignPerformanceSummary.active || 0],
                ['MEMBERS', campaignPerformanceSummary.memberReach || 0],
              ].map(([label, value]) => (
                <div key={label} style={{ borderRadius: 10, padding: 9, background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ margin: 0, color: '#60A5FA', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{label}</p>
                  <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 18, fontWeight: 900 }}>{value}</p>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {[
                ['PUBLIC', campaignPerformanceSummary.public || 0],
                ['PREMIUM', campaignPerformanceSummary.premium || 0],
                ['SEASONAL', campaignPerformanceSummary.seasonal || 0],
              ].map(([label, value]) => (
                <div key={label} style={{ borderRadius: 10, padding: 9, background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ margin: 0, color: '#A78BFA', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{label}</p>
                  <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 18, fontWeight: 900 }}>{value}</p>
                </div>
              ))}
            </div>
            <p style={{ margin: '10px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
              {campaignPerformanceCopy}
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(campaignPerformanceCopy)}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(96,165,250,0.22)', background: 'rgba(96,165,250,0.10)',
                color: '#60A5FA', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
              }}
            >
              COPY CAMPAIGN BOARD COPY
            </button>
          </div>
        )}

        {(isAdmin || creatorEnabled) && (
          <div style={{
            borderRadius: 16, padding: 16, marginBottom: 20,
            background: 'rgba(52,211,153,0.05)',
            border: '1px solid rgba(52,211,153,0.16)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Weekly Campaign Scheduler</p>
                <p style={{ margin: '4px 0 0', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
                  Creator/admin Instagram cadence prompt
                </p>
              </div>
              <span style={{ color: '#34D399', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                WEEK {weeklyCampaignPrompt.week}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: 8, marginBottom: 10 }}>
              <div style={{ borderRadius: 10, padding: 10, background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p style={{ margin: 0, color: '#34D399', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{weeklyCampaignPrompt.label.toUpperCase()}</p>
                <p style={{ margin: '5px 0 0', color: '#fff', fontSize: 16, fontWeight: 900 }}>{weeklyCampaignPrompt.name}</p>
              </div>
              <div style={{ borderRadius: 10, padding: 10, background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p style={{ margin: 0, color: GOLD, fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>HASHTAG</p>
                <p style={{ margin: '5px 0 0', color: '#fff', fontSize: 12, fontWeight: 900 }}>{weeklyCampaignPrompt.hashtag}</p>
              </div>
            </div>
            <p style={{ margin: 0, color: '#aaa', fontSize: 11, lineHeight: 1.5 }}>
              {weeklyCampaignPrompt.cta}
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(campaignSchedulerCopy)}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(52,211,153,0.22)', background: 'rgba(52,211,153,0.10)',
                color: '#34D399', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
              }}
            >
              COPY WEEKLY CAMPAIGN COPY
            </button>
          </div>
        )}

        {(isAdmin || creatorEnabled) && (
          <div style={{
            borderRadius: 16, padding: 16, marginBottom: 20,
            background: 'rgba(96,165,250,0.05)',
            border: '1px solid rgba(96,165,250,0.16)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Weekly Campaign Launch Card Kit</p>
                <p style={{ margin: '4px 0 0', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
                  Shareable campaign card brief
                </p>
              </div>
              <span style={{ color: '#60A5FA', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                CARD COPY
              </span>
            </div>
            <div style={{
              borderRadius: 14, padding: 14, marginBottom: 10,
              background: 'linear-gradient(135deg, rgba(96,165,250,0.22), rgba(52,211,153,0.12))',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <p style={{ margin: 0, color: '#60A5FA', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
                WEEK {weeklyCampaignPrompt.week} · {weeklyCampaignPrompt.label.toUpperCase()}
              </p>
              <p style={{ margin: '7px 0 0', color: '#fff', fontSize: 20, fontWeight: 900 }}>{weeklyCampaignPrompt.name}</p>
              <p style={{ margin: '7px 0 0', color: '#ddd', fontSize: 12, lineHeight: 1.35 }}>{weeklyCampaignPrompt.cta}</p>
              <p style={{ margin: '10px 0 0', color: GOLD, fontSize: 11, fontWeight: 900, fontFamily: 'monospace' }}>{weeklyCampaignPrompt.hashtag}</p>
            </div>
            <p style={{ margin: 0, color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
              Copy the launch-card headline, caption, design notes, hashtag, and consent-safe posting guardrails for Stories, Reels covers, and challenge invites.
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(weeklyCampaignLaunchCardCopy)}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(96,165,250,0.22)', background: 'rgba(96,165,250,0.10)',
                color: '#60A5FA', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
              }}
            >
              COPY LAUNCH CARD KIT
            </button>
          </div>
        )}

        {(isAdmin || creatorEnabled) && (
          <div style={{
            borderRadius: 16, padding: 16, marginBottom: 20,
            background: 'rgba(20,184,166,0.05)',
            border: '1px solid rgba(20,184,166,0.16)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Weekly Campaign Preflight Checklist</p>
                <p style={{ margin: '4px 0 0', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
                  Manual launch readiness before posting
                </p>
              </div>
              <span style={{ color: '#14B8A6', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                CHECKLIST
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 10 }}>
              {[
                ['CARD', weeklyCampaignPrompt.hashtag],
                ['DM', DM_KEYWORD_PROMPTS.length],
                ['UGC', featureReviewQueue.length],
                ['REACH', campaignPerformanceSummary.memberReach || 0],
              ].map(([label, value]) => (
                <div key={label} style={{ borderRadius: 10, padding: 9, background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ margin: 0, color: '#14B8A6', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{label}</p>
                  <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 13, fontWeight: 900 }}>{value}</p>
                </div>
              ))}
            </div>
            <p style={{ margin: 0, color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
              Confirm card copy, manual DM replies, content calendar, referral copy, consent-reviewed UGC, and first-party review metrics before the weekly push.
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(weeklyCampaignPreflightCopy)}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(20,184,166,0.22)', background: 'rgba(20,184,166,0.10)',
                color: '#14B8A6', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
              }}
            >
              COPY CAMPAIGN PREFLIGHT
            </button>
          </div>
        )}

        {(isAdmin || creatorEnabled) && (
          <div style={{
            borderRadius: 16, padding: 16, marginBottom: 20,
            background: 'rgba(251,191,36,0.05)',
            border: '1px solid rgba(251,191,36,0.16)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Weekly Campaign Review Kit</p>
                <p style={{ margin: '4px 0 0', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
                  First-party weekly campaign review
                </p>
              </div>
              <span style={{ color: GOLD, fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                REVIEW
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 10 }}>
              {[
                ['REACH', campaignPerformanceSummary.memberReach || 0],
                ['REF', referralJoins],
                ['UGC', featureReviewQueue.length],
                ['DM', DM_KEYWORD_PROMPTS.length],
              ].map(([label, value]) => (
                <div key={label} style={{ borderRadius: 10, padding: 9, background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ margin: 0, color: GOLD, fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{label}</p>
                  <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 13, fontWeight: 900 }}>{value}</p>
                </div>
              ))}
            </div>
            <p style={{ margin: 0, color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
              Review challenge joins, referral movement, consent-cleared UGC, manual DM copy, and share-card usage before shaping next week's push.
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(weeklyCampaignReviewCopy)}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(251,191,36,0.22)', background: 'rgba(251,191,36,0.10)',
                color: GOLD, fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
              }}
            >
              COPY CAMPAIGN REVIEW
            </button>
          </div>
        )}

        {(isAdmin || creatorEnabled) && (
          <div style={{
            borderRadius: 16, padding: 16, marginBottom: 20,
            background: 'rgba(244,114,182,0.05)',
            border: '1px solid rgba(244,114,182,0.16)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Weekly Campaign Storyboard Kit</p>
                <p style={{ margin: '4px 0 0', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
                  Reels, Stories, and carousel outline
                </p>
              </div>
              <span style={{ color: '#F472B6', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                STORYBOARD
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 10 }}>
              {[
                ['REEL', '4 BEATS'],
                ['STORY', '4 FRAMES'],
                ['POST', '5 SLIDES'],
                ['TAG', weeklyCampaignPrompt.hashtag],
              ].map(([label, value]) => (
                <div key={label} style={{ borderRadius: 10, padding: 9, background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ margin: 0, color: '#F472B6', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{label}</p>
                  <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 13, fontWeight: 900 }}>{value}</p>
                </div>
              ))}
            </div>
            <p style={{ margin: 0, color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
              Copy a manual Reel hook, Story frame plan, carousel outline, hashtag, and consent-safe publishing guardrails for this week's campaign.
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(weeklyCampaignStoryboardCopy)}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(244,114,182,0.22)', background: 'rgba(244,114,182,0.10)',
                color: '#F472B6', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
              }}
            >
              COPY STORYBOARD KIT
            </button>
          </div>
        )}

        {(isAdmin || creatorEnabled) && (
          <div style={{
            borderRadius: 16, padding: 16, marginBottom: 20,
            background: 'rgba(192,132,252,0.05)',
            border: '1px solid rgba(192,132,252,0.16)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Weekly Campaign Experiment Brief Kit</p>
                <p style={{ margin: '4px 0 0', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
                  Manual experiment from weekly campaign signals
                </p>
              </div>
              <span style={{ color: '#C084FC', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                {recommendedLaunchExperiment.label.toUpperCase()}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 10 }}>
              {[
                ['TEST', recommendedLaunchExperiment.label],
                ['SIGNAL', recommendedLaunchExperiment.signal],
                ['WEEK', weeklyCampaignPrompt.week],
                ['TAG', weeklyCampaignPrompt.hashtag],
              ].map(([label, value]) => (
                <div key={label} style={{ borderRadius: 10, padding: 9, background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ margin: 0, color: '#C084FC', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{label}</p>
                  <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 13, fontWeight: 900 }}>{value}</p>
                </div>
              ))}
            </div>
            <p style={{ margin: 0, color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
              Connect this week's campaign CTA to the recommended manual experiment and review only first-party app movement afterward.
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(weeklyCampaignExperimentBriefCopy)}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(192,132,252,0.22)', background: 'rgba(192,132,252,0.10)',
                color: '#C084FC', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
              }}
            >
              COPY EXPERIMENT BRIEF
            </button>
          </div>
        )}

        {(isAdmin || creatorEnabled) && (
          <div style={{
            borderRadius: 16, padding: 16, marginBottom: 20,
            background: 'rgba(167,139,250,0.05)',
            border: '1px solid rgba(167,139,250,0.16)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Instagram DM Keyword Kit</p>
                <p style={{ margin: '4px 0 0', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
                  Manual replies for Reels, Stories, and community DMs
                </p>
              </div>
              <span style={{ color: '#A78BFA', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                {DM_KEYWORD_PROMPTS.length} KEYWORDS
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8 }}>
              {DM_KEYWORD_PROMPTS.map(prompt => (
                <div key={prompt.keyword} style={{ borderRadius: 10, padding: 10, background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ margin: 0, color: '#A78BFA', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>DM {prompt.keyword}</p>
                  <p style={{ margin: '5px 0 0', color: '#fff', fontSize: 12, fontWeight: 900 }}>{prompt.label}</p>
                  <p style={{ margin: '4px 0 0', color: '#777', fontSize: 9, lineHeight: 1.35 }}>{prompt.reply}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigator.clipboard?.writeText(dmKeywordCopy)}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(167,139,250,0.22)', background: 'rgba(167,139,250,0.10)',
                color: '#A78BFA', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
              }}
            >
              COPY DM KEYWORD REPLIES
            </button>
          </div>
        )}

        {(isAdmin || creatorEnabled) && (
          <div style={{
            borderRadius: 16, padding: 16, marginBottom: 20,
            background: 'rgba(129,140,248,0.05)',
            border: '1px solid rgba(129,140,248,0.16)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Weekly Campaign Comment Reply Kit</p>
                <p style={{ margin: '4px 0 0', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
                  Manual public replies for weekly campaign comments
                </p>
              </div>
              <span style={{ color: '#818CF8', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                {weeklyCampaignPrompt.hashtag}
              </span>
            </div>
            <p style={{ margin: 0, color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
              Copy public comment replies for joining, comeback, paid-access, and Feature Me questions without automation or comment scraping.
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(weeklyCampaignCommentReplyCopy)}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(129,140,248,0.22)', background: 'rgba(129,140,248,0.10)',
                color: '#818CF8', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
              }}
            >
              COPY COMMENT REPLIES
            </button>
          </div>
        )}

        {(isAdmin || creatorEnabled) && (
          <div style={{
            borderRadius: 16, padding: 16, marginBottom: 20,
            background: 'rgba(251,146,60,0.05)',
            border: '1px solid rgba(251,146,60,0.16)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Weekly Campaign Countdown Story Kit</p>
                <p style={{ margin: '4px 0 0', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
                  Manual Story countdown sequence before launch
                </p>
              </div>
              <span style={{ color: '#FB923C', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                COUNTDOWN
              </span>
            </div>
            <p style={{ margin: 0, color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
              Copy countdown frames, sticker text, and app-first launch reminders without scheduling Stories, scraping responses, or treating Story interactions as app consent.
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(weeklyCampaignCountdownStoryCopy)}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(251,146,60,0.22)', background: 'rgba(251,146,60,0.10)',
                color: '#FB923C', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
              }}
            >
              COPY COUNTDOWN STORIES
            </button>
          </div>
        )}

        {(isAdmin || creatorEnabled) && (
          <div style={{
            borderRadius: 16, padding: 16, marginBottom: 20,
            background: 'rgba(34,197,94,0.05)',
            border: '1px solid rgba(34,197,94,0.16)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Weekly Campaign Start-Day Story Kit</p>
                <p style={{ margin: '4px 0 0', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
                  Manual launch-day Stories for first logs
                </p>
              </div>
              <span style={{ color: '#22C55E', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                START DAY
              </span>
            </div>
            <p style={{ margin: 0, color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
              Copy launch-day Story frames and stickers that push followers to join and save the first app log without scraping reactions or creating attribution.
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(weeklyCampaignStartDayStoryCopy)}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(34,197,94,0.22)', background: 'rgba(34,197,94,0.10)',
                color: '#22C55E', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
              }}
            >
              COPY START-DAY STORIES
            </button>
          </div>
        )}

        {(isAdmin || creatorEnabled) && (
          <div style={{
            borderRadius: 16, padding: 16, marginBottom: 20,
            background: 'rgba(16,185,129,0.05)',
            border: '1px solid rgba(16,185,129,0.16)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Weekly Campaign Midweek Check-In Story Kit</p>
                <p style={{ margin: '4px 0 0', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
                  Manual midweek Stories for comeback logs
                </p>
              </div>
              <span style={{ color: '#10B981', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                MIDWEEK
              </span>
            </div>
            <p style={{ margin: 0, color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
              Copy midweek Story frames and stickers that route people back to today's app log without scraping reactions or creating attribution.
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(weeklyCampaignMidweekCheckInStoryCopy)}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(16,185,129,0.22)', background: 'rgba(16,185,129,0.10)',
                color: '#10B981', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
              }}
            >
              COPY MIDWEEK CHECK-IN
            </button>
          </div>
        )}

        {(isAdmin || creatorEnabled) && (
          <div style={{
            borderRadius: 16, padding: 16, marginBottom: 20,
            background: 'rgba(245,158,11,0.05)',
            border: '1px solid rgba(245,158,11,0.16)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Weekly Campaign Weekend Push Story Kit</p>
                <p style={{ margin: '4px 0 0', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
                  Manual weekend Stories for finish-line logs
                </p>
              </div>
              <span style={{ color: '#F59E0B', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                WEEKEND
              </span>
            </div>
            <p style={{ margin: 0, color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
              Copy weekend Story frames and stickers that push saved logs, referrals, and consent-based Feature Me submissions without scraping reactions.
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(weeklyCampaignWeekendPushStoryCopy)}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(245,158,11,0.22)', background: 'rgba(245,158,11,0.10)',
                color: '#F59E0B', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
              }}
            >
              COPY WEEKEND PUSH
            </button>
          </div>
        )}

        {(isAdmin || creatorEnabled) && (
          <div style={{
            borderRadius: 16, padding: 16, marginBottom: 20,
            background: 'rgba(96,165,250,0.05)',
            border: '1px solid rgba(96,165,250,0.16)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Weekly Campaign Completion Recap Story Kit</p>
                <p style={{ margin: '4px 0 0', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
                  Manual recap Stories for consent-safe weekly wins
                </p>
              </div>
              <span style={{ color: '#60A5FA', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                RECAP
              </span>
            </div>
            <p style={{ margin: 0, color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
              Copy weekly recap Story frames and stickers that celebrate aggregate progress, route wins through Feature Me, and point people to the next challenge.
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(weeklyCampaignCompletionRecapStoryCopy)}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(96,165,250,0.22)', background: 'rgba(96,165,250,0.10)',
                color: '#60A5FA', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
              }}
            >
              COPY COMPLETION RECAP
            </button>
          </div>
        )}

        {(isAdmin || creatorEnabled) && (
          <div style={{
            borderRadius: 16, padding: 16, marginBottom: 20,
            background: 'rgba(168,85,247,0.05)',
            border: '1px solid rgba(168,85,247,0.16)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Weekly Campaign Next-Week Teaser Story Kit</p>
                <p style={{ margin: '4px 0 0', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
                  Manual teaser Stories for the next challenge
                </p>
              </div>
              <span style={{ color: '#A855F7', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                NEXT
              </span>
            </div>
            <p style={{ margin: 0, color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
              Copy teaser Story frames and stickers that turn this week's closeout into a next-challenge invite using first-party app movement.
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(weeklyCampaignNextWeekTeaserStoryCopy)}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(168,85,247,0.22)', background: 'rgba(168,85,247,0.10)',
                color: '#A855F7', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
              }}
            >
              COPY NEXT-WEEK TEASER
            </button>
          </div>
        )}

        {(isAdmin || creatorEnabled) && (
          <div style={{
            borderRadius: 16, padding: 16, marginBottom: 20,
            background: 'rgba(34,211,238,0.05)',
            border: '1px solid rgba(34,211,238,0.16)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Weekly Campaign Partner Perk Teaser Story Kit</p>
                <p style={{ margin: '4px 0 0', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
                  Manual perk-interest Stories before partner outreach
                </p>
              </div>
              <span style={{ color: '#22D3EE', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                PERK
              </span>
            </div>
            <p style={{ margin: 0, color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
              Copy partner-perk teaser frames and stickers that route interest back into the app before any partner link, payout, or outreach exists.
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(weeklyCampaignPartnerPerkTeaserStoryCopy)}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(34,211,238,0.22)', background: 'rgba(34,211,238,0.10)',
                color: '#22D3EE', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
              }}
            >
              COPY PARTNER PERK TEASER
            </button>
          </div>
        )}

        {(isAdmin || creatorEnabled) && (
          <div style={{
            borderRadius: 16, padding: 16, marginBottom: 20,
            background: 'rgba(45,212,191,0.05)',
            border: '1px solid rgba(45,212,191,0.16)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Weekly Campaign Story Poll Kit</p>
                <p style={{ margin: '4px 0 0', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
                  Manual Story stickers for campaign feedback
                </p>
              </div>
              <span style={{ color: '#2DD4BF', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                POLL
              </span>
            </div>
            <p style={{ margin: 0, color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
              Copy poll, quiz, and question sticker prompts that route voters back into the app without scraping or treating Instagram votes as app consent.
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(weeklyCampaignStoryPollCopy)}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(45,212,191,0.22)', background: 'rgba(45,212,191,0.10)',
                color: '#2DD4BF', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
              }}
            >
              COPY STORY POLLS
            </button>
          </div>
        )}

        {(isAdmin || creatorEnabled) && (
          <div style={{
            borderRadius: 16, padding: 16, marginBottom: 20,
            background: 'rgba(20,184,166,0.05)',
            border: '1px solid rgba(20,184,166,0.16)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Weekly Campaign Poll Review Kit</p>
                <p style={{ margin: '4px 0 0', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
                  Manual readback for Story poll signals
                </p>
              </div>
              <span style={{ color: '#14B8A6', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                REVIEW
              </span>
            </div>
            <p style={{ margin: 0, color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
              Convert visible poll reactions into a next content or app CTA while confirming decisions with first-party app movement.
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(weeklyCampaignPollReviewCopy)}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(20,184,166,0.22)', background: 'rgba(20,184,166,0.10)',
                color: '#14B8A6', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
              }}
            >
              COPY POLL REVIEW
            </button>
          </div>
        )}

        {(isAdmin || creatorEnabled) && (
          <div style={{
            borderRadius: 16, padding: 16, marginBottom: 20,
            background: 'rgba(244,114,182,0.05)',
            border: '1px solid rgba(244,114,182,0.16)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Weekly Campaign Live Q&A Kit</p>
                <p style={{ margin: '4px 0 0', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
                  Manual Live prompts from audience questions to app actions
                </p>
              </div>
              <span style={{ color: '#F472B6', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                LIVE
              </span>
            </div>
            <p style={{ margin: 0, color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
              Copy Live setup, question lanes, close copy, and first-party follow-up guardrails.
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(weeklyCampaignLiveQaCopy)}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(244,114,182,0.22)', background: 'rgba(244,114,182,0.10)',
                color: '#F472B6', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
              }}
            >
              COPY LIVE Q&A
            </button>
          </div>
        )}

        {(isAdmin || creatorEnabled) && (
          <div style={{
            borderRadius: 16, padding: 16, marginBottom: 20,
            background: 'rgba(251,113,133,0.05)',
            border: '1px solid rgba(251,113,133,0.16)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Weekly Campaign Live Recap Kit</p>
                <p style={{ margin: '4px 0 0', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
                  Manual Live readback into first-party content decisions
                </p>
              </div>
              <span style={{ color: '#FB7185', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                RECAP
              </span>
            </div>
            <p style={{ margin: 0, color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
              Copy post-Live recap prompts, public summary copy, and app-signal review guardrails.
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(weeklyCampaignLiveRecapCopy)}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(251,113,133,0.22)', background: 'rgba(251,113,133,0.10)',
                color: '#FB7185', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
              }}
            >
              COPY LIVE RECAP
            </button>
          </div>
        )}

        {(isAdmin || creatorEnabled) && (
          <div style={{
            borderRadius: 16, padding: 16, marginBottom: 20,
            background: 'rgba(250,204,21,0.05)',
            border: '1px solid rgba(250,204,21,0.16)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Weekly Campaign FAQ Carousel Kit</p>
                <p style={{ margin: '4px 0 0', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
                  Manual carousel outline from repeated audience questions
                </p>
              </div>
              <span style={{ color: '#FACC15', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                FAQ
              </span>
            </div>
            <p style={{ margin: 0, color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
              Copy a seven-slide FAQ carousel that answers common questions and routes action back into the app.
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(weeklyCampaignFaqCarouselCopy)}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(250,204,21,0.22)', background: 'rgba(250,204,21,0.10)',
                color: '#FACC15', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
              }}
            >
              COPY FAQ CAROUSEL
            </button>
          </div>
        )}

        {(isAdmin || creatorEnabled) && (
          <div style={{
            borderRadius: 16, padding: 16, marginBottom: 20,
            background: 'rgba(34,211,238,0.05)',
            border: '1px solid rgba(34,211,238,0.16)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Weekly Campaign Caption Bank Kit</p>
                <p style={{ margin: '4px 0 0', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
                  Manual captions for Reels, Stories, carousels, and pinned comments
                </p>
              </div>
              <span style={{ color: '#22D3EE', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                COPY
              </span>
            </div>
            <p style={{ margin: 0, color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
              Copy weekly caption variants that route followers into first-party app actions without scheduling posts or collecting Instagram identities.
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(weeklyCampaignCaptionBankCopy)}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(34,211,238,0.22)', background: 'rgba(34,211,238,0.10)',
                color: '#22D3EE', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
              }}
            >
              COPY CAPTION BANK
            </button>
          </div>
        )}

        {(isAdmin || creatorEnabled) && (
          <div style={{
            borderRadius: 16, padding: 16, marginBottom: 20,
            background: 'rgba(168,85,247,0.05)',
            border: '1px solid rgba(168,85,247,0.16)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Weekly Campaign Collab Invite Kit</p>
                <p style={{ margin: '4px 0 0', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
                  Manual outreach for collab posts and creator mentions
                </p>
              </div>
              <span style={{ color: '#A855F7', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                COLLAB
              </span>
            </div>
            <p style={{ margin: 0, color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
              Copy pressure-safe creator outreach that points deeper hosting interest back to first-party review flows.
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(weeklyCampaignCollabInviteCopy)}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(168,85,247,0.22)', background: 'rgba(168,85,247,0.10)',
                color: '#A855F7', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
              }}
            >
              COPY COLLAB INVITE
            </button>
          </div>
        )}

        {(isAdmin || creatorEnabled) && (
          <div style={{
            borderRadius: 16, padding: 16, marginBottom: 20,
            background: 'rgba(192,132,252,0.05)',
            border: '1px solid rgba(192,132,252,0.16)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Weekly Campaign Collab Follow-Up Kit</p>
                <p style={{ margin: '4px 0 0', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
                  Manual replies after a creator responds
                </p>
              </div>
              <span style={{ color: '#C084FC', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                FOLLOW-UP
              </span>
            </div>
            <p style={{ margin: 0, color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
              Copy creator follow-ups for yes, post guidance, paid hosting questions, and not-ready replies.
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(weeklyCampaignCollabFollowUpCopy)}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(192,132,252,0.22)', background: 'rgba(192,132,252,0.10)',
                color: '#C084FC', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
              }}
            >
              COPY COLLAB FOLLOW-UP
            </button>
          </div>
        )}

        {(isAdmin || creatorEnabled) && (
          <div style={{
            borderRadius: 16, padding: 16, marginBottom: 20,
            background: 'rgba(45,212,191,0.05)',
            border: '1px solid rgba(45,212,191,0.16)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Weekly Campaign Collab Safety Checklist</p>
                <p style={{ margin: '4px 0 0', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
                  Manual consent and claim review before creator escalation
                </p>
              </div>
              <span style={{ color: '#2DD4BF', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                SAFETY
              </span>
            </div>
            <p style={{ margin: 0, color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
              Copy a pre-collab checklist for consent, claims, private replies, member data, and paid-hosting review.
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(weeklyCampaignCollabSafetyCopy)}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(45,212,191,0.22)', background: 'rgba(45,212,191,0.10)',
                color: '#2DD4BF', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
              }}
            >
              COPY COLLAB SAFETY
            </button>
          </div>
        )}

        {(isAdmin || creatorEnabled) && (
          <div style={{
            borderRadius: 16, padding: 16, marginBottom: 20,
            background: 'rgba(20,184,166,0.05)',
            border: '1px solid rgba(20,184,166,0.16)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Weekly Campaign Collab Recap Kit</p>
                <p style={{ margin: '4px 0 0', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
                  Manual post-collab review from first-party app movement
                </p>
              </div>
              <span style={{ color: '#14B8A6', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                RECAP
              </span>
            </div>
            <p style={{ margin: 0, color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
              Copy a recap prompt for creator posts, app movement, content lessons, and next collab decisions.
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(weeklyCampaignCollabRecapCopy)}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(20,184,166,0.22)', background: 'rgba(20,184,166,0.10)',
                color: '#14B8A6', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
              }}
            >
              COPY COLLAB RECAP
            </button>
          </div>
        )}

        {(isAdmin || creatorEnabled) && (
          <div style={{
            borderRadius: 16, padding: 16, marginBottom: 20,
            background: 'rgba(13,148,136,0.05)',
            border: '1px solid rgba(13,148,136,0.16)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Weekly Campaign Collab Renewal Kit</p>
                <p style={{ margin: '4px 0 0', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
                  Manual repeat-or-pause decision after the recap
                </p>
              </div>
              <span style={{ color: '#0D9488', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                RENEW
              </span>
            </div>
            <p style={{ margin: 0, color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
              Copy renewal criteria for repeating, pausing, or routing a creator into deeper review.
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(weeklyCampaignCollabRenewalCopy)}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(13,148,136,0.22)', background: 'rgba(13,148,136,0.10)',
                color: '#0D9488', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
              }}
            >
              COPY COLLAB RENEWAL
            </button>
          </div>
        )}

        {(isAdmin || creatorEnabled) && (
          <div style={{
            borderRadius: 16, padding: 16, marginBottom: 20,
            background: 'rgba(96,165,250,0.05)',
            border: '1px solid rgba(96,165,250,0.16)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>INSTAGRAM CONTENT CALENDAR</p>
                <p style={{ margin: '4px 0 0', color: '#8DB8FF', fontSize: 10, fontFamily: 'monospace' }}>
                  Seven-day creator/admin cadence
                </p>
              </div>
              <span style={{ color: '#60A5FA', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                {INSTAGRAM_WEEKLY_PROMPTS.length} DAYS
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8 }}>
              {INSTAGRAM_WEEKLY_PROMPTS.map((prompt, index) => (
                <div key={prompt.label} style={{ borderRadius: 10, padding: 10, background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ margin: 0, color: '#60A5FA', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
                    {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][index]} · {prompt.label}
                  </p>
                  <p style={{ margin: '5px 0 0', color: '#fff', fontSize: 12, fontWeight: 900 }}>{prompt.title}</p>
                  <p style={{ margin: '4px 0 0', color: '#777', fontSize: 9, lineHeight: 1.35 }}>{prompt.hook}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigator.clipboard?.writeText(instagramContentCalendarCopy)}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(96,165,250,0.22)', background: 'rgba(96,165,250,0.10)',
                color: '#60A5FA', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
              }}
            >
              COPY CONTENT CALENDAR
            </button>
          </div>
        )}

        <div style={{
          borderRadius: 16, padding: 16, marginBottom: 20,
          background: proActive ? 'rgba(255,107,53,0.06)' : 'rgba(255,255,255,0.03)',
          border: `1px solid ${proActive ? 'rgba(255,107,53,0.22)' : 'rgba(255,255,255,0.06)'}`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
            <div>
              <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Streak recovery</p>
              <p style={{ margin: '4px 0 0', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
                Recover yesterday as a zero-point Pro credit
              </p>
            </div>
            <span style={{ color: proActive ? ACCENT : GOLD, fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
              {yesterdayRecovered ? 'USED' : 'PRO'}
            </span>
          </div>
          <button
            onClick={handleStreakRecovery}
            disabled={isSavingRecovery}
            style={{
              width: '100%', marginTop: 12, padding: '12px',
              borderRadius: 14, border: 'none',
              background: proActive ? ACCENT : 'rgba(255,255,255,0.08)',
              color: proActive ? '#111' : '#aaa',
              fontWeight: 900, cursor: isSavingRecovery ? 'wait' : 'pointer',
            }}
          >
            {proActive ? (isSavingRecovery ? 'Recovering Streak' : 'Recover Yesterday') : 'Unlock with Tribe Pro'}
          </button>
          {recoveryMessage && (
            <p style={{ margin: '10px 0 0', color: proActive ? '#34D399' : GOLD, fontSize: 11, fontWeight: 800 }}>
              {recoveryMessage}
            </p>
          )}
        </div>

        <div style={{
          borderRadius: 16, padding: 16, marginBottom: 20,
          background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.16)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
            <div>
              <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>STREAK RESCUE PROMPT KIT</p>
              <p style={{ margin: '4px 0 0', color: '#FDE68A', fontSize: 10, fontFamily: 'monospace' }}>
                Comeback copy after a missed day
              </p>
            </div>
            <span style={{ color: '#FBBF24', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
              {currentStreak}/{goalStreak}
            </span>
          </div>
          <p style={{ margin: '12px 0 0', color: '#FEF3C7', fontSize: 12, lineHeight: 1.45 }}>
            Copy a pressure-safe restart prompt that brings members back to honest logging without awarding points or spending recovery credits.
          </p>
          <button
            type="button"
            onClick={() => copyText(streakRescuePromptCopy, 'Streak rescue prompt copied')}
            style={{
              width: '100%', marginTop: 12, padding: '12px',
              borderRadius: 14, border: '1px solid rgba(251,191,36,0.22)',
              background: 'rgba(251,191,36,0.10)', color: '#FBBF24',
              fontWeight: 900, fontSize: 11, fontFamily: 'monospace',
            }}
          >
            COPY STREAK RESCUE PROMPT
          </button>
        </div>

        <div style={{
          borderRadius: 16, padding: 16, marginBottom: 20,
          background: 'rgba(244,114,182,0.05)', border: '1px solid rgba(244,114,182,0.16)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
            <div>
              <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>COMEBACK CHALLENGE INVITE KIT</p>
              <p style={{ margin: '4px 0 0', color: '#FBCFE8', fontSize: 10, fontFamily: 'monospace' }}>
                Restart invite for this week's campaign
              </p>
            </div>
            <span style={{ color: '#F472B6', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
              {weeklyCampaignPrompt.hashtag}
            </span>
          </div>
          <p style={{ margin: '12px 0 0', color: '#FCE7F3', fontSize: 12, lineHeight: 1.45 }}>
            Copy a comeback invite that turns a missed day into a return-to-challenge prompt for this week's campaign.
          </p>
          <button
            type="button"
            onClick={() => copyText(comebackChallengeInviteCopy, 'Comeback challenge invite copied')}
            style={{
              width: '100%', marginTop: 12, padding: '12px',
              borderRadius: 14, border: '1px solid rgba(244,114,182,0.22)',
              background: 'rgba(244,114,182,0.10)', color: '#F472B6',
              fontWeight: 900, fontSize: 11, fontFamily: 'monospace',
            }}
          >
            COPY COMEBACK CHALLENGE INVITE
          </button>
        </div>

        <div style={{
          borderRadius: 16, padding: 16, marginBottom: 20,
          background: 'rgba(52,211,153,0.055)', border: '1px solid rgba(52,211,153,0.16)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
            <div>
              <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>REFERRAL LAUNCH KIT</p>
              <p style={{ margin: '4px 0 0', color: '#8bdcc0', fontSize: 10, fontFamily: 'monospace' }}>
                Copy a next-tier invite prompt
              </p>
            </div>
            <span style={{ color: '#34D399', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
              {referralState.next ? `${referralState.remainingToNext} TO NEXT` : 'TIERS CLEAR'}
            </span>
          </div>
          <p style={{ margin: '12px 0 0', color: '#d6fff0', fontSize: 12, lineHeight: 1.45 }}>
            {referralState.next
              ? `Push toward ${referralState.next.label} with a copy-ready Instagram/community invite.`
              : 'Keep inviting new members even after the current reward ladder is complete.'}
          </p>
          <button
            onClick={() => copyText(referralLaunchCopy, 'Referral launch copy copied')}
            style={{
              width: '100%', marginTop: 12, padding: '12px',
              borderRadius: 14, border: '1px solid rgba(52,211,153,0.22)',
              background: 'rgba(52,211,153,0.10)', color: '#34D399',
              fontWeight: 900, fontSize: 11, fontFamily: 'monospace',
            }}
          >
            COPY REFERRAL LAUNCH COPY
          </button>
        </div>

        <div style={{
          borderRadius: 16, padding: 16, marginBottom: 20,
          background: 'rgba(20,184,166,0.05)', border: '1px solid rgba(20,184,166,0.16)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
            <div>
              <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>REFERRAL STORY SPRINT KIT</p>
              <p style={{ margin: '4px 0 0', color: '#8bdcc0', fontSize: 10, fontFamily: 'monospace' }}>
                Story/Reel invite around your next tier
              </p>
            </div>
            <span style={{ color: '#14B8A6', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
              {referralState.next ? `${referralJoins}/${referralState.next.target}` : `${referralJoins} JOINS`}
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 12 }}>
            {[
              ['NEXT', referralState.next?.label || 'LADDER CLEAR'],
              ['LEFT', referralState.next ? referralState.remainingToNext : 0],
              ['STORY', '4 FRAMES'],
            ].map(([label, value]) => (
              <div key={label} style={{ borderRadius: 10, padding: 9, background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p style={{ margin: 0, color: '#14B8A6', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{label}</p>
                <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 12, fontWeight: 900 }}>{value}</p>
              </div>
            ))}
          </div>
          <p style={{ margin: '12px 0 0', color: '#d6fff0', fontSize: 12, lineHeight: 1.45 }}>
            Copy a consent-safe Story/Reel sprint that invites one accountability partner back into the app challenge loop.
          </p>
          <button
            onClick={() => copyText(referralStorySprintCopy, 'Referral story sprint copied')}
            style={{
              width: '100%', marginTop: 12, padding: '12px',
              borderRadius: 14, border: '1px solid rgba(20,184,166,0.22)',
              background: 'rgba(20,184,166,0.10)', color: '#14B8A6',
              fontWeight: 900, fontSize: 11, fontFamily: 'monospace',
            }}
          >
            COPY REFERRAL STORY SPRINT
          </button>
        </div>

        <div style={{
          borderRadius: 16, padding: 16, marginBottom: 20,
          background: 'rgba(56,189,248,0.05)', border: '1px solid rgba(56,189,248,0.16)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
            <div>
              <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>REFERRAL REWARD SOCIAL PROOF KIT</p>
              <p style={{ margin: '4px 0 0', color: '#BAE6FD', fontSize: 10, fontFamily: 'monospace' }}>
                Reward-tier celebration copy
              </p>
            </div>
            <span style={{ color: '#38BDF8', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
              {unlockedReferralRewardTier ? unlockedReferralRewardTier.label.toUpperCase() : 'PREP'}
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 12 }}>
            {[
              ['TIER', unlockedReferralRewardTier?.label || 'NEXT'],
              ['JOINS', referralJoins],
              ['FORMAT', 'STORY + CAROUSEL'],
            ].map(([label, value]) => (
              <div key={label} style={{ borderRadius: 10, padding: 9, background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p style={{ margin: 0, color: '#38BDF8', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{label}</p>
                <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 12, fontWeight: 900 }}>{value}</p>
              </div>
            ))}
          </div>
          <p style={{ margin: '12px 0 0', color: '#E0F2FE', fontSize: 12, lineHeight: 1.45 }}>
            Copy a reward-tier Story/carousel caption that turns first-party referral progress into Instagram social proof while keeping fulfillment manual.
          </p>
          <button
            onClick={() => copyText(referralRewardSocialProofCopy, 'Referral reward social proof copied')}
            style={{
              width: '100%', marginTop: 12, padding: '12px',
              borderRadius: 14, border: '1px solid rgba(56,189,248,0.22)',
              background: 'rgba(56,189,248,0.10)', color: '#38BDF8',
              fontWeight: 900, fontSize: 11, fontFamily: 'monospace',
            }}
          >
            COPY REFERRAL SOCIAL PROOF
          </button>
        </div>

        <div style={{
          borderRadius: 16, padding: 16, marginBottom: 20,
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
            <div>
              <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Referral rewards</p>
              <p style={{ margin: '4px 0 0', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
                {referralJoins} attributed challenge join{referralJoins === 1 ? '' : 's'}
              </p>
            </div>
            <span style={{ color: referralState.achieved?.color || '#34D399', fontSize: 11, fontWeight: 900, fontFamily: 'monospace' }}>
              {referralState.achieved?.label?.toUpperCase() || 'STARTER'}
            </span>
          </div>
          <div style={{ marginTop: 12, height: 7, borderRadius: 999, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <div style={{
              width: `${referralState.pct}%`, height: '100%',
              background: referralState.next?.color || referralState.achieved?.color || '#34D399',
              borderRadius: 999,
            }} />
          </div>
          <p style={{ margin: '10px 0 0', color: '#bbb', fontSize: 11, lineHeight: 1.35 }}>
            {referralState.next
              ? `Next: ${referralState.next.label} at ${referralState.next.target} joins · ${referralState.next.reward}`
              : 'All current referral tiers unlocked. Keep building the tribe.'}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 12 }}>
            {[
              ['TIERS EARNED', `${referralState.earnedCount}/${REFERRAL_TIERS.length}`],
              ['TO NEXT', referralState.next ? `${referralState.remainingToNext}` : '0'],
              ['LADDER', `${Math.round(referralState.ladderPct)}%`],
            ].map(([label, value]) => (
              <div key={label} style={{
                borderRadius: 10, padding: '9px 6px',
                background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.06)',
                textAlign: 'center',
              }}>
                <p style={{ margin: 0, color: '#fff', fontSize: 15, fontWeight: 900, fontFamily: "'Syne', sans-serif" }}>{value}</p>
                <p style={{ margin: '3px 0 0', color: '#666', fontSize: 8, fontWeight: 800, fontFamily: 'monospace' }}>{label}</p>
              </div>
            ))}
          </div>
          <p style={{ margin: '10px 0 0', color: '#777', fontSize: 10, lineHeight: 1.45, fontFamily: 'monospace' }}>
            Best next action: share a challenge launch card after creating or opening a challenge.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
            {REFERRAL_TIERS.map(tier => {
              const done = referralJoins >= tier.target;
              return (
                <div key={tier.target} style={{
                  borderRadius: 12, padding: 10,
                  border: `1px solid ${done ? tier.color + '66' : 'rgba(255,255,255,0.06)'}`,
                  background: done ? `${tier.color}12` : 'rgba(0,0,0,0.18)',
                }}>
                  <p style={{ margin: 0, color: done ? tier.color : '#777', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                    {tier.target} JOIN{tier.target === 1 ? '' : 'S'}
                  </p>
                  <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 11, fontWeight: 900 }}>{tier.label}</p>
                </div>
              );
            })}
          </div>
          <div style={{
            marginTop: 12, padding: 12, borderRadius: 12,
            background: 'rgba(52,211,153,0.055)', border: '1px solid rgba(52,211,153,0.16)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start' }}>
              <div>
                <p style={{ margin: 0, color: '#fff', fontSize: 11, fontWeight: 900, fontFamily: 'monospace' }}>REFERRAL REWARD CLAIM</p>
                <p style={{ margin: '5px 0 0', color: '#9AE6B4', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                  {unlockedReferralRewardTier ? `${unlockedReferralRewardTier.label} ready` : '1 JOIN TO UNLOCK'}
                </p>
              </div>
              <span style={{ color: '#34D399', fontSize: 18, fontWeight: 900 }}>✓</span>
            </div>
            <p style={{ margin: '10px 0 0', color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
              Request review for your highest unlocked referral tier. This is request-only and does not grant Pro, entitlements, discounts, purchases, payouts, or affiliate rewards.
            </p>
            <button
              type="button"
              onClick={handleReferralRewardClaim}
              disabled={isClaimingReferralReward || !unlockedReferralRewardTier}
              style={{
                marginTop: 10, width: '100%', border: 0, borderRadius: 12, padding: '11px 10px',
                background: unlockedReferralRewardTier ? '#34D399' : 'rgba(255,255,255,0.08)',
                color: unlockedReferralRewardTier ? '#111' : '#666',
                fontSize: 10, fontWeight: 900, fontFamily: 'monospace', letterSpacing: 1,
              }}
            >
              {isClaimingReferralReward ? 'SENDING REFERRAL REWARD CLAIM...' : 'CLAIM REFERRAL REWARD'}
            </button>
            {referralRewardClaimMessage && (
              <div style={{ marginTop: 9, color: referralRewardClaimMessage.includes('sent') ? '#34D399' : '#ffb199', fontSize: 10, fontWeight: 800, lineHeight: 1.35 }}>
                {referralRewardClaimMessage}
              </div>
            )}
          </div>
        </div>

        {isAdmin && (
          <div style={{
            borderRadius: 16, padding: 14, marginBottom: 20,
            background: 'rgba(52,211,153,0.045)', border: '1px solid rgba(52,211,153,0.14)',
          }}>
            <p style={{ margin: 0, color: '#fff', fontSize: 12, fontWeight: 900, fontFamily: 'monospace' }}>REFERRAL REWARD REVIEW QUEUE</p>
            <p style={{ margin: '8px 0 10px', color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
              Admin-only queue for open referralRewardClaims. Verify meaningful challenge joins before fulfillment; do not grant Pro, entitlements, discounts, payouts, purchases, or affiliate rewards from this profile UI.
            </p>
            {referralRewardReviewQueue.length === 0 ? (
              <div style={{ color: '#666', fontSize: 11, fontWeight: 800 }}>No open referral reward claims.</div>
            ) : referralRewardReviewQueue.slice(0, 5).map(req => (
              <div key={req.id} style={{ padding: '10px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ color: '#fff', fontSize: 12, fontWeight: 900 }}>{req.displayName || req.email || req.uid}</span>
                  <span style={{ color: '#34D399', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{req.tierLabel || req.tierTarget}</span>
                </div>
                <div style={{ color: '#777', fontSize: 10, fontWeight: 700, marginTop: 4 }}>{req.referralJoins || 0} joins · {req.source || 'unknown'}</div>
                <div style={{ color: '#aaa', fontSize: 11, lineHeight: 1.35, marginTop: 6 }}>{req.reward}</div>
                <textarea
                  value={referralRewardReviewNotes[req.id] || ''}
                  onChange={event => setReferralRewardReviewNotes(notes => ({ ...notes, [req.id]: event.target.value.slice(0, 500) }))}
                  placeholder="Manual referral reward review note: meaningful joins, duplicate checks, recognition plan, no Pro or payout grant..."
                  rows={2}
                  style={{
                    width: '100%', marginTop: 8, border: '1px solid rgba(52,211,153,0.18)',
                    borderRadius: 10, background: 'rgba(0,0,0,0.20)', color: '#fff', padding: 8,
                    fontSize: 11, lineHeight: 1.35, resize: 'vertical', boxSizing: 'border-box',
                  }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 6, marginTop: 8 }}>
                  {[
                    ['approved', 'APPROVE'],
                    ['waiting', 'WAIT'],
                    ['not_ready', 'NOT READY'],
                    ['declined', 'DECLINE'],
                  ].map(([status, label]) => (
                    <button
                      key={status}
                      onClick={() => handleReferralRewardClaimReview(req.id, status)}
                      disabled={reviewingReferralRewardClaimId === req.id}
                      style={{
                        border: 0, borderRadius: 8, padding: '7px 6px',
                        background: 'rgba(52,211,153,0.14)', color: '#34D399',
                        fontSize: 9, fontWeight: 900, fontFamily: 'monospace',
                        cursor: reviewingReferralRewardClaimId === req.id ? 'wait' : 'pointer',
                      }}
                    >
                      {reviewingReferralRewardClaimId === req.id ? 'SAVING' : label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{
          borderRadius: 16, padding: 16, marginBottom: 20,
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
              <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Partner perks</p>
              <p style={{ margin: '4px 0 0', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
                Future aligned offers for active tribe members
              </p>
            </div>
            <span style={{ color: GOLD, fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
              {selectedPartnerPerkIds.length ? `${selectedPartnerPerkIds.length} SAVED` : 'COMING SOON'}
            </span>
          </div>
          <div style={{ display: 'grid', gap: 8 }}>
            {PARTNER_PERKS.map(perk => {
              const selected = selectedPartnerPerkIds.includes(perk.id);
              const progress = getPartnerPerkProgress(perk, partnerPerkStats);
              return (
              <button key={perk.id} onClick={() => handlePartnerPerkToggle(perk.id)} disabled={isSavingPartnerPerks} style={{
                borderRadius: 12, padding: 11,
                background: selected ? `${perk.color}18` : `${perk.color}10`,
                border: `1px solid ${selected ? perk.color : perk.color + '33'}`,
                textAlign: 'left',
                cursor: isSavingPartnerPerks ? 'default' : 'pointer',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}>
                  <p style={{ margin: 0, color: perk.color, fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{perk.label.toUpperCase()}</p>
                  <p style={{ margin: 0, color: selected ? perk.color : '#666', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{selected ? 'INTERESTED' : 'TAP TO SAVE'}</p>
                </div>
                <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 12, fontWeight: 900 }}>{perk.title}</p>
                <p style={{ margin: '4px 0 0', color: '#888', fontSize: 10, lineHeight: 1.4 }}>{perk.detail}</p>
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center', marginBottom: 5 }}>
                    <span style={{ color: progress.eligible ? perk.color : '#777', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
                      {progress.eligible ? 'ELIGIBLE' : perk.requirement.toUpperCase()}
                    </span>
                    <span style={{ color: '#777', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
                      {progress.current}/{progress.target}
                    </span>
                  </div>
                  <div style={{ height: 5, borderRadius: 99, overflow: 'hidden', background: 'rgba(255,255,255,0.08)' }}>
                    <div style={{ width: `${progress.percent}%`, height: '100%', background: perk.color }} />
                  </div>
                </div>
                {progress.eligible && (
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={event => {
                      event.stopPropagation();
                      handlePartnerPerkClaim(perk, progress);
                    }}
                    onKeyDown={event => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        event.stopPropagation();
                        handlePartnerPerkClaim(perk, progress);
                      }
                    }}
                    style={{
                      marginTop: 9, borderRadius: 10, padding: '8px 10px',
                      background: `${perk.color}14`, border: `1px solid ${perk.color}33`,
                      color: perk.color, fontSize: 9, fontWeight: 900, fontFamily: 'monospace',
                      textAlign: 'center',
                    }}
                  >
                    {claimingPartnerPerkId === perk.id ? 'SENDING PERK REVIEW...' : 'REQUEST PERK REVIEW'}
                  </div>
                )}
              </button>
            );})}
          </div>
          {partnerPerkMessage && <p style={{ margin: '8px 0 0', color: GOLD, fontSize: 10, fontWeight: 900 }}>{partnerPerkMessage}</p>}
          {partnerPerkClaimMessage && (
            <p style={{ margin: '8px 0 0', color: partnerPerkClaimMessage.includes('sent') ? '#2DD4BF' : '#ffb199', fontSize: 10, lineHeight: 1.4, fontFamily: 'monospace' }}>
              {partnerPerkClaimMessage}
            </p>
          )}
          <div style={{
            marginTop: 12, borderRadius: 12, padding: 11,
            background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <p style={{ margin: 0, color: '#fff', fontSize: 11, fontWeight: 900 }}>Partner perk claim status</p>
            <p style={{ margin: '5px 0 0', color: '#777', fontSize: 10, lineHeight: 1.4 }}>
              Review-only claim history from partnerPerkClaims. Status updates are manual and do not create coupons, partner links, payouts, discounts, purchases, entitlements, or paid-access claims.
            </p>
            {partnerPerkClaims.length === 0 ? (
              <div style={{ marginTop: 8, color: '#666', fontSize: 11, fontWeight: 800 }}>No partner perk claims yet.</div>
            ) : partnerPerkClaims.slice(0, 3).map(claim => (
              <div key={claim.id} style={{ padding: '9px 0', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ color: '#fff', fontSize: 12, fontWeight: 900 }}>{claim.perkLabel || 'Partner perk'}</span>
                  <span style={{ color: claim.status === 'open' ? '#38BDF8' : '#888', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{(claim.status || 'open').toUpperCase()}</span>
                </div>
                <div style={{ color: '#777', fontSize: 10, fontWeight: 700, marginTop: 4 }}>
                  {claim.current || 0}/{claim.target || 0} · {claim.requirement || 'eligible'} · {claim.source || 'unknown'}
                </div>
                {claim.reviewNote && (
                  <div style={{ color: '#aaa', fontSize: 10, lineHeight: 1.4, marginTop: 5 }}>
                    Review note: {claim.reviewNote}
                  </div>
                )}
              </div>
            ))}
          </div>
          {isAdmin && (
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <p style={{ margin: '0 0 8px', color: '#fff', fontSize: 11, fontWeight: 900 }}>Partner demand summary</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {PARTNER_PERKS.map(perk => (
                  <div key={perk.id} style={{
                    borderRadius: 10, padding: 8,
                    background: 'rgba(0,0,0,0.18)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}>
                    <p style={{ margin: 0, color: perk.color, fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{perk.label.toUpperCase()}</p>
                    <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 18, fontWeight: 900 }}>{partnerPerkSummary[perk.id] || 0}</p>
                  </div>
                ))}
              </div>
              <div style={{
                marginTop: 10, borderRadius: 12, padding: 11,
                background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.18)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center' }}>
                  <p style={{ margin: 0, color: '#60A5FA', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>PARTNER PITCH KIT</p>
                  <p style={{ margin: 0, color: topPartnerPerk?.demand ? topPartnerPerk.color : '#777', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
                    {topPartnerPerk?.demand ? `${topPartnerPerk.label.toUpperCase()} LEADS` : 'GATHERING'}
                  </p>
                </div>
                <p style={{ margin: '7px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
                  {partnerPitchCopy}
                </p>
                <button
                  onClick={() => navigator.clipboard?.writeText(partnerPitchCopy)}
                  style={{
                    marginTop: 9, width: '100%', borderRadius: 12, padding: '9px 10px',
                    border: '1px solid rgba(96,165,250,0.22)', background: 'rgba(96,165,250,0.10)',
                    color: '#60A5FA', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
                  }}
                >
                  COPY PARTNER PITCH
                </button>
              </div>
              <div style={{
                marginTop: 10, borderRadius: 12, padding: 11,
                background: 'rgba(20,184,166,0.08)', border: '1px solid rgba(20,184,166,0.18)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center' }}>
                  <p style={{ margin: 0, color: '#2DD4BF', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>PARTNER CAMPAIGN ACTIVATION KIT</p>
                  <p style={{ margin: 0, color: partnerDemandTotal ? '#2DD4BF' : '#777', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
                    PILOT BRIEF
                  </p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 9 }}>
                  {[
                    ['DEMAND', partnerDemandTotal],
                    ['REACH', campaignPerformanceSummary.memberReach || 0],
                    ['REFERRALS', referralJoins],
                  ].map(([label, value]) => (
                    <div key={label} style={{ borderRadius: 10, padding: 8, background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <p style={{ margin: 0, color: '#2DD4BF', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{label}</p>
                      <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 18, fontWeight: 900 }}>{value}</p>
                    </div>
                  ))}
                </div>
                <p style={{ margin: '8px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
                  Copy a sponsor-backed challenge pilot brief without partner links, ad tracking, purchases, or entitlement changes.
                </p>
                <button
                  onClick={() => navigator.clipboard?.writeText(partnerActivationCopy)}
                  style={{
                    marginTop: 9, width: '100%', borderRadius: 12, padding: '9px 10px',
                    border: '1px solid rgba(20,184,166,0.22)', background: 'rgba(20,184,166,0.10)',
                    color: '#2DD4BF', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
                  }}
                >
                  COPY ACTIVATION KIT
                </button>
              </div>
              <div style={{
                marginTop: 10, borderRadius: 12, padding: 11,
                background: 'rgba(56,189,248,0.075)', border: '1px solid rgba(56,189,248,0.18)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center' }}>
                  <p style={{ margin: 0, color: '#38BDF8', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>PARTNER TERMS READINESS KIT</p>
                  <p style={{ margin: 0, color: partnerDemandTotal ? '#38BDF8' : '#777', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
                    TERMS DRAFT
                  </p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 9 }}>
                  {[
                    ['DEMAND', partnerDemandTotal],
                    ['REACH', campaignPerformanceSummary.memberReach || 0],
                    ['REFERRALS', referralJoins],
                  ].map(([label, value]) => (
                    <div key={label} style={{ borderRadius: 10, padding: 8, background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <p style={{ margin: 0, color: '#38BDF8', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{label}</p>
                      <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 18, fontWeight: 900 }}>{value}</p>
                    </div>
                  ))}
                </div>
                <p style={{ margin: '8px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
                  Copy partner fit, disclosure, data-boundary, destination-review, reporting, and support handoff guardrails before sponsor pilots are reviewed.
                </p>
                <button
                  onClick={() => navigator.clipboard?.writeText(partnerTermsReadinessCopy)}
                  style={{
                    marginTop: 9, width: '100%', borderRadius: 12, padding: '9px 10px',
                    border: '1px solid rgba(56,189,248,0.22)', background: 'rgba(56,189,248,0.10)',
                    color: '#38BDF8', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
                  }}
                >
                  COPY PARTNER TERMS KIT
                </button>
              </div>
              <div style={{
                marginTop: 10, borderRadius: 12, padding: 11,
                background: 'rgba(129,140,248,0.075)', border: '1px solid rgba(129,140,248,0.18)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center' }}>
                  <p style={{ margin: 0, color: '#818CF8', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>PARTNER CONTRACT READINESS KIT</p>
                  <p style={{ margin: 0, color: partnerDemandTotal ? '#818CF8' : '#777', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
                    CONTRACT CHECK
                  </p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 9 }}>
                  {[
                    ['DEMAND', partnerDemandTotal],
                    ['REACH', campaignPerformanceSummary.memberReach || 0],
                    ['REFERRALS', referralJoins],
                  ].map(([label, value]) => (
                    <div key={label} style={{ borderRadius: 10, padding: 8, background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <p style={{ margin: 0, color: '#818CF8', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{label}</p>
                      <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 18, fontWeight: 900 }}>{value}</p>
                    </div>
                  ))}
                </div>
                <p style={{ margin: '8px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
                  Copy identity, support, disclosure, fulfillment, privacy, reporting, and destination checks before sponsor terms move forward.
                </p>
                <button
                  onClick={() => navigator.clipboard?.writeText(partnerContractReadinessCopy)}
                  style={{
                    marginTop: 9, width: '100%', borderRadius: 12, padding: '9px 10px',
                    border: '1px solid rgba(129,140,248,0.22)', background: 'rgba(129,140,248,0.10)',
                    color: '#818CF8', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
                  }}
                >
                  COPY PARTNER CONTRACT KIT
                </button>
              </div>
              <div style={{
                marginTop: 10, borderRadius: 12, padding: 11,
                background: 'rgba(129,140,248,0.075)', border: '1px solid rgba(129,140,248,0.18)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center' }}>
                  <p style={{ margin: 0, color: '#818CF8', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>PARTNER CAMPAIGN OBJECTION REPLY KIT</p>
                  <p style={{ margin: 0, color: partnerDemandTotal ? '#818CF8' : '#777', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
                    COPY ONLY
                  </p>
                </div>
                <p style={{ margin: '8px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
                  Copy manual replies for sponsor-pilot questions without claiming partner links, tracking, payouts, purchases, or revenue-share are live.
                </p>
                <button
                  onClick={() => navigator.clipboard?.writeText(partnerCampaignObjectionReplyCopy)}
                  style={{
                    marginTop: 9, width: '100%', borderRadius: 12, padding: '9px 10px',
                    border: '1px solid rgba(129,140,248,0.22)', background: 'rgba(129,140,248,0.10)',
                    color: '#818CF8', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
                  }}
                >
                  COPY PARTNER REPLIES
                </button>
              </div>
              <div style={{
                marginTop: 10, borderRadius: 12, padding: 11,
                background: 'rgba(96,165,250,0.075)', border: '1px solid rgba(96,165,250,0.18)',
              }}>
                <p style={{ margin: 0, color: '#60A5FA', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>PARTNER PERK CLAIM REVIEW QUEUE</p>
                <p style={{ margin: '8px 0 10px', color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
                  Admin-only queue for open partnerPerkClaims. Review eligibility, partner fit, disclosure, support ownership, and fulfillment readiness manually; do not create coupons, partner links, payouts, discounts, purchases, entitlements, or paid-access claims from profile UI.
                </p>
                {partnerPerkClaimReviewQueue.length === 0 ? (
                  <div style={{ color: '#666', fontSize: 11, fontWeight: 800 }}>No open partner perk claims.</div>
                ) : partnerPerkClaimReviewQueue.slice(0, 5).map(req => (
                  <div key={req.id} style={{ padding: '10px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                      <span style={{ color: '#fff', fontSize: 12, fontWeight: 900 }}>{req.displayName || req.email || req.uid}</span>
                      <span style={{ color: '#60A5FA', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{(req.perkLabel || 'PERK').toUpperCase()}</span>
                    </div>
                    <div style={{ color: '#777', fontSize: 10, fontWeight: 700, marginTop: 4 }}>
                      {req.current || 0}/{req.target || 0} · {req.requirement || 'eligible'} · {req.source || 'unknown'}
                    </div>
                    <textarea
                      value={partnerPerkReviewNotes[req.id] || ''}
                      onChange={event => setPartnerPerkReviewNotes(notes => ({ ...notes, [req.id]: event.target.value.slice(0, 500) }))}
                      placeholder="Manual review note: eligibility proof, partner terms, support owner, destination safety..."
                      style={{
                        marginTop: 8, width: '100%', minHeight: 54, borderRadius: 10, padding: 8,
                        border: '1px solid rgba(96,165,250,0.18)', background: 'rgba(0,0,0,0.24)',
                        color: '#fff', fontSize: 10, lineHeight: 1.35, resize: 'vertical',
                      }}
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 6, marginTop: 7 }}>
                      {[
                        ['approved', 'APPROVE'],
                        ['waiting', 'WAIT'],
                        ['not_ready', 'NOT READY'],
                        ['declined', 'DECLINE'],
                      ].map(([status, label]) => (
                        <button
                          key={status}
                          onClick={() => handlePartnerPerkClaimReview(req.id, status)}
                          disabled={reviewingPartnerPerkClaimId === req.id}
                          style={{
                            borderRadius: 9, padding: '7px 6px',
                            border: '1px solid rgba(96,165,250,0.20)', background: 'rgba(96,165,250,0.10)',
                            color: '#60A5FA', fontSize: 8, fontWeight: 900, fontFamily: 'monospace',
                          }}
                        >
                          {reviewingPartnerPerkClaimId === req.id ? 'SAVING' : label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{
                marginTop: 10, borderRadius: 12, padding: 11,
                background: 'rgba(14,165,233,0.075)', border: '1px solid rgba(14,165,233,0.18)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center' }}>
                  <p style={{ margin: 0, color: '#67E8F9', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>PARTNER PERK DECISION REPLY KIT</p>
                  <p style={{ margin: 0, color: partnerPerkClaimReviewQueue.length ? '#67E8F9' : '#777', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
                    COPY ONLY
                  </p>
                </div>
                <p style={{ margin: '8px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
                  Copy approved, waiting, not-ready, and declined replies for manual claim decisions without creating coupons, partner links, payouts, discounts, purchases, entitlements, or paid-access claims.
                </p>
                <button
                  onClick={() => navigator.clipboard?.writeText(partnerPerkDecisionReplyCopy)}
                  style={{
                    marginTop: 9, width: '100%', borderRadius: 12, padding: '9px 10px',
                    border: '1px solid rgba(103,232,249,0.22)', background: 'rgba(103,232,249,0.10)',
                    color: '#67E8F9', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
                  }}
                >
                  COPY PERK DECISION REPLIES
                </button>
              </div>
              <div style={{
                marginTop: 10, borderRadius: 12, padding: 11,
                background: 'rgba(14,165,233,0.075)', border: '1px solid rgba(14,165,233,0.18)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center' }}>
                  <p style={{ margin: 0, color: '#38BDF8', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>PARTNER PERK FULFILLMENT READINESS KIT</p>
                  <p style={{ margin: 0, color: partnerPerkClaimReviewQueue.length ? '#38BDF8' : '#777', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
                    {partnerPerkClaimReviewQueue.length} CLAIMS
                  </p>
                </div>
                <p style={{ margin: '8px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
                  Copy manual claim-readiness checks before coupons, partner links, payouts, discounts, purchases, entitlements, or fulfillment promises exist.
                </p>
                <button
                  onClick={() => navigator.clipboard?.writeText(partnerPerkFulfillmentReadinessCopy)}
                  style={{
                    marginTop: 9, width: '100%', borderRadius: 12, padding: '9px 10px',
                    border: '1px solid rgba(56,189,248,0.22)', background: 'rgba(56,189,248,0.10)',
                    color: '#38BDF8', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
                  }}
                >
                  COPY PERK FULFILLMENT KIT
                </button>
              </div>
              <div style={{
                marginTop: 10, borderRadius: 12, padding: 11,
                background: 'rgba(45,212,191,0.075)', border: '1px solid rgba(45,212,191,0.18)',
              }}>
                <p style={{ margin: 0, color: '#2DD4BF', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>PARTNER CAMPAIGN APPLICATION REVIEW QUEUE</p>
                <p style={{ margin: '8px 0 10px', color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
                  Admin-only queue for open partnerCampaignApplications. Review first-party demand, campaign reach, partner terms, privacy, and support readiness; do not add partner links, tracking pixels, ad targeting, affiliate payouts, purchases, entitlements, revenue-share, or paid-access claims from profile UI.
                </p>
                {partnerCampaignApplicationReviewQueue.length === 0 ? (
                  <div style={{ color: '#666', fontSize: 11, fontWeight: 800 }}>No open partner campaign applications.</div>
                ) : partnerCampaignApplicationReviewQueue.slice(0, 5).map(req => (
                  <div key={req.id} style={{ padding: '10px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                      <span style={{ color: '#fff', fontSize: 12, fontWeight: 900 }}>{req.displayName || req.email || req.uid}</span>
                      <span style={{ color: '#2DD4BF', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{(req.topPerkLabel || 'PILOT').toUpperCase()}</span>
                    </div>
                    <div style={{ color: '#777', fontSize: 10, fontWeight: 700, marginTop: 4 }}>
                      {req.demandCount || 0} demand · {req.totalDemand || 0} total · {req.campaignReach || 0} reach · {req.referralJoins || 0} refs · {req.source || 'unknown'}
                    </div>
                    <textarea
                      value={partnerCampaignApplicationReviewNotes[req.id] || ''}
                      onChange={event => setPartnerCampaignApplicationReviewNotes(notes => ({ ...notes, [req.id]: event.target.value.slice(0, 500) }))}
                      placeholder="Manual campaign review note: partner terms, privacy, support readiness, destination safety..."
                      style={{
                        marginTop: 8, width: '100%', minHeight: 54, borderRadius: 10, padding: 8,
                        border: '1px solid rgba(45,212,191,0.18)', background: 'rgba(0,0,0,0.24)',
                        color: '#fff', fontSize: 10, lineHeight: 1.35, resize: 'vertical',
                      }}
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 6, marginTop: 7 }}>
                      {[
                        ['approved', 'APPROVE'],
                        ['waiting', 'WAIT'],
                        ['not_ready', 'NOT READY'],
                        ['declined', 'DECLINE'],
                      ].map(([status, label]) => (
                        <button
                          key={status}
                          onClick={() => handlePartnerCampaignApplicationReview(req.id, status)}
                          disabled={reviewingPartnerCampaignApplicationId === req.id}
                          style={{
                            borderRadius: 9, padding: '7px 6px',
                            border: '1px solid rgba(45,212,191,0.20)', background: 'rgba(45,212,191,0.10)',
                            color: '#2DD4BF', fontSize: 8, fontWeight: 900, fontFamily: 'monospace',
                          }}
                        >
                          {reviewingPartnerCampaignApplicationId === req.id ? 'SAVING' : label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div style={{
            marginTop: 12, borderRadius: 12, padding: 12,
            background: 'rgba(45,212,191,0.075)', border: '1px solid rgba(45,212,191,0.18)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start' }}>
              <div>
                <p style={{ margin: 0, color: '#2DD4BF', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>PARTNER CAMPAIGN APPLICATION</p>
                <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 12, fontWeight: 900 }}>
                  Request manual sponsor-pilot review
                </p>
              </div>
              <span style={{ color: partnerCampaignApplicationSignalTotal ? '#2DD4BF' : '#777', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
                REVIEW ONLY
              </span>
            </div>
            <p style={{ margin: '9px 0 0', color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
              Submit partnerCampaignApplications for manual review using saved perk demand, campaign reach, and referral signals. This does not add partner links, tracking pixels, ad targeting, affiliate payouts, purchases, entitlements, revenue-share, or paid-access claims.
            </p>
            <button
              onClick={handlePartnerCampaignApplication}
              disabled={isSubmittingPartnerCampaignApplication || !partnerCampaignApplicationSignalTotal}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(45,212,191,0.24)', background: partnerCampaignApplicationSignalTotal ? 'rgba(45,212,191,0.12)' : 'rgba(255,255,255,0.05)',
                color: partnerCampaignApplicationSignalTotal ? '#2DD4BF' : '#666', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
                cursor: partnerCampaignApplicationSignalTotal ? 'pointer' : 'not-allowed',
              }}
            >
              {isSubmittingPartnerCampaignApplication ? 'SENDING PARTNER CAMPAIGN APPLICATION...' : 'APPLY FOR PARTNER PILOT REVIEW'}
            </button>
            {partnerCampaignApplicationMessage && (
              <p style={{ margin: '8px 0 0', color: partnerCampaignApplicationMessage.includes('sent') ? '#2DD4BF' : '#ffb199', fontSize: 10, lineHeight: 1.4, fontFamily: 'monospace' }}>
                {partnerCampaignApplicationMessage}
              </p>
            )}
          </div>
        </div>

        <div style={{
          borderRadius: 16, padding: 16, marginBottom: 20,
          background: proActive ? 'rgba(255,215,0,0.07)' : 'rgba(255,255,255,0.03)',
          border: `1px solid ${proActive ? 'rgba(255,215,0,0.28)' : 'rgba(255,255,255,0.06)'}`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
              <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Tribe Pro</p>
              <p style={{ margin: '4px 0 0', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
                Subscription entitlement foundation
              </p>
            </div>
            <span style={{
              color: proActive ? GOLD : '#777', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
              border: `1px solid ${proActive ? 'rgba(255,215,0,0.45)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 999, padding: '4px 8px',
            }}>
              {proActive ? 'ACTIVE' : 'NOT ACTIVE'}
            </span>
          </div>
          <p style={{ margin: '0 0 10px', color: '#aaa', fontSize: 11, lineHeight: 1.45 }}>
            Checkout uses shared product IDs. Pro unlock still requires backend receipt validation and entitlement sync.
          </p>
          <div style={{ display: 'grid', gap: 7 }}>
            {PRO_BENEFITS.map(benefit => (
              <div key={benefit} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: proActive ? GOLD : '#555', fontSize: 12 }}>{proActive ? '✓' : '•'}</span>
                <span style={{ color: proActive ? '#fff' : '#888', fontSize: 11, fontWeight: 700 }}>{benefit}</span>
              </div>
            ))}
          </div>
          <div style={{
            marginTop: 12, borderRadius: 12, padding: 12,
            background: proActive ? 'rgba(255,215,0,0.10)' : 'rgba(96,165,250,0.08)',
            border: `1px solid ${proActive ? 'rgba(255,215,0,0.22)' : 'rgba(96,165,250,0.18)'}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center', marginBottom: 9 }}>
              <p style={{ margin: 0, color: proActive ? GOLD : '#60A5FA', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>PRO VALUE SNAPSHOT</p>
              <p style={{ margin: 0, color: proActive ? '#34D399' : '#777', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
                {proActive ? 'UNLOCKED' : 'PREVIEW'}
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {[
                ['WEEK SCORE', `${weeklyReport.weeklyScore}%`],
                ['30D ACTIVE', `${monthlyRecap.activeDays}/30`],
                ['CHAL PTS', totalChallengePoints],
              ].map(([label, value]) => (
                <div key={label} style={{ borderRadius: 10, padding: 8, background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ margin: 0, color: proActive ? GOLD : '#60A5FA', fontSize: 8, fontWeight: 900, fontFamily: 'monospace' }}>{label}</p>
                  <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 16, fontWeight: 900 }}>{value}</p>
                </div>
              ))}
            </div>
            <p style={{ margin: '9px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
              {proValueNextAction}
            </p>
            <div style={{
              marginTop: 10, borderRadius: 10, padding: 10,
              background: 'rgba(20,184,166,0.08)', border: '1px solid rgba(20,184,166,0.18)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center' }}>
                <div>
                  <p style={{ margin: 0, color: '#14B8A6', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>VALUE PROOF STORY KIT</p>
                  <p style={{ margin: '4px 0 0', color: '#99F6E4', fontSize: 9, fontFamily: 'monospace' }}>Copy a progress-proof Story</p>
                </div>
                <span style={{ color: '#14B8A6', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{weeklyReport.status}</span>
              </div>
              <p style={{ margin: '9px 0 0', color: '#CCFBF1', fontSize: 10, lineHeight: 1.45 }}>
                Turn current points, streak, weekly score, and campaign prompt into a manual Instagram Story proof asset.
              </p>
              <button
                type="button"
                onClick={() => copyText(valueProofStoryCopy, 'Value proof story copied')}
                style={{
                  width: '100%', marginTop: 10, padding: '10px',
                  borderRadius: 12, border: '1px solid rgba(20,184,166,0.22)',
                  background: 'rgba(20,184,166,0.10)', color: '#14B8A6',
                  fontWeight: 900, fontSize: 10, fontFamily: 'monospace',
                }}
              >
                COPY VALUE PROOF STORY
              </button>
            </div>
            <div style={{
              marginTop: 10, borderRadius: 10, padding: 10,
              background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.18)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center' }}>
                <div>
                  <p style={{ margin: 0, color: '#60A5FA', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>STORY POSTING CHECKLIST KIT</p>
                  <p style={{ margin: '4px 0 0', color: '#BFDBFE', fontSize: 9, fontFamily: 'monospace' }}>Manual weekly Story sequence</p>
                </div>
                <span style={{ color: '#60A5FA', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{communityHighlightRoundupItems.length} UGC</span>
              </div>
              <p style={{ margin: '9px 0 0', color: '#DBEAFE', fontSize: 10, lineHeight: 1.45 }}>
                Bundle the campaign CTA, app proof, comeback prompt, referral action, and consent-cleared highlights into a manual Story checklist.
              </p>
              <button
                type="button"
                onClick={() => copyText(storyPostingChecklistCopy, 'Story posting checklist copied')}
                style={{
                  width: '100%', marginTop: 10, padding: '10px',
                  borderRadius: 12, border: '1px solid rgba(96,165,250,0.22)',
                  background: 'rgba(96,165,250,0.10)', color: '#60A5FA',
                  fontWeight: 900, fontSize: 10, fontFamily: 'monospace',
                }}
              >
                COPY STORY POSTING CHECKLIST
              </button>
            </div>
          </div>
          <div style={{
            marginTop: 12, borderRadius: 12, padding: 12,
            background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.18)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center', marginBottom: 8 }}>
              <p style={{ margin: 0, color: '#A78BFA', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>PRO TRIAL INTEREST</p>
              <p style={{ margin: 0, color: selectedProTrialReasonIds.length ? '#34D399' : '#777', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
                {selectedProTrialReasonIds.length ? `${selectedProTrialReasonIds.length} SAVED` : 'TAP TO SAVE'}
              </p>
            </div>
            <p style={{ margin: '0 0 8px', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
              Tell us what would make a Pro trial worth trying. This is a first-party demand signal only.
            </p>
            <div style={{ display: 'grid', gap: 7 }}>
              {PRO_TRIAL_REASONS.map(reason => {
                const selected = selectedProTrialReasonIds.includes(reason.id);
                return (
                  <button key={reason.id} onClick={() => handleProTrialReasonToggle(reason.id)} disabled={isSavingProTrialInterest} style={{
                    textAlign: 'left', borderRadius: 10, padding: 10,
                    border: `1px solid ${selected ? 'rgba(167,139,250,0.65)' : 'rgba(255,255,255,0.07)'}`,
                    background: selected ? 'rgba(167,139,250,0.14)' : 'rgba(0,0,0,0.18)',
                    cursor: isSavingProTrialInterest ? 'wait' : 'pointer',
                  }}>
                    <p style={{ margin: 0, color: selected ? '#A78BFA' : '#fff', fontSize: 11, fontWeight: 900 }}>{reason.label}</p>
                    <p style={{ margin: '3px 0 0', color: '#777', fontSize: 9, lineHeight: 1.35 }}>{reason.detail}</p>
                  </button>
                );
              })}
            </div>
          {proTrialMessage && (
              <p style={{ margin: '8px 0 0', color: proTrialMessage.includes('Could not') ? '#ffb199' : '#A78BFA', fontSize: 10, fontFamily: 'monospace' }}>
                {proTrialMessage}
              </p>
            )}
            {isAdmin && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <p style={{ margin: '0 0 8px', color: '#fff', fontSize: 11, fontWeight: 900 }}>Pro trial demand summary</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {PRO_TRIAL_REASONS.map(reason => (
                    <div key={reason.id} style={{
                      borderRadius: 10, padding: 8,
                      background: 'rgba(0,0,0,0.18)',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}>
                      <p style={{ margin: 0, color: '#A78BFA', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{reason.label.toUpperCase()}</p>
                      <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 18, fontWeight: 900 }}>{proTrialSummary[reason.id] || 0}</p>
                    </div>
                  ))}
                </div>
                <div style={{
                  marginTop: 10, borderRadius: 12, padding: 11,
                  background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.18)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center' }}>
                    <p style={{ margin: 0, color: '#A78BFA', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>TRIAL LAUNCH KIT</p>
                    <p style={{ margin: 0, color: topProTrialReason?.demand ? '#34D399' : '#777', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
                      {topProTrialReason?.demand ? `${topProTrialReason.label.toUpperCase()} LEADS` : 'GATHERING'}
                    </p>
                  </div>
                  <p style={{ margin: '7px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
                    {proTrialPitchCopy}
                  </p>
                  <button
                    onClick={() => navigator.clipboard?.writeText(proTrialPitchCopy)}
                    style={{
                      marginTop: 9, width: '100%', borderRadius: 12, padding: '9px 10px',
                      border: '1px solid rgba(167,139,250,0.22)', background: 'rgba(167,139,250,0.10)',
                      color: '#A78BFA', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
                    }}
                  >
                    COPY TRIAL LAUNCH COPY
                  </button>
                </div>
                <div style={{
                  marginTop: 10, borderRadius: 12, padding: 11,
                  background: 'rgba(244,114,182,0.08)', border: '1px solid rgba(244,114,182,0.18)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center' }}>
                    <p style={{ margin: 0, color: '#F472B6', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>PRO TRIAL OBJECTION REPLY KIT</p>
                    <p style={{ margin: 0, color: proTrialDemandTotal ? '#34D399' : '#777', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
                      {proTrialDemandTotal ? `${proTrialDemandTotal} SIGNALS` : 'GATHERING'}
                    </p>
                  </div>
                  <p style={{ margin: '7px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
                    Copy manual replies for Pro questions without claiming live trials, prices, purchases, discounts, or entitlements.
                  </p>
                  <button
                    onClick={() => navigator.clipboard?.writeText(proTrialObjectionReplyCopy)}
                    style={{
                      marginTop: 9, width: '100%', borderRadius: 12, padding: '9px 10px',
                      border: '1px solid rgba(244,114,182,0.22)', background: 'rgba(244,114,182,0.10)',
                      color: '#F472B6', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
                    }}
                  >
                    COPY PRO TRIAL REPLIES
                  </button>
                </div>
              </div>
            )}
          </div>
          <div style={{ display: 'grid', gap: 8, marginTop: 12 }}>
            {STORE_CATALOG.filter(product => product.kind === 'subscription').map(product => (
              <button
                key={product.id}
                onClick={() => handleCheckout(product.id)}
                disabled={checkoutProductId === product.id}
                style={{
                  width: '100%', padding: '10px 12px', borderRadius: 12,
                  border: '1px solid rgba(255,215,0,0.22)',
                  background: 'rgba(255,215,0,0.08)', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  gap: 12, cursor: checkoutProductId === product.id ? 'wait' : 'pointer',
                }}
              >
                <span style={{ fontSize: 12, fontWeight: 900 }}>
                  {product.cadence === 'yearly' ? 'Tribe Pro Yearly' : 'Tribe Pro Monthly'}
                </span>
                <span style={{ fontSize: 10, color: GOLD, fontFamily: 'monospace', fontWeight: 900 }}>
                  {checkoutProductId === product.id ? 'STARTING' : 'CHECKOUT'}
                </span>
              </button>
            ))}
            {STORE_CATALOG.filter(product => product.kind === 'challengePack').map(product => {
              const unlocked = isPackUnlocked(product);
              return (
                <button
                  key={product.id}
                  onClick={() => !unlocked && handleCheckout(product.id)}
                  disabled={unlocked || checkoutProductId === product.id}
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: 12,
                    border: `1px solid ${unlocked ? 'rgba(52,211,153,0.32)' : 'rgba(167,139,250,0.22)'}`,
                    background: unlocked ? 'rgba(52,211,153,0.08)' : 'rgba(167,139,250,0.08)',
                    color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    gap: 12, cursor: unlocked ? 'default' : checkoutProductId === product.id ? 'wait' : 'pointer',
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 900 }}>{challengePackTitle(product)}</span>
                  <span style={{ fontSize: 10, color: unlocked ? '#34D399' : '#A78BFA', fontFamily: 'monospace', fontWeight: 900 }}>
                    {unlocked ? 'UNLOCKED' : checkoutProductId === product.id ? 'STARTING' : 'PACK'}
                  </span>
                </button>
              );
            })}
            <button
              onClick={handleSyncPurchases}
              disabled={checkoutProductId === 'sync'}
              style={{
                width: '100%', padding: '10px 12px', borderRadius: 12,
                border: '1px solid rgba(52,211,153,0.24)',
                background: 'rgba(52,211,153,0.08)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                gap: 12, cursor: checkoutProductId === 'sync' ? 'wait' : 'pointer',
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 900 }}>Sync previous purchases</span>
              <span style={{ fontSize: 10, color: '#34D399', fontFamily: 'monospace', fontWeight: 900 }}>
                {checkoutProductId === 'sync' ? 'SYNCING' : 'SYNC'}
              </span>
            </button>
            <button
              onClick={handleEntitlementRecoveryRequest}
              disabled={isRequestingEntitlementRecovery}
              style={{
                width: '100%', padding: '10px 12px', borderRadius: 12,
                border: '1px solid rgba(56,189,248,0.24)',
                background: 'rgba(56,189,248,0.08)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                gap: 12, cursor: isRequestingEntitlementRecovery ? 'wait' : 'pointer',
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 900 }}>Request entitlement review</span>
              <span style={{ fontSize: 10, color: '#38BDF8', fontFamily: 'monospace', fontWeight: 900 }}>
                {isRequestingEntitlementRecovery ? 'SENDING' : 'REVIEW'}
              </span>
            </button>
          </div>
          {checkoutMessage && (
            <p style={{ margin: '10px 0 0', color: checkoutMessage.includes('not configured') ? GOLD : '#34D399', fontSize: 11, fontWeight: 800 }}>
              {checkoutMessage}
            </p>
          )}
          {entitlementRecoveryMessage && (
            <p style={{ margin: '10px 0 0', color: entitlementRecoveryMessage.includes('sent') ? '#38BDF8' : '#ffb199', fontSize: 11, fontWeight: 800, lineHeight: 1.4 }}>
              {entitlementRecoveryMessage}
            </p>
          )}
          <p style={{ margin: '10px 0 0', color: '#777', fontSize: 10, lineHeight: 1.4 }}>
            Use this only if restore/sync does not match your App Store or Play purchase history. It opens an entitlementRecoveryRequests case for support review.
          </p>
          <p style={{ margin: '10px 0 0', color: '#666', fontSize: 9, fontFamily: 'monospace' }}>
            SOURCE: {String(proSource).toUpperCase()}
          </p>
        </div>

        <div style={{
          borderRadius: 16, padding: 16, marginBottom: 20,
          background: proActive ? 'rgba(96,165,250,0.07)' : 'rgba(255,255,255,0.025)',
          border: `1px solid ${proActive ? 'rgba(96,165,250,0.24)' : 'rgba(255,255,255,0.06)'}`,
          opacity: proActive ? 1 : 0.82,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
              <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Creator / Coach Mode</p>
              <p style={{ margin: '4px 0 0', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
                Public profile foundation for future hosted challenges
              </p>
            </div>
            <span style={{ color: creatorEnabled ? '#60A5FA' : (proActive ? GOLD : '#777'), fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
              {creatorEnabled ? 'LIVE' : (proActive ? 'PRO' : 'LOCKED')}
            </span>
          </div>
          <label style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 12, marginBottom: 10, color: '#ddd', fontSize: 12, fontWeight: 900,
          }}>
            Enable creator profile
            <input
              type="checkbox"
              checked={creatorEnabled}
              disabled={!proActive}
              onChange={e => setCreatorEnabled(e.target.checked)}
              style={{ width: 18, height: 18, accentColor: '#60A5FA' }}
            />
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 10 }}>
            {[
              ['HOSTED', creatorAnalytics.hosted],
              ['MEMBERS', creatorAnalytics.members],
              ['ACTIVE', creatorAnalytics.active],
              ['PRIVATE', creatorAnalytics.private],
            ].map(([label, value]) => (
              <div key={label} style={{
                borderRadius: 10, padding: 9,
                background: proActive ? 'rgba(96,165,250,0.08)' : 'rgba(0,0,0,0.18)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}>
                <p style={{ margin: 0, color: proActive ? '#60A5FA' : '#666', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{label}</p>
                <p style={{ margin: '4px 0 0', color: proActive ? '#fff' : '#777', fontSize: 18, fontWeight: 900 }}>{proActive ? value : '•'}</p>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 10 }}>
            {[
              ['PAID PACKS', creatorAnalytics.paidPacks],
              ['READY', creatorAnalytics.revenueReady],
            ].map(([label, value]) => (
              <div key={label} style={{
                borderRadius: 10, padding: 9,
                background: proActive ? 'rgba(52,211,153,0.08)' : 'rgba(0,0,0,0.18)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}>
                <p style={{ margin: 0, color: proActive ? '#34D399' : '#666', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{label}</p>
                <p style={{ margin: '4px 0 0', color: proActive ? '#fff' : '#777', fontSize: 18, fontWeight: 900 }}>{proActive ? value : '•'}</p>
              </div>
            ))}
          </div>
          <label style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 12, marginBottom: 10, color: '#ddd', fontSize: 12, fontWeight: 900,
          }}>
            Opt into future revenue-share beta
            <input
              type="checkbox"
              checked={creatorRevenueShareInterest}
              disabled={!proActive}
              onChange={e => setCreatorRevenueShareInterest(e.target.checked)}
              style={{ width: 18, height: 18, accentColor: '#34D399' }}
            />
          </label>
          {isAdmin && (
            <div style={{
              borderRadius: 12, padding: 12, marginBottom: 10,
              background: 'rgba(52,211,153,0.08)',
              border: '1px solid rgba(52,211,153,0.18)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center', marginBottom: 8 }}>
                <p style={{ margin: 0, color: '#34D399', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>CREATOR DEMAND SUMMARY</p>
                <p style={{ margin: 0, color: creatorRevenueShareTotal ? '#34D399' : '#777', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
                  {creatorRevenueShareTotal ? 'BETA INTEREST' : 'GATHERING'}
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {[
                  ['ENABLED', creatorRevenueShareSummary.enabled || 0],
                  ['BETA', creatorRevenueShareSummary.revenueShareInterest || 0],
                  ['BRANDED', creatorRevenueShareSummary.branded || 0],
                ].map(([label, value]) => (
                  <div key={label} style={{
                    borderRadius: 10, padding: 8,
                    background: 'rgba(0,0,0,0.18)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}>
                    <p style={{ margin: 0, color: '#34D399', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{label}</p>
                    <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 18, fontWeight: 900 }}>{value}</p>
                  </div>
                ))}
              </div>
              <p style={{ margin: '9px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
                {creatorRevenueSharePitchCopy}
              </p>
              <button
                onClick={() => navigator.clipboard?.writeText(creatorRevenueSharePitchCopy)}
                style={{
                  marginTop: 9, width: '100%', borderRadius: 12, padding: '9px 10px',
                  border: '1px solid rgba(52,211,153,0.22)', background: 'rgba(52,211,153,0.10)',
                  color: '#34D399', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
                }}
              >
                COPY CREATOR BETA COPY
              </button>
            </div>
          )}
          {isAdmin && (
            <div style={{
              borderRadius: 12, padding: 12, marginBottom: 10,
              background: 'rgba(244,114,182,0.075)',
              border: '1px solid rgba(244,114,182,0.18)',
            }}>
              <p style={{ margin: 0, color: '#F472B6', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>CREATOR HOSTING APPLICATION REVIEW QUEUE</p>
              <p style={{ margin: '8px 0 10px', color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
                Admin-only queue for open creatorHostingApplications. Review hosted reach, creator focus, payout policy, terms, and support readiness; do not create contracts, payouts, purchases, entitlements, revenue-share, or paid-access claims from profile UI.
              </p>
              {creatorHostingApplicationReviewQueue.length === 0 ? (
                <div style={{ color: '#666', fontSize: 11, fontWeight: 800 }}>No open creator hosting applications.</div>
              ) : creatorHostingApplicationReviewQueue.slice(0, 5).map(req => (
                <div key={req.id} style={{ padding: '10px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <span style={{ color: '#fff', fontSize: 12, fontWeight: 900 }}>{req.displayName || req.email || req.uid}</span>
                    <span style={{ color: '#F472B6', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{req.revenueShareInterest ? 'BETA' : 'REVIEW'}</span>
                  </div>
                  <div style={{ color: '#777', fontSize: 10, fontWeight: 700, marginTop: 4 }}>
                    {req.hostedCount || 0} hosted · {req.memberReach || 0} reach · {req.revenueReadyCount || 0} ready · {req.source || 'unknown'}
                  </div>
                  <div style={{ color: '#aaa', fontSize: 11, lineHeight: 1.35, marginTop: 6 }}>{req.specialty || req.bio || 'Creator profile pending detail'}</div>
                  <textarea
                    value={creatorHostingApplicationReviewNotes[req.id] || ''}
                    onChange={event => setCreatorHostingApplicationReviewNotes(notes => ({ ...notes, [req.id]: event.target.value.slice(0, 500) }))}
                    placeholder="Manual creator review note: creator focus, moderation, payout policy, terms, support readiness..."
                    style={{
                      marginTop: 8, width: '100%', minHeight: 54, borderRadius: 10, padding: 8,
                      border: '1px solid rgba(244,114,182,0.18)', background: 'rgba(0,0,0,0.24)',
                      color: '#fff', fontSize: 10, lineHeight: 1.35, resize: 'vertical',
                    }}
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 6, marginTop: 7 }}>
                    {[
                      ['approved', 'APPROVE'],
                      ['waiting', 'WAIT'],
                      ['not_ready', 'NOT READY'],
                      ['declined', 'DECLINE'],
                    ].map(([status, label]) => (
                      <button
                        key={status}
                        onClick={() => handleCreatorHostingApplicationReview(req.id, status)}
                        disabled={reviewingCreatorHostingApplicationId === req.id}
                        style={{
                          borderRadius: 9, padding: '7px 6px',
                          border: '1px solid rgba(244,114,182,0.20)', background: 'rgba(244,114,182,0.10)',
                          color: '#F472B6', fontSize: 8, fontWeight: 900, fontFamily: 'monospace',
                        }}
                      >
                        {reviewingCreatorHostingApplicationId === req.id ? 'SAVING' : label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div style={{
            borderRadius: 12, padding: 12, marginBottom: 10,
            background: proActive ? 'rgba(96,165,250,0.08)' : 'rgba(0,0,0,0.18)',
            border: '1px solid rgba(96,165,250,0.20)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start' }}>
              <div>
                <p style={{ margin: 0, color: '#60A5FA', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>CREATOR LAUNCH KIT</p>
                <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 12, fontWeight: 900 }}>
                  {creatorLaunchChallenge?.name || 'No hosted challenge yet'}
                </p>
              </div>
              <span style={{ color: proActive && creatorLaunchChallenge ? '#34D399' : '#777', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
                {creatorLaunchLink ? 'INVITE READY' : 'COPY READY'}
              </span>
            </div>
            <p style={{ whiteSpace: 'pre-line', margin: '9px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
              {creatorLaunchCopy}
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(creatorLaunchCopy)}
              disabled={!proActive}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(96,165,250,0.24)', background: proActive ? 'rgba(96,165,250,0.10)' : 'rgba(255,255,255,0.05)',
                color: proActive ? '#60A5FA' : '#666', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
                cursor: proActive ? 'pointer' : 'not-allowed',
              }}
            >
              COPY CREATOR LAUNCH COPY
            </button>
          </div>
          <div style={{
            borderRadius: 12, padding: 12, marginBottom: 10,
            background: proActive ? 'rgba(244,114,182,0.08)' : 'rgba(0,0,0,0.18)',
            border: '1px solid rgba(244,114,182,0.20)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
              <div>
                <p style={{ margin: 0, color: '#F472B6', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>CREATOR HOSTING OFFER KIT</p>
                <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 12, fontWeight: 900 }}>
                  Future paid-hosting planning brief
                </p>
              </div>
              <span style={{ color: proActive && creatorEnabled ? '#F472B6' : '#777', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
                COPY ONLY
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {[
                ['HOSTED', creatorAnalytics.hosted],
                ['REACH', creatorAnalytics.members],
                ['READY', creatorAnalytics.revenueReady],
              ].map(([label, value]) => (
                <div key={label} style={{ borderRadius: 10, padding: 8, background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ margin: 0, color: '#F472B6', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{label}</p>
                  <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 18, fontWeight: 900 }}>{value}</p>
                </div>
              ))}
            </div>
            <p style={{ margin: '9px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
              Draft creator offer copy before paid hosting, revenue-share terms, payout operations, and entitlement QA are live.
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(creatorHostingOfferCopy)}
              disabled={!proActive}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(244,114,182,0.24)', background: proActive ? 'rgba(244,114,182,0.10)' : 'rgba(255,255,255,0.05)',
                color: proActive ? '#F472B6' : '#666', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
                cursor: proActive ? 'pointer' : 'not-allowed',
              }}
            >
              COPY HOSTING OFFER KIT
            </button>
          </div>
          <div style={{
            borderRadius: 12, padding: 12, marginBottom: 10,
            background: proActive ? 'rgba(45,212,191,0.08)' : 'rgba(0,0,0,0.18)',
            border: '1px solid rgba(45,212,191,0.20)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
              <div>
                <p style={{ margin: 0, color: '#2DD4BF', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>CREATOR TERMS READINESS KIT</p>
                <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 12, fontWeight: 900 }}>
                  Responsibilities before paid hosting
                </p>
              </div>
              <span style={{ color: proActive && creatorEnabled ? '#2DD4BF' : '#777', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
                TERMS DRAFT
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {[
                ['HOSTED', creatorAnalytics.hosted],
                ['READY', creatorAnalytics.revenueReady],
                ['BETA', creatorRevenueShareInterest ? 'YES' : 'NO'],
              ].map(([label, value]) => (
                <div key={label} style={{ borderRadius: 10, padding: 8, background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ margin: 0, color: '#2DD4BF', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{label}</p>
                  <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 18, fontWeight: 900 }}>{value}</p>
                </div>
              ))}
            </div>
            <p style={{ margin: '9px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
              Copy creator responsibilities, moderation, payout readiness, support handoff, and marketplace guardrails before hosted paid access is reviewed.
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(creatorTermsReadinessCopy)}
              disabled={!proActive}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(45,212,191,0.24)', background: proActive ? 'rgba(45,212,191,0.10)' : 'rgba(255,255,255,0.05)',
                color: proActive ? '#2DD4BF' : '#666', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
                cursor: proActive ? 'pointer' : 'not-allowed',
              }}
            >
              COPY CREATOR TERMS KIT
            </button>
          </div>
          <div style={{
            borderRadius: 12, padding: 12, marginBottom: 10,
            background: proActive ? 'rgba(129,140,248,0.08)' : 'rgba(0,0,0,0.18)',
            border: '1px solid rgba(129,140,248,0.20)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
              <div>
                <p style={{ margin: 0, color: '#818CF8', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>CREATOR PAYOUT READINESS KIT</p>
                <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 12, fontWeight: 900 }}>
                  Payout operations before revenue-share
                </p>
              </div>
              <span style={{ color: proActive && creatorEnabled ? '#818CF8' : '#777', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
                OPS CHECK
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {[
                ['REACH', creatorAnalytics.members],
                ['READY', creatorAnalytics.revenueReady],
                ['BETA', creatorRevenueShareInterest ? 'YES' : 'NO'],
              ].map(([label, value]) => (
                <div key={label} style={{ borderRadius: 10, padding: 8, background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ margin: 0, color: '#818CF8', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{label}</p>
                  <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 18, fontWeight: 900 }}>{value}</p>
                </div>
              ))}
            </div>
            <p style={{ margin: '9px 0 0', color: '#888', fontSize: 10, lineHeight: 1.45 }}>
              Copy payout provider, tax, identity, refund, marketplace, support, and creator-claim checks before any revenue-share promise.
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(creatorPayoutReadinessCopy)}
              disabled={!proActive}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(129,140,248,0.24)', background: proActive ? 'rgba(129,140,248,0.10)' : 'rgba(255,255,255,0.05)',
                color: proActive ? '#818CF8' : '#666', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
                cursor: proActive ? 'pointer' : 'not-allowed',
              }}
            >
              COPY CREATOR PAYOUT KIT
            </button>
          </div>
          <div style={{
            borderRadius: 12, padding: 12, marginBottom: 10,
            background: proActive ? 'rgba(129,140,248,0.08)' : 'rgba(0,0,0,0.18)',
            border: '1px solid rgba(129,140,248,0.20)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
              <div>
                <p style={{ margin: 0, color: '#818CF8', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>CREATOR HOSTING OBJECTION REPLY KIT</p>
                <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 12, fontWeight: 900 }}>
                  Manual replies before revenue-share launch
                </p>
              </div>
              <span style={{ color: proActive && creatorEnabled ? '#818CF8' : '#777', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
                COPY ONLY
              </span>
            </div>
            <p style={{ margin: 0, color: '#888', fontSize: 10, lineHeight: 1.45 }}>
              Answer creator questions without claiming paid hosting, payouts, contracts, purchases, or revenue-share are live.
            </p>
            <button
              onClick={() => navigator.clipboard?.writeText(creatorHostingObjectionReplyCopy)}
              disabled={!proActive}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(129,140,248,0.24)', background: proActive ? 'rgba(129,140,248,0.10)' : 'rgba(255,255,255,0.05)',
                color: proActive ? '#818CF8' : '#666', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
                cursor: proActive ? 'pointer' : 'not-allowed',
              }}
            >
              COPY CREATOR REPLIES
            </button>
          </div>
          <div style={{
            borderRadius: 12, padding: 12, marginBottom: 10,
            background: proActive ? 'rgba(244,114,182,0.075)' : 'rgba(0,0,0,0.18)',
            border: '1px solid rgba(244,114,182,0.20)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start' }}>
              <div>
                <p style={{ margin: 0, color: '#F472B6', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>CREATOR HOSTING APPLICATION</p>
                <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 12, fontWeight: 900 }}>
                  Request admin review for hosted challenge readiness
                </p>
              </div>
              <span style={{ color: proActive && creatorEnabled ? '#F472B6' : '#777', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
                REVIEW ONLY
              </span>
            </div>
            <p style={{ margin: '9px 0 0', color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
              Submit creatorHostingApplications for manual review using hosted challenge reach and creator profile details. This does not create contracts, payouts, purchases, entitlements, revenue-share, or paid-access claims.
            </p>
            <button
              onClick={handleCreatorHostingApplication}
              disabled={isSubmittingCreatorHostingApplication || !proActive || !creatorEnabled}
              style={{
                marginTop: 10, width: '100%', borderRadius: 12, padding: '9px 10px',
                border: '1px solid rgba(244,114,182,0.24)', background: proActive && creatorEnabled ? 'rgba(244,114,182,0.12)' : 'rgba(255,255,255,0.05)',
                color: proActive && creatorEnabled ? '#F472B6' : '#666', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
                cursor: proActive && creatorEnabled ? 'pointer' : 'not-allowed',
              }}
            >
              {isSubmittingCreatorHostingApplication ? 'SENDING CREATOR HOSTING APPLICATION...' : 'APPLY FOR HOSTED REVIEW'}
            </button>
            {creatorHostingApplicationMessage && (
              <p style={{ margin: '8px 0 0', color: creatorHostingApplicationMessage.includes('sent') ? '#F472B6' : '#ffb199', fontSize: 10, lineHeight: 1.4, fontFamily: 'monospace' }}>
                {creatorHostingApplicationMessage}
              </p>
            )}
          </div>
          <div style={{ display: 'grid', gap: 8 }}>
            <input
              value={creatorSpecialty}
              disabled={!proActive}
              placeholder="Specialty, e.g. Strength coach"
              onChange={e => setCreatorSpecialty(e.target.value.slice(0, 60))}
              style={{
                width: '100%', boxSizing: 'border-box', borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.24)',
                color: proActive ? '#fff' : '#777', padding: '11px 12px', fontWeight: 800,
              }}
            />
            <textarea
              value={creatorBio}
              disabled={!proActive}
              placeholder="Short coaching bio or challenge promise"
              onChange={e => setCreatorBio(e.target.value.slice(0, 240))}
              rows={3}
              style={{
                width: '100%', boxSizing: 'border-box', borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.24)',
                color: proActive ? '#fff' : '#777', padding: '11px 12px', fontWeight: 700,
                resize: 'vertical',
              }}
            />
            <input
              value={creatorCtaUrl}
              disabled={!proActive}
              placeholder="CTA URL for future branded pages"
              onChange={e => setCreatorCtaUrl(e.target.value.slice(0, 160))}
              style={{
                width: '100%', boxSizing: 'border-box', borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.24)',
                color: proActive ? '#fff' : '#777', padding: '11px 12px', fontWeight: 800,
              }}
            />
          </div>
          <button onClick={handleCreatorSave} disabled={isSavingCreator} style={{
            marginTop: 12, width: '100%', border: 'none', borderRadius: 12,
            background: proActive ? '#60A5FA' : 'rgba(255,255,255,0.08)',
            color: proActive ? '#06111f' : '#777', padding: '11px 12px',
            fontSize: 12, fontWeight: 900, cursor: isSavingCreator ? 'default' : 'pointer',
          }}>
            {proActive ? (isSavingCreator ? 'Saving Creator Profile' : 'Save Creator Profile') : 'Unlock with Tribe Pro'}
          </button>
          {creatorMessage && (
            <p style={{ margin: '8px 0 0', color: proActive ? '#60A5FA' : GOLD, fontSize: 10, fontFamily: 'monospace' }}>
              {creatorMessage}
            </p>
          )}
        </div>

        <div style={{
          borderRadius: 16, padding: 16, marginBottom: 20,
          background: proActive ? 'rgba(167,139,250,0.08)' : 'rgba(255,255,255,0.025)',
          border: `1px solid ${proActive ? 'rgba(167,139,250,0.28)' : 'rgba(255,255,255,0.06)'}`,
          opacity: proActive ? 1 : 0.82,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
              <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Pro analytics report</p>
              <p style={{ margin: '4px 0 0', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
                Weekly and monthly performance insight
              </p>
            </div>
            <span style={{ color: proActive ? '#A78BFA' : '#777', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
              {proActive ? 'UNLOCKED' : 'PRO PREVIEW'}
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {[
              ['WEEKLY SCORE', `${weeklyReport.weeklyScore}%`],
              ['7D CONSISTENCY', `${weeklyReport.consistency}%`],
              ['CHALLENGE PTS', `${weeklyReport.totalChallengePoints}`],
            ].map(([label, value]) => (
              <div key={label} style={{
                textAlign: 'center', borderRadius: 10, padding: '9px 6px',
                background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.06)',
              }}>
                <p style={{ margin: 0, color: '#fff', fontSize: 15, fontWeight: 900, fontFamily: "'Syne', sans-serif" }}>{value}</p>
                <p style={{ margin: '3px 0 0', color: '#666', fontSize: 8, fontWeight: 800, fontFamily: 'monospace' }}>{label}</p>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 8 }}>
            {[
              ['MONTH SCORE', `${monthlyReport.monthlyScore}%`],
              ['30D ACTIVE', `${monthlyReport.activeDays}/30`],
              ['30D POINTS', `${monthlyReport.monthlyPoints}`],
            ].map(([label, value]) => (
              <div key={label} style={{
                textAlign: 'center', borderRadius: 10, padding: '9px 6px',
                background: 'rgba(167,139,250,0.055)', border: '1px solid rgba(167,139,250,0.10)',
              }}>
                <p style={{ margin: 0, color: '#fff', fontSize: 15, fontWeight: 900, fontFamily: "'Syne', sans-serif" }}>{proActive ? value : 'LOCKED'}</p>
                <p style={{ margin: '3px 0 0', color: '#666', fontSize: 8, fontWeight: 800, fontFamily: 'monospace' }}>{label}</p>
              </div>
            ))}
          </div>
          <p style={{ margin: '12px 0 0', color: '#bbb', fontSize: 11, lineHeight: 1.45 }}>
            {proActive ? weeklyReport.nextAction : 'Unlock Tribe Pro to turn your history into weekly reports, trends, and personalized targets.'}
          </p>
          {proActive && (
            <p style={{ margin: '8px 0 0', color: '#A78BFA', fontSize: 10, lineHeight: 1.45, fontFamily: 'monospace' }}>
              MONTHLY: {monthlyReport.status} · {monthlyReport.nextAction}
            </p>
          )}
          <p style={{ margin: '8px 0 0', color: '#777', fontSize: 10, fontFamily: 'monospace' }}>
            STATUS: {proActive ? weeklyReport.status : 'LOCKED'} · TOP ACTIVITY: {proActive ? weeklyReport.bestType : 'LOCKED'}
          </p>
        </div>

        <div style={{
          borderRadius: 16, padding: 16, marginBottom: 20,
          background: proActive ? 'rgba(52,211,153,0.07)' : 'rgba(255,255,255,0.025)',
          border: `1px solid ${proActive ? 'rgba(52,211,153,0.24)' : 'rgba(255,255,255,0.06)'}`,
          opacity: proActive ? 1 : 0.82,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
              <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Custom goals</p>
              <p style={{ margin: '4px 0 0', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
                Weekly targets and streak focus
              </p>
            </div>
            <span style={{ color: proActive ? '#34D399' : '#777', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
              {proActive ? 'EDITABLE' : 'PRO'}
            </span>
          </div>
          <div style={{ display: 'grid', gap: 10 }}>
            {[
              ['Active days/week', goalActiveDays, setGoalActiveDays, 1, 7, `${weeklyRecap.activeDays}/${goalActiveDays} days`, goalProgress.activeDays],
              ['Weekly points', goalPoints, setGoalPoints, 50, 10000, `${weeklyRecap.points}/${goalPoints} pts`, goalProgress.points],
              ['Streak target', goalStreak, setGoalStreak, 1, 365, `${currentStreak}/${goalStreak} days`, goalProgress.streak],
            ].map(([label, value, setter, min, max, progressLabel, pct]) => (
              <div key={label}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <label style={{ flex: 1, color: '#bbb', fontSize: 11, fontWeight: 800 }}>{label}</label>
                  <input
                    type="number"
                    min={min}
                    max={max}
                    disabled={!proActive}
                    value={value}
                    onChange={e => setter(Number(e.target.value))}
                    style={{
                      width: 72, height: 34, borderRadius: 10,
                      border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.25)',
                      color: proActive ? '#fff' : '#777', fontSize: 12, fontWeight: 900,
                      textAlign: 'center',
                    }}
                  />
                </div>
                <div style={{ height: 6, borderRadius: 999, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', borderRadius: 999, background: '#34D399' }} />
                </div>
                <p style={{ margin: '5px 0 0', color: '#666', fontSize: 9, fontFamily: 'monospace' }}>{progressLabel}</p>
              </div>
            ))}
          </div>
          <button onClick={handleCustomGoalsSave} disabled={isSavingGoals} style={{
            marginTop: 12, width: '100%', border: 'none', borderRadius: 12,
            background: proActive ? '#34D399' : 'rgba(255,255,255,0.08)',
            color: proActive ? '#07130d' : '#777', padding: '11px 12px',
            fontSize: 12, fontWeight: 900, cursor: isSavingGoals ? 'default' : 'pointer',
          }}>
            {proActive ? (isSavingGoals ? 'Saving goals' : 'Save Custom Goals') : 'Unlock with Tribe Pro'}
          </button>
          {goalsMessage && (
            <p style={{ margin: '8px 0 0', color: proActive ? '#34D399' : '#A78BFA', fontSize: 10, fontFamily: 'monospace' }}>
              {goalsMessage}
            </p>
          )}
        </div>

        <div style={{
          borderRadius: 16, padding: 16, marginBottom: 20,
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
            <div>
              <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Instagram</p>
              <p style={{ margin: '3px 0 0', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
                Used for shares and future Tribe features.
              </p>
            </div>
            {profile?.instagramHandle && (
              <span style={{ color: ACCENT, fontSize: 11, fontWeight: 800, fontFamily: 'monospace' }}>
                @{profile.instagramHandle}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{
              flex: 1, display: 'flex', alignItems: 'center', gap: 4,
              borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(0,0,0,0.22)', padding: '0 12px',
            }}>
              <span style={{ color: '#777', fontSize: 13, fontWeight: 800 }}>@</span>
              <input
                value={instagramHandle}
                onChange={e => setInstagramHandle(e.target.value.replace(/^@+/, '').replace(/[^a-zA-Z0-9._]/g, '').slice(0, 30))}
                placeholder="yourhandle"
                style={{
                  flex: 1, minWidth: 0, height: 42, border: 'none', outline: 'none',
                  background: 'transparent', color: '#fff', fontSize: 13, fontWeight: 700,
                }}
              />
            </div>
            <button
              onClick={handleSocialSave}
              disabled={isSavingSocial}
              style={{
                minWidth: 78, border: 'none', borderRadius: 12,
                background: isSavingSocial ? 'rgba(255,255,255,0.08)' : ACCENT,
                color: isSavingSocial ? '#777' : '#111', fontSize: 12, fontWeight: 900,
                cursor: isSavingSocial ? 'default' : 'pointer',
              }}
            >
              {isSavingSocial ? 'Saving' : 'Save'}
            </button>
          </div>
          {socialMessage && (
            <p style={{ margin: '8px 0 0', color: socialMessage.includes('Could not') ? '#ffb199' : '#777', fontSize: 10, fontFamily: 'monospace' }}>
              {socialMessage}
            </p>
          )}
        </div>

        <div style={{
          borderRadius: 16, padding: 16, marginBottom: 20,
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,107,53,0.18)',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
            <div>
              <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Instagram Weekly Prompt Kit</p>
              <p style={{ margin: '4px 0 0', color: ACCENT, fontSize: 10, fontFamily: 'monospace', fontWeight: 900 }}>
                {instagramWeeklyPrompt.label}
              </p>
            </div>
            <span style={{ color: GOLD, fontSize: 18 }}>↗</span>
          </div>
          <p style={{ margin: '0 0 6px', color: '#fff', fontSize: 12, fontWeight: 900 }}>{instagramWeeklyPrompt.title}</p>
          <p style={{ margin: 0, color: '#888', fontSize: 11, lineHeight: 1.45 }}>{instagramPromptCopy}</p>
          <button
            onClick={() => navigator.clipboard?.writeText(instagramPromptCopy)}
            style={{
              marginTop: 12, width: '100%', border: '1px solid rgba(255,107,53,0.24)',
              borderRadius: 12, padding: '10px 12px', background: 'rgba(255,107,53,0.10)',
              color: ACCENT, fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
            }}
          >
            COPY INSTAGRAM PROMPT
          </button>
        </div>

        {isAdmin && (
          <div style={{
            borderRadius: 16, padding: 16, marginBottom: 20,
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Feature review queue</p>
            <p style={{ margin: '4px 0 12px', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
              Pending user stories waiting for Instagram/content review.
            </p>
            {featureReviewQueue.length === 0 ? (
              <p style={{ margin: 0, color: '#666', fontSize: 11, fontFamily: 'monospace' }}>No pending submissions.</p>
            ) : featureReviewQueue.slice(0, 5).map(sub => (
              <div key={sub.id} style={{ padding: '12px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <p style={{ margin: '0 0 3px', color: '#fff', fontSize: 12, fontWeight: 900 }}>
                  {sub.displayName || sub.email || 'Tribe member'} {sub.instagramHandle ? `@${sub.instagramHandle}` : ''}
                </p>
                <p style={{ margin: '0 0 8px', color: '#777', fontSize: 10, lineHeight: 1.35 }}>{sub.story}</p>
                {sub.mediaImageData && (
                  <img src={`data:image/jpeg;base64,${sub.mediaImageData}`} alt="Submission media" style={{ width: '100%', maxHeight: 160, objectFit: 'cover', borderRadius: 12, marginBottom: 8 }} />
                )}
                <textarea
                  value={featureReviewNotes[sub.id] || ''}
                  onChange={(event) => setFeatureReviewNotes(notes => ({ ...notes, [sub.id]: event.target.value }))}
                  placeholder="Manual feature submission review note: consent, repost fit, claims safety, caption context..."
                  rows={2}
                  style={{
                    width: '100%',
                    marginBottom: 8,
                    padding: 8,
                    borderRadius: 10,
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(0,0,0,0.2)',
                    color: '#ddd',
                    fontSize: 10,
                    fontWeight: 700,
                    fontFamily: "'Space Grotesk', sans-serif",
                    resize: 'vertical',
                    boxSizing: 'border-box',
                  }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
                  {['approved', 'featured', 'declined'].map(status => (
                    <button
                      key={status}
                      onClick={() => handleReviewSubmission(sub.id, status)}
                      style={{
                        border: 'none', borderRadius: 10, padding: '9px 6px',
                        background: status === 'declined' ? 'rgba(248,113,113,0.16)' : status === 'featured' ? 'rgba(52,211,153,0.16)' : 'rgba(96,165,250,0.16)',
                        color: status === 'declined' ? '#F87171' : status === 'featured' ? '#34D399' : '#60A5FA',
                        fontSize: 9, fontWeight: 900, fontFamily: 'monospace',
                      }}
                    >
                      {status.toUpperCase()}
                    </button>
                  ))}
                </div>
                <p style={{ margin: '6px 0 0', color: '#777', fontSize: 9, fontWeight: 800, lineHeight: 1.35 }}>
                  Manual UGC/content review only; do not auto-post, override consent, imply outcomes, or share unreviewed submissions.
                </p>
              </div>
            ))}
            {reviewMessage && (
              <p style={{ margin: '8px 0 0', color: reviewMessage.includes('Could not') ? '#ffb199' : '#777', fontSize: 10, fontFamily: 'monospace' }}>
                {reviewMessage}
              </p>
            )}
          </div>
        )}

        <div style={{
          borderRadius: 16, padding: 16, marginBottom: 20,
          background: `linear-gradient(135deg, ${ACCENT}12, rgba(52,211,153,0.08))`,
          border: `1px solid ${ACCENT}24`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
            <div>
              <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Win card</p>
              <p style={{ margin: '4px 0 0', color: '#777', fontSize: 10, fontFamily: 'monospace', lineHeight: 1.35 }}>
                {totalWinPoints} pts · {currentStreak}d streak · {daysActive} days active
              </p>
            </div>
            <span style={{ color: GOLD, fontSize: 20, lineHeight: 1 }}>{rank.icon}</span>
          </div>
          <button
            onClick={handleWinCardShare}
            style={{
              marginTop: 12, width: '100%', border: 'none', borderRadius: 12, padding: '12px 10px',
              background: GOLD, color: '#111', fontSize: 12, fontWeight: 900, cursor: 'pointer',
            }}
          >
            Create Share Card
          </button>
          <button
            onClick={handleWeeklyRecapShare}
            style={{
              marginTop: 8, width: '100%', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '11px 10px',
              background: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: 12, fontWeight: 900, cursor: 'pointer',
            }}
          >
            Share 7-Day Recap
          </button>
          <button
            onClick={handleMonthlyRecapShare}
            style={{
              marginTop: 8, width: '100%', border: '1px solid rgba(167,139,250,0.18)', borderRadius: 12, padding: '11px 10px',
              background: proActive ? 'rgba(167,139,250,0.12)' : 'rgba(255,255,255,0.04)',
              color: proActive ? '#fff' : '#777', fontSize: 12, fontWeight: 900,
              cursor: proActive ? 'pointer' : 'not-allowed',
            }}
            disabled={!proActive}
          >
            {proActive ? 'Share 30-Day Recap' : '30-Day Recap with Pro'}
          </button>
          <p style={{ margin: '8px 0 0', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
            This week: {weeklyRecap.points} pts · {weeklyRecap.sessions} sessions · {weeklyRecap.activeDays}/7 days
          </p>
          <p style={{ margin: '4px 0 0', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
            This month: {monthlyReport.monthlyPoints} pts · {monthlyReport.sessions} sessions · {monthlyReport.activeDays}/30 days
          </p>
          {winCardMessage && (
            <p style={{ margin: '8px 0 0', color: winCardMessage.includes('Could not') ? '#ffb199' : '#777', fontSize: 10, fontFamily: 'monospace' }}>
              {winCardMessage}
            </p>
          )}
        </div>

        <div style={{
          borderRadius: 16, padding: 16, marginBottom: 20,
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Community highlights</p>
          <p style={{ margin: '4px 0 12px', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
            Featured tribe wins ready for Instagram reposts.
          </p>
          {featuredSubmissions.length === 0 ? (
            <p style={{ margin: 0, color: '#777', fontSize: 11, lineHeight: 1.45 }}>
              No featured wins yet. Submit your story below and help us build the highlight wall.
            </p>
          ) : (
            <div style={{ display: 'grid', gap: 10 }}>
              {featuredSubmissions.slice(0, 4).map(sub => {
                const handle = (sub.instagramHandle || '').replace(/^@+/, '');
                const label = FEATURE_CATEGORY_LABELS[sub.category] || sub.category || 'Tribe win';
                const copy = `${label}: ${sub.story}${handle ? `\n\nFollow @${handle}` : ''}\n\nTag @risewiththetribe and keep building with the tribe.`;
                return (
                  <div key={sub.id} style={{
                    borderRadius: 14, padding: 12,
                    background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(52,211,153,0.16)',
                  }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      {sub.mediaImageData ? (
                        <img src={`data:image/jpeg;base64,${sub.mediaImageData}`} alt="" style={{ width: 54, height: 54, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
                      ) : (
                        <div style={{
                          width: 54, height: 54, borderRadius: 12, flexShrink: 0,
                          display: 'grid', placeItems: 'center', background: sub.avatarColor || GOLD,
                          color: '#111', fontSize: 24, fontWeight: 900,
                        }}>
                          {sub.avatarEmoji || '✨'}
                        </div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, color: '#34D399', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>
                          FEATURED · {label.toUpperCase()}
                        </p>
                        <p style={{ margin: '4px 0 0', color: '#fff', fontSize: 12, fontWeight: 900 }}>
                          {sub.displayName || (handle ? `@${handle}` : 'Tribe member')}
                        </p>
                        <p style={{ margin: '4px 0 0', color: '#888', fontSize: 11, lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                          {sub.story}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigator.clipboard?.writeText(copy)}
                      style={{
                        marginTop: 10, width: '100%', border: '1px solid rgba(52,211,153,0.22)',
                        borderRadius: 12, padding: '9px 10px', background: 'rgba(52,211,153,0.08)',
                        color: '#34D399', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
                      }}
                    >
                      COPY REPOST CAPTION
                    </button>
                  </div>
                );
              })}
            </div>
          )}
          <div style={{
            marginTop: 12, padding: 12, borderRadius: 12,
            background: 'rgba(52,211,153,0.055)', border: '1px solid rgba(52,211,153,0.16)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start' }}>
              <div>
                <p style={{ margin: 0, color: '#fff', fontSize: 11, fontWeight: 900, fontFamily: 'monospace' }}>COMMUNITY HIGHLIGHT ROUNDUP KIT</p>
                <p style={{ margin: '5px 0 0', color: '#8BDCC0', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                  Weekly featured-win roundup copy
                </p>
              </div>
              <span style={{ color: '#34D399', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                {communityHighlightRoundupItems.length} READY
              </span>
            </div>
            <p style={{ margin: '10px 0 0', color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
              Copy a consent-safe weekly roundup using only submissions already marked featured.
            </p>
            <button
              type="button"
              onClick={() => copyText(communityHighlightRoundupCopy, 'Community highlight roundup copied')}
              style={{
                marginTop: 10, width: '100%', border: '1px solid rgba(52,211,153,0.22)',
                borderRadius: 12, padding: '10px 10px', background: 'rgba(52,211,153,0.08)',
                color: '#34D399', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
              }}
            >
              COPY HIGHLIGHT ROUNDUP
            </button>
          </div>
          <div style={{
            marginTop: 12, padding: 12, borderRadius: 12,
            background: 'rgba(96,165,250,0.055)', border: '1px solid rgba(96,165,250,0.16)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start' }}>
              <div>
                <p style={{ margin: 0, color: '#fff', fontSize: 11, fontWeight: 900, fontFamily: 'monospace' }}>UGC CONSENT REMINDER KIT</p>
                <p style={{ margin: '5px 0 0', color: '#BFDBFE', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                  Manual repost safety checklist
                </p>
              </div>
              <span style={{ color: '#60A5FA', fontSize: 10, fontWeight: 900, fontFamily: 'monospace' }}>
                {featureReviewQueue.length} REVIEW
              </span>
            </div>
            <p style={{ margin: '10px 0 0', color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
              Copy a consent reminder before reposting member wins, with review status, attribution, and claim-safety checks.
            </p>
            <button
              type="button"
              onClick={() => copyText(ugcConsentReminderCopy, 'UGC consent reminder copied')}
              style={{
                marginTop: 10, width: '100%', border: '1px solid rgba(96,165,250,0.22)',
                borderRadius: 12, padding: '10px 10px', background: 'rgba(96,165,250,0.08)',
                color: '#60A5FA', fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
              }}
            >
              COPY UGC CONSENT REMINDER
            </button>
          </div>
        </div>

        <div style={{
          borderRadius: 16, padding: 16, marginBottom: 20,
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 900 }}>Submit to be featured</p>
          <p style={{ margin: '4px 0 12px', color: '#666', fontSize: 10, fontFamily: 'monospace' }}>
            Share a win for the @risewiththetribe channel review queue.
          </p>
          <select
            value={featureCategory}
            onChange={e => setFeatureCategory(e.target.value)}
            style={{
              width: '100%', height: 42, marginBottom: 10, borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.22)',
              color: '#fff', padding: '0 12px', fontSize: 12, fontWeight: 800,
            }}
          >
            {FEATURE_CATEGORIES.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
          </select>
          <textarea
            value={featureStory}
            onChange={e => setFeatureStory(e.target.value.slice(0, 900))}
            placeholder="What did you overcome, complete, or prove to yourself?"
            rows={4}
            style={{
              width: '100%', boxSizing: 'border-box', resize: 'vertical', borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.22)',
              color: '#fff', padding: 12, fontSize: 13, lineHeight: 1.45, outline: 'none',
            }}
          />
          <input
            id={featureFileInputRef.current}
            type="file"
            accept="image/*"
            onChange={handleFeatureMediaUpload}
            style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 1, height: 1 }}
          />
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 10 }}>
            <label
              htmlFor={featureFileInputRef.current}
              style={{
                flex: 1, borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.05)', color: '#ddd', padding: '10px 12px',
                fontSize: 11, fontWeight: 900, cursor: 'pointer', textAlign: 'center',
              }}
            >
              {featureMediaData ? 'Replace Photo' : 'Attach Photo'}
            </label>
            {featureMediaData && (
              <button
                onClick={() => setFeatureMediaData('')}
                style={{
                  border: 'none', borderRadius: 12, background: 'rgba(255,255,255,0.06)',
                  color: '#aaa', padding: '10px 12px', fontSize: 11, fontWeight: 900,
                }}
              >
                Remove
              </button>
            )}
          </div>
          {featureMediaData && (
            <div style={{ marginTop: 10, borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
              <img src={`data:image/jpeg;base64,${featureMediaData}`} alt="Feature submission preview" style={{ width: '100%', maxHeight: 180, objectFit: 'cover', display: 'block' }} />
            </div>
          )}
          <label style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginTop: 10, color: '#777', fontSize: 11, lineHeight: 1.4 }}>
            <input type="checkbox" checked={featureConsent} onChange={e => setFeatureConsent(e.target.checked)} />
            I consent to Rise With The Tribe reviewing this submission and potentially featuring my story and Instagram handle.
          </label>
          <button
            onClick={handleFeatureSubmit}
            disabled={isSubmittingFeature || !featureConsent || featureStory.trim().length < 20}
            style={{
              marginTop: 12, width: '100%', border: 'none', borderRadius: 12, padding: '12px 10px',
              background: featureConsent && featureStory.trim().length >= 20 ? ACCENT : 'rgba(255,255,255,0.07)',
              color: featureConsent && featureStory.trim().length >= 20 ? '#111' : '#666',
              fontSize: 12, fontWeight: 900, cursor: featureConsent && featureStory.trim().length >= 20 ? 'pointer' : 'default',
            }}
          >
            {isSubmittingFeature ? 'Submitting' : 'Submit for Review'}
          </button>
          {featureMessage && (
            <p style={{ margin: '8px 0 0', color: featureMessage.includes('Could not') || featureMessage.includes('Please') ? '#ffb199' : '#777', fontSize: 10, fontFamily: 'monospace' }}>
              {featureMessage}
            </p>
          )}
          {featureSubmissions.length > 0 && (
            <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <p style={{ margin: '0 0 8px', color: '#555', fontSize: 10, fontFamily: 'monospace', fontWeight: 800 }}>YOUR SUBMISSIONS</p>
              {featureSubmissions.slice(0, 3).map(sub => {
                const [label, color] = FEATURE_STATUS_STYLES[sub.status] || [sub.status || 'Pending', '#888'];
                return (
                  <div key={sub.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '9px 0', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: '0 0 3px', color: '#ddd', fontSize: 12, fontWeight: 800 }}>
                        {FEATURE_CATEGORY_LABELS[sub.category] || sub.category || 'Submission'}
                      </p>
                      <p style={{ margin: 0, color: '#666', fontSize: 10, lineHeight: 1.35, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {sub.story}
                      </p>
                      {sub.mediaImageData && (
                        <p style={{ margin: '3px 0 0', color: ACCENT, fontSize: 9, fontFamily: 'monospace', fontWeight: 900 }}>
                          PHOTO ATTACHED
                        </p>
                      )}
                    </div>
                    <span style={{ color, border: `1px solid ${color}44`, background: `${color}12`, borderRadius: 999, padding: '3px 7px', fontSize: 9, fontFamily: 'monospace', fontWeight: 900 }}>
                      {label.toUpperCase()}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Rank progress bar */}
        {rank.next && (
          <div style={{
            borderRadius: 16, padding: '14px 16px', marginBottom: 20,
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: '#888', fontFamily: 'monospace' }}>
                → {rank.next.icon} {rank.next.label}
              </span>
              <span style={{ fontSize: 11, color: rank.color, fontFamily: 'monospace', fontWeight: 700 }}>
                {badgeXP} / {rank.next.min} XP
              </span>
            </div>
            <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 5 }}>
              <div style={{
                height: '100%', borderRadius: 5,
                background: `linear-gradient(90deg, ${rank.color}, ${rank.next.color})`,
                width: `${rankedPct}%`, transition: 'width .8s ease',
              }} />
            </div>
          </div>
        )}

        {/* Stats grid */}
        <p style={{ color: '#555', fontSize: 10, fontWeight: 700, letterSpacing: 2, fontFamily: 'monospace', margin: '0 0 12px' }}>STATS</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
          {statsGrid.map(s => (
            <div key={s.label} onClick={s.onClick} style={{
              background: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: '14px 16px',
              border: `1px solid ${s.onClick ? s.color + '44' : 'rgba(255,255,255,0.06)'}`,
              cursor: s.onClick ? 'pointer' : 'default',
              position: 'relative', transition: 'border-color .2s',
            }}>
              {s.onClick && (
                <span style={{ position: 'absolute', top: 10, right: 12, fontSize: 11, color: s.color, opacity: 0.7, fontFamily: 'monospace' }}>→</span>
              )}
              <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: s.color }}>
                {s.value ?? 0}
              </div>
              <div style={{ fontSize: 9, color: '#555', fontWeight: 700, letterSpacing: 1, fontFamily: 'monospace', marginTop: 2 }}>
                {s.label}
              </div>
              {s.onClick && (
                <div style={{ fontSize: 8, color: s.color, fontFamily: 'monospace', marginTop: 4, opacity: 0.6 }}>
                  TAP FOR BREAKDOWN
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Badges showcase */}
        {earnedList.length > 0 && (
          <>
            <p style={{ color: '#555', fontSize: 10, fontWeight: 700, letterSpacing: 2, fontFamily: 'monospace', margin: '0 0 12px' }}>
              BADGES ({earnedList.length})
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
              {earnedList.map(b => (
                <div key={b.id} title={`${b.label} — ${b.desc}`} style={{
                  width: 46, height: 46, borderRadius: 14, flexShrink: 0,
                  background: `${b.color}18`, border: `1.5px solid ${b.color}55`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, boxShadow: `0 0 12px ${b.color}22`,
                }}>
                  {b.icon}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Preferences from onboarding */}
        {prefRows.length > 0 && (
          <>
            <p style={{ color: '#555', fontSize: 10, fontWeight: 700, letterSpacing: 2, fontFamily: 'monospace', margin: '0 0 12px' }}>PREFERENCES</p>
            <div style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 16, padding: '0 16px 4px', marginBottom: 24,
            }}>
              {prefRows.map((row, i) => (
                <div key={row.label} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: i < prefRows.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                }}>
                  <span style={{ fontSize: 9, color: '#444', fontFamily: 'monospace', fontWeight: 700, letterSpacing: 1 }}>{row.label}</span>
                  <span style={{ fontSize: 12, color: '#ccc', fontWeight: 700 }}>{row.value}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Daily reminder */}
        <p style={{ color: '#555', fontSize: 10, fontWeight: 700, letterSpacing: 2, fontFamily: 'monospace', margin: '0 0 12px' }}>DAILY REMINDER</p>
        <div style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 16, padding: 16, marginBottom: 24,
        }}>
          <div style={{ fontSize: 16, color: '#fff', fontWeight: 900, fontFamily: "'Syne', sans-serif", marginBottom: 4 }}>
            {reminderLabel === 'Off' ? 'Reminders are off' : `Reminder set for ${reminderLabel}`}
          </div>
          <div style={{ fontSize: 12, color: '#777', lineHeight: 1.45, marginBottom: 12 }}>
            Browser reminders work while the web app is open. Use the mobile apps for background reminders.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            <button onClick={() => handleReminder(8, 0)} style={reminderButtonStyle(ACCENT, '#111')}>Morning</button>
            <button onClick={() => handleReminder(20, 0)} style={reminderButtonStyle(GOLD, '#111')}>Evening</button>
            <button onClick={disableReminder} style={reminderButtonStyle('rgba(255,255,255,0.07)', '#fff')}>Off</button>
          </div>
          {reminderError && (
            <div style={{ marginTop: 10, color: '#ffb199', fontSize: 11, fontWeight: 700 }}>
              {reminderError}
            </div>
          )}
        </div>

        {/* Policy and support links */}
        <p style={{ color: '#555', fontSize: 10, fontWeight: 700, letterSpacing: 2, fontFamily: 'monospace', margin: '0 0 12px' }}>POLICY & SUPPORT</p>
        <div style={{
          background: 'rgba(20,184,166,0.04)', border: '1px solid rgba(20,184,166,0.12)',
          borderRadius: 16, padding: 14, marginBottom: 20,
        }}>
          <p style={{ margin: '0 0 10px', color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
            Review privacy, terms, support, and account/data deletion resources for store release and member help.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {POLICY_LINKS.map(link => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  borderRadius: 12, padding: '10px 8px',
                  border: '1px solid rgba(20,184,166,0.18)',
                  background: 'rgba(20,184,166,0.08)',
                  color: '#14B8A6', textDecoration: 'none',
                  fontSize: 10, fontWeight: 900, fontFamily: 'monospace',
                  textAlign: 'center',
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Support request */}
        <p style={{ color: '#555', fontSize: 10, fontWeight: 700, letterSpacing: 2, fontFamily: 'monospace', margin: '0 0 12px' }}>SUPPORT REQUEST</p>
        <div style={{
          background: 'rgba(96,165,250,0.04)', border: '1px solid rgba(96,165,250,0.12)',
          borderRadius: 16, padding: 14, marginBottom: 20,
        }}>
          <p style={{ margin: '0 0 10px', color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
            Send an account, billing, bug, safety, or general supportRequests note. This does not process refunds, cancel subscriptions, or change entitlements.
          </p>
          <select
            value={supportCategory}
            onChange={e => setSupportCategory(e.target.value)}
            style={{ width: '100%', marginBottom: 8, borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)', background: '#111', color: '#fff', padding: '10px 12px', fontSize: 12, fontWeight: 800 }}
          >
            <option value="general">General</option>
            <option value="account">Account</option>
            <option value="billing">Billing</option>
            <option value="bug">Bug</option>
            <option value="safety">Safety</option>
          </select>
          <textarea
            value={supportMessage}
            onChange={e => setSupportMessage(e.target.value)}
            placeholder="What do you need help with?"
            rows={4}
            maxLength={1200}
            style={{ width: '100%', boxSizing: 'border-box', marginBottom: 10, borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)', background: '#111', color: '#fff', padding: 12, fontSize: 12, lineHeight: 1.4, resize: 'vertical' }}
          />
          <button
            type="button"
            onClick={handleSupportRequest}
            disabled={isSubmittingSupport}
            style={{ width: '100%', border: 0, borderRadius: 12, padding: '12px 10px', background: '#60A5FA', color: '#111', fontSize: 10, fontWeight: 900, fontFamily: 'monospace', letterSpacing: 1 }}
          >
            {isSubmittingSupport ? 'SENDING SUPPORT REQUEST...' : 'SEND SUPPORT REQUEST'}
          </button>
          {supportStatusMessage && (
            <div style={{ marginTop: 10, color: supportStatusMessage.includes('sent') ? '#34D399' : '#ffb199', fontSize: 11, fontWeight: 800 }}>
              {supportStatusMessage}
            </div>
          )}
        </div>

        {isAdmin && (
          <>
            <p style={{ color: '#555', fontSize: 10, fontWeight: 700, letterSpacing: 2, fontFamily: 'monospace', margin: '0 0 12px' }}>SUPPORT REVIEW QUEUE</p>
            <div style={{
              background: 'rgba(96,165,250,0.04)', border: '1px solid rgba(96,165,250,0.12)',
              borderRadius: 16, padding: 14, marginBottom: 20,
            }}>
              <p style={{ margin: '0 0 10px', color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
                Admin-only queue for open supportRequests. Use this for follow-up only; do not resolve refunds, subscriptions, or entitlements from profile UI.
              </p>
              {supportReviewQueue.length === 0 ? (
                <div style={{ color: '#666', fontSize: 11, fontWeight: 800 }}>No open support requests.</div>
              ) : supportReviewQueue.slice(0, 5).map(req => (
                <div key={req.id} style={{ padding: '10px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <span style={{ color: '#fff', fontSize: 12, fontWeight: 900 }}>{req.displayName || req.email || req.uid}</span>
                    <span style={{ color: '#60A5FA', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{req.category || 'general'}</span>
                  </div>
                  <div style={{ color: '#777', fontSize: 10, fontWeight: 700, marginTop: 4 }}>{req.email || 'No email'} · {req.source || 'unknown'}</div>
                  <div style={{ color: '#aaa', fontSize: 11, lineHeight: 1.35, marginTop: 6 }}>{req.message}</div>
                  <textarea
                    value={supportReviewNotes[req.id] || ''}
                    onChange={event => setSupportReviewNotes(notes => ({ ...notes, [req.id]: event.target.value.slice(0, 500) }))}
                    placeholder="Manual support review note: follow-up owner, identity check, store/support handoff, no refund or entitlement action..."
                    rows={2}
                    style={{
                      width: '100%', marginTop: 8, border: '1px solid rgba(96,165,250,0.18)',
                      borderRadius: 10, background: 'rgba(0,0,0,0.20)', color: '#fff', padding: 8,
                      fontSize: 11, lineHeight: 1.35, resize: 'vertical', boxSizing: 'border-box',
                    }}
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 6, marginTop: 8 }}>
                    {[
                      ['waiting', 'WAIT'],
                      ['resolved', 'RESOLVE'],
                      ['closed', 'CLOSE'],
                    ].map(([status, label]) => (
                      <button
                        key={status}
                        onClick={() => handleSupportRequestReview(req.id, status)}
                        disabled={reviewingSupportRequestId === req.id}
                        style={{
                          border: 0, borderRadius: 8, padding: '7px 6px',
                          background: 'rgba(96,165,250,0.14)', color: '#60A5FA',
                          fontSize: 9, fontWeight: 900, fontFamily: 'monospace',
                          cursor: reviewingSupportRequestId === req.id ? 'wait' : 'pointer',
                        }}
                      >
                        {reviewingSupportRequestId === req.id ? 'SAVING' : label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Account deletion request */}
        <p style={{ color: '#555', fontSize: 10, fontWeight: 700, letterSpacing: 2, fontFamily: 'monospace', margin: '0 0 12px' }}>ACCOUNT DELETION REQUEST</p>
        <div style={{
          background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.16)',
          borderRadius: 16, padding: 14, marginBottom: 20,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
            <p style={{ margin: 0, color: '#fff', fontSize: 14, fontWeight: 900, fontFamily: "'Syne', sans-serif" }}>
              {accountDeletionRequested ? 'Request recorded' : 'Request account/data deletion review'}
            </p>
            <span style={{
              flexShrink: 0, borderRadius: 999, padding: '4px 8px',
              background: accountDeletionRequested ? 'rgba(52,211,153,0.12)' : 'rgba(255,255,255,0.06)',
              color: accountDeletionRequested ? '#34D399' : '#aaa',
              fontSize: 8, fontWeight: 900, fontFamily: 'monospace', letterSpacing: 1,
            }}>
              {accountDeletionRequested ? 'REQUESTED' : 'NOT REQUESTED'}
            </span>
          </div>
          <p style={{ margin: '0 0 12px', color: '#aaa', fontSize: 10, lineHeight: 1.5, fontWeight: 800 }}>
            This records a support-reviewed accountDeletionRequests entry and does not immediately delete your account, cancel purchases, or bypass marketplace refund policy.
          </p>
          <button
            type="button"
            onClick={handleAccountDeletionRequest}
            disabled={accountDeletionRequested || isRequestingDeletion}
            style={{
              width: '100%', border: 0, borderRadius: 12, padding: '12px 10px',
              background: accountDeletionRequested ? 'rgba(255,255,255,0.06)' : '#F87171',
              color: accountDeletionRequested ? '#777' : '#111',
              fontSize: 10, fontWeight: 900, fontFamily: 'monospace', letterSpacing: 1,
              cursor: accountDeletionRequested ? 'default' : 'pointer',
            }}
          >
            {accountDeletionRequested ? 'REQUEST RECORDED' : (isRequestingDeletion ? 'RECORDING REQUEST...' : 'REQUEST ACCOUNT DELETION')}
          </button>
          {deletionRequestMessage && (
            <div style={{ marginTop: 10, color: deletionRequestMessage.includes('recorded') ? '#34D399' : '#ffb199', fontSize: 11, fontWeight: 800 }}>
              {deletionRequestMessage}
            </div>
          )}
        </div>

        {isAdmin && (
          <>
            <p style={{ color: '#555', fontSize: 10, fontWeight: 700, letterSpacing: 2, fontFamily: 'monospace', margin: '0 0 12px' }}>ACCOUNT DELETION REVIEW QUEUE</p>
            <div style={{
              background: 'rgba(248,113,113,0.04)', border: '1px solid rgba(248,113,113,0.12)',
              borderRadius: 16, padding: 14, marginBottom: 20,
            }}>
              <p style={{ margin: '0 0 10px', color: '#aaa', fontSize: 10, lineHeight: 1.45, fontWeight: 800 }}>
                Admin-only support queue for requested accountDeletionRequests. Review identity, subscriptions, refunds, and data-retention obligations before any backend deletion work.
              </p>
              {accountDeletionReviewQueue.length === 0 ? (
                <div style={{ color: '#666', fontSize: 11, fontWeight: 800 }}>No pending account deletion requests.</div>
              ) : accountDeletionReviewQueue.slice(0, 5).map(req => (
                <div key={req.id} style={{
                  padding: '10px 0',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <span style={{ color: '#fff', fontSize: 12, fontWeight: 900 }}>{req.displayName || req.email || req.uid}</span>
                    <span style={{ color: '#F87171', fontSize: 9, fontWeight: 900, fontFamily: 'monospace' }}>{req.source || 'unknown'}</span>
                  </div>
                  <div style={{ color: '#777', fontSize: 10, fontWeight: 700, marginTop: 4 }}>
                    {req.email || 'No email'} · {req.uid || req.id}
                  </div>
                  <textarea
                    value={accountDeletionReviewNotes[req.id] || ''}
                    onChange={(event) => setAccountDeletionReviewNotes(notes => ({ ...notes, [req.id]: event.target.value }))}
                    placeholder="Manual account deletion review note: identity verified, subscription/refund context, retention obligations, no automatic deletion..."
                    rows={2}
                    style={{
                      width: '100%',
                      marginTop: 8,
                      padding: 8,
                      borderRadius: 10,
                      border: '1px solid rgba(255,255,255,0.08)',
                      background: 'rgba(0,0,0,0.22)',
                      color: '#ddd',
                      fontSize: 10,
                      fontWeight: 700,
                      fontFamily: "'Space Grotesk', sans-serif",
                      resize: 'vertical',
                      boxSizing: 'border-box',
                    }}
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 6, marginTop: 8 }}>
                    {[
                      ['verified', 'VERIFIED'],
                      ['contacted', 'CONTACTED'],
                      ['blocked', 'BLOCKED'],
                      ['closed', 'CLOSED'],
                    ].map(([status, label]) => (
                      <button
                        key={status}
                        onClick={() => handleAccountDeletionReview(req.id, status)}
                        disabled={reviewingAccountDeletionRequestId === req.id}
                        style={{
                          border: '1px solid rgba(248,113,113,0.2)',
                          background: 'rgba(248,113,113,0.08)',
                          color: '#FCA5A5',
                          borderRadius: 10,
                          padding: '8px 4px',
                          fontSize: 8,
                          fontWeight: 900,
                          cursor: reviewingAccountDeletionRequestId === req.id ? 'default' : 'pointer',
                        }}
                      >
                        {reviewingAccountDeletionRequestId === req.id ? '...' : label}
                      </button>
                    ))}
                  </div>
                  <div style={{ color: '#777', fontSize: 9, fontWeight: 800, marginTop: 6 }}>
                    Manual account deletion review only; this does not delete the account, erase data, cancel purchases, process refunds, or bypass marketplace policy.
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Account info */}
        <p style={{ color: '#555', fontSize: 10, fontWeight: 700, letterSpacing: 2, fontFamily: 'monospace', margin: '0 0 12px' }}>ACCOUNT</p>
        <div style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 16, padding: '0 16px 4px',
        }}>
          {[
            { label: 'EMAIL',   value: user.email || '—' },
            { label: 'USER ID', value: (user.uid?.slice(0, 12) || '') + '…' },
          ].map((row, i) => (
            <div key={row.label} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 0',
              borderBottom: i === 0 ? '1px solid rgba(255,255,255,0.05)' : 'none',
            }}>
              <span style={{ fontSize: 9, color: '#444', fontFamily: 'monospace', fontWeight: 700, letterSpacing: 1 }}>{row.label}</span>
              <span style={{ fontSize: 11, color: '#666', fontFamily: 'monospace' }}>{row.value}</span>
            </div>
          ))}
        </div>

        {/* Sign out */}
        <button
          onClick={() => signOut(auth)}
          style={{
            width: '100%', marginTop: 24, padding: '14px', borderRadius: 14,
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.04)', color: '#666',
            fontSize: 14, fontWeight: 700, cursor: 'pointer',
            fontFamily: "'Space Grotesk', sans-serif", letterSpacing: 0.5,
            transition: 'all .2s',
          }}
        >
          Sign Out
        </button>

      </div>

      {/* ── Avatar picker bottom sheet ── */}
      {showAvatarPicker && (
        <div
          onClick={() => setShowAvatarPicker(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 340,
            background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 430,
              background: '#111',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '24px 24px 0 0',
              padding: '20px 24px calc(28px + env(safe-area-inset-bottom))',
              maxHeight: 'calc(100dvh - 20px)',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            <div style={{ width: 36, height: 4, background: 'rgba(255,255,255,0.12)', borderRadius: 4, margin: '0 auto 20px' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
              <div>
                <p style={{ margin: 0, fontSize: 10, color: '#555', fontFamily: 'monospace', fontWeight: 700, letterSpacing: 2 }}>CREATE AVATAR</p>
                <h3 style={{ margin: '4px 0 0', fontSize: 20, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: '#fff' }}>
                  Choose Your Look
                </h3>
              </div>
              <button onClick={() => setShowAvatarPicker(false)} style={{
                width: 32, height: 32, borderRadius: 999,
                border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)',
                color: '#777', cursor: 'pointer', fontSize: 18,
              }}>×</button>
            </div>

            <label
              htmlFor={fileInputRef.current}
              style={{
                width: '100%', minHeight: 46, marginBottom: 16,
                borderRadius: 14, border: `1px solid ${ACCENT}55`,
                background: `${ACCENT}18`, color: ACCENT,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 8, fontSize: 13, fontWeight: 800, cursor: 'pointer',
              }}
            >
              <span>📷</span>
              Upload Photo
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {AVATAR_OPTIONS.map(([emoji, color]) => (
                <button
                  key={`${emoji}-${color}`}
                  onClick={() => {
                    persistAppearance({ profileImageData: null, avatarEmoji: emoji, avatarColor: color });
                    setShowAvatarPicker(false);
                  }}
                  style={{
                    border: `1.5px solid ${color}55`, borderRadius: 18,
                    background: `${color}22`, height: 70,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    gap: 5, cursor: 'pointer',
                  }}
                >
                  <span style={{ fontSize: 28 }}>{emoji}</span>
                  <span style={{ width: 9, height: 9, borderRadius: 999, background: color }} />
                </button>
              ))}
            </div>

            {profileImageSrc && (
              <button
                onClick={() => {
                  persistAppearance({ profileImageData: null, avatarEmoji, avatarColor });
                  setShowAvatarPicker(false);
                }}
                style={{
                  width: '100%', marginTop: 16, padding: '12px',
                  borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.04)', color: '#888',
                  fontSize: 13, fontWeight: 700, cursor: 'pointer',
                }}
              >
                Remove Uploaded Photo
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Challenge points breakdown bottom sheet ── */}
      {showBreakdown && (
        <div
          onClick={() => setShowBreakdown(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 350,
            background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 430,
              background: '#111',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '24px 24px 0 0',
              padding: '20px 24px 52px',
              maxHeight: '72vh', overflowY: 'auto',
            }}
          >
            {/* Drag handle */}
            <div style={{ width: 36, height: 4, background: 'rgba(255,255,255,0.12)', borderRadius: 4, margin: '0 auto 20px' }} />

            {/* Sheet header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <p style={{ margin: 0, fontSize: 10, color: '#555', fontFamily: 'monospace', fontWeight: 700, letterSpacing: 2 }}>PER CHALLENGE</p>
                <h3 style={{ margin: '4px 0 0', fontSize: 20, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: '#fff' }}>
                  Points Breakdown
                </h3>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 28, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: '#34D399' }}>
                  {totalChallengePoints}
                </div>
                <div style={{ fontSize: 9, color: '#555', fontFamily: 'monospace', fontWeight: 700 }}>TOTAL PTS</div>
              </div>
            </div>

            {challengePoints.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🏅</div>
                <p style={{ margin: 0, fontSize: 14, color: '#555' }}>No challenge points yet</p>
                <p style={{ margin: '6px 0 0', fontSize: 12, color: '#444' }}>
                  Log daily tasks inside a challenge to earn points
                </p>
              </div>
            ) : (
              <>
                {challengePoints
                  .slice()
                  .sort((a, b) => b.totalPoints - a.totalPoints)
                  .map((c, i, arr) => (
                    <div key={c.challengeId} style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '14px 0',
                      borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    }}>
                      <div style={{
                        width: 46, height: 46, borderRadius: 14, flexShrink: 0,
                        background: `${c.color}22`, border: `1.5px solid ${c.color}55`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 22, boxShadow: `0 0 10px ${c.color}22`,
                      }}>
                        {c.emoji}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {c.name}
                        </div>
                        <div style={{ fontSize: 10, color: '#555', fontFamily: 'monospace', marginTop: 3 }}>
                          {c.daysCompleted} day{c.daysCompleted !== 1 ? 's' : ''} logged
                          {c.currentStreak > 0 ? ` · ${c.currentStreak}🔥 streak` : ''}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: 22, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: c.color }}>
                          {c.totalPoints}
                        </div>
                        <div style={{ fontSize: 9, color: '#555', fontFamily: 'monospace', fontWeight: 700 }}>PTS</div>
                      </div>
                    </div>
                  ))
                }

                {/* Grand total row */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginTop: 16, padding: '12px 16px', borderRadius: 14,
                  background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.2)',
                }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#888', fontFamily: 'monospace', letterSpacing: 0.5 }}>
                    TOTAL ACROSS ALL CHALLENGES
                  </span>
                  <span style={{ fontSize: 22, fontWeight: 900, fontFamily: "'Syne', sans-serif", color: '#34D399' }}>
                    {totalChallengePoints}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
