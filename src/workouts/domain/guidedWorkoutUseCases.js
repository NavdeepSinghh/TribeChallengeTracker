export class LoadActiveGuidedWorkoutUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  execute() {
    return this.repository.loadActiveSession();
  }
}

export class SaveActiveGuidedWorkoutUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  execute(session) {
    return this.repository.saveActiveSession(session);
  }
}

export class ClearActiveGuidedWorkoutUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  execute() {
    return this.repository.clearActiveSession();
  }
}

export class FinishGuidedWorkoutUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  execute(payload) {
    return this.repository.finishSession(payload);
  }
}

export class SavePendingGuidedWorkoutFinishUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  execute(payload) {
    return this.repository.savePendingFinish(payload);
  }
}

export class LoadPendingGuidedWorkoutFinishUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  execute() {
    return this.repository.loadPendingFinish();
  }
}

export class ClearPendingGuidedWorkoutFinishUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  execute() {
    return this.repository.clearPendingFinish();
  }
}
