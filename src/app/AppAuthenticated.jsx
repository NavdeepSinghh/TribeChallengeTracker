import AppBottomNav from "./AppBottomNav";
import AppAuthenticatedFrame from "./AppAuthenticatedFrame";
import AppOverlays from "./AppOverlays";
import AppTabContent from "./AppTabContent";
import AppToast from "./AppToast";
import { buildAppAuthenticatedProps } from "./appAuthenticatedProps";
import useAppAuthenticatedState from "./useAppAuthenticatedState";

export default function AppAuthenticated({ user }) {
  const appState = useAppAuthenticatedState(user);
  const {
    bottomNavProps,
    overlayProps,
    tabContentProps,
  } = buildAppAuthenticatedProps({ appState, user });

  return (
    <AppAuthenticatedFrame>
      <AppOverlays {...overlayProps} />

      <AppToast toast={appState.toast} />

      <AppTabContent {...tabContentProps} />

      <AppBottomNav {...bottomNavProps} />
    </AppAuthenticatedFrame>
  );
}
