import OnboardingContinueButton from './OnboardingContinueButton';
import OnboardingFloatingNextButton from './OnboardingFloatingNextButton';
import OnboardingOptionGrid from './OnboardingOptionGrid';
import OnboardingQuestionHeader from './OnboardingQuestionHeader';

export default function OnboardingQuestionStep({
  canContinue,
  current,
  isMulti,
  onContinue,
  question,
  select,
  visible,
}) {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      padding: '34px 24px 28px',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(14px)',
      transition: 'opacity .26s ease, transform .26s ease',
    }}>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 28 }}>
        <OnboardingQuestionHeader question={question} />
        <OnboardingOptionGrid
          current={current}
          isMulti={isMulti}
          question={question}
          select={select}
        />
      </div>
      <OnboardingFloatingNextButton canContinue={canContinue} onContinue={onContinue} />
      <OnboardingContinueButton hasAnswer={canContinue} onContinue={onContinue} />
    </div>
  );
}
