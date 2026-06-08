import { useState } from 'react';
import OnboardingCompletionScreen from './OnboardingCompletionScreen';
import OnboardingProgress from './OnboardingProgress';
import OnboardingQuestionStep from './OnboardingQuestionStep';
import { ONBOARDING_QUESTIONS } from './onboardingQuestions';

// ─── MAIN ONBOARDING ──────────────────────────────────────────────────────────
export default function OnboardingScreen({ onComplete, userName }) {
  const [step, setStep]       = useState(0);
  const [answers, setAnswers] = useState({});
  const [visible, setVisible] = useState(true);
  const [done, setDone]       = useState(false);

  const q       = ONBOARDING_QUESTIONS[step];
  const isMulti = q.multi;
  const current = answers[q.id] ?? (isMulti ? [] : null);
  const hasAnswer = isMulti ? current.length > 0 : current !== null;

  const transition = (nextStep) => {
    setVisible(false);
    setTimeout(() => {
      if (nextStep >= ONBOARDING_QUESTIONS.length) setDone(true);
      else setStep(nextStep);
      setVisible(true);
    }, 260);
  };

  const select = (optId) => {
    if (isMulti) {
      setAnswers(prev => {
        const arr = prev[q.id] || [];
        return {
          ...prev,
          [q.id]: arr.includes(optId) ? arr.filter(x => x !== optId) : [...arr, optId],
        };
      });
    } else {
      setAnswers(prev => ({ ...prev, [q.id]: optId }));
      setTimeout(() => transition(step + 1), 340);
    }
  };

  if (done) {
    return <OnboardingCompletionScreen answers={answers} userName={userName} onComplete={onComplete} />;
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#080808',
      display: 'flex', flexDirection: 'column',
      maxWidth: 430, margin: '0 auto',
      fontFamily: "'Space Grotesk', sans-serif",
      paddingBottom: 40,
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <OnboardingProgress questions={ONBOARDING_QUESTIONS} step={step} />
      <OnboardingQuestionStep
        current={current}
        hasAnswer={hasAnswer}
        isMulti={isMulti}
        onContinue={() => transition(step + 1)}
        question={q}
        select={select}
        visible={visible}
      />
    </div>
  );
}
