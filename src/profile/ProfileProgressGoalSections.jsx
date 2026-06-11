import CustomGoalsSection from './CustomGoalsSection';
import ProAnalyticsReportSection from './ProAnalyticsReportSection';

export default function ProfileProgressGoalSections({ model }) {
  const {
    currentStreak,
    goalActiveDays,
    goalPoints,
    goalProgress,
    goalStreak,
    goalsMessage,
    handleCustomGoalsSave,
    isSavingGoals,
    longHistoryReport,
    monthlyReport,
    proActive,
    setGoalActiveDays,
    setGoalPoints,
    setGoalStreak,
    weeklyRecap,
    weeklyReport,
  } = model;

  return (
    <>
      <ProAnalyticsReportSection
        proActive={proActive}
        weeklyReport={weeklyReport}
        monthlyReport={monthlyReport}
        longHistoryReport={longHistoryReport}
      />

      <CustomGoalsSection
        proActive={proActive}
        goalActiveDays={goalActiveDays}
        setGoalActiveDays={setGoalActiveDays}
        goalPoints={goalPoints}
        setGoalPoints={setGoalPoints}
        goalStreak={goalStreak}
        setGoalStreak={setGoalStreak}
        weeklyRecap={weeklyRecap}
        currentStreak={currentStreak}
        goalProgress={goalProgress}
        handleCustomGoalsSave={handleCustomGoalsSave}
        isSavingGoals={isSavingGoals}
        goalsMessage={goalsMessage}
      />
    </>
  );
}
