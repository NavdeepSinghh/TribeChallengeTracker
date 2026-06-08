import { useEffect, useState } from 'react';
import OnboardingCompletionCta from './OnboardingCompletionCta';
import OnboardingCompletionHero from './OnboardingCompletionHero';
import OnboardingCompletionSummaryCard from './OnboardingCompletionSummaryCard';
import { buildOnboardingCompletionData } from './onboardingCompletionData';

export default function OnboardingCompletionScreen({ answers, userName, onComplete }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);

  const firstName = userName?.split(' ')[0];
  const { activities, rows } = buildOnboardingCompletionData(answers);

  return (
    <div style={{
      minHeight: '100vh', background: '#080808',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px', maxWidth: 430, margin: '0 auto',
      fontFamily: "'Space Grotesk', sans-serif",
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(20px)',
      transition: 'all .5s ease',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <OnboardingCompletionHero firstName={firstName} />
      <OnboardingCompletionSummaryCard activities={activities} rows={rows} />
      <OnboardingCompletionCta answers={answers} onComplete={onComplete} />
    </div>
  );
}
