import { httpsCallable } from "firebase/functions";
import {
  collection,
  getDocs,
  limit as limitQuery,
  orderBy,
  query,
} from "firebase/firestore";
import { auth, db, workoutsFunctions } from "../../firebase";
import {
  mapWorkoutInsightAggregateDocument,
  mapWorkoutProgressionSuggestionDocument,
} from "../domain/workoutInsightModels";

export class FirestoreWorkoutInsightRepository {
  constructor({
    firebaseAuth = auth,
    firestoreDb = db,
    syncAggregateCallable = httpsCallable(workoutsFunctions, "syncWorkoutInsightAggregates"),
    syncProgressionCallable = httpsCallable(workoutsFunctions, "syncWorkoutProgressionSuggestions"),
  } = {}) {
    this.auth = firebaseAuth;
    this.db = firestoreDb;
    this.syncAggregateCallable = syncAggregateCallable;
    this.syncProgressionCallable = syncProgressionCallable;
  }

  requireUid() {
    const uid = this.auth.currentUser?.uid;
    if (!uid) throw new Error("Sign in to view workout insights.");
    return uid;
  }

  async listProgressionSuggestions() {
    const uid = this.requireUid();
    const snapshot = await getDocs(collection(this.db, "users", uid, "workoutProgressionSuggestions"));
    return snapshot.docs
      .map(document => mapWorkoutProgressionSuggestionDocument(document.id, document.data()))
      .sort((left, right) => {
        if (left.status !== right.status) return left.status === "ready" ? -1 : 1;
        return String(right.updatedAt || "").localeCompare(String(left.updatedAt || ""));
      });
  }

  async syncProgressionSuggestion({ exerciseId, level = "beginner" } = {}) {
    const uid = this.requireUid();
    const cleanExerciseId = String(exerciseId || "").trim();
    if (!cleanExerciseId) throw new Error("Pick an exercise before refreshing the suggestion.");
    await this.syncProgressionCallable({ exerciseId: cleanExerciseId, level });
    const nextSuggestions = await this.listProgressionSuggestions(uid);
    return nextSuggestions.find(suggestion => suggestion.exerciseId === cleanExerciseId) || null;
  }

  async listInsightAggregates({ limit = 4 } = {}) {
    const uid = this.requireUid();
    const snapshot = await getDocs(query(
      collection(this.db, "users", uid, "workoutInsightAggregates"),
      orderBy("periodKey", "desc"),
      limitQuery(limit),
    ));
    return snapshot.docs
      .map(document => mapWorkoutInsightAggregateDocument(document.id, document.data()))
      .sort((left, right) => String(right.periodKey).localeCompare(String(left.periodKey)));
  }

  async syncInsightAggregate({ weekKey } = {}) {
    this.requireUid();
    await this.syncAggregateCallable(weekKey ? { weekKey } : {});
    const nextAggregates = await this.listInsightAggregates({ limit: 4 });
    return nextAggregates[0] || null;
  }
}

export function createDefaultWorkoutInsightRepository() {
  return new FirestoreWorkoutInsightRepository();
}
