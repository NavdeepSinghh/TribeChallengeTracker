import { useEffect } from "react";
import { useAuth } from "./AuthContext";
import AuthScreen from "./AuthScreen";
import OnboardingScreen from "./OnboardingScreen";
import AppAuthenticated from "./app/AppAuthenticated";
import useOnboardingStatus from "./app/useOnboardingStatus";
import { safeSessionSet } from "./browserStorage";

function capturePendingChallengeInvite() {
  const params = new URLSearchParams(window.location.search);
  const joinCode = params.get("join") || params.get("code");
  const referralUid = params.get("ref");
  const sanitizedCode = joinCode?.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 12);
  const sanitizedReferral = referralUid?.replace(/[^A-Za-z0-9_-]/g, "").slice(0, 128);

  if (sanitizedCode) {
    safeSessionSet("pendingJoinCode", sanitizedCode);
  }
  if (sanitizedReferral) {
    safeSessionSet("pendingReferralUid", sanitizedReferral);
  }
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function TribeChallenge() {
  const { user } = useAuth();
  const { completeOnboarding, onboarded } = useOnboardingStatus(user);

  useEffect(() => {
    capturePendingChallengeInvite();
  }, []);

  if (user === undefined || (user && onboarded === null)) {
    return (
      <div style={{ minHeight: "100vh", background: "#080808", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 32 }}>🏃</span>
      </div>
    );
  }

  if (!user) return <AuthScreen />;

  if (!onboarded) {
    return (
      <OnboardingScreen
        userName={user.displayName}
        onComplete={completeOnboarding}
      />
    );
  }

  return <AppAuthenticated user={user} />;
}
