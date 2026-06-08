import { useEffect, useState } from "react";
import { getUserProfile, saveOnboarding } from "../userService";

export default function useOnboardingStatus(user) {
  const [onboarded, setOnboarded] = useState(null);

  useEffect(() => {
    if (!user) {
      setOnboarded(null);
      return;
    }
    const cached = localStorage.getItem("onboarding_" + user.uid);
    if (cached) {
      setOnboarded(true);
      return;
    }
    getUserProfile(user.uid).then(profile => {
      if (profile?.onboarding || profile?.onboardingDone) {
        localStorage.setItem("onboarding_" + user.uid, "1");
        setOnboarded(true);
      } else {
        setOnboarded(false);
      }
    });
  }, [user]);

  const completeOnboarding = async (answers) => {
    try {
      await saveOnboarding(user.uid, answers);
    } catch (e) {
      console.error("saveOnboarding failed:", e);
    }
    localStorage.setItem("onboarding_" + user.uid, "1");
    setOnboarded(true);
  };

  return { completeOnboarding, onboarded };
}
