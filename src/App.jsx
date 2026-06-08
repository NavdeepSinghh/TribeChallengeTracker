import { useAuth } from "./AuthContext";
import AuthScreen from "./AuthScreen";
import OnboardingScreen from "./OnboardingScreen";
import AppAuthenticated from "./app/AppAuthenticated";
import useOnboardingStatus from "./app/useOnboardingStatus";

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function TribeChallenge() {
  const { user } = useAuth();
  const { completeOnboarding, onboarded } = useOnboardingStatus(user);

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
