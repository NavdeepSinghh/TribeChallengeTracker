import { useCallback, useEffect, useMemo, useState } from "react";

const initialState = {
  status: "idle",
  workouts: [],
  errorMessage: "",
  copyingId: null,
  copiedTemplateIds: {},
  followUpdatingUid: null,
};

export function useWorkoutSocialViewModel({ useCases }) {
  const [state, setState] = useState(initialState);

  const load = useCallback(async () => {
    setState(prev => ({ ...prev, status: "loading", errorMessage: "" }));
    try {
      const workouts = await useCases.loadPublicWorkouts.execute({ limit: 12 });
      setState(prev => ({
        ...prev,
        status: workouts.length ? "loaded" : "empty",
        workouts,
        errorMessage: "",
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        status: "failed",
        workouts: [],
        errorMessage: error?.message || "Public workouts could not load.",
      }));
    }
  }, [useCases]);

  const copyWorkout = useCallback(async (workout) => {
    setState(prev => ({ ...prev, copyingId: workout.publicWorkoutId, errorMessage: "" }));
    try {
      const result = await useCases.copyPublicWorkout.execute(workout.publicWorkoutId);
      setState(prev => ({
        ...prev,
        copyingId: null,
        copiedTemplateIds: {
          ...prev.copiedTemplateIds,
          [workout.publicWorkoutId]: result.templateId,
        },
        workouts: prev.workouts.map(item => (
          item.publicWorkoutId === workout.publicWorkoutId
            ? { ...item, copiedCount: item.copiedCount + (result.status === "copied" ? 1 : 0) }
            : item
        )),
      }));
      return result;
    } catch (error) {
      setState(prev => ({
        ...prev,
        copyingId: null,
        errorMessage: error?.message || "Workout could not be copied.",
      }));
      return null;
    }
  }, [useCases]);

  const toggleFollow = useCallback(async (workout) => {
    setState(prev => ({ ...prev, followUpdatingUid: workout.ownerUid, errorMessage: "" }));
    try {
      const status = await useCases.toggleCreatorFollow.execute(workout, workout.followStatus);
      setState(prev => ({
        ...prev,
        followUpdatingUid: null,
        workouts: prev.workouts.map(item => (
          item.ownerUid === workout.ownerUid ? { ...item, followStatus: status } : item
        )),
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        followUpdatingUid: null,
        errorMessage: error?.message || "Follow status could not update.",
      }));
    }
  }, [useCases]);

  useEffect(() => {
    load();
  }, [load]);

  return useMemo(() => ({
    ...state,
    load,
    copyWorkout,
    toggleFollow,
  }), [state, load, copyWorkout, toggleFollow]);
}
