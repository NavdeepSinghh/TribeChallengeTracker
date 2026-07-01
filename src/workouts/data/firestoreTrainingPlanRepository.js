import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { mapTrainingPlanDocument } from "../domain/trainingPlanModels";

export class FirestoreTrainingPlanRepository {
  constructor(firestoreDb = db) {
    this.db = firestoreDb;
  }

  async listPublishedTrainingPlans() {
    const snapshot = await getDocs(query(
      collection(this.db, "trainingPlans"),
      where("status", "==", "published"),
      where("visibility", "==", "public")
    ));
    return snapshot.docs
      .map(document => mapTrainingPlanDocument(document.id, document.data()))
      .sort((left, right) => {
        const leftUpdated = left.updatedAt || "";
        const rightUpdated = right.updatedAt || "";
        if (leftUpdated !== rightUpdated) return rightUpdated.localeCompare(leftUpdated);
        return left.name.localeCompare(right.name);
      });
  }
}

export function createDefaultTrainingPlanRepository() {
  return new FirestoreTrainingPlanRepository();
}
