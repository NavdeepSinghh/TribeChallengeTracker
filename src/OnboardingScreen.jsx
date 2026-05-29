import { useState, useEffect } from 'react';

const ACCENT = '#FF6B35';
const GOLD   = '#FFD700';

const QUESTIONS = [
  {
    id: 'goal',
    emoji: '🎯',
    question: "What's your main goal?",
    subtitle: 'This shapes your whole challenge experience',
    multi: false,
    cols: 2,
    options: [
      { id: 'lose_weight',    emoji: '🔥', label: 'Lose Weight' },
      { id: 'build_muscle',   emoji: '💪', label: 'Build Muscle' },
      { id: 'endurance',      emoji: '🏃', label: 'Improve Endurance' },
      { id: 'stress',         emoji: '🧘', label: 'Reduce Stress' },
      { id: 'energy',         emoji: '⚡', label: 'Boost Energy' },
    ],
  },
  {
    id: 'level',
    emoji: '📊',
    question: 'Current fitness level?',
    subtitle: "Be honest — we'll tailor the challenge to you",
    multi: false,
    cols: 2,
    options: [
      { id: 'beginner',  emoji: '🌱', label: 'Just Starting',    desc: '0–1 workouts / week' },
      { id: 'moderate',  emoji: '🚶', label: 'Somewhat Active',  desc: '2–3 workouts / week' },
      { id: 'fit',       emoji: '🏃', label: 'Pretty Fit',       desc: '4–5 workouts / week' },
      { id: 'athlete',   emoji: '🦅', label: 'Very Athletic',    desc: '6+ workouts / week' },
    ],
  },
  {
    id: 'activities',
    emoji: '🏋️',
    question: 'Activities you love?',
    subtitle: 'Pick everything that gets you moving',
    multi: true,
    cols: 3,
    options: [
      { id: 'run',   emoji: '🏃', label: 'Run' },
      { id: 'yoga',  emoji: '🧘', label: 'Yoga' },
      { id: 'gym',   emoji: '💪', label: 'Gym' },
      { id: 'cycle', emoji: '🚴', label: 'Cycle' },
      { id: 'swim',  emoji: '🏊', label: 'Swim' },
      { id: 'walk',  emoji: '🚶', label: 'Walk' },
    ],
  },
  {
    id: 'frequency',
    emoji: '📅',
    question: 'How often will you train?',
    subtitle: 'Consistency beats intensity every time',
    multi: false,
    cols: 2,
    options: [
      { id: '2_3',      emoji: '🌿', label: '2–3× a week' },
      { id: '4_5',      emoji: '💪', label: '4–5× a week' },
      { id: 'daily',    emoji: '🔥', label: 'Every day' },
      { id: 'flexible', emoji: '🎯', label: 'Flexible' },
    ],
  },
  {
    id: 'time',
    emoji: '⏰',
    question: 'Best time to train?',
    subtitle: "We'll cheer you on at the right moment",
    multi: false,
    cols: 2,
    options: [
      { id: 'early',     emoji: '🌅', label: 'Early Bird',  desc: 'Before 7 am' },
      { id: 'morning',   emoji: '☀️',  label: 'Morning',    desc: '7 am – 12 pm' },
      { id: 'afternoon', emoji: '🌤',  label: 'Afternoon',  desc: '12 pm – 5 pm' },
      { id: 'evening',   emoji: '🌙', label: 'Evening',     desc: 'After 5 pm' },
    ],
  },
  {
    id: 'motivation',
    emoji: '🚀',
    question: 'What drives you most?',
    subtitle: 'Your tribe wants to know',
    multi: false,
    cols: 2,
    options: [
      { id: 'compete',   emoji: '🏆', label: 'Beating others' },
      { id: 'progress',  emoji: '📈', label: 'My own progress' },
      { id: 'community', emoji: '👥', label: 'The community' },
      { id: 'records',   emoji: '⚡', label: 'Personal records' },
    ],
  },
];

