import OnboardingContinueButton from './OnboardingContinueButton';
import OnboardingOptionGrid from './OnboardingOptionGrid';
import OnboardingQuestionHeader from './OnboardingQuestionHeader';

export default function OnboardingQuestionStep({
  current,
  hasAnswer,
  isMulti,
  onContinue,
  question,
  select,
  visible,
}) {
  return (
    <div style={{
      flex: 1, padding: '32px 24px 0',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(14px)',
      transition: 'opacity .26s ease, transform .26s ease',
    }}>
      <OnboardingQuestionHeader question={question} />
      <OnboardingOptionGrid
        current={current}
        isMulti={isMulti}
        question={question}
        select={select}
      />
      {isMulti && <OnboardingContinueButton hasAnswer={hasAnswer} onContinue={onContinue} />}
    </div>
  );
}
