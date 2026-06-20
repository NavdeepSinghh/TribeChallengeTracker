import AppBottomNav from "./AppBottomNav";
import AppAuthenticatedFrame from "./AppAuthenticatedFrame";
import AppOverlays from "./AppOverlays";
import AppTabContent from "./AppTabContent";
import AppToast from "./AppToast";
import { AppThemeProvider } from "./AppThemeContext";
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
    <AppThemeProvider>
      <AppAuthenticatedFrame>
        <AppOverlays {...overlayProps} />

        <AppToast toast={appState.toast} />

        <AppTabContent {...tabContentProps} />

        <AppBottomNav {...bottomNavProps} />
      </AppAuthenticatedFrame>
    </AppThemeProvider>
  );
}
