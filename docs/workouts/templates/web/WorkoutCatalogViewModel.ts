import { ListExercisesUseCase, Exercise, WorkoutLevel } from "./workoutDomain";

// Reference scaffold only. Use this pattern with Zustand, RxJS, or a small observable store.

export type WorkoutCatalogState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "loaded"; exercises: Exercise[] }
  | { status: "empty" }
  | { status: "failed"; message: string };

export class WorkoutCatalogViewModel {
  state: WorkoutCatalogState = { status: "idle" };
  searchText = "";
  selectedLevel?: WorkoutLevel;

  constructor(
    private readonly listExercises: ListExercisesUseCase,
    private readonly emit: (state: WorkoutCatalogState) => void
  ) {}

  async load(): Promise<void> {
    this.setState({ status: "loading" });
    try {
      const exercises = await this.listExercises.execute({
        searchText: this.searchText,
        level: this.selectedLevel,
      });
      this.setState(exercises.length ? { status: "loaded", exercises } : { status: "empty" });
    } catch {
      this.setState({ status: "failed", message: "Workouts could not load. Try again." });
    }
  }

  private setState(state: WorkoutCatalogState): void {
    this.state = state;
    this.emit(state);
  }
}

