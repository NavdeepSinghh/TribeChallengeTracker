import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  TRAINING_PLAN_ALL_FILTER,
  buildTrainingPlanFilterOptions,
  enrollmentForPlan,
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
  const [enrollments, setEnrollments] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [filterOptions, setFilterOptions] = useState(DEFAULT_FILTER_OPTIONS);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [enrollingPlanId, setEnrollingPlanId] = useState("");
  const [customizingPlanId, setCustomizingPlanId] = useState("");

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
      const [nextPlans, nextEnrollments, nextOptions] = await Promise.all([
        useCasesRef.current.loadTrainingPlans.execute(filters),
        useCasesRef.current.loadEnrollments
          ? useCasesRef.current.loadEnrollments.execute()
          : Promise.resolve([]),
        shouldLoadOptions
          ? useCasesRef.current.getFilterOptions.execute()
          : Promise.resolve(null),
      ]);
      setPlans(nextPlans);
      setEnrollments(nextEnrollments);
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
  const enrollmentByPlanId = useMemo(() => (
    enrollments.reduce((lookup, enrollment) => ({
      ...lookup,
      [enrollment.planId]: enrollment,
    }), {})
  ), [enrollments]);
  const selectedEnrollment = selectedPlan ? enrollmentForPlan(enrollments, selectedPlan.id) : null;
  const todayWorkout = useMemo(() => (
    selectedPlan && selectedEnrollment && useCasesRef.current?.selectTodayWorkout
      ? useCasesRef.current.selectTodayWorkout.execute(selectedPlan, selectedEnrollment)
      : null
  ), [selectedEnrollment, selectedPlan]);

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

  const enrollInPlan = useCallback(async (plan = selectedPlan) => {
    if (!plan || !useCasesRef.current?.enrollInPlan) return null;
    setEnrollingPlanId(plan.id);
    setErrorMessage("");
    try {
      const enrollment = await useCasesRef.current.enrollInPlan.execute(plan);
      setEnrollments(current => [
        enrollment,
        ...current.filter(item => item.planId !== enrollment.planId),
      ]);
      return enrollment;
    } catch (error) {
      setErrorMessage(error?.message || "Training plan enrollment failed.");
      return null;
    } finally {
      setEnrollingPlanId("");
    }
  }, [selectedPlan]);

  const leavePlan = useCallback(async (plan = selectedPlan) => {
    if (!plan || !useCasesRef.current?.leavePlan) return null;
    setEnrollingPlanId(plan.id);
    setErrorMessage("");
    try {
      await useCasesRef.current.leavePlan.execute(plan.id);
      setEnrollments(current => current.filter(item => item.planId !== plan.id));
      return plan.id;
    } catch (error) {
      setErrorMessage(error?.message || "Training plan update failed.");
      return null;
    } finally {
      setEnrollingPlanId("");
    }
  }, [selectedPlan]);

  const replaceEnrollment = useCallback((enrollment) => {
    if (!enrollment?.planId) return;
    setEnrollments(current => [
      enrollment,
      ...current.filter(item => item.planId !== enrollment.planId),
    ]);
  }, []);

  const skipTodayPlanDay = useCallback(async () => {
    if (!selectedPlan || !selectedEnrollment || !todayWorkout?.dayKey || !useCasesRef.current?.skipPlanDay) return null;
    setCustomizingPlanId(selectedPlan.id);
    setErrorMessage("");
    try {
      const enrollment = await useCasesRef.current.skipPlanDay.execute(selectedEnrollment, todayWorkout.dayKey);
      replaceEnrollment(enrollment);
      return enrollment;
    } catch (error) {
      setErrorMessage(error?.message || "Plan day could not be skipped.");
      return null;
    } finally {
      setCustomizingPlanId("");
    }
  }, [replaceEnrollment, selectedEnrollment, selectedPlan, todayWorkout]);

  const adjustFrequency = useCallback(async (daysPerWeek) => {
    if (!selectedPlan || !selectedEnrollment || !useCasesRef.current?.adjustFrequency) return null;
    setCustomizingPlanId(selectedPlan.id);
    setErrorMessage("");
    try {
      const enrollment = await useCasesRef.current.adjustFrequency.execute(selectedEnrollment, daysPerWeek);
      replaceEnrollment(enrollment);
      return enrollment;
    } catch (error) {
      setErrorMessage(error?.message || "Plan frequency could not be updated.");
      return null;
    } finally {
      setCustomizingPlanId("");
    }
  }, [replaceEnrollment, selectedEnrollment, selectedPlan]);

  const swapExercise = useCallback(async (swap) => {
    if (!selectedPlan || !selectedEnrollment || !useCasesRef.current?.swapExercise) return null;
    setCustomizingPlanId(selectedPlan.id);
    setErrorMessage("");
    try {
      const enrollment = await useCasesRef.current.swapExercise.execute(selectedEnrollment, swap);
      replaceEnrollment(enrollment);
      return enrollment;
    } catch (error) {
      setErrorMessage(error?.message || "Exercise swap could not be saved.");
      return null;
    } finally {
      setCustomizingPlanId("");
    }
  }, [replaceEnrollment, selectedEnrollment, selectedPlan]);

  return {
    adjustFrequency,
    customizingPlanId,
    enrollInPlan,
    enrollmentByPlanId,
    enrollingPlanId,
    errorMessage,
    filterOptions: mergedFilterOptions,
    filters,
    isEmpty,
    leavePlan,
    refresh,
    resetFilters,
    selectedEnrollment,
    selectedPlan,
    selectedPlanId,
    setSelectedPlanId,
    skipTodayPlanDay,
    status,
    swapExercise,
    todayWorkout,
    updateFilter,
    visiblePlans,
  };
}

export { TRAINING_PLAN_ALL_FILTER };
