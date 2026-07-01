import React, { useEffect, useMemo, useState } from "react";
import { WorkoutCatalogViewModel, WorkoutCatalogState } from "./WorkoutCatalogViewModel";
import { ListExercisesUseCase, WorkoutCatalogRepository } from "./workoutDomain";

// Reference scaffold only. Production code should inject the repository from app composition.

export function WorkoutCatalogView({ repository }: { repository: WorkoutCatalogRepository }) {
  const [state, setState] = useState<WorkoutCatalogState>({ status: "idle" });
  const viewModel = useMemo(
    () => new WorkoutCatalogViewModel(new ListExercisesUseCase(repository), setState),
    [repository]
  );

  useEffect(() => {
    viewModel.load();
  }, [viewModel]);

  if (state.status === "loading" || state.status === "idle") {
    return <section aria-busy="true">Loading workouts</section>;
  }

  if (state.status === "failed") {
    return (
      <section>
        <p>{state.message}</p>
        <button onClick={() => viewModel.load()}>Retry</button>
      </section>
    );
  }

  if (state.status === "empty") {
    return <section>No exercises yet</section>;
  }

  return (
    <section>
      <h1>Workouts</h1>
      {state.exercises.map(exercise => (
        <article key={exercise.id}>
          <h2>{exercise.name}</h2>
          <p>{exercise.primaryMuscles.join(" · ")}</p>
        </article>
      ))}
    </section>
  );
}

