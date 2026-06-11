import { buildHealthSyncInsight, buildLongHistoryReport } from '../profile/profileReportData';

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

  it('builds Pro Health Sync Insight from already-imported app logs only', () => {
    const history = {
      [dayKey(0)]: {
        activities: [
          { id: 'health-connect-workout-1', activityId: 'run', points: 40, note: 'Morning run synced from Health Connect' },
          { id: 'manual-1', activityId: 'yoga', points: 20, note: 'Manual mobility' },
        ],
      },
      [dayKey(12)]: {
        activities: [{ id: 'health-abc', activityId: 'walk', points: 10, note: 'Synced from Apple Watch via Fitness' }],
      },
      [dayKey(30)]: {
        activities: [{ id: 'health-old', activityId: 'cycle', points: 50, note: 'Synced from Health Connect' }],
      },
    };

    expect(buildHealthSyncInsight({ history })).toMatchObject({
      syncedSessions: 2,
      manualSessions: 1,
      syncRate: 67,
      syncedPoints: 50,
      status: 'SYNC BASE',
    });
  });
});
