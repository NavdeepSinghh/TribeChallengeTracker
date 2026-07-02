const {
  deterministicWorkoutIds,
  finishWorkoutSession,
} = require("../../functions/workoutSessionCallableHandlers");
const planSeed = require("../../scripts/workout-training-plans-seed.json");

class FakeDocumentRef {
  constructor(db, path) {
    this.db = db;
    this.path = path;
    this.id = path.split("/").pop();
  }

  collection(name) {
    return new FakeCollectionRef(this.db, `${this.path}/${name}`);
  }
}

class FakeCollectionRef {
  constructor(db, path) {
    this.db = db;
    this.path = path;
  }

  doc(id) {
    return new FakeDocumentRef(this.db, `${this.path}/${id}`);
  }
}

class FakeTransaction {
  constructor(db) {
    this.db = db;
  }

  async get(ref) {
    const value = this.db.store.get(ref.path);
    return {
      exists: value !== undefined,
      id: ref.id,
      data: () => value,
    };
  }

  set(ref, data, options = {}) {
    const existing = this.db.store.get(ref.path) || {};
    this.db.store.set(ref.path, options.merge ? { ...existing, ...data } : { ...data });
  }

  delete(ref) {
    this.db.store.delete(ref.path);
  }
}

class FakeFirestore {
  constructor(initial = {}) {
    this.store = new Map(Object.entries(initial));
  }

  collection(name) {
    return new FakeCollectionRef(this, name);
  }

  async runTransaction(callback) {
    return callback(new FakeTransaction(this));
  }
}

function fakeAdmin(db) {
  function firestore() {
    return db;
  }
  firestore.FieldValue = {
    serverTimestamp: () => "SERVER_TIMESTAMP",
    increment: (value) => ({ __increment: value }),
  };
  return { firestore };
}

function plannedFinishPayload({ planId, sessionId = "planned-session-1" }) {
  return {
    sessionId,
    shareVisibility: "private",
    finalSession: {
      name: "Plan Day 1",
      type: "gym",
      dateStr: "2026-07-02",
      durationSeconds: 1800,
      points: 55,
      trainingPlanId: planId,
      trainingPlanDayKey: "w1-d1",
      trainingPlanWeekIndex: 1,
      trainingPlanDayIndex: 1,
      exercises: [
        {
          exerciseId: "goblet_squat",
          name: "Goblet Squat",
          primaryMuscles: ["quads", "glutes"],
          sets: [
            { reps: 10, weightKg: 24, completed: true },
            { reps: 8, weightKg: 28, completed: true },
          ],
        },
      ],
    },
  };
}

describe("Phase 2 planned workout finish smoke contract", () => {
  it("completes one planned day through the trusted finish path without duplicate mirrors on retry", async () => {
    const uid = "phase2_user";
    const plan = planSeed[0];
    const sessionId = "planned-session-1";
    const ids = deterministicWorkoutIds(uid, sessionId);
    const db = new FakeFirestore({
      [`users/${uid}`]: {
        displayName: "Navdeep",
        avatarEmoji: "🔥",
        avatarColor: "#FF6B35",
        currentStreak: 3,
      },
      [`trainingPlans/${plan.id}`]: {
        ...plan,
      },
      [`users/${uid}/trainingPlanEnrollments/${plan.id}`]: {
        uid,
        planId: plan.id,
        planVersion: plan.version,
        status: "active",
        startDate: "2026-07-01",
        completedDayKeys: [],
        skippedDayKeys: ["w1-d1"],
      },
    });
    const admin = fakeAdmin(db);
    const request = {
      auth: { uid },
      data: plannedFinishPayload({ planId: plan.id, sessionId }),
    };

    const first = await finishWorkoutSession({ admin, request });
    const second = await finishWorkoutSession({ admin, request });

    expect(first.trainingPlanProgress).toMatchObject({
      planId: plan.id,
      completedDayKey: "w1-d1",
      status: "active",
      adherencePct: 100,
      awardedBadgeIds: ["plan_first_workout"],
    });
    expect(second).toMatchObject({
      activityLogId: ids.activityLogId,
      feedId: ids.feedId,
      status: "completed",
    });

    const enrollment = db.store.get(`users/${uid}/trainingPlanEnrollments/${plan.id}`);
    expect(enrollment.completedDayKeys).toEqual(["w1-d1"]);
    expect(enrollment.skippedDayKeys).toEqual([]);

    const adherence = db.store.get(`users/${uid}/trainingPlanAdherence/${plan.id}`);
    expect(adherence).toMatchObject({
      planId: plan.id,
      completedCount: 1,
      dueCount: 1,
      missedCount: 0,
      adherencePct: 100,
    });

    const badge = db.store.get(`users/${uid}/trainingPlanBadges/${plan.id}_plan_first_workout`);
    expect(badge).toMatchObject({
      badgeId: "plan_first_workout",
      uid,
      planId: plan.id,
      category: "training_plan",
    });

    const activityLog = db.store.get(`users/${uid}/activityLog/2026-07-02`);
    expect(activityLog.activities.filter((activity) => activity.id === ids.activityLogId)).toHaveLength(1);
    expect(activityLog.totalPoints).toBe(55);

    const feed = db.store.get(`tribeFeed/${ids.feedId}`);
    expect(feed).toMatchObject({
      uid,
      activityLogId: ids.activityLogId,
      workoutSessionId: sessionId,
      points: 55,
    });

    const publicWorkout = db.store.get(`publicWorkouts/${ids.publicWorkoutId}`);
    expect(publicWorkout).toBeUndefined();
  });
});
