export class LoadPublicWorkoutsUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  execute({ limit = 12 } = {}) {
    return this.repository.fetchPublicWorkouts({ limit });
  }
}

export class CopyPublicWorkoutUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  execute(publicWorkoutId) {
    return this.repository.copyPublicWorkout(publicWorkoutId);
  }
}

export class ToggleWorkoutCreatorFollowUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  execute(ownerProfile, currentStatus) {
    if (currentStatus === "following") {
      return this.repository.unfollowCreator(ownerProfile.ownerUid || ownerProfile.uid || ownerProfile.id);
    }
    return this.repository.followCreator(ownerProfile);
  }
}
