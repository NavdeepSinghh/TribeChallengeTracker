import { getWeeklyCampaignPrompt } from '../challengeService';
import { buildProfileAppearanceState } from './profileDerivedState';
import {
  INSTAGRAM_WEEKLY_PROMPTS,
  PROFILE_FRAMES,
} from './profileConstants';
import { buildSupportDecisionCopy } from './supportDecisionCopy';

export function buildProfileBaseDerivedData({
  accountDeletionReviewQueue,
  profile,
  rank,
  selectedFrameId,
  supportCategory,
  supportReviewQueue,
  user,
}) {
  const weeklyCampaignPrompt = getWeeklyCampaignPrompt();
  const instagramWeeklyPrompt = INSTAGRAM_WEEKLY_PROMPTS[new Date().getDay()];
  const memberYear = profile?.createdAt?.toDate?.()?.getFullYear?.() || new Date().getFullYear();
  const accountDeletionRequested = profile?.accountDeletionRequest?.status === 'requested';
  const isAdmin = profile?.isAdmin || profile?.role === 'admin';
  const supportDecisionData = buildSupportDecisionCopy({
    supportReviewQueue,
    supportCategory,
    accountDeletionReviewQueue,
    profile,
    userEmail: user?.email,
  });
  const appearanceData = buildProfileAppearanceState({
    profile,
    rank,
    selectedFrameId,
    profileFrames: PROFILE_FRAMES,
  });

  return {
    ...appearanceData,
    ...supportDecisionData,
    accountDeletionRequested,
    instagramWeeklyPrompt,
    isAdmin,
    memberYear,
    weeklyCampaignPrompt,
  };
}
