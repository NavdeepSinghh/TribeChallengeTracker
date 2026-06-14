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
      {step === 0 && (
        <section style={{
          margin: '26px 24px 0',
          padding: 16,
          border: '1px solid rgba(255,255,255,.08)',
          borderRadius: 16,
          background: 'rgba(255,255,255,.04)',
        }}>
          <div style={{
            color: '#555',
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: 1.2,
            marginBottom: 12,
            fontFamily: "'Space Grotesk', sans-serif",
          }}>
            HOW TRIBELOG WORKS
          </div>
          {[
            ['🎯', 'Pick a challenge', 'Join a simple fitness challenge that fits your current rhythm.'],
            ['➕', 'Log one activity', 'Add a run, walk, gym session, yoga, swim, cycle, or optional wearable sync when you choose it.'],
            ['🔥', 'Build momentum', 'TribeLog tracks points, streaks, badges, and progress without asking for Health, photo, or reminder permissions during setup.'],
          ].map(([icon, title, body]) => (
            <div key={title} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '5px 0' }}>
              <div style={{ width: 24, fontSize: 18, lineHeight: '22px' }}>{icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#fff', fontSize: 13, fontWeight: 800 }}>{title}</div>
                <div style={{ color: 'rgba(255,255,255,.62)', fontSize: 12, lineHeight: '16px', marginTop: 2 }}>{body}</div>
              </div>
            </div>
          ))}
        </section>
      )}
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
