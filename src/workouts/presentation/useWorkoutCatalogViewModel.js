import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ALL_FILTER_VALUE,
  buildExerciseFilterOptions,
  filterExercises,
} from "../domain/workoutCatalogModels";

const DEFAULT_FILTERS = {
  search: "",
  muscle: ALL_FILTER_VALUE,
  equipment: ALL_FILTER_VALUE,
  level: ALL_FILTER_VALUE,
};

const INITIAL_OPTIONS = {
  muscles: [],
  equipment: [],
  levels: [],
};

export function useWorkoutCatalogViewModel({ useCases } = {}) {
  const useCasesRef = useRef(useCases);
  const hasLoadedFilterOptionsRef = useRef(false);
  const [status, setStatus] = useState("idle");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [exercises, setExercises] = useState([]);
  const [filterOptions, setFilterOptions] = useState(INITIAL_OPTIONS);
  const [selectedExerciseId, setSelectedExerciseId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const backendFilters = useMemo(() => ({
    muscle: filters.muscle,
    equipment: filters.equipment,
    level: filters.level,
  }), [filters.equipment, filters.level, filters.muscle]);

  const load = useCallback(async ({ refreshOptions = false } = {}) => {
    if (!useCasesRef.current?.loadCatalog || !useCasesRef.current?.getFilterOptions) {
      setStatus("failed");
      setErrorMessage("Workout catalog dependencies are not configured.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");
    const shouldLoadFilterOptions = refreshOptions || !hasLoadedFilterOptionsRef.current;

    try {
      const [nextExercises, nextOptions] = await Promise.all([
        useCasesRef.current.loadCatalog.execute(backendFilters),
        shouldLoadFilterOptions
          ? useCasesRef.current.getFilterOptions.execute()
          : Promise.resolve(null),
      ]);

      setExercises(nextExercises);
      if (nextOptions) {
        hasLoadedFilterOptionsRef.current = true;
        setFilterOptions(nextOptions);
      }
      setSelectedExerciseId(currentId => (
        currentId && nextExercises.some(exercise => exercise.id === currentId)
          ? currentId
          : nextExercises[0]?.id || ""
      ));
      setStatus(nextExercises.length > 0 ? "loaded" : "empty");
    } catch (error) {
      setStatus("failed");
      setErrorMessage(error?.message || "Workout catalog could not be loaded.");
    }
  }, [backendFilters]);

  useEffect(() => {
    load();
  }, [load]);

  const visibleExercises = useMemo(() => filterExercises(exercises, filters), [exercises, filters]);
  const isEmpty = status === "empty" || (status === "loaded" && visibleExercises.length === 0);
  const selectedExercise = useMemo(() => (
    visibleExercises.find(exercise => exercise.id === selectedExerciseId)
    || visibleExercises[0]
    || null
  ), [selectedExerciseId, visibleExercises]);

  const mergedFilterOptions = useMemo(() => {
    const derivedOptions = buildExerciseFilterOptions(exercises);
    return {
      muscles: filterOptions.muscles.length ? filterOptions.muscles : derivedOptions.muscles,
      equipment: filterOptions.equipment.length ? filterOptions.equipment : derivedOptions.equipment,
      levels: filterOptions.levels.length ? filterOptions.levels : derivedOptions.levels,
    };
  }, [exercises, filterOptions]);

  const updateFilter = useCallback((key, value) => {
    setFilters(current => ({
      ...current,
      [key]: value,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const refresh = useCallback(() => {
    load({ refreshOptions: true });
  }, [load]);

  return {
    errorMessage,
    filterOptions: mergedFilterOptions,
    filters,
    isEmpty,
    refresh,
    resetFilters,
    selectedExercise,
    selectedExerciseId,
    setSelectedExerciseId,
    status,
    updateFilter,
    visibleExercises,
  };
}

export { ALL_FILTER_VALUE };
