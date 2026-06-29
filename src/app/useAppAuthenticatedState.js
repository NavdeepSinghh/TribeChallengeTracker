import { useEffect, useState } from "react";
import { startDailyReminderLoop } from "../reminderService";
import { buildAppActivitySummary } from "./appActivitySummary";
import { buildAppAuthenticatedStateResult } from "./appAuthenticatedStateResult";
import useActivityHistory from "./useActivityHistory";
import useAppBadges from "./useAppBadges";
import useAppShellState from "./useAppShellState";
import useAdminAccess from "./useAdminAccess";
import useChallengeRefreshHandlers from "./useChallengeRefreshHandlers";
import usePendingChallengeEntry from "./usePendingChallengeEntry";
import useProgressShareActions from "./useProgressShareActions";
import useRankRules from "./useRankRules";
import useUserChallengeData from "./useUserChallengeData";

export default function useAppAuthenticatedState(user) {
  const shellState = useAppShellState();
  const isAdmin = useAdminAccess(user);
  const { showToast, ...publicShellState } = shellState;
  const { setTab } = publicShellState;
  const pendingChallengeEntry = usePendingChallengeEntry(setTab);
  const rankRules = useRankRules();
  const {
    clearPendingChallengeEntry,
  } = pendingChallengeEntry;
  const userChallengeData = useUserChallengeData(user);
  const {
    challengeStats,
    refreshChallengeStats,
    setUserProfile,
    userProfile,
  } = userChallengeData;
  const badgeState = useAppBadges({ user, userProfile });
  const { triggerBadgeCheck } = badgeState;
  const [levelUp, setLevelUp] = useState(null);
  const logState = useActivityHistory({
    challengeStats,
    onLevelUp: setLevelUp,
    rankRules,
    showToast,
    triggerBadgeCheck,
    user,
    userProfile,
  });
  const {
    myHistory,
  } = logState;
  const activitySummary = buildAppActivitySummary({ myHistory, rankRules, userProfile });
  const {
    hasActivePro,
    shareStats,
    shareTemplateId,
  } = activitySummary;
  const progressShareActions = useProgressShareActions({
    hasActivePro,
    setUserProfile,
    shareStats,
    shareTemplateId,
    showToast,
    user,
  });

  useEffect(() => {
    startDailyReminderLoop();
  }, [user.uid]);

  const challengeRefreshHandlers = useChallengeRefreshHandlers({
    clearPendingChallengeEntry,
    myHistory,
    refreshChallengeStats,
    triggerBadgeCheck,
  });

  return buildAppAuthenticatedStateResult({
    activitySummary,
    badgeState,
    challengeRefreshHandlers,
    logState,
    pendingChallengeEntry,
    progressShareActions,
    publicShellState,
    levelUpState: {
      dismissLevelUp: () => setLevelUp(null),
      levelUp,
    },
    isAdmin,
    rankRules,
    userChallengeData,
  });
}
