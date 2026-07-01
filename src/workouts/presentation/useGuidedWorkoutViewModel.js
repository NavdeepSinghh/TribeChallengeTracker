import { useCallback, useEffect, useMemo, useState } from "react";
import {
  buildFinalGuidedWorkoutPayload,
  completeCurrentSet,
  createGuidedWorkoutSession,
  guidedWorkoutSummary,
  isWorkoutSessionComplete,
  tickRestTimer,
  updateGuidedSet,
} from "../domain/guidedWorkoutModels";

export function useGuidedWorkoutViewModel({ catalogUseCases, guidedUseCases } = {}) {
  const [status, setStatus] = useState("loading");
  const [catalog, setCatalog] = useState([]);
  const [selectedExerciseIds, setSelectedExerciseIds] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [finishResult, setFinishResult] = useState(null);
  const [pendingFinish, setPendingFinish] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const selectedExercises = useMemo(
    () => catalog.filter(exercise => selectedExerciseIds.includes(exercise.id)),
    [catalog, selectedExerciseIds],
  );
  const currentExercise = activeSession?.exercises?.[activeSession.activeExerciseIndex || 0] || null;
  const currentSet = currentExercise?.sets?.[activeSession.activeSetIndex || 0] || null;
  const summary = useMemo(() => guidedWorkoutSummary(activeSession), [activeSession]);
  const canStart = selectedExerciseIds.length > 0;
  const canFinish = activeSession ? isWorkoutSessionComplete(activeSession) : false;

  const persistSession = useCallback((session) => {
    setActiveSession(session);
    guidedUseCases?.saveActiveSession?.execute(session);
  }, [guidedUseCases]);

  const load = useCallback(async () => {
    setStatus("loading");
    setErrorMessage("");
    try {
      const [exercises, savedSession, savedPendingFinish] = await Promise.all([
        catalogUseCases.loadCatalog.execute({}),
        guidedUseCases.loadActiveSession.execute(),
        guidedUseCases.loadPendingFinish.execute(),
      ]);
      setCatalog(exercises);
      setActiveSession(savedSession);
      setPendingFinish(savedPendingFinish);
      setStatus(savedSession ? "active" : "selecting");
    } catch (error) {
      setErrorMessage(error.message || "Guided workout could not load.");
      setStatus("failed");
    }
  }, [catalogUseCases, guidedUseCases]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!activeSession?.restRemainingSeconds) return undefined;
    const timer = window.setInterval(() => {
      setActiveSession(current => {
        if (!current?.restRemainingSeconds) return current;
        const next = tickRestTimer(current);
        guidedUseCases?.saveActiveSession?.execute(next);
        return next;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [activeSession?.restRemainingSeconds, guidedUseCases]);

  const toggleExercise = useCallback((exerciseId) => {
    setSelectedExerciseIds(current => (
      current.includes(exerciseId)
        ? current.filter(id => id !== exerciseId)
        : [...current, exerciseId].slice(0, 6)
    ));
  }, []);

  const startWorkout = useCallback(() => {
    const session = createGuidedWorkoutSession({
      exercises: selectedExercises,
      name: selectedExercises.length === 1
        ? `${selectedExercises[0].name} session`
        : `${selectedExercises.length} exercise workout`,
    });
    persistSession(session);
    setStatus("active");
    setFinishResult(null);
  }, [persistSession, selectedExercises]);

  const discardWorkout = useCallback(() => {
    setActiveSession(null);
    setFinishResult(null);
    guidedUseCases.clearActiveSession.execute();
    setStatus("selecting");
  }, [guidedUseCases]);

  const updateCurrentSet = useCallback((patch) => {
    setActiveSession(current => {
      if (!current) return current;
      const next = updateGuidedSet(
        current,
        current.activeExerciseIndex || 0,
        current.activeSetIndex || 0,
        patch,
      );
      guidedUseCases.saveActiveSession.execute(next);
      return next;
    });
  }, [guidedUseCases]);

  const completeSet = useCallback(() => {
    setActiveSession(current => {
      if (!current) return current;
      const next = completeCurrentSet(current);
      guidedUseCases.saveActiveSession.execute(next);
      return next;
    });
  }, [guidedUseCases]);

  const finishWorkout = useCallback(async ({ shareVisibility = "private" } = {}) => {
    if (!activeSession) return null;
    const payload = buildFinalGuidedWorkoutPayload(activeSession, { shareVisibility });
    setStatus("saving");
    setErrorMessage("");
    try {
      const result = await guidedUseCases.finishSession.execute(payload);
      guidedUseCases.clearActiveSession.execute();
      guidedUseCases.clearPendingFinish.execute();
      setActiveSession(null);
      setPendingFinish(null);
      setFinishResult({ ...result, summary: guidedWorkoutSummary(activeSession) });
      setStatus("finished");
      return result;
    } catch (error) {
      guidedUseCases.savePendingFinish.execute(payload);
      setPendingFinish(payload);
      setErrorMessage(error.message || "Workout saved locally. It will need a retry when network is available.");
      setStatus("pending_sync");
      return null;
    }
  }, [activeSession, guidedUseCases]);

  const retryPendingFinish = useCallback(async () => {
    const payload = pendingFinish || guidedUseCases.loadPendingFinish.execute();
    if (!payload) return null;
    setStatus("saving");
    try {
      const result = await guidedUseCases.finishSession.execute(payload);
      guidedUseCases.clearPendingFinish.execute();
      guidedUseCases.clearActiveSession.execute();
      setPendingFinish(null);
      setActiveSession(null);
      setFinishResult({ ...result, summary: guidedWorkoutSummary(payload.finalSession) });
      setStatus("finished");
      return result;
    } catch (error) {
      setErrorMessage(error.message || "Retry failed.");
      setStatus("pending_sync");
      return null;
    }
  }, [guidedUseCases, pendingFinish]);

  return {
    activeSession,
    canFinish,
    canStart,
    catalog,
    completeSet,
    currentExercise,
    currentSet,
    discardWorkout,
    errorMessage,
    finishResult,
    finishWorkout,
    load,
    pendingFinish,
    retryPendingFinish,
    selectedExerciseIds,
    selectedExercises,
    startWorkout,
    status,
    summary,
    toggleExercise,
    updateCurrentSet,
  };
}
