import { ACCENT, GOLD } from './profileThemeConstants';
export { PROFILE_PARITY_CONTRACT_LABELS } from './profileParityContractLabels';

export const DM_KEYWORD_PROMPTS = [
  { keyword: 'TRIBE', label: 'Weekly challenge invite', reply: 'Send this when someone wants the current weekly challenge link.' },
  { keyword: 'COMEBACK', label: 'Restart support', reply: 'Send this when someone says they fell off and needs a small restart.' },
  { keyword: 'PRO', label: 'Future paid access', reply: 'Send this when someone asks about reports, private challenges, or challenge packs.' },
  { keyword: 'FEATURE', label: 'UGC/highlight flow', reply: 'Send this when someone wants to be reposted by @risewiththetribe.' },
];

export const FEATURE_CATEGORIES = [
  ['streak_win', 'Streak win'],
  ['challenge_completion', 'Challenge completion'],
  ['comeback', 'Comeback story'],
  ['beginner_win', 'Beginner win'],
  ['transformation', 'Transformation'],
];
export const FEATURE_CATEGORY_LABELS = Object.fromEntries(FEATURE_CATEGORIES);
export const FEATURE_STATUS_STYLES = {
  pending: ['Pending', '#F59E0B'],
  approved: ['Approved', '#60A5FA'],
  featured: ['Featured', '#34D399'],
  declined: ['Declined', '#F87171'],
};

export const REFERRAL_TIERS = [
  { target: 1, label: 'Connector', reward: 'Referral badge unlock', color: '#34D399' },
  { target: 5, label: 'Tribe Builder', reward: 'Builder badge + featured queue priority', color: ACCENT },
  { target: 10, label: 'Community Captain', reward: 'Captain badge + leaderboard shoutout', color: GOLD },
  { target: 25, label: 'Founder Circle', reward: 'Future Pro trial / founder perk candidate', color: '#A78BFA' },
];

export const PRO_BENEFITS = [
  'Advanced progress analytics',
  'Weekly/monthly performance reports',
  'Custom weekly and streak goals',
  'Premium profile frames',
  'Streak recovery credits',
  'Private challenges',
  'Premium badges and share templates',
];

export const PRO_TRIAL_REASONS = [
  { id: 'reports', label: 'Reports', detail: 'Weekly/monthly insights and custom goals' },
  { id: 'challenge_packs', label: 'Challenge packs', detail: 'Structured premium programs and prompts' },
  { id: 'creator_tools', label: 'Creator tools', detail: 'Launch kit, hosted analytics, and future revenue-share' },
];

export const INSTAGRAM_WEEKLY_PROMPTS = [
  { label: 'SUNDAY COUNTDOWN', title: 'Set the tone for next week', hook: 'Next week starts now. I am choosing consistency before motivation shows up.' },
  { label: 'WEEKLY CHALLENGE LAUNCH', title: 'Invite the tribe in', hook: 'New week, new challenge energy. Pick one action and bring someone with you.' },
  { label: 'CONSISTENCY LESSON', title: 'Teach one useful habit', hook: 'Small repeatable habits beat dramatic restarts. Here is the one I am protecting today.' },
  { label: 'COMMUNITY WIN', title: 'Celebrate a visible win', hook: 'A win worth sharing: I showed up again, and that counts.' },
  { label: 'ACCOUNTABILITY HOOK', title: 'Call in the next log', hook: 'This is your sign to log the session before the day gets away from you.' },
  { label: 'LEADERBOARD RECAP', title: 'Share proof of effort', hook: 'Proof over promises. The points, streak, and active days are moving.' },
  { label: 'FOUNDER NOTE', title: 'Share the behind-the-scenes', hook: 'Building the tribe one check-in at a time. The goal is consistency people can feel.' },
];
