import GuidedWorkoutSection from "../../GuidedWorkoutSection";

export default function StartWorkoutFlow({ catalogUseCases, guidedUseCases }) {
  return (
    <GuidedWorkoutSection
      catalogUseCases={catalogUseCases}
      guidedUseCases={guidedUseCases}
    />
  );
}
