import { auth } from "../firebase";
import { FirestoreWorkoutSocialRepository } from "./data/firestoreWorkoutSocialRepository";
import {
  CopyPublicWorkoutUseCase,
  LoadPublicWorkoutsUseCase,
  ToggleWorkoutCreatorFollowUseCase,
} from "./domain/workoutSocialUseCases";

export function createWorkoutSocialUseCases() {
  const repository = new FirestoreWorkoutSocialRepository({ auth });
  return {
    loadPublicWorkouts: new LoadPublicWorkoutsUseCase(repository),
    copyPublicWorkout: new CopyPublicWorkoutUseCase(repository),
    toggleCreatorFollow: new ToggleWorkoutCreatorFollowUseCase(repository),
  };
}
