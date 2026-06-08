import { useEffect, useState } from "react";

function getInitialPendingParam(paramName, storageKey) {
  const params = new URLSearchParams(window.location.search);
  return params.get(paramName) || sessionStorage.getItem(storageKey) || null;
}

export default function usePendingChallengeEntry(setTab) {
  const [pendingJoinCode, setPendingJoinCode] = useState(() => getInitialPendingParam("join", "pendingJoinCode"));
  const [pendingReferralUid, setPendingReferralUid] = useState(() => getInitialPendingParam("ref", "pendingReferralUid"));

  useEffect(() => {
    if (!pendingJoinCode) return;
    sessionStorage.setItem("pendingJoinCode", pendingJoinCode);
    if (pendingReferralUid) sessionStorage.setItem("pendingReferralUid", pendingReferralUid);
    setTab("challenges");
  }, [pendingJoinCode, pendingReferralUid, setTab]);

  const clearPendingChallengeEntry = () => {
    setPendingJoinCode(null);
    setPendingReferralUid(null);
    sessionStorage.removeItem("pendingJoinCode");
  };

  return {
    clearPendingChallengeEntry,
    pendingJoinCode,
    pendingReferralUid,
  };
}
