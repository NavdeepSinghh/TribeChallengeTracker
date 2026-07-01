import {
  collection,
  getDocs,
  limit as limitQuery,
  orderBy,
  query,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import {
  mapExercisePrDocument,
  mapWorkoutSessionDocument,
} from "../domain/workoutHistoryModels";

export class FirestoreWorkoutHistoryRepository {
  constructor({ firestoreDb = db, firebaseAuth = auth } = {}) {
    this.db = firestoreDb;
    this.auth = firebaseAuth;
  }

  requireUid() {
    const uid = this.auth.currentUser?.uid;
    if (!uid) throw new Error("Sign in to view workout history.");
    return uid;
  }

  async listCompletedSessions({ limit = 12 } = {}) {
    const uid = this.requireUid();
    const snapshot = await getDocs(query(
      collection(this.db, "users", uid, "trainingSessions"),
      orderBy("dateStr", "desc"),
      limitQuery(limit),
    ));
    return snapshot.docs
      .map(document => mapWorkoutSessionDocument(document.id, document.data()))
      .filter(session => session.status === "completed")
      .sort((left, right) => String(right.dateStr).localeCompare(String(left.dateStr)));
  }

  async listPersonalRecords() {
    const uid = this.requireUid();
    const snapshot = await getDocs(collection(this.db, "users", uid, "exercisePRs"));
    return snapshot.docs
      .map(document => mapExercisePrDocument(document.id, document.data()))
      .sort((left, right) => right.bestEstimatedOneRepMaxKg - left.bestEstimatedOneRepMaxKg);
  }
}

export function createDefaultWorkoutHistoryRepository() {
  return new FirestoreWorkoutHistoryRepository();
}
