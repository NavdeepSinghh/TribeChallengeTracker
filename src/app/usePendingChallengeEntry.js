import { useEffect, useState } from "react";
import { safeSessionGet, safeSessionRemove, safeSessionSet } from "../browserStorage";

function getInitialPendingParam(paramName, storageKey) {
  const params = new URLSearchParams(window.location.search);
  return params.get(paramName) || safeSessionGet(storageKey) || null;
}

export default function usePendingChallengeEntry(setTab) {
  const [pendingJoinCode, setPendingJoinCode] = useState(() => getInitialPendingParam("join", "pendingJoinCode"));
  const [pendingReferralUid, setPendingReferralUid] = useState(() => getInitialPendingParam("ref", "pendingReferralUid"));

  useEffect(() => {
    if (!pendingJoinCode) return;
    safeSessionSet("pendingJoinCode", pendingJoinCode);
    if (pendingReferralUid) safeSessionSet("pendingReferralUid", pendingReferralUid);
    setTab("challenges");
  }, [pendingJoinCode, pendingReferralUid, setTab]);

  const clearPendingChallengeEntry = () => {
    setPendingJoinCode(null);
    setPendingReferralUid(null);
    safeSessionRemove("pendingJoinCode");
    safeSessionRemove("pendingReferralUid");
  };

  return {
    clearPendingChallengeEntry,
    pendingJoinCode,
    pendingReferralUid,
  };
}