// ─── MAIN ONBOARDING ──────────────────────────────────────────────────────────
export default function OnboardingScreen({ onComplete, userName }) {
  const [step, setStep]       = useState(0);
  const [answers, setAnswers] = useState({});
  const [visible, setVisible] = useState(true);
  const [done, setDone]       = useState(false);

  const q       = QUESTIONS[step];
  const isMulti = q.multi;
  const current = answers[q.id] ?? (isMulti ? [] : null);
  const hasAnswer = isMulti ? current.length > 0 : current !== null;

  const transition = (nextStep) => {
    setVisible(false);
    setTimeout(() => {
      if (nextStep >= QUESTIONS.length) setDone(true);
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
    return <CompletionScreen answers={answers} userName={userName} onComplete={onComplete} />;
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

      {/* Progress */}
      <div style={{ padding: '56px 24px 0' }}>
        <div style={{ display: 'flex', gap: 5, marginBottom: 8 }}>
          {QUESTIONS.map((_, i) => (
            <div key={i} style={{
              flex: 1, height: 3, borderRadius: 3,
              background: i <= step
                ? `linear-gradient(90deg, ${ACCENT}, ${GOLD})`
                : 'rgba(255,255,255,0.07)',
              transition: 'background .4s',
            }} />
          ))}
        </div>
        <p style={{ color: '#444', fontSize: 10, fontFamily: 'monospace', fontWeight: 700, letterSpacing: 1, margin: 0 }}>
          {step + 1} / {QUESTIONS.length}
        </p>
      </div>

      {/* Question */}
      <div style={{
        flex: 1, padding: '32px 24px 0',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(14px)',
        transition: 'opacity .26s ease, transform .26s ease',
      }}>
        <div style={{ fontSize: 50, marginBottom: 20 }}>{q.emoji}</div>

        <h2 style={{
          margin: '0 0 6px', fontSize: 26, fontWeight: 900,
          fontFamily: "'Syne', sans-serif", color: '#fff', lineHeight: 1.2,
        }}>
          {q.question}
        </h2>
        <p style={{ color: '#555', fontSize: 13, margin: '0 0 26px', fontWeight: 500 }}>
          {q.subtitle}
        </p>

        {/* Options */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${q.cols}, 1fr)`,
          gap: 10,
        }}>
          {q.options.map(opt => {
            const selected = isMulti ? current.includes(opt.id) : current === opt.id;
            return (
              <button key={opt.id} onClick={() => select(opt.id)} style={{
                padding: q.cols === 3 ? '16px 8px' : '18px 12px',
                borderRadius: 16,
                border: `1.5px solid ${selected ? ACCENT : 'rgba(255,255,255,0.08)'}`,
                background: selected ? `rgba(255,107,53,0.12)` : 'rgba(255,255,255,0.03)',
                color: '#fff', cursor: 'pointer', textAlign: 'center',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                boxShadow: selected ? `0 0 20px rgba(255,107,53,0.25)` : 'none',
                transform: selected ? 'scale(1.03)' : 'scale(1)',
                transition: 'all .2s ease',
              }}>
                <span style={{ fontSize: q.cols === 3 ? 28 : 26 }}>{opt.emoji}</span>
                <span style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.3, letterSpacing: 0.2 }}>
                  {opt.label}
                </span>
                {opt.desc && (
                  <span style={{ fontSize: 10, color: '#555', fontFamily: 'monospace' }}>{opt.desc}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Continue — multi-select only */}
        {isMulti && (
          <button
            onClick={() => transition(step + 1)}
            disabled={!hasAnswer}
            style={{
              width: '100%', padding: '15px', borderRadius: 14, border: 'none',
              background: hasAnswer
                ? `linear-gradient(135deg, ${ACCENT}, ${GOLD})`
                : 'rgba(255,255,255,0.06)',
              color: hasAnswer ? '#000' : '#444',
              fontSize: 15, fontWeight: 800,
              cursor: hasAnswer ? 'pointer' : 'default',
              fontFamily: "'Syne', sans-serif", letterSpacing: 0.5,
              marginTop: 22,
              boxShadow: hasAnswer ? `0 4px 20px rgba(255,107,53,0.35)` : 'none',
              transition: 'all .3s ease',
            }}
          >
            Continue →
          </button>
        )}
      </div>
    </div>
  );
}

// ─── COMPLETION SCREEN ────────────────────────────────────────────────────────
const GOAL_LABELS = {
  lose_weight: 'Lose Weight 🔥', build_muscle: 'Build Muscle 💪',
  endurance: 'Improve Endurance 🏃', stress: 'Reduce Stress 🧘', energy: 'Boost Energy ⚡',
};
const LEVEL_LABELS = {
  beginner: 'Just Starting 🌱', moderate: 'Somewhat Active 🚶',
  fit: 'Pretty Fit 🏃', athlete: 'Very Athletic 🦅',
};
const FREQ_LABELS = {
  '2_3': '2–3× a week', '4_5': '4–5× a week', daily: 'Every day 🔥', flexible: 'Flexible 🎯',
};
const ACTIVITY_LABELS = {
  run: '🏃 Run', yoga: '🧘 Yoga', gym: '💪 Gym',
  cycle: '🚴 Cycle', swim: '🏊 Swim', walk: '🚶 Walk',
};

function CompletionScreen({ answers, userName, onComplete }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);

  const firstName   = userName?.split(' ')[0];
  const activities  = (answers.activities || []).map(a => ACTIVITY_LABELS[a]).filter(Boolean);

  const rows = [
    { label: 'GOAL',      value: GOAL_LABELS[answers.goal] },
    { label: 'LEVEL',     value: LEVEL_LABELS[answers.level] },
    { label: 'FREQUENCY', value: FREQ_LABELS[answers.frequency] },
  ].filter(r => r.value);

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

      <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
      <p style={{ color: '#555', fontSize: 10, fontWeight: 700, letterSpacing: 2, margin: '0 0 8px', fontFamily: 'monospace' }}>
        PROFILE COMPLETE
      </p>
      <h2 style={{
        margin: '0 0 8px', fontSize: 28, fontWeight: 900,
        fontFamily: "'Syne', sans-serif", textAlign: 'center', color: '#fff',
      }}>
        You're tribe-ready{firstName ? `, ${firstName}` : ''}!
      </h2>
      <p style={{ color: '#555', fontSize: 13, textAlign: 'center', margin: '0 0 32px' }}>
        Your 30-day challenge is personalised and waiting.
      </p>

      {/* Summary card */}
      <div style={{
        width: '100%',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20, padding: '4px 20px 16px', marginBottom: 24,
      }}>
        {rows.map((row, i) => (
          <div key={row.label} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '13px 0',
            borderBottom: i < rows.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
          }}>
            <span style={{ fontSize: 10, color: '#444', fontFamily: 'monospace', fontWeight: 700, letterSpacing: 1 }}>
              {row.label}
            </span>
            <span style={{ fontSize: 13, color: '#fff', fontWeight: 700 }}>{row.value}</span>
          </div>
        ))}

        {activities.length > 0 && (
          <div style={{ paddingTop: 14 }}>
            <span style={{ fontSize: 10, color: '#444', fontFamily: 'monospace', fontWeight: 700, letterSpacing: 1, display: 'block', marginBottom: 10 }}>
              ACTIVITIES
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {activities.map(a => (
                <span key={a} style={{
                  padding: '5px 12px', borderRadius: 20,
                  background: 'rgba(255,107,53,0.1)',
                  border: '1px solid rgba(255,107,53,0.25)',
                  color: ACCENT, fontSize: 12, fontWeight: 700,
                }}>
                  {a}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <button onClick={onComplete} style={{
        width: '100%', padding: '16px', borderRadius: 14, border: 'none',
        background: `linear-gradient(135deg, ${ACCENT} 0%, ${GOLD} 100%)`,
        color: '#000', fontSize: 16, fontWeight: 800, cursor: 'pointer',
        fontFamily: "'Syne', sans-serif", letterSpacing: 0.5,
        boxShadow: '0 4px 30px rgba(255,107,53,0.4)',
      }}>
        Enter the Tribe 🏃
      </button>
    </div>
  );
}
