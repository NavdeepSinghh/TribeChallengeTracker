import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  TRAINING_PLAN_ENROLLMENT_STATUS,
  countMissedTrainingPlanWorkouts,
} from '../workouts/domain/trainingPlanModels';

function activeEnrollment(enrollments = []) {
  return enrollments.find(enrollment => enrollment.status === TRAINING_PLAN_ENROLLMENT_STATUS.ACTIVE) || null;
}

export default function useTodayTrainingPlanCardState({ useCases } = {}) {
  const useCasesRef = useRef(useCases);
  const [state, setState] = useState({
    enrollment: null,
    errorMessage: '',
    missedCount: 0,
    plan: null,
    status: 'idle',
    todayWorkout: null,
  });

  const load = useCallback(async () => {
    if (!useCasesRef.current?.loadTrainingPlans || !useCasesRef.current?.loadEnrollments) {
      setState(current => ({
        ...current,
        errorMessage: 'Training plan dependencies are not configured.',
        status: 'failed',
      }));
      return;
    }

    setState(current => ({ ...current, errorMessage: '', status: 'loading' }));

    try {
      const [plans, enrollments] = await Promise.all([
        useCasesRef.current.loadTrainingPlans.execute(),
        useCasesRef.current.loadEnrollments.execute(),
      ]);
      const enrollment = activeEnrollment(enrollments);
      const plan = enrollment ? plans.find(item => item.id === enrollment.planId) || null : null;

      if (!enrollment || !plan) {
        setState({
          enrollment,
          errorMessage: '',
          missedCount: 0,
          plan,
          status: 'empty',
          todayWorkout: null,
        });
        return;
      }

      const todayWorkout = useCasesRef.current.selectTodayWorkout?.execute(plan, enrollment) || null;
      setState({
        enrollment,
        errorMessage: '',
        missedCount: countMissedTrainingPlanWorkouts(plan, enrollment),
        plan,
        status: 'loaded',
        todayWorkout,
      });
    } catch (error) {
      setState(current => ({
        ...current,
        errorMessage: error?.message || 'Today plan could not be loaded.',
        status: 'failed',
      }));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return useMemo(() => ({
    ...state,
    refresh: load,
  }), [load, state]);
}

export { activeEnrollment };
