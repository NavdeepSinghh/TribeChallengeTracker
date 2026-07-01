import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  TRAINING_PLAN_ALL_FILTER,
  buildTrainingPlanFilterOptions,
  filterTrainingPlans,
} from "../domain/trainingPlanModels";

const DEFAULT_FILTERS = {
  search: "",
  goal: TRAINING_PLAN_ALL_FILTER,
  level: TRAINING_PLAN_ALL_FILTER,
};

const DEFAULT_FILTER_OPTIONS = {
  goals: [],
  levels: [],
};

export function useTrainingPlansViewModel({ useCases } = {}) {
  const useCasesRef = useRef(useCases);
  const hasLoadedOptionsRef = useRef(false);
  const [status, setStatus] = useState("idle");
  const [plans, setPlans] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [filterOptions, setFilterOptions] = useState(DEFAULT_FILTER_OPTIONS);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const load = useCallback(async ({ refreshOptions = false } = {}) => {
    if (!useCasesRef.current?.loadTrainingPlans || !useCasesRef.current?.getFilterOptions) {
      setStatus("failed");
      setErrorMessage("Training plan dependencies are not configured.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");
    const shouldLoadOptions = refreshOptions || !hasLoadedOptionsRef.current;

    try {
      const [nextPlans, nextOptions] = await Promise.all([
        useCasesRef.current.loadTrainingPlans.execute(filters),
        shouldLoadOptions
          ? useCasesRef.current.getFilterOptions.execute()
          : Promise.resolve(null),
      ]);
      setPlans(nextPlans);
      if (nextOptions) {
        hasLoadedOptionsRef.current = true;
        setFilterOptions(nextOptions);
      }
      setSelectedPlanId(currentId => (
        currentId && nextPlans.some(plan => plan.id === currentId)
          ? currentId
          : nextPlans[0]?.id || ""
      ));
      setStatus(nextPlans.length > 0 ? "loaded" : "empty");
    } catch (error) {
      setStatus("failed");
      setErrorMessage(error?.message || "Training plans could not be loaded.");
    }
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  const visiblePlans = useMemo(() => filterTrainingPlans(plans, filters), [filters, plans]);
  const isEmpty = status === "empty" || (status === "loaded" && visiblePlans.length === 0);
  const selectedPlan = useMemo(() => (
    visiblePlans.find(plan => plan.id === selectedPlanId)
    || visiblePlans[0]
    || null
  ), [selectedPlanId, visiblePlans]);

  const mergedFilterOptions = useMemo(() => {
    const derived = buildTrainingPlanFilterOptions(plans);
    return {
      goals: filterOptions.goals.length ? filterOptions.goals : derived.goals,
      levels: filterOptions.levels.length ? filterOptions.levels : derived.levels,
    };
  }, [filterOptions, plans]);

  const updateFilter = useCallback((key, value) => {
    setFilters(current => ({
      ...current,
      [key]: value,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const refresh = useCallback(() => load({ refreshOptions: true }), [load]);

  return {
    errorMessage,
    filterOptions: mergedFilterOptions,
    filters,
    isEmpty,
    refresh,
    resetFilters,
    selectedPlan,
    selectedPlanId,
    setSelectedPlanId,
    status,
    updateFilter,
    visiblePlans,
  };
}

export { TRAINING_PLAN_ALL_FILTER };
