import { buildLongHistoryReport } from '../profile/profileReportData';

function dayKey(offset) {
  const date = new Date();
  date.setDate(date.getDate() - offset);
  return date.toISOString().split('T')[0];
}

describe('profile report data', () => {
  it('builds 90-day Pro history insight from existing activity history only', () => {
    const history = {
      [dayKey(0)]: {
        activities: [
          { activityId: 'run', points: 40 },
          { activityId: 'walk', points: 15 },
        ],
        totalPoints: 55,
      },
      [dayKey(10)]: {
        activities: [{ activityId: 'run', points: 35 }],
        totalPoints: 35,
      },
      [dayKey(89)]: {
        activities: [{ activityId: 'yoga', points: 20 }],
        totalPoints: 20,
      },
      [dayKey(90)]: {
        activities: [{ activityId: 'cycle', points: 50 }],
        totalPoints: 50,
      },
    };

    expect(buildLongHistoryReport({ history })).toMatchObject({
      activeDays: 3,
      activeRate: 3,
      sessions: 4,
      points: 110,
      status: 'RESET WINDOW',
      topType: 'RUN',
      topTypeSessions: 2,
    });
  });
});
