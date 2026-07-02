import { useCallback, useEffect, useMemo, useState } from "react";

export function retryAfterSeconds(error) {
  const structured = Number(error?.details?.retryAfterSeconds);
  if (Number.isFinite(structured) && structured > 0) {
    return Math.ceil(structured);
  }
  const match = String(error?.message || "").match(/try again in\s+(\d+)\s+seconds?/i);
  return match ? Math.max(1, Number(match[1]) || 0) : 0;
}

export function useWorkoutInsightsViewModel({
  level = "beginner",
  sessions = [],
  useCases,
} = {}) {
  const [aggregate, setAggregate] = useState(null);
  const [aggregateCooldownSeconds, setAggregateCooldownSeconds] = useState(0);
  const [aggregateStatus, setAggregateStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionCooldownSeconds, setSuggestionCooldownSeconds] = useState(0);
  const [suggestionStatus, setSuggestionStatus] = useState("idle");

  const candidate = useMemo(
    () => useCases?.selectProgressionCandidate?.execute({ sessions, suggestions }) || null,
    [sessions, suggestions, useCases],
  );
  const activeSuggestion = useMemo(
    () => suggestions.find(suggestion => suggestion.exerciseId === candidate?.exerciseId) || suggestions[0] || null,
    [candidate, suggestions],
  );
  const progressionCopy = useMemo(
    () => useCases?.buildProgressionInsightCopy?.execute({ candidate, suggestion: activeSuggestion }) || {},
    [activeSuggestion, candidate, useCases],
  );
  const muscleVolumeInsight = useMemo(
    () => useCases?.buildMuscleVolumeInsight?.execute({ aggregate }) || null,
    [aggregate, useCases],
  );

  const loadInsights = useCallback(async () => {
    if (!useCases) return;
    setSuggestionStatus("loading");
    setAggregateStatus("loading");
    setAggregateCooldownSeconds(0);
    setErrorMessage("");
    setSuggestionCooldownSeconds(0);
    try {
      const [nextSuggestions, nextAggregates] = await Promise.all([
        useCases.loadProgressionSuggestions.execute(),
        useCases.loadAggregates.execute({ limit: 4 }),
      ]);
      setSuggestions(nextSuggestions);
      setAggregate(nextAggregates[0] || null);
      setSuggestionStatus(nextSuggestions.length ? "loaded" : "empty");
      setAggregateStatus(nextAggregates.length ? "loaded" : "empty");
    } catch (error) {
      setErrorMessage(error.message || "Workout insights could not load.");
      setSuggestionStatus("failed");
      setAggregateStatus("failed");
    }
  }, [useCases]);

  const refreshProgressionSuggestion = useCallback(async () => {
    if (!candidate?.exerciseId || !useCases || suggestionCooldownSeconds > 0) return null;
    setSuggestionStatus("syncing");
    setErrorMessage("");
    try {
      const nextSuggestion = await useCases.syncProgressionSuggestion.execute({
        exerciseId: candidate.exerciseId,
        level,
      });
      const nextSuggestions = await useCases.loadProgressionSuggestions.execute();
      setSuggestions(nextSuggestions);
      setSuggestionStatus(nextSuggestion ? "loaded" : "empty");
      return nextSuggestion;
    } catch (error) {
      const retrySeconds = retryAfterSeconds(error);
      setSuggestionCooldownSeconds(retrySeconds);
      setErrorMessage(retrySeconds
        ? `Suggestion refresh is cooling down. Try again in ${retrySeconds} seconds.`
        : (error.message || "Suggestion refresh is cooling down. Try again shortly."));
      setSuggestionStatus("failed");
      return null;
    }
  }, [candidate, level, suggestionCooldownSeconds, useCases]);

  const refreshMuscleVolume = useCallback(async () => {
    if (!useCases || aggregateCooldownSeconds > 0) return null;
    setAggregateStatus("syncing");
    setAggregateCooldownSeconds(0);
    setErrorMessage("");
    try {
      const nextAggregate = await useCases.syncAggregate.execute();
      setAggregate(nextAggregate);
      setAggregateStatus(nextAggregate ? "loaded" : "empty");
      return nextAggregate;
    } catch (error) {
      const retrySeconds = retryAfterSeconds(error);
      setAggregateCooldownSeconds(retrySeconds);
      setErrorMessage(retrySeconds
        ? `Weekly read is cooling down. Try again in ${retrySeconds} seconds.`
        : (error.message || "Muscle volume refresh is cooling down. Try again shortly."));
      setAggregateStatus("failed");
      return null;
    }
  }, [aggregateCooldownSeconds, useCases]);

  useEffect(() => {
    if (aggregateCooldownSeconds <= 0) return undefined;
    const timer = window.setTimeout(() => {
      setAggregateCooldownSeconds(value => Math.max(0, value - 1));
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [aggregateCooldownSeconds]);

  useEffect(() => {
    if (suggestionCooldownSeconds <= 0) return undefined;
    const timer = window.setTimeout(() => {
      setSuggestionCooldownSeconds(value => Math.max(0, value - 1));
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [suggestionCooldownSeconds]);

  useEffect(() => {
    loadInsights();
  }, [loadInsights]);

  return {
    activeSuggestion,
    aggregate,
    aggregateCooldownSeconds,
    aggregateStatus,
    candidate,
    errorMessage,
    loadInsights,
    muscleVolumeInsight,
    progressionCopy,
    refreshMuscleVolume,
    refreshProgressionSuggestion,
    suggestionCooldownSeconds,
    suggestionStatus,
    suggestions,
  };
}
