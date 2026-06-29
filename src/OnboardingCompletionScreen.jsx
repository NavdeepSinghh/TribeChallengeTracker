import { useEffect, useState } from 'react';
import OnboardingBackButton from './OnboardingBackButton';
import OnboardingCompletionConfetti from './OnboardingCompletionConfetti';
import OnboardingCompletionCta from './OnboardingCompletionCta';
import OnboardingCompletionHero from './OnboardingCompletionHero';
import OnboardingCompletionSummaryCard from './OnboardingCompletionSummaryCard';
import { buildOnboardingCompletionData } from './onboardingCompletionData';

export default function OnboardingCompletionScreen({ answers, shouldCelebrate = false, userName, onBack, onComplete }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(timer);
  }, []);

  const welcomeName = userName?.trim();
  const { activities, rows } = buildOnboardingCompletionData(answers);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fbfaf7',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '42px 24px 28px',
      maxWidth: 430,
      margin: '0 auto',
      fontFamily: "'Space Grotesk', sans-serif",
      position: 'relative',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(20px)',
      transition: 'all .5s ease',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <OnboardingCompletionConfetti active={shouldCelebrate} />
      {onBack && <OnboardingBackButton onBack={onBack} style={{ position: 'absolute', top: 54, left: 24 }} />}
      <OnboardingCompletionHero name={welcomeName} />
      <OnboardingCompletionSummaryCard activities={activities} rows={rows} />
      <OnboardingCompletionCta answers={answers} onComplete={onComplete} />
    </div>
  );
}
