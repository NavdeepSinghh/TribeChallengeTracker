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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [completionVisitCount, setCompletionVisitCount] = useState(0);

  const q       = ONBOARDING_QUESTIONS[step];
  const isMulti = q.multi;
  const current = answers[q.id] ?? (isMulti ? [] : null);
  const hasAnswer = isMulti ? current.length > 0 : current !== null;

  const transition = (nextStep) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setVisible(false);
    setTimeout(() => {
      if (nextStep >= ONBOARDING_QUESTIONS.length) {
        setCompletionVisitCount(count => count + 1);
        setDone(true);
      } else {
        setStep(nextStep);
      }
      setVisible(true);
      setIsTransitioning(false);
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
    }
  };

  const goBack = () => {
    if (isTransitioning) return;
    if (done) {
      setDone(false);
      setStep(ONBOARDING_QUESTIONS.length - 1);
      setVisible(true);
      return;
    }
    if (step > 0) transition(step - 1);
  };

  if (done) {
    return (
      <OnboardingCompletionScreen
        answers={answers}
        onBack={goBack}
        onComplete={onComplete}
        shouldCelebrate={completionVisitCount === 1}
        userName={userName}
      />
    );
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#fbfaf7',
      display: 'flex', flexDirection: 'column',
      maxWidth: 430, margin: '0 auto',
      fontFamily: "'Space Grotesk', sans-serif",
      color: '#090909',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <OnboardingProgress
        canGoBack={step > 0 && !isTransitioning}
        onBack={goBack}
        questions={ONBOARDING_QUESTIONS}
        step={step}
      />
      <OnboardingQuestionStep
        canContinue={hasAnswer && !isTransitioning}
        current={current}
        isMulti={isMulti}
        onContinue={() => transition(step + 1)}
        question={q}
        select={select}
        visible={visible}
      />
    </div>
  );
}
