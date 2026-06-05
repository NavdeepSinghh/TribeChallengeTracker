import { buildMonthlyReport, buildWeeklyReport } from '../weeklyReport';

describe('weekly report', () => {
  it('scores goal progress and recommends the first unmet weekly action', () => {
    const report = buildWeeklyReport({
      weeklyRecap: { activeDays: 3, sessions: 4, points: 120 },
      goals: { weeklyActiveDaysTarget: 5, weeklyPointsTarget: 250, streakTarget: 10 },
      currentStreak: 4,
      totalChallengePoints: 90,
      bestType: 'RUN · 2 sessions',
    });

    expect(report).toMatchObject({
      activeDays: 3,
      sessions: 4,
      weeklyPoints: 120,
      totalChallengePoints: 90,
      consistency: 43,
      activePct: 60,
      pointsPct: 48,
      streakPct: 40,
      weeklyScore: 49,
      status: 'RESTART',
      bestType: 'RUN · 2 sessions',
    });
    expect(report.nextAction).toBe('Log 2 more active days to hit your weekly goal.');
  });

  it('celebrates completed goals with a share prompt', () => {
    const report = buildWeeklyReport({
      weeklyRecap: { activeDays: 7, sessions: 9, points: 400 },
      goals: { weeklyActiveDaysTarget: 5, weeklyPointsTarget: 250, streakTarget: 3 },
      currentStreak: 6,
    });

    expect(report.weeklyScore).toBe(100);
    expect(report.status).toBe('ON TRACK');
    expect(report.nextAction).toContain('Share your weekly recap');
  });

  it('scores 30-day Pro reports by scaling weekly goals to monthly pace', () => {
    const report = buildMonthlyReport({
      monthlyRecap: { activeDays: 12, sessions: 20, points: 750 },
      goals: { weeklyActiveDaysTarget: 5, weeklyPointsTarget: 250, streakTarget: 30 },
      currentStreak: 15,
      totalChallengePoints: 300,
      bestType: 'YOGA · 8 sessions',
    });

    expect(report).toMatchObject({
      activeDays: 12,
      sessions: 20,
      monthlyPoints: 750,
      totalChallengePoints: 300,
      consistency: 40,
      activePct: 60,
      pointsPct: 75,
      streakPct: 50,
      monthlyScore: 62,
      status: 'BUILDING',
      bestType: 'YOGA · 8 sessions',
    });
    expect(report.nextAction).toBe('Log 8 more active days to close the month strong.');
  });
});
