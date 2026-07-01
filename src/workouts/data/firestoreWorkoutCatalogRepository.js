import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import {
  buildExerciseFilterOptions,
  mapExerciseDocument,
} from "../domain/workoutCatalogModels";

export class FirestoreWorkoutCatalogRepository {
  constructor(firestoreDb = db) {
    this.db = firestoreDb;
  }

  async listPublishedExercises(backendFilter = { type: "all" }) {
    const snapshot = await getDocs(query(
      collection(this.db, "exerciseCatalog"),
      where("status", "==", "published")
    ));
    return snapshot.docs
      .map(document => mapExerciseDocument(document.id, document.data()))
      .filter(exercise => {
        if (backendFilter.type === "muscle") {
          return exercise.allMuscles.includes(backendFilter.value);
        }
        if (backendFilter.type === "equipment") {
          return exercise.equipment.includes(backendFilter.value);
        }
        if (backendFilter.type === "level") {
          return exercise.level === backendFilter.value;
        }
        return true;
      })
      .sort((left, right) => left.name.localeCompare(right.name));
  }

  async listFilterOptions() {
    const exercises = await this.listPublishedExercises({ type: "all" });
    return buildExerciseFilterOptions(exercises);
  }
}

export function createDefaultWorkoutCatalogRepository() {
  return new FirestoreWorkoutCatalogRepository();
}
