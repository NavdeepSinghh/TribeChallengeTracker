/**
 * @jest-environment node
 */

const fs = require('fs');
const path = require('path');
const { ReadableStream, TransformStream, WritableStream } = require('stream/web');
const {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} = require('@firebase/rules-unit-testing');

Object.assign(global, { ReadableStream, TransformStream, WritableStream });

const { fetch, Headers, Request, Response } = require('undici');

Object.assign(global, { fetch, Headers, Request, Response });

const repoRoot = path.resolve(__dirname, '../..');
const projectId = `tribelog-workout-insights-${Date.now()}`;

let testEnv;

jest.setTimeout(30000);

function authedDb(uid) {
  return testEnv.authenticatedContext(uid).firestore();
}

function guestDb() {
  return testEnv.unauthenticatedContext().firestore();
}

async function seedDocs(docs) {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await Promise.all(Object.entries(docs).map(([docPath, data]) => db.doc(docPath).set(data)));
  });
}

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId,
    firestore: {
      rules: fs.readFileSync(path.join(repoRoot, 'firestore.rules'), 'utf8'),
    },
  });
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

afterAll(async () => {
  await testEnv?.cleanup();
});

describe('Phase 3 workout insight Firestore rules', () => {
  it('keeps weekly muscle volume aggregates owner-readable only', async () => {
    await seedDocs({
      'users/owner/workoutInsightAggregates/weekly_2026-W27': {
        id: 'weekly_2026-W27',
        uid: 'owner',
        periodType: 'week',
        periodKey: '2026-W27',
        sessionCount: 3,
        muscles: {
          chest: {
            muscle: 'chest',
            volumeKg: 1200,
            setCount: 6,
            exerciseIds: ['bench_press'],
          },
        },
      },
    });

    await assertSucceeds(authedDb('owner').doc('users/owner/workoutInsightAggregates/weekly_2026-W27').get());
    await assertFails(authedDb('viewer').doc('users/owner/workoutInsightAggregates/weekly_2026-W27').get());
    await assertFails(guestDb().doc('users/owner/workoutInsightAggregates/weekly_2026-W27').get());
  });

  it('keeps progressive overload suggestions owner-readable only', async () => {
    await seedDocs({
      'users/owner/workoutProgressionSuggestions/bench_press': {
        uid: 'owner',
        exerciseId: 'bench_press',
        status: 'ready',
        observedSessions: 4,
        observedTrainingWeeks: 2,
        suggestion: {
          type: 'weight',
          targetWeightKg: 65,
          targetReps: 10,
        },
      },
    });

    await assertSucceeds(authedDb('owner').doc('users/owner/workoutProgressionSuggestions/bench_press').get());
    await assertFails(authedDb('viewer').doc('users/owner/workoutProgressionSuggestions/bench_press').get());
    await assertFails(guestDb().doc('users/owner/workoutProgressionSuggestions/bench_press').get());
  });

  it('denies normal clients direct writes to insight aggregates and suggestions', async () => {
    await assertFails(authedDb('owner').doc('users/owner/workoutInsightAggregates/weekly_2026-W27').set({
      id: 'weekly_2026-W27',
      uid: 'owner',
      periodKey: '2026-W27',
      sessionCount: 3,
    }));

    await assertFails(authedDb('owner').doc('users/owner/workoutProgressionSuggestions/bench_press').set({
      uid: 'owner',
      exerciseId: 'bench_press',
      status: 'ready',
    }));
  });

  it('allows admin writes for support, backfill, and Cloud Function-equivalent maintenance', async () => {
    await seedDocs({
      'admins/admin': {
        uid: 'admin',
      },
    });

    await assertSucceeds(authedDb('admin').doc('users/owner/workoutInsightAggregates/weekly_2026-W27').set({
      id: 'weekly_2026-W27',
      uid: 'owner',
      periodKey: '2026-W27',
      sessionCount: 3,
    }));

    await assertSucceeds(authedDb('admin').doc('users/owner/workoutProgressionSuggestions/bench_press').set({
      uid: 'owner',
      exerciseId: 'bench_press',
      status: 'ready',
      observedSessions: 4,
      observedTrainingWeeks: 2,
    }));
  });
});
