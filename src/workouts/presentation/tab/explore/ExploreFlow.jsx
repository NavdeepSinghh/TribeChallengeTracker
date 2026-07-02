import PublicWorkoutDiscoverySection from "../../PublicWorkoutDiscoverySection";
import WorkoutsLibrarySection from "../../WorkoutsLibrarySection";
import ExploreModeTabs from "./ExploreModeTabs";

export default function ExploreFlow({
  catalogUseCases,
  mode,
  onModeChange,
  onQuickLog,
  socialUseCases,
  theme,
}) {
  return (
    <>
      <ExploreModeTabs mode={mode} onChange={onModeChange} theme={theme} />
      {mode === "exercises" ? (
        <WorkoutsLibrarySection
          onQuickLog={onQuickLog}
          useCases={catalogUseCases}
        />
      ) : (
        <PublicWorkoutDiscoverySection useCases={socialUseCases} />
      )}
    </>
  );
}
