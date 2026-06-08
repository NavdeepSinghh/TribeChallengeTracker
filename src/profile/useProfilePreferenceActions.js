import { buildProfileAppearanceActionHandlers } from './profileAppearanceActionHandlers';
import { buildProfileProPreferenceActionHandlers } from './profileProPreferenceActionHandlers';

export default function useProfilePreferenceActions(inputs) {
  const appearanceActions = buildProfileAppearanceActionHandlers(inputs);
  const proPreferenceActions = buildProfileProPreferenceActionHandlers(inputs);

  return {
    ...appearanceActions,
    ...proPreferenceActions,
  };
}
