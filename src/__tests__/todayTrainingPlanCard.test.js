import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import TodayTrainingPlanCard from '../challengeTracker/TodayTrainingPlanCard';
import {
  countMissedTrainingPlanWorkouts,
  mapTrainingPlanDocument,
  mapTrainingPlanEnrollmentDocument,
  selectTodayTrainingPlanWorkout,
} from '../workouts/domain/trainingPlanModels';
import planSeed from '../../scripts/workout-training-plans-seed.json';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

async function renderCard(element) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  await act(async () => {
    root.render(element);
  });

  return { container, root };
}

function activeEnrollment(overrides = {}) {
  const plan = mapTrainingPlanDocument(planSeed[0].id, planSeed[0]);
  return mapTrainingPlanEnrollmentDocument(plan.id, {
    id: plan.id,
    uid: 'user_123',
    planId: plan.id,
    planVersion: 1,
    status: 'active',
    startDate: '2026-07-01',
    timezone: 'Australia/Melbourne',
    completedDayKeys: [],
    skippedDayKeys: [],
    currentDayIndex: 1,
    ...overrides,
  });
}

describe('TodayTrainingPlanCard', () => {
  it('counts missed workout days without counting rest days or skipped days', () => {
    const plan = mapTrainingPlanDocument(planSeed[0].id, planSeed[0]);

    expect(countMissedTrainingPlanWorkouts(plan, activeEnrollment(), new Date('2026-07-04T10:00:00.000Z'))).toBe(2);
    expect(countMissedTrainingPlanWorkouts(
      plan,
      activeEnrollment({ completedDayKeys: ['w1-d1'], skippedDayKeys: ['w1-d3'] }),
      new Date('2026-07-04T10:00:00.000Z')
    )).toBe(0);
  });

  it('prefers trusted server missed counts when adherence is available', () => {
    const plan = mapTrainingPlanDocument(planSeed[0].id, planSeed[0]);
    const enrollment = activeEnrollment({
      adherence: {
        dueCount: 5,
        missedCount: 4,
        adherencePct: 20,
      },
    });

    expect(countMissedTrainingPlanWorkouts(plan, enrollment, new Date('2026-07-04T10:00:00.000Z'))).toBe(4);
  });

  it('falls back to local missed counts when trusted adherence is malformed', () => {
    const plan = mapTrainingPlanDocument(planSeed[0].id, planSeed[0]);
    const enrollment = activeEnrollment({
      adherence: {
        missedCount: -1,
      },
    });

    expect(countMissedTrainingPlanWorkouts(plan, enrollment, new Date('2026-07-04T10:00:00.000Z'))).toBe(2);
  });

  it('keeps Today useful without an active training plan', async () => {
    const onOpenWorkouts = jest.fn();
    const { container, root } = await renderCard(
      <TodayTrainingPlanCard
        onOpenWorkouts={onOpenWorkouts}
        viewModel={{ errorMessage: '', refresh: jest.fn(), status: 'empty' }}
      />
    );

    expect(container.textContent).toContain("No active training plan yet.");
    expect(container.textContent).toContain("Your challenge tasks are ready below.");
    expect(container.textContent).toContain("Browse plans");

    await act(async () => {
      container.querySelector('button').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(onOpenWorkouts).toHaveBeenCalledTimes(1);

    await act(async () => root.unmount());
    container.remove();
  });

  it('renders a workout day with supportive missed-workout recovery copy', async () => {
    const plan = mapTrainingPlanDocument(planSeed[0].id, planSeed[0]);
    const enrollment = activeEnrollment();
    const todayWorkout = selectTodayTrainingPlanWorkout(plan, enrollment, new Date('2026-07-03T10:00:00.000Z'));
    const { container, root } = await renderCard(
      <TodayTrainingPlanCard
        onOpenWorkouts={jest.fn()}
        viewModel={{
          enrollment,
          errorMessage: '',
          missedCount: countMissedTrainingPlanWorkouts(plan, enrollment, new Date('2026-07-03T10:00:00.000Z')),
          plan,
          refresh: jest.fn(),
          status: 'loaded',
          todayWorkout,
        }}
      />
    );

    expect(container.textContent).toContain("TODAY'S PLAN");
    expect(container.textContent).toContain('Beginner Strength Foundation');
    expect(container.textContent).toContain('Full Body B');
    expect(container.textContent).toContain('4 exercises · 40 min');
    expect(container.textContent).toContain('COMEBACK PATH');
    expect(container.textContent).toContain('One plan workout is waiting when you are ready. No reset needed.');
    expect(container.textContent).toContain('Continue plan workout');

    await act(async () => root.unmount());
    container.remove();
  });

  it('renders a rest day without guilt copy', async () => {
    const plan = mapTrainingPlanDocument(planSeed[0].id, planSeed[0]);
    const enrollment = activeEnrollment({ completedDayKeys: ['w1-d1'] });
    const todayWorkout = selectTodayTrainingPlanWorkout(plan, enrollment, new Date('2026-07-02T10:00:00.000Z'));
    const { container, root } = await renderCard(
      <TodayTrainingPlanCard
        viewModel={{
          enrollment,
          errorMessage: '',
          missedCount: 0,
          plan,
          refresh: jest.fn(),
          status: 'loaded',
          todayWorkout,
        }}
      />
    );

    expect(container.textContent).toContain('RECOVERY');
    expect(container.textContent).toContain('Recovery day');
    expect(container.textContent).toContain('Walk, stretch, or keep it easy.');
    expect(container.textContent).not.toContain('COMEBACK PATH');

    await act(async () => root.unmount());
    container.remove();
  });
});
